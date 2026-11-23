"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
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
    <div>
      {/* Falso campo de texto: es un botón hasta que el chat exista */}
      <button
        type="button"
        onClick={handleOpen}
        aria-describedby={showNotice ? noticeId : undefined}
        className="glass glass-hover group flex h-16 w-full items-center gap-3 rounded-full pl-5 pr-2 text-left"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-peach" aria-hidden />
        <span className="flex-1 truncate text-base text-muted transition-colors group-hover:text-fg">
          {chat.placeholder}
        </span>
        <span className="hidden rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-fg sm:inline">
          {chat.badge}
        </span>
        <span
          aria-hidden
          className="glass-solid grid h-12 w-12 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </span>
      </button>

      {/* Aviso "Próximamente" */}
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

      {/* Preguntas de ejemplo (desactivadas de momento) */}
      <p className="sr-only">{chat.suggestionsLabel}</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {chat.suggestions.map((question) => (
          <li key={question}>
            <button
              type="button"
              disabled={!enabled}
              title={!enabled ? chat.badge : undefined}
              className={cn(
                "rounded-full border border-line bg-white/10 px-3.5 py-1.5 text-xs text-fg backdrop-blur-md transition-colors",
                enabled ? "hover:bg-white/20" : "cursor-not-allowed",
              )}
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
