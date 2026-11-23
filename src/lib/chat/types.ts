/** Tipos compartidos entre el ChatWidget (cliente) y /api/chat (servidor). */

export type ChatRole = "user" | "assistant";

/** Mensaje tal y como viaja entre el navegador y /api/chat */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

/** Errores: el endpoint responde JSON con este código; el éxito es texto en streaming. */
export type ChatErrorCode = "invalid" | "too_long" | "rate_limited" | "unavailable";

export interface ChatErrorResponse {
  error: ChatErrorCode;
}

/** Límites básicos para no gastar tokens con entradas abusivas */
export const CHAT_LIMITS = {
  maxMessages: 12,
  maxMessageLength: 600,
} as const;
