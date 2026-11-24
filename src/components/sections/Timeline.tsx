import { Briefcase, GraduationCap } from "lucide-react";
import type { Content } from "@/data/types";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";

const icons = {
  work: Briefcase,
  education: GraduationCap,
} as const;

/**
 * Trayectoria completa (estudios y experiencia) en una línea de tiempo vertical,
 * de lo más reciente a lo más antiguo. Los datos están en `timeline.items` (profile.ts).
 */
export function Timeline({ timeline }: { timeline: Content["timeline"] }) {
  const items = [...timeline.items].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <Section id="trayectoria">
      <SectionTitle id="trayectoria" title={timeline.eyebrow} />

      <ol className="relative mx-auto max-w-3xl">
        {/* Línea vertical que une los puntos */}
        <span
          aria-hidden
          className="absolute bottom-6 left-5 top-6 w-px -translate-x-1/2 bg-gradient-to-b from-white/60 via-white/30 to-white/10"
        />

        {items.map((item, index) => {
          const Icon = icons[item.type];
          return (
            <Reveal
              as="li"
              key={`${item.organization}-${item.start}`}
              delay={Math.min(index * 0.05, 0.2)}
              className="relative pb-6 pl-14 last:pb-0 sm:pl-16"
            >
              {/* Punto con el icono */}
              <span
                className="glass-solid absolute left-0 top-4 grid h-10 w-10 place-items-center rounded-full"
                title={timeline.typeLabels[item.type]}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
                <span className="sr-only">{timeline.typeLabels[item.type]}</span>
              </span>

              <article className="glass rounded-[24px] px-5 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <span className="tabular-nums">{item.period}</span>
                  {item.current && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 font-medium text-fg">
                      {timeline.currentLabel}
                    </span>
                  )}
                </div>
                <h3 className="mt-1.5 text-lg font-medium leading-snug text-fg">{item.title}</h3>
                <p className="text-sm text-muted">
                  {item.organization}
                  {item.location && ` · ${item.location}`}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg/90">{item.description}</p>
              </article>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
