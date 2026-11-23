import type { Content } from "@/data/types";
import { techIcons } from "@/lib/tech-icons";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";

/** Un único panel de vidrio con los logos agrupados en tres filas. */
export function Stack({ stack }: { stack: Content["stack"] }) {
  return (
    <Section id="stack">
      <SectionTitle id="stack" title={stack.eyebrow} />

      <Reveal>
        <div className="glass divide-y divide-white/15 rounded-[28px] px-6 sm:px-8">
          {stack.groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
              <h3 className="w-20 shrink-0 text-sm font-medium uppercase tracking-[0.18em] text-faint">
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const Icon = techIcons[item.icon];
                  return (
                    <li
                      key={item.name}
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.25)] transition-colors duration-300 hover:bg-white/20"
                    >
                      <Icon aria-hidden className="h-4 w-4" />
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
