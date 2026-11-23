"use client";

import { useEffect, useState } from "react";

/**
 * Devuelve el id de la sección que ocupa la franja central de la pantalla,
 * para resaltar su enlace en la navbar.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Solo cuenta la franja central de la ventana
      { rootMargin: "-45% 0px -50% 0px" },
    );

    // Al volver al hero no hay ninguna sección activa
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) setActive(null);
    };

    elements.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}
