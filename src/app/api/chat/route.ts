/**
 * Endpoint del chatbot: POST /api/chat
 *
 * Recibe el historial de la conversación, comprueba el límite de uso
 * y responde con el texto del modelo en streaming (text/plain).
 * Los errores previos se devuelven como JSON `{ error: ChatErrorCode }`.
 *
 * El proveedor (OpenRouter o Anthropic) y el modelo se eligen en
 * `src/lib/chat/providers.ts` según las variables de entorno.
 *
 * Al terminar cada respuesta se avisa a Antonio por Telegram
 * (`src/lib/chat/notify.ts`), sin retrasar ni afectar al chat.
 */

import { after } from "next/server";
import { siteConfig } from "@/data/profile";
import { getContent } from "@/i18n";
import { getChatProvider, ProviderError, streamAnswer } from "@/lib/chat/providers";
import {
  getVisitorInfo,
  hasNoNotifyCookie,
  isValidSessionId,
  notificationsEnabled,
  notifyChat,
} from "@/lib/chat/notify";
import { checkRateLimit, getClientIp } from "@/lib/chat/rate-limit";
import { CHAT_LIMITS, type ChatErrorCode, type ChatMessage } from "@/lib/chat/types";

function errorResponse(error: ChatErrorCode, status: number) {
  return Response.json({ error }, { status });
}

/** Valida y limpia el historial: alterna user/assistant y termina en user. */
function parseMessages(body: unknown): ChatMessage[] | "invalid" | "too_long" {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > CHAT_LIMITS.maxMessages) return "invalid";

  const messages: ChatMessage[] = [];
  for (const [index, item] of raw.entries()) {
    const role = (item as ChatMessage)?.role;
    const content = (item as ChatMessage)?.content;
    const expected = index % 2 === 0 ? "user" : "assistant";
    if (role !== expected || typeof content !== "string" || !content.trim()) return "invalid";
    if (content.length > CHAT_LIMITS.maxMessageLength * (role === "assistant" ? 4 : 1)) return "too_long";
    messages.push({ role, content: content.trim() });
  }
  return messages.at(-1)?.role === "user" ? messages : "invalid";
}

export async function POST(request: Request) {
  const provider = getChatProvider();
  if (!siteConfig.chatEnabled || !provider) {
    return errorResponse("unavailable", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("invalid", 400);
  }

  const messages = parseMessages(body);
  if (messages === "invalid") return errorResponse("invalid", 400);
  if (messages === "too_long") return errorResponse("too_long", 413);

  if (!(await checkRateLimit(getClientIp(request)))) {
    return errorResponse("rate_limited", 429);
  }

  const { errors } = getContent().chat;
  const encoder = new TextEncoder();
  // Si el visitante cierra la página, se corta la generación (y el gasto)
  const abort = new AbortController();
  request.signal.addEventListener("abort", () => abort.abort());

  // Respuesta completa del bot, disponible cuando termina el streaming
  let resolveAnswer: (answer: string) => void = () => {};
  const fullAnswer = new Promise<string>((resolve) => (resolveAnswer = resolve));

  const sessionId = (body as { sessionId?: unknown }).sessionId;
  if (notificationsEnabled() && isValidSessionId(sessionId) && !hasNoNotifyCookie(request)) {
    const visitor = getVisitorInfo(request, (body as { referrer?: unknown }).referrer);
    const question = messages.at(-1)!.content;
    const firstInClient = messages.length === 1;
    // Se ejecuta cuando la respuesta ya se ha enviado entera al visitante
    after(async () => {
      await notifyChat({ sessionId, firstInClient, question, answer: await fullAnswer, visitor });
    });
  }

  const responseBody = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sentText = false;
      let answer = "";
      try {
        for await (const text of streamAnswer(provider, messages, abort.signal)) {
          sentText = true;
          answer += text;
          controller.enqueue(encoder.encode(text));
        }
        // Respuesta vacía (p. ej. pregunta rechazada por el modelo)
        if (!sentText) controller.enqueue(encoder.encode(errors.generic));
      } catch (error) {
        if (!abort.signal.aborted) {
          console.error("[api/chat]", error instanceof ProviderError ? error.message : error);
          controller.enqueue(encoder.encode(sentText ? `\n\n${errors.generic}` : errors.generic));
        }
      } finally {
        resolveAnswer(answer || errors.generic);
        controller.close();
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(responseBody, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
