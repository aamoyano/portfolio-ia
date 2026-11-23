"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo del hero:
 *  - "Aurora": manchas de color difuminadas que se mueven despacio (CSS puro).
 *  - Rejilla de puntos tenue con un brillo que sigue al ratón (solo con ratón).
 * Las animaciones CSS se paran solas con `prefers-reduced-motion`.
 */
export function HeroBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = spotlight.getBoundingClientRect();
        spotlight.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        spotlight.style.setProperty("--my", `${event.clientY - rect.top}px`);
        spotlight.style.opacity = "1";
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Aurora */}
      <div className="absolute -top-[30%] left-1/2 h-[90vh] w-[120vw] -translate-x-1/2 opacity-60 sm:w-[90vw]">
        <div className="animate-aurora absolute left-[10%] top-[20%] h-[55%] w-[45%] rounded-full bg-accent/40 blur-[110px]" />
        <div
          className="animate-aurora absolute right-[8%] top-[30%] h-[45%] w-[40%] rounded-full bg-cyan/25 blur-[120px]"
          style={{ animationDelay: "-6s", animationDuration: "22s" }}
        />
        <div
          className="animate-aurora absolute left-[35%] top-[45%] h-[40%] w-[35%] rounded-full bg-[#6d28d9]/40 blur-[100px]"
          style={{ animationDelay: "-12s", animationDuration: "26s" }}
        />
      </div>

      {/* Rejilla de puntos tenue */}
      <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Brillo que sigue al ratón: la misma rejilla, más luminosa, enmascarada alrededor del cursor */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          backgroundImage: "radial-gradient(rgba(167,139,250,0.55) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), black, transparent)",
          WebkitMaskImage:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), black, transparent)",
        }}
      />

      {/* Fundido hacia el fondo para enlazar con la siguiente sección */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
