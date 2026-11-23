"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { Content } from "@/data/types";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  chat: Content["chat"];
  /** Interruptor en `siteConfig.chatEnabled` */
  enabled: boolean;
}

/**
 * Interfaz del asistente de IA.
 *
 * FASE ACTUAL: placeholder. El campo de texto no escribe; al pulsarlo
 * se muestra un aviso de "Próximamente" y los chips están desactivados.
 *
 * CUANDO SE IMPLEMENTE (ver README → Próximos pasos):
 *  1. Mantener esta misma caja como "lanzador" en el hero.
 *  2. Al enviar, abrir un panel con el historial de mensajes
 *     (`ChatMessage[]` de `src/lib/chat/types.ts`).
 *  3. Hacer POST a `/api/chat` y pintar la respuesta en streaming.
 *  4. Los chips rellenan y envían la pregunta directamente.
 */
export function ChatWidget({ chat, enabled }: ChatWidgetProps) {
  const [showNotice, setShowNotice] = useState(false);
  const noticeId = useId();

  useEffect(() => {
    if (!showNotice) return;
    const timeout = setTimeout(() => setShowNotice(false), 4500);
    return () => clearTimeout(timeout);
  }, [showNotice]);

  // Mientras el chatbot no exista, cualquier interacción muestra el aviso
  const handleOpen = () => {
    if (!enabled) setShowNotice(true);
  };

  return (
    <div className="relative">
      {/* Halo exterior */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-[22px] bg-gradient-to-br from-accent/50 via-white/5 to-cyan/40 opacity-80"
      />
      <div className="relative rounded-[21px] bg-surface/90 p-4 backdrop-blur-xl sm:p-5">
        {/* Cabecera */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-accent grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white">
              <Bot className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold text-fg">{chat.title}</p>
              <p className="text-xs text-muted">{chat.description}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-cyan">
            <Sparkles className="h-3 w-3" aria-hidden />
            {chat.badge}
          </span>
        </div>

        {/* Falso campo de texto: es un botón hasta que el chat exista */}
        <button
          type="button"
          onClick={handleOpen}
          aria-describedby={showNotice ? noticeId : undefined}
          className="group flex w-full items-center gap-3 rounded-2xl border border-line bg-bg/60 py-2 pl-4 pr-2 text-left transition-colors duration-300 hover:border-accent/50 focus-visible:border-accent/60"
        >
          <span className="flex-1 truncate text-[15px] text-muted transition-colors group-hover:text-fg/80">
            {chat.placeholder}
          </span>
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-muted transition-all duration-300 group-hover:bg-accent group-hover:text-white"
          >
            <Send className="h-4 w-4" />
          </span>
        </button>

        {/* Aviso "Próximamente" */}
        <div role="status" aria-live="polite" className="min-h-0">
          <AnimatePresence>
            {showNotice && (
              <motion.p
                id={noticeId}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden rounded-xl border border-accent/25 bg-accent/10 px-3.5 py-2.5 text-sm text-fg/90"
              >
                {chat.comingSoon}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Preguntas de ejemplo (desactivadas de momento) */}
        <p className="sr-only">{chat.suggestionsLabel}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {chat.suggestions.map((question) => (
            <li key={question}>
              <button
                type="button"
                disabled={!enabled}
                title={!enabled ? chat.badge : undefined}
                className={cn(
                  "rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors",
                  enabled ? "hover:border-accent/50 hover:text-fg" : "cursor-not-allowed opacity-60",
                )}
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
