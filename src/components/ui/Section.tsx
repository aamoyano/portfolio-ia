import { cn } from "@/lib/utils";
import type { SectionId } from "@/data/types";
import { Container } from "./Container";

/** Sección de la página con su ancla y espaciado estándar. */
export function Section({
  id,
  className,
  children,
}: {
  id: SectionId;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("relative py-24 sm:py-32", className)}>
      <Container>{children}</Container>
    </section>
  );
}
