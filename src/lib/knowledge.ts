import { siteConfig } from "@/data/profile";
import type { Content } from "@/data/types";
import { getContent, type Locale } from "@/i18n";

/**
 * Convierte `profile.ts` en un texto plano que el LLM puede leer.
 *
 * El texto completo va en el system prompt (ver `src/lib/chat/system-prompt.ts`).
 * Si algún día el contenido crece mucho, se podría trocear por secciones
 * y recuperar solo lo relevante (RAG); con este tamaño no hace falta.
 */
export function buildKnowledgeBase(locale?: Locale): string {
  const content: Content = getContent(locale);
  const { person, about, projects, timeline, assistant } = content;

  const lines: string[] = [
    `# ${siteConfig.name}`,
    `- Perfil: ${person.role}`,
    `- Ubicación: ${person.location}`,
    `- Resumen: ${person.summary}`,
    `- Objetivo: ${person.objective}`,
    `- Disponibilidad: ${person.availability}`,
    `- Idiomas: ${person.languages.map((l) => `${l.name} (${l.level})`).join("; ")}`,
    `- Certificaciones: ${assistant.certifications}`,
    `- Email: ${siteConfig.email}`,
    `- LinkedIn: ${siteConfig.links.linkedin}`,
    ...(siteConfig.links.github ? [`- GitHub: ${siteConfig.links.github}`] : []),
    "",
    "## Sobre mí (texto de Antonio en primera persona)",
    ...about.paragraphs,
    "",
    "## Por qué da el salto a la IA",
    assistant.motivation,
    "",
    "## Puntos fuertes",
    ...assistant.strengths.map((s) => `- ${s}`),
    "",
    "## Qué busca y condiciones",
    ...assistant.workPreferences.map((w) => `- ${w}`),
    "",
    "## Tecnologías",
    `- Principales: ${assistant.skills.main.join(", ")}`,
    `- También conoce bien: ${assistant.skills.solid.join(", ")}`,
    `- Está aprendiendo: ${assistant.skills.learning.join(", ")}`,
    "",
    "## Proyectos (los únicos que puedes mencionar)",
    ...projects.items.map(
      (p) =>
        `- ${p.title} (${projects.statusLabels[p.status]}): ${p.description} Tecnologías: ${p.tags.join(", ")}.`,
    ),
    "",
    "## Trayectoria (de la más reciente a la más antigua)",
    ...[...timeline.items]
      .sort((a, b) => b.start.localeCompare(a.start))
      .map(
        (t) =>
          `- [${timeline.typeLabels[t.type]}] ${t.title} — ${t.organization} (${t.period}${t.current ? ", en curso" : ""}): ${t.description}`,
      ),
    "",
    "## Solo si te lo preguntan explícitamente (nunca lo menciones por iniciativa propia)",
    ...assistant.onlyIfAsked.map((item) => `- ${item.topic}: ${item.answer}`),
  ];

  return lines.join("\n");
}
