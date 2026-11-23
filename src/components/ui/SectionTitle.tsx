import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** Título de sección minimalista: una sola palabra, grande y ligera. */
export function SectionTitle({
  id,
  title,
  className,
}: {
  /** id de la sección: el título usa `${id}-title` para el aria-labelledby */
  id: string;
  title: string;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-8 sm:mb-10", className)}>
      <h2 id={`${id}-title`} className="text-3xl font-medium tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
    </Reveal>
  );
}
