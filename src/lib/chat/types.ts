/** Tipos compartidos entre el ChatWidget (cliente) y /api/chat (servidor). */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  status: "coming-soon" | "ok" | "error";
  reply: string;
}

/** Límites básicos para no gastar tokens con entradas abusivas */
export const CHAT_LIMITS = {
  maxMessages: 12,
  maxMessageLength: 600,
} as const;
