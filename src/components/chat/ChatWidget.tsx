"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Content } from "@/data/types";
import { CHAT_LIMITS, type ChatErrorCode, type ChatMessage } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  chat: Content["chat"];
  /** true cuando `siteConfig.chatEnabled` está activo y hay API key en el servidor */
  enabled: boolean;
}

/**
 * Asistente de IA del hero.
 *
 * - La barra de vidrio es el campo de texto; al enviar se abre debajo
 *   el panel con la conversación.
 * - Las respuestas llegan en streaming desde /api/chat.
 * - Si el chat está desactivado, la barra muestra el aviso "Próximamente".
 */
export function ChatWidget({ chat, enabled }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  const inputId = useId();
  const noticeId = useId();
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const hasConversation = messages.length > 0;
  const errorTexts: Record<ChatErrorCode, string> = {
    invalid: chat.errors.generic,
    unavailable: chat.errors.generic,
    rate_limited: chat.errors.rateLimited,
    too_long: chat.errors.tooLong,
  };

  // Cancela la petición en curso si el componente se desmonta
  useEffect(() => () => abortRef.current?.abort(), []);

  // Mantiene visible el final de la conversación mientras llega el texto
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!showNotice) return;
    const timeout = setTimeout(() => setShowNotice(false), 4500);
    return () => clearTimeout(timeout);
  }, [showNotice]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || streaming) return;
    if (!enabled) {
      setShowNotice(true);
      return;
    }
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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
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
    setStreaming(false);
  }

  return (
    <div className="text-left">
      {/* Barra de pregunta */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
        className="glass group flex h-16 w-full items-center gap-3 rounded-full pl-5 pr-2 transition-shadow focus-within:shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_18px_50px_-14px_rgb(15_20_45/0.5)]"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-peach" aria-hidden />
        <label htmlFor={inputId} className="sr-only">
          {chat.inputLabel}
        </label>
        <input
          id={inputId}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onFocus={() => !enabled && setShowNotice(true)}
          readOnly={!enabled}
          maxLength={CHAT_LIMITS.maxMessageLength}
          placeholder={chat.placeholder}
          autoComplete="off"
          aria-describedby={showNotice ? noticeId : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-fg placeholder:text-muted focus:outline-none"
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
              className="glass mt-3 rounded-2xl px-4 py-3 text-sm text-fg"
            >
              {chat.comingSoon}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Conversación */}
      <AnimatePresence>
        {hasConversation && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass mt-3 overflow-hidden rounded-3xl"
          >
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              className="max-h-[min(22rem,45svh)] space-y-4 overflow-y-auto px-5 py-5"
            >
              {messages.map((message, index) => (
                <div key={index} className={cn("flex", message.role === "user" && "justify-end")}>
                  <span className="sr-only">{message.role === "user" ? chat.you : chat.assistant}: </span>
                  {message.role === "user" ? (
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-white/20 px-4 py-2.5 text-[15px] text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]">
                      {message.content}
                    </p>
                  ) : message.content ? (
                    <p className="max-w-[92%] whitespace-pre-line text-[15px] leading-relaxed text-fg">
                      {message.content}
                    </p>
                  ) : (
                    <p className="flex items-center gap-1.5 py-2" aria-label={chat.typing}>
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          aria-hidden
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80"
                          style={{ animationDelay: `${dot * 0.15}s` }}
                        />
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/15 px-5 py-2.5">
              <p className="text-[11px] text-faint">{chat.disclaimer}</p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-muted transition-colors hover:bg-white/15 hover:text-fg"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                {chat.reset}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <p role="alert" className="glass mt-3 rounded-2xl px-4 py-3 text-sm text-fg">
          {error}
        </p>
      )}

      {/* Preguntas de ejemplo: solo antes de empezar la conversación */}
      {!hasConversation && (
        <>
          <p className="sr-only">{chat.suggestionsLabel}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {chat.suggestions.map((question) => (
              <li key={question}>
                <button
                  type="button"
                  onClick={() => void send(question)}
                  className="rounded-full border border-line bg-white/10 px-3.5 py-1.5 text-xs text-fg backdrop-blur-md transition-colors hover:bg-white/20"
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
