import { ArrowRight, Download } from "lucide-react";
import { siteConfig } from "@/data/profile";
import type { Content } from "@/data/types";
import { ChatWidget } from "../chat/ChatWidget";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { SocialLinks } from "../ui/SocialLinks";
import { HeroBackground } from "./HeroBackground";

interface HeroProps {
  content: Content;
  /** Ruta del CV, o null si todavía no está en /public */
  cvHref: string | null;
}

/** Retardo escalonado para la entrada del hero (CSS, sin esperar a JS) */
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

export function Hero({ content, cvHref }: HeroProps) {
  const { hero, chat, nav } = content;
  // Separa el apellido final para darle el degradado
  const nameParts = siteConfig.name.split(" ");
  const lastName = nameParts.pop();
  const firstNames = nameParts.join(" ");

  return (
    <section
      id="inicio"
      aria-label={hero.greeting + " " + siteConfig.name}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28 sm:pt-32"
    >
      <HeroBackground />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <div>
            <p
              className="animate-fade-up mb-5 font-display text-lg text-muted sm:text-xl"
              style={delay(0.05)}
            >
              {hero.greeting}
            </p>

            <h1
              className="animate-fade-up text-balance font-display text-[clamp(2.9rem,9vw,6.75rem)] font-bold leading-[0.95] tracking-[-0.035em] text-fg"
              style={delay(0.1)}
            >
              {firstNames} <span className="text-gradient">{lastName}</span>
            </h1>

            <p
              className="animate-fade-up mt-7 flex items-start gap-3 font-display text-lg font-medium text-fg sm:text-xl"
              style={delay(0.2)}
            >
              <span aria-hidden className="animate-pulse-soft mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-cyan" />
              {hero.subtitle}
            </p>

            <p
              className="animate-fade-up mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
              style={delay(0.28)}
            >
              {hero.tagline}
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
              style={delay(0.36)}
            >
              <Button href="#proyectos" size="lg">
                {hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              {cvHref ? (
                <Button
                  href={cvHref}
                  download={siteConfig.assets.cv.split("/").pop()}
                  variant="secondary"
                  size="lg"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {hero.ctaSecondary}
                </Button>
              ) : (
                <Button variant="secondary" size="lg" disabled title={nav.cvUnavailable}>
                  <Download className="h-4 w-4" aria-hidden />
                  {nav.cvUnavailable}
                </Button>
              )}
              <SocialLinks className="sm:ml-2" />
            </div>
          </div>

          <div className="animate-fade-up w-full max-w-xl lg:justify-self-end" style={delay(0.5)}>
            <ChatWidget chat={chat} enabled={siteConfig.chatEnabled} />
          </div>
        </div>
      </Container>

      {/* Indicador de scroll */}
      <a
        href="#sobre-mi"
        aria-label={hero.scrollLabel}
        className="animate-fade-up absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:block"
        style={delay(0.8)}
      >
        <span className="flex h-10 w-6 justify-center rounded-full border border-line-strong pt-2 transition-colors hover:border-accent/60">
          <span className="animate-scroll-dot h-2 w-1 rounded-full bg-accent-soft" />
        </span>
      </a>
    </section>
  );
}
