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
 * de lo más reciente a lo más antiguo, dentro de un único panel de vidrio
 * del mismo ancho que el resto de secciones. Datos en `timeline.items` (profile.ts).
 */
export function Timeline({ timeline }: { timeline: Content["timeline"] }) {
  const items = [...timeline.items].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <Section id="trayectoria">
      <SectionTitle id="trayectoria" title={timeline.eyebrow} />

      <Reveal>
        <div className="glass rounded-[28px] px-5 py-8 sm:px-8 sm:py-10">
          <ol className="relative">
            {/* Línea vertical que une los puntos */}
            <span
              aria-hidden
              className="absolute bottom-5 left-5 top-5 w-px -translate-x-1/2 bg-gradient-to-b from-white/60 via-white/30 to-white/10"
            />

            {items.map((item) => {
              const Icon = icons[item.type];
              return (
                <li key={`${item.organization}-${item.start}`} className="relative pb-9 pl-14 last:pb-0 sm:pl-16">
                  {/* Punto con el icono */}
                  <span
                    className="glass-solid absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full"
                    title={timeline.typeLabels[item.type]}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                    <span className="sr-only">{timeline.typeLabels[item.type]}</span>
                  </span>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span className="tabular-nums">{item.period}</span>
                    {item.current && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 font-medium text-fg">
                        {timeline.currentLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-lg font-medium leading-snug text-fg">{item.title}</h3>
                  <p className="text-sm text-muted">
                    {item.organization}
                    {item.location && ` · ${item.location}`}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-fg/90">{item.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>
    </Section>
  );
}
