"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Content } from "@/data/types";
import { useActiveSection } from "@/hooks/useActiveSection";
import { getScrollRoot } from "@/lib/scroll-root";
import { cn } from "@/lib/utils";
import { buttonClasses } from "../ui/Button";

interface NavbarProps {
  nav: Content["nav"];
  a11y: Content["a11y"];
  initials: string;
  /** Ruta del CV, o null si todavía no está en /public */
  cvHref: string | null;
  cvFileName: string;
}

/**
 * Navbar flotante en forma de píldora de vidrio.
 * Al cargar no se ve (la pantalla inicial es solo el chat):
 * aparece al bajar por la página.
 */
export function Navbar({ nav, a11y, initials, cvHref, cvFileName }: NavbarProps) {
  const ids = useMemo(() => nav.links.map((link) => link.id), [nav.links]);
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Se muestra cuando se ha bajado más de media pantalla
  useEffect(() => {
    const scroller = getScrollRoot();
    if (!scroller) return;
    const onScroll = () => setVisible(scroller.scrollTop > window.innerHeight * 0.5);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: se cierra con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cvButton = cvHref ? (
    <a href={cvHref} download={cvFileName} className={buttonClasses({ className: "h-9 px-4 md:h-9 md:px-3.5 md:text-[13px]" })}>
      <Download className="h-4 w-4" aria-hidden />
      {nav.cv}
    </a>
  ) : (
    <span
      aria-disabled="true"
      title={nav.cvUnavailable}
      className="inline-flex h-9 cursor-not-allowed items-center rounded-full border border-line px-3.5 text-[13px] text-faint"
    >
      {nav.cvUnavailable}
    </span>
  );

  return (
    <header
      inert={!visible && !open}
      className={cn(
        "absolute inset-x-0 top-[calc(1rem+env(safe-area-inset-top))] z-50 px-4 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible || open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-24 opacity-0",
      )}
    >
      <div className="glass mx-auto flex h-14 max-w-[820px] items-center justify-between gap-4 rounded-full pl-6 pr-2 md:h-12 md:max-w-[640px] md:pl-5 md:pr-1.5">
        <a
          href="#inicio"
          aria-label={nav.home}
          onClick={() => setOpen(false)}
          className="font-display text-base font-semibold tracking-tight text-fg md:text-sm"
        >
          {initials}
        </a>

        <nav aria-label={a11y.mainNav} className="hidden md:block">
          <ul className="flex items-center">
            {nav.links.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative isolate rounded-full px-3 py-1.5 text-[13px] transition-colors duration-300",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full bg-white/20 shadow-[inset_0_1px_0_rgb(255_255_255/0.5)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">{cvButton}</div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            className="grid h-10 w-10 place-items-center rounded-full text-fg transition-colors hover:bg-white/15 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={a11y.mainNav}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass mx-auto mt-3 max-w-[820px] rounded-3xl p-3 md:hidden"
          >
            <ul>
              {nav.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === link.id ? "location" : undefined}
                    className={cn(
                      "block rounded-2xl px-4 py-3 font-display text-xl transition-colors",
                      active === link.id ? "bg-white/15 text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="px-4 pb-2 pt-3">{cvButton}</div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
