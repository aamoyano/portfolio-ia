import type { Content } from "@/data/types";
import { techIcons } from "@/lib/tech-icons";
import { Card } from "../ui/Card";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";

export function Stack({ stack }: { stack: Content["stack"] }) {
  return (
    <Section id="stack">
      <SectionTitle id="stack" eyebrow={stack.eyebrow} title={stack.title} subtitle={stack.subtitle} />

      <div className="grid gap-6 lg:grid-cols-3">
        {stack.groups.map((group, index) => (
          <Reveal key={group.id} delay={index * 0.1}>
            <Card className="h-full p-6 sm:p-7">
              <h3 className="text-2xl font-semibold text-fg">{group.title}</h3>
              <p className="mt-2 text-sm text-muted">{group.description}</p>

              <ul className="mt-6 flex flex-wrap gap-2.5">
                {group.items.map((item) => {
                  const Icon = techIcons[item.icon];
                  return (
                    <li
                      key={item.name}
                      className="group/chip inline-flex items-center gap-2 rounded-xl border border-line bg-bg/50 px-3.5 py-2.5 text-sm text-fg/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10"
                    >
                      <Icon
                        aria-hidden
                        className="h-[18px] w-[18px] text-muted transition-colors duration-300 group-hover/chip:text-accent-soft"
                      />
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
