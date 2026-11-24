import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./system-prompt";
import type { ChatMessage } from "./types";

/**
 * Proveedores del chatbot. Se usa el primero que tenga clave:
 *   1. OpenRouter  (OPENROUTER_API_KEY)
 *   2. Anthropic   (ANTHROPIC_API_KEY)
 *
 * El modelo se puede cambiar con la variable CHAT_MODEL, usando el
 * nombre que espera cada proveedor (ver README → Chatbot).
 */
export type ChatProvider = "openrouter" | "anthropic";

const DEFAULT_MODELS: Record<ChatProvider, string> = {
  openrouter: "anthropic/claude-sonnet-5.5",
  anthropic: "claude-sonnet-5-5",
};

/** Respuestas cortas a propósito (incluye el razonamiento interno del modelo) */
const MAX_TOKENS = 2048;

export function getChatProvider(): ChatProvider | null {
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

/** Error del proveedor con su código HTTP, para registrarlo en el servidor */
export class ProviderError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

/** Devuelve la respuesta del modelo trozo a trozo, según se genera. */
export function streamAnswer(
  provider: ChatProvider,
  messages: ChatMessage[],
  signal: AbortSignal,
): AsyncGenerator<string> {
  const model = process.env.CHAT_MODEL || DEFAULT_MODELS[provider];
  return provider === "openrouter"
    ? streamOpenRouter(model, messages, signal)
    : streamAnthropic(model, messages, signal);
}

/* ------------------------------------------------------------------ */
/*  OpenRouter (API estilo OpenAI, streaming por SSE)                  */
/* ------------------------------------------------------------------ */

async function* streamOpenRouter(model: string, messages: ChatMessage[], signal: AbortSignal) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      stream: true,
      max_tokens: MAX_TOKENS,
      // Chat sencillo: poco razonamiento (más rápido y barato) y sin devolverlo
      reasoning: { effort: "low", exclude: true },
      messages: [
        // El perfil es igual en todas las peticiones: se cachea y abarata cada pregunta
        {
          role: "system",
          content: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        },
        ...messages,
      ],
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    throw new ProviderError(`OpenRouter ${response.status}: ${detail.slice(0, 300)}`, response.status);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    buffer += decoder.decode(value, { stream: true });

    // Procesa solo las líneas completas; la última puede estar a medias
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      // Líneas vacías y comentarios (": OPENROUTER PROCESSING") se ignoran
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;

      const chunk = JSON.parse(data) as {
        error?: { code?: number; message?: string };
        choices?: { delta?: { content?: string | null } }[];
      };
      if (chunk.error) {
        throw new ProviderError(`OpenRouter: ${chunk.error.message ?? "error"}`, chunk.error.code);
      }
      const text = chunk.choices?.[0]?.delta?.content;
      if (text) yield text;
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Anthropic directo (SDK oficial)                                    */
/* ------------------------------------------------------------------ */

let anthropicClient: Anthropic | null = null;

async function* streamAnthropic(model: string, messages: ChatMessage[], signal: AbortSignal) {
  anthropicClient ??= new Anthropic();

  const stream = anthropicClient.beta.messages.stream(
    {
      model,
      max_tokens: MAX_TOKENS,
      output_config: { effort: "low" },
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages,
      // Si el modelo rechaza una pregunta por seguridad, otro modelo responde en su lugar
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    },
    { signal },
  );

  try {
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield event.delta.text;
      }
    }
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      throw new ProviderError(`Anthropic ${error.status}: ${error.message}`, error.status);
    }
    throw error;
  } finally {
    stream.abort();
  }
}
