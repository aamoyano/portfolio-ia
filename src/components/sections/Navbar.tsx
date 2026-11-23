"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Content } from "@/data/types";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import { buttonClasses } from "../ui/Button";
import { Container } from "../ui/Container";

interface NavbarProps {
  nav: Content["nav"];
  a11y: Content["a11y"];
  initials: string;
  /** Ruta del CV, o null si todavía no está en /public */
  cvHref: string | null;
  cvFileName: string;
}

export function Navbar({ nav, a11y, initials, cvHref, cvFileName }: NavbarProps) {
  const ids = useMemo(() => nav.links.map((link) => link.id), [nav.links]);
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fondo con glassmorphism en cuanto se hace scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú móvil: bloquea el scroll del fondo y se cierra con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cvButton = cvHref ? (
    <a href={cvHref} download={cvFileName} className={buttonClasses({ size: "md", className: "h-9 px-4" })}>
      <Download className="h-4 w-4" aria-hidden />
      {nav.cv}
    </a>
  ) : (
    <span
      aria-disabled="true"
      title={nav.cvUnavailable}
      className={buttonClasses({ variant: "secondary", size: "md", className: "h-9 cursor-not-allowed px-4" })}
    >
      {nav.cvUnavailable}
    </span>
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <a
          href="#inicio"
          aria-label={nav.home}
          onClick={() => setOpen(false)}
          className="font-display text-lg font-bold tracking-tight text-fg transition-colors hover:text-accent-soft"
        >
          {initials}
          <span className="text-accent">.</span>
        </a>

        <nav aria-label={a11y.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.links.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative isolate rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute inset-0 -z-10 rounded-full border border-accent/30 bg-accent/10"
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
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-fg transition-colors hover:bg-white/5 md:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={a11y.mainNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
          >
            <Container className="flex flex-col gap-1 pb-10 pt-6">
              {nav.links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === link.id ? "location" : undefined}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.05 }}
                  className={cn(
                    "border-b border-line py-4 font-display text-3xl font-semibold transition-colors",
                    active === link.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-8"
              >
                {cvButton}
              </motion.div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
