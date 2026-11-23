/**
 * Endpoint del chatbot: POST /api/chat
 *
 * Recibe el historial de la conversación, comprueba el límite de uso
 * y responde con el texto de Claude en streaming (text/plain).
 * Los errores se devuelven como JSON `{ error: ChatErrorCode }`.
 *
 * Fase 1: el perfil completo va en el system prompt (ver
 * `src/lib/chat/system-prompt.ts`). Fase 2 (RAG): ver README.
 */

import Anthropic from "@anthropic-ai/sdk";
import { siteConfig } from "@/data/profile";
import { getContent } from "@/i18n";
import { checkRateLimit, getClientIp } from "@/lib/chat/rate-limit";
import { SYSTEM_PROMPT } from "@/lib/chat/system-prompt";
import { CHAT_LIMITS, type ChatErrorCode, type ChatMessage } from "@/lib/chat/types";

/**
 * Modelo de Claude. Para abaratar el chat puedes cambiarlo por
 * "claude-sonnet-5-5" o "claude-haiku-5-5" (ver README → Chatbot).
 */
const CHAT_MODEL = "claude-opus-5-5";

const client = new Anthropic();

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
  if (!siteConfig.chatEnabled || !process.env.ANTHROPIC_API_KEY) {
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

  const stream = client.beta.messages.stream(
    {
      model: CHAT_MODEL,
      max_tokens: 1024, // respuestas cortas a propósito
      // En un chat sencillo, el esfuerzo bajo responde rápido y gasta menos
      output_config: { effort: "low" },
      // El perfil es igual en todas las peticiones: se cachea y abarata cada pregunta
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages,
      // Si el modelo rechaza una pregunta por seguridad, otro modelo responde en su lugar
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    },
    // Si el visitante cierra la página, se corta la generación (y el gasto)
    { signal: request.signal },
  );

  const responseBody = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sentText = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            sentText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !sentText) {
          controller.enqueue(encoder.encode(errors.generic));
        }
      } catch (error) {
        if (!request.signal.aborted) {
          console.error("[api/chat]", error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error);
          controller.enqueue(encoder.encode(sentText ? `\n\n${errors.generic}` : errors.generic));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(responseBody, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
