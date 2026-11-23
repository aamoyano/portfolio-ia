import { Briefcase, GraduationCap } from "lucide-react";
import type { Content } from "@/data/types";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";

const icons = {
  work: Briefcase,
  education: GraduationCap,
} as const;

/** Trayectoria resumida en cuatro líneas (`timeline.summary` en profile.ts). */
export function Timeline({ timeline }: { timeline: Content["timeline"] }) {
  return (
    <Section id="trayectoria">
      <SectionTitle id="trayectoria" title={timeline.eyebrow} />

      <Reveal>
        <ol className="glass divide-y divide-white/15 rounded-[28px] px-6 sm:px-8">
          {timeline.summary.map((item) => {
            const Icon = icons[item.type];
            return (
              <li key={item.title} className="flex items-center gap-4 py-5 sm:gap-6">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]"
                  title={timeline.typeLabels[item.type]}
                >
                  <Icon className="h-[18px] w-[18px] text-fg" aria-hidden />
                  <span className="sr-only">{timeline.typeLabels[item.type]}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-fg">{item.title}</h3>
                  <p className="text-sm text-muted">
                    {item.place}
                    <span className="sm:hidden"> · {item.period}</span>
                  </p>
                </div>
                <span className="hidden shrink-0 text-sm tabular-nums text-muted sm:block">{item.period}</span>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </Section>
  );
}
