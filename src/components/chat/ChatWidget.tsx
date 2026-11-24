"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, Sparkles } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Content } from "@/data/types";
import { CHAT_LIMITS, type ChatErrorCode, type ChatMessage } from "@/lib/chat/types";
import { ChatPanel, SuggestionList } from "./ChatPanel";

const SESSION_KEY = "chat-session";

/**
 * ID de la conversación (para agrupar los avisos en Telegram) y web de la que
 * viene el visitante. Se guardan en sessionStorage: duran lo que la pestaña.
 * El Referer de la petición a /api/chat es la propia web, por eso se envía
 * `document.referrer` desde aquí.
 */
function getChatSession(): { sessionId: string; referrer: string } {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null");
    if (saved?.sessionId) return saved;
  } catch {
    // sessionStorage bloqueado o JSON corrupto: se crea uno nuevo
  }
  const session = { sessionId: crypto.randomUUID(), referrer: document.referrer };
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Sin almacenamiento: cada mensaje contará como conversación nueva
  }
  return session;
}

interface ChatWidgetProps {
  chat: Content["chat"];
  /** true cuando `siteConfig.chatEnabled` está activo y hay API key en el servidor */
  enabled: boolean;
}

/**
 * Asistente de IA: protagonista de la pantalla inicial.
 *
 * - En el hero se ve la barra de pregunta y las preguntas de ejemplo.
 * - Al preguntar, la conversación se abre a pantalla completa (ChatPanel).
 * - Las respuestas llegan en streaming desde /api/chat.
 * - Si el chat está desactivado, la barra muestra el aviso "Próximamente".
 */
export function ChatWidget({ chat, enabled }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // El portal solo se monta tras la primera interacción (nunca en el HTML del servidor)
  const [portalReady, setPortalReady] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  const inputId = useId();
  const noticeId = useId();
  const abortRef = useRef<AbortController | null>(null);

  // Cancela la petición en curso si el componente se desmonta
  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!showNotice) return;
    const timeout = setTimeout(() => setShowNotice(false), 4500);
    return () => clearTimeout(timeout);
  }, [showNotice]);

  const openPanel = () => {
    getChatSession();
    setPortalReady(true);
    setOpen(true);
  };

  const close = useCallback(() => setOpen(false), []);

  // En el móvil el chat ocupa toda la pantalla: mientras está abierto, la barra
  // inferior de Safari toma el color del fondo del chat; al cerrarlo vuelve el de la foto.
  // (La superior es vidrio translúcido siempre: ver Background.tsx)
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 639px)").matches) return;
    const root = document.documentElement.style;
    root.setProperty("--color-edge-bottom", "var(--color-chat-edge-bottom)");
    return () => {
      root.removeProperty("--color-edge-bottom");
    };
  }, [open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || streaming) return;
    if (!enabled) {
      setShowNotice(true);
      return;
    }

    openPanel();
    if (question.length > CHAT_LIMITS.maxMessageLength) {
      setError(chat.errors.tooLong);
      return;
    }

    // Historial que se envía: últimos mensajes, empezando siempre por el usuario
    const userMessage: ChatMessage = { role: "user", content: question };
    let history = [...messages, userMessage].slice(-CHAT_LIMITS.maxMessages);
    if (history[0]?.role === "assistant") history = history.slice(1);

    setError(null);
    setInput("");
    setStreaming(true);
    setMessages([...history, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    // Si algo falla, se quita la pregunta y se devuelve al campo de texto
    const fail = (message: string) => {
      setMessages(history.slice(0, -1));
      setInput(question);
      setError(message);
    };

    const errorTexts: Record<ChatErrorCode, string> = {
      invalid: chat.errors.generic,
      unavailable: chat.errors.generic,
      rate_limited: chat.errors.rateLimited,
      too_long: chat.errors.tooLong,
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, ...getChatSession() }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as { error?: ChatErrorCode } | null;
        fail(errorTexts[data?.error ?? "unavailable"]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) fail(chat.errors.generic);
    } catch (err) {
      if ((err as Error).name !== "AbortError") fail(chat.errors.generic);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setInput("");
    setStreaming(false);
  }

  const hasConversation = messages.length > 0;

  return (
    // Mientras la conversación está abierta, la barra del hero se oculta para que no se transparente
    <div className={open ? "invisible" : undefined}>
      {/* Barra de pregunta del hero */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
        className="glass mx-auto flex h-16 w-full max-w-2xl items-center gap-3 rounded-full pl-5 pr-2 text-left transition-shadow focus-within:shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_18px_50px_-14px_rgb(15_20_45/0.5)] sm:h-[4.25rem]"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-peach" aria-hidden />
        <label htmlFor={inputId} className="sr-only">
          {chat.inputLabel}
        </label>
        <input
          id={inputId}
          value={open ? "" : input}
          onChange={(event) => setInput(event.target.value)}
          onFocus={() => !enabled && setShowNotice(true)}
          readOnly={!enabled}
          maxLength={CHAT_LIMITS.maxMessageLength}
          placeholder={chat.placeholder}
          autoComplete="off"
          aria-describedby={showNotice ? noticeId : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-fg placeholder:text-muted focus:outline-none sm:text-[17px]"
          style={{ textShadow: "none" }}
        />
        {!enabled && (
          <span className="hidden rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-fg sm:inline">
            {chat.badge}
          </span>
        )}
        <button
          type="submit"
          aria-label={chat.sendLabel}
          disabled={enabled && (streaming || !input.trim())}
          className="glass-solid grid h-12 w-12 shrink-0 place-items-center rounded-full transition-[transform,opacity] duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          <ArrowUp className="h-5 w-5" aria-hidden />
        </button>
      </form>

      {/* Aviso "Próximamente" (solo con el chat desactivado) */}
      <div role="status" aria-live="polite">
        <AnimatePresence>
          {showNotice && (
            <motion.p
              id={noticeId}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="glass mx-auto mt-3 max-w-2xl rounded-2xl px-4 py-3 text-sm text-fg"
            >
              {chat.comingSoon}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Preguntas de ejemplo, o volver a la conversación si ya hay una */}
      {hasConversation ? (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={openPanel}
            className="glass glass-hover inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-fg"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            {chat.resume}
          </button>
        </div>
      ) : (
        <SuggestionList chat={chat} onSend={(question) => void send(question)} className="mt-5" />
      )}

      {/* Conversación a pantalla completa */}
      {portalReady &&
        createPortal(
          <AnimatePresence>
            {open && (
              <ChatPanel
                chat={chat}
                messages={messages}
                input={input}
                streaming={streaming}
                error={error}
                onInputChange={setInput}
                onSend={(text) => void send(text)}
                onReset={reset}
                onClose={close}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
