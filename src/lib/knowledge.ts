import { siteConfig } from "@/data/profile";
import type { Content } from "@/data/types";
import { getContent, type Locale } from "@/i18n";

/**
 * Convierte `profile.ts` en un texto plano que el LLM puede leer.
 *
 * Fase 1 del chatbot: este texto va entero en el system prompt.
 * Fase 2: se trocea por secciones, se generan embeddings y se guarda
 * en una base vectorial para recuperar solo lo relevante (RAG).
 */
export function buildKnowledgeBase(locale?: Locale): string {
  const content: Content = getContent(locale);
  const { person, about, projects, stack, timeline } = content;

  const lines: string[] = [
    `# ${siteConfig.name}`,
    `- Perfil: ${person.role}`,
    `- Ubicación: ${person.location}`,
    `- Resumen: ${person.summary}`,
    `- Objetivo: ${person.objective}`,
    `- Disponibilidad: ${person.availability}`,
    `- Idiomas: ${person.languages.map((l) => `${l.name} (${l.level})`).join(", ")}`,
    `- Email: ${siteConfig.email}`,
    `- LinkedIn: ${siteConfig.links.linkedin}`,
    ...(siteConfig.links.github ? [`- GitHub: ${siteConfig.links.github}`] : []),
    "",
    "## Sobre mí",
    ...about.paragraphs,
    ...about.highlights.map((h) => `- ${h.value} ${h.label}`),
    "",
    "## Proyectos",
    ...projects.items.map(
      (p) =>
        `- ${p.title} (${projects.statusLabels[p.status]}): ${p.description} Tecnologías: ${p.tags.join(", ")}.`,
    ),
    "",
    "## Stack",
    ...stack.groups.map((g) => `- ${g.title}: ${g.items.map((i) => i.name).join(", ")}`),
    "",
    "## Trayectoria",
    ...[...timeline.items]
      .sort((a, b) => b.start.localeCompare(a.start))
      .map(
        (t) =>
          `- [${timeline.typeLabels[t.type]}] ${t.title} — ${t.organization} (${t.period}): ${t.description}`,
      ),
  ];

  return lines.join("\n");
}
