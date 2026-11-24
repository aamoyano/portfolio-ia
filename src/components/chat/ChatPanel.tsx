"use client";

import { motion } from "framer-motion";
import { ArrowUp, RotateCcw, Sparkles, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { Content } from "@/data/types";
import { CHAT_LIMITS, type ChatMessage } from "@/lib/chat/types";
import { cn } from "@/lib/utils";
import { MessageContent } from "./MessageContent";

interface ChatPanelProps {
  chat: Content["chat"];
  messages: ChatMessage[];
  input: string;
  streaming: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
  onReset: () => void;
  onClose: () => void;
}

/**
 * Conversación a pantalla completa, como una app de mensajería:
 * cabecera, mensajes con scroll y campo de texto fijo abajo.
 */
export function ChatPanel({
  chat,
  messages,
  input,
  streaming,
  error,
  onInputChange,
  onSend,
  onReset,
  onClose,
}: ChatPanelProps) {
  const titleId = useId();
  const inputId = useId();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Bloquea el scroll de la web y cierra con Escape
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // En escritorio, el cursor vuelve al campo al terminar cada respuesta
  useEffect(() => {
    if (!streaming && window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
  }, [streaming]);

  // Sigue el final de la conversación mientras llega el texto
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight });
  }, [messages, error]);

  const lastIndex = messages.length - 1;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex justify-center bg-[rgb(20_25_55/0.35)] backdrop-blur-xl max-sm:bg-[linear-gradient(180deg,var(--color-edge-top)_0%,rgb(20_25_55/0.55)_12%,rgb(20_25_55/0.55)_88%,var(--color-edge-bottom)_100%)] max-sm:backdrop-blur-[48px] max-sm:bg-transparent max-sm:backdrop-saturate-150"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-[100dvh] w-full max-w-3xl pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] sm:p-6"
      >
        {/* En el móvil, sin marco: fondo liso a pantalla completa, como una app de mensajería */}
        <div className="glass flex w-full flex-col overflow-hidden max-sm:rounded-none max-sm:border-0 max-sm:bg-none max-sm:shadow-none max-sm:before:hidden sm:rounded-[28px]">
          {/* Cabecera */}
          <header className="flex items-center gap-3 border-b border-white/15 px-4 py-3 sm:px-6">
            <span className="glass-solid grid h-9 w-9 shrink-0 place-items-center rounded-full">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <h2 id={titleId} className="truncate font-display text-base font-medium text-fg">
                {chat.title}
              </h2>
              <p className="truncate text-xs text-muted">{chat.description}</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={onReset}
                aria-label={chat.reset}
                title={chat.reset}
                className="grid h-10 w-10 place-items-center rounded-full text-fg transition-colors hover:bg-white/15"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={chat.close}
              title={chat.close}
              className="grid h-10 w-10 place-items-center rounded-full text-fg transition-colors hover:bg-white/15"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </header>

          {/* Mensajes */}
          <div ref={logRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                <p className="text-muted">{chat.placeholder}</p>
                <SuggestionList chat={chat} onSend={onSend} />
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) =>
                  message.role === "user" ? (
                    <div key={index} className="flex justify-end">
                      <span className="sr-only">{chat.you}: </span>
                      <p className="max-w-[85%] rounded-[20px] rounded-br-md bg-white/20 px-4 py-2.5 text-[15px] text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]">
                        {message.content}
                      </p>
                    </div>
                  ) : (
                    <div key={index} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-peach" />
                      </span>
                      <div className="min-w-0 max-w-[90%] pt-0.5 text-[15px] leading-relaxed text-fg">
                        <span className="sr-only">{chat.assistant}: </span>
                        {message.content ? (
                          <>
                            <MessageContent text={message.content} />
                            {streaming && index === lastIndex && (
                              <span aria-hidden className="ml-0.5 inline-block h-4 w-[3px] translate-y-0.5 animate-pulse rounded-full bg-white/80" />
                            )}
                          </>
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
                    </div>
                  ),
                )}
              </div>
            )}

            {error && (
              <p role="alert" className="mt-6 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-fg">
                {error}
              </p>
            )}
          </div>

          {/* Campo de texto */}
          <div className="border-t border-white/15 px-3 pb-3 pt-3 sm:px-6 sm:pb-4">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSend(input);
              }}
              className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-5 pr-1.5 transition-colors focus-within:border-white/50 focus-within:bg-white/15"
            >
              <label htmlFor={inputId} className="sr-only">
                {chat.inputLabel}
              </label>
              <input
                ref={inputRef}
                id={inputId}
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                maxLength={CHAT_LIMITS.maxMessageLength}
                placeholder={messages.length ? chat.followUpPlaceholder : chat.placeholder}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-base text-fg placeholder:text-muted focus:outline-none"
                style={{ textShadow: "none" }}
              />
              <button
                type="submit"
                aria-label={chat.sendLabel}
                disabled={streaming || !input.trim()}
                className="glass-solid grid h-10 w-10 shrink-0 place-items-center rounded-full transition-[transform,opacity] duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <ArrowUp className="h-[18px] w-[18px]" aria-hidden />
              </button>
            </form>
            <p className="mt-2 text-center text-[11px] text-faint">{chat.disclaimer}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Chips con las preguntas de ejemplo */
export function SuggestionList({
  chat,
  onSend,
  className,
}: {
  chat: Content["chat"];
  onSend: (text: string) => void;
  className?: string;
}) {
  return (
    <>
      <p className="sr-only">{chat.suggestionsLabel}</p>
      <ul className={cn("flex flex-wrap justify-center gap-2", className)}>
        {chat.suggestions.map((question) => (
          <li key={question}>
            <button
              type="button"
              onClick={() => onSend(question)}
              className="rounded-full border border-line bg-white/10 px-3.5 py-1.5 text-xs text-fg backdrop-blur-md transition-colors hover:bg-white/20"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
