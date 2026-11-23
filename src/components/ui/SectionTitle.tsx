import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionTitle({
  id,
  eyebrow,
  title,
  subtitle,
  className,
}: {
  /** id de la sección: el título usa `${id}-title` para el aria-labelledby */
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-12 max-w-2xl sm:mb-16", className)}>
      <p className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-soft">
        <span aria-hidden className="h-px w-6 bg-accent" />
        {eyebrow}
      </p>
      <h2
        id={`${id}-title`}
        className="text-balance text-4xl font-bold leading-[1.05] text-fg sm:text-5xl md:text-6xl"
      >
        {title}
      </h2>
      {subtitle && <p className="mt-5 text-pretty text-lg text-muted">{subtitle}</p>}
    </Reveal>
  );
}
