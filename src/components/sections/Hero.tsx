import { ArrowDown } from "lucide-react";
import { siteConfig } from "@/data/profile";
import type { Content } from "@/data/types";
import { ChatWidget } from "../chat/ChatWidget";
import { Container } from "../ui/Container";

interface HeroProps {
  content: Content;
  /** Chat activo: interruptor en profile.ts + API key configurada */
  chatEnabled: boolean;
}

/** Retardo escalonado para la entrada del hero (CSS, sin esperar a JS) */
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

/**
 * Pantalla inicial: solo un saludo corto y el chat.
 * El resto de la web (proyectos, stack…) aparece al hacer scroll.
 */
export function Hero({ content, chatEnabled }: HeroProps) {
  const { hero, chat } = content;

  return (
    <section
      id="inicio"
      aria-labelledby="inicio-title"
      className="relative flex min-h-[100svh] flex-col items-center justify-center py-24"
    >
      <Container className="flex max-w-[760px] flex-col items-center text-center">
        <h1
          id="inicio-title"
          className="animate-fade-up text-balance font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg"
          style={delay(0.05)}
        >
          {hero.greeting} {siteConfig.name}
        </h1>

        <p className="animate-fade-up mt-4 text-pretty text-base text-muted sm:text-lg" style={delay(0.15)}>
          {hero.intro}
        </p>

        <div className="animate-fade-up mt-10 w-full" style={delay(0.3)}>
          <ChatWidget chat={chat} enabled={chatEnabled} />
        </div>
      </Container>

      {/* Indicador de scroll hacia el resto de la web */}
      <a
        href="#proyectos"
        aria-label={hero.scrollLabel}
        className="animate-fade-up glass glass-hover absolute bottom-8 left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full"
        style={delay(0.6)}
      >
        <ArrowDown className="h-4 w-4 text-fg" aria-hidden />
      </a>
    </section>
  );
}
