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
  const { person, about, timeline, assistant } = content;

  const lines: string[] = [
    `# ${siteConfig.name}`,
    `- Perfil: ${person.role}`,
    `- Ubicación: ${person.location}`,
    `- Resumen: ${person.summary}`,
    `- Objetivo: ${person.objective}`,
    `- Certificaciones: ${assistant.certifications}`,
    `- Email: ${siteConfig.email}`,
    `- LinkedIn: ${siteConfig.links.linkedin}`,
    ...(siteConfig.links.github ? [`- GitHub: ${siteConfig.links.github}`] : []),
    "",
    "## Sobre mí (texto de Antonio en primera persona)",
    ...about.paragraphs,
    "",
    "## Experiencia profesional en resumen",
    ...assistant.experienceSummary.map((e) => `- ${e}`),
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
    "## Tecnologías (por orden de prioridad; los grupos son internos, no los menciones)",
    `- Prioridad alta, nómbralas primero: ${assistant.skills.main.join(", ")}`,
    `- Prioridad media: ${assistant.skills.solid.join(", ")}`,
    `- Prioridad baja, las está aprendiendo: ${assistant.skills.learning.join(", ")}`,
    "",
    "## Proyectos (los únicos que puedes mencionar)",
    ...assistant.projects.map((p) => `- ${p}`),
    "",
    "## Ficha técnica de este portfolio (para preguntas sobre cómo está hecho)",
    ...assistant.portfolioTech.map((p) => `- ${p}`),
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
