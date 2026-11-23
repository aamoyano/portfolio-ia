import { ArrowDown, Download } from "lucide-react";
import { siteConfig } from "@/data/profile";
import type { Content } from "@/data/types";
import { ChatWidget } from "../chat/ChatWidget";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { SocialLinks } from "../ui/SocialLinks";

interface HeroProps {
  content: Content;
  /** Ruta del CV, o null si todavía no está en /public */
  cvHref: string | null;
}

/** Retardo escalonado para la entrada del hero (CSS, sin esperar a JS) */
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

export function Hero({ content, cvHref }: HeroProps) {
  const { hero, chat } = content;

  return (
    <section
      id="inicio"
      aria-labelledby="inicio-title"
      className="relative flex min-h-[100svh] flex-col items-center justify-center pb-28 pt-32"
    >
      <Container className="flex max-w-[860px] flex-col items-center text-center">
        <h1
          id="inicio-title"
          className="animate-fade-up text-balance font-display text-[clamp(2.75rem,6vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg"
          style={delay(0.05)}
        >
          {siteConfig.name}
        </h1>

        <p className="animate-fade-up mt-5 text-lg text-muted" style={delay(0.15)}>
          {hero.subtitle}
        </p>

        <div className="animate-fade-up mt-12 w-full max-w-xl" style={delay(0.3)}>
          <ChatWidget chat={chat} enabled={siteConfig.chatEnabled} />
        </div>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3"
          style={delay(0.45)}
        >
          <Button href="#proyectos" size="lg">
            {hero.ctaPrimary}
          </Button>
          {/* El botón de CV solo aparece cuando el PDF está en /public */}
          {cvHref && (
            <Button
              href={cvHref}
              download={siteConfig.assets.cv.split("/").pop()}
              variant="glass"
              size="lg"
            >
              <Download className="h-4 w-4" aria-hidden />
              {hero.ctaSecondary}
            </Button>
          )}
          <SocialLinks />
        </div>
      </Container>

      {/* Indicador de scroll */}
      <a
        href="#proyectos"
        aria-label={hero.scrollLabel}
        className="animate-fade-up glass glass-hover absolute bottom-8 left-1/2 hidden h-11 w-11 -translate-x-1/2 place-items-center rounded-full sm:grid"
        style={delay(0.8)}
      >
        <ArrowDown className="h-4 w-4 text-fg" aria-hidden />
      </a>
    </section>
  );
}
