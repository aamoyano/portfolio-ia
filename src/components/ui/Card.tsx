"use client";

import { cn } from "@/lib/utils";

/**
 * Tarjeta base: se eleva al pasar el ratón y muestra un borde
 * con brillo que sigue al cursor (variables CSS --mx / --my).
 */
export function Card({
  children,
  className,
  as: Component = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <Component
      onPointerMove={handlePointerMove}
      className={cn(
        "glow-border rounded-2xl border border-line bg-surface transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.35)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
