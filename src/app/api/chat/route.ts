/**
 * Endpoint del chatbot: POST /api/chat
 *
 * ESTADO ACTUAL: devuelve siempre un mensaje fijo de "Próximamente".
 *
 * PLAN DE IMPLEMENTACIÓN (ver README → Próximos pasos):
 *
 * 1) LLAMADA AL LLM
 *    - Instalar el SDK: `npm install @anthropic-ai/sdk` (u `openai`).
 *    - Construir el system prompt con `buildKnowledgeBase()` de
 *      `src/lib/knowledge.ts` + instrucciones: responder solo sobre
 *      Antonio, en el idioma del usuario, sin inventar datos y
 *      remitiendo al email si no sabe algo.
 *    - La API key se lee de `process.env.ANTHROPIC_API_KEY` (nunca en el cliente).
 *
 * 2) LÍMITE DE USO
 *    - Limitar peticiones por IP (p. ej. 10 por minuto y 50 al día)
 *      con Upstash Redis + @upstash/ratelimit, o Vercel KV.
 *    - Además de CHAT_LIMITS (longitud y nº de mensajes), fijar
 *      `max_tokens` bajo y un tope de gasto en la consola del proveedor.
 *
 * 3) STREAMING
 *    - Usar la API de streaming del SDK y devolver un `ReadableStream`
 *      (`new Response(stream, { headers: { "Content-Type": "text/event-stream" } })`).
 *    - El ChatWidget leerá el stream con `response.body.getReader()`
 *      y pintará el texto según llega.
 */

import { siteConfig } from "@/data/profile";
import { getContent } from "@/i18n";
import { CHAT_LIMITS, type ChatRequest, type ChatResponse } from "@/lib/chat/types";

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json(
      { status: "error", reply: "Petición no válida." } satisfies ChatResponse,
      { status: 400 },
    );
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const tooLong =
    messages.length > CHAT_LIMITS.maxMessages ||
    messages.some((m) => typeof m?.content !== "string" || m.content.length > CHAT_LIMITS.maxMessageLength);

  if (messages.length === 0 || tooLong) {
    return Response.json(
      { status: "error", reply: "El mensaje está vacío o es demasiado largo." } satisfies ChatResponse,
      { status: 400 },
    );
  }

  if (siteConfig.chatEnabled) {
    // TODO: aquí irá la llamada al LLM con límite de uso y streaming
    // (ver el comentario al inicio del archivo).
  }

  return Response.json({
    status: "coming-soon",
    reply: getContent().chat.comingSoon,
  } satisfies ChatResponse);
}
