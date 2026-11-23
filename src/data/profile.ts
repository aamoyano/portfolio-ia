/**
 * ============================================================
 *  PERFIL DE ANTONIO ÁLVAREZ MOYANO — única fuente de datos
 * ============================================================
 *
 * Cambia aquí cualquier texto, enlace, proyecto o entrada de la
 * trayectoria: los componentes no contienen textos propios.
 *
 * Este archivo es también la base de conocimiento del futuro
 * chatbot (ver `src/lib/knowledge.ts`), así que conviene que los
 * datos sean completos y estén escritos como hechos.
 *
 * Idiomas: los textos están agrupados por idioma en `content`.
 * Para añadir inglés, crea un objeto `en: Content` con la misma
 * forma que `es` y añade "en" a `enabledLocales` en `src/i18n/config.ts`.
 */

import type { Locale } from "@/i18n/config";
import type { Content, SiteConfig } from "./types";

/* ------------------------------------------------------------------ */
/*  Datos comunes a todos los idiomas                                  */
/* ------------------------------------------------------------------ */

export const siteConfig: SiteConfig = {
  name: "Antonio Álvarez Moyano",
  initials: "AÁM",
  email: "aamoyano01@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/antonio-alvarez-moyano",
    // Pendiente de publicar. Rellénalo y aparecerán todos los botones de GitHub.
    github: "",
  },
  assets: {
    photo: "/foto-antonio.jpg",
    cv: "/cv-antonio-alvarez.pdf",
  },
  chatEnabled: false,
};

/* ------------------------------------------------------------------ */
/*  Español                                                            */
/* ------------------------------------------------------------------ */

const es: Content = {
  locale: "es",

  seo: {
    title: "Antonio Álvarez Moyano · IA y Big Data",
    description:
      "Portfolio de Antonio Álvarez Moyano: perfil junior en Inteligencia Artificial y Big Data en Madrid. Automatización, agentes con LLMs y datos, con experiencia previa poniendo webs en producción.",
    keywords: [
      "Antonio Álvarez Moyano",
      "Inteligencia Artificial",
      "Big Data",
      "LLM",
      "Agentes de IA",
      "Automatización",
      "Python",
      "Desarrollador web",
      "Madrid",
      "Junior IA",
    ],
  },

  person: {
    location: "Madrid, España",
    role: "IA y Big Data · Automatización y agentes",
    summary:
      "Estoy reorientando mi carrera hacia la Inteligencia Artificial y el Big Data. Vengo del desarrollo web y del marketing digital.",
    objective:
      "Encontrar prácticas o un puesto junior en IA, datos o automatización.",
    availability: "Disponibilidad inmediata",
    languages: [
      { name: "Español", level: "Nativo" },
      { name: "Inglés", level: "Intermedio" },
    ],
  },

  nav: {
    links: [
      { id: "sobre-mi", label: "Sobre mí" },
      { id: "proyectos", label: "Proyectos" },
      { id: "stack", label: "Stack" },
      { id: "trayectoria", label: "Trayectoria" },
      { id: "contacto", label: "Contacto" },
    ],
    cv: "CV",
    cvUnavailable: "CV próximamente",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    home: "Ir al inicio",
  },

  hero: {
    greeting: "Hola, soy",
    subtitle: "IA y Big Data · Automatización y agentes",
    tagline:
      "Construyo soluciones con datos e inteligencia artificial, con la base de alguien que lleva años poniendo webs en producción.",
    ctaPrimary: "Ver proyectos",
    ctaSecondary: "Descargar CV",
    scrollLabel: "Bajar a la sección Sobre mí",
  },

  chat: {
    placeholder: "Pregúntale a mi IA sobre mí…",
    badge: "Próximamente",
    comingSoon:
      "Mi asistente de IA está en construcción. Muy pronto podrás preguntarle lo que quieras sobre mi perfil.",
    suggestionsLabel: "Preguntas de ejemplo",
    suggestions: [
      "¿Qué proyectos ha hecho?",
      "¿Está disponible?",
      "¿Por qué contratarle?",
    ],
  },

  about: {
    eyebrow: "Sobre mí",
    title: "Del código en producción a los datos y la IA",
    paragraphs: [
      "Empecé en el marketing digital, leyendo métricas de campañas, y de ahí pasé a programar: más de un año desarrollando y manteniendo webs WordPress en producción para empresas reales, donde lo importante es que todo funcione hoy y no se rompa mañana.",
      "Ahora estoy dando el salto a la Inteligencia Artificial y el Big Data con un máster oficial. Me atrae la parte práctica: automatizar procesos, construir agentes con LLMs y convertir datos en decisiones útiles para un negocio.",
    ],
    highlights: [
      { value: "+1 año", label: "con webs en producción" },
      { value: "Máster oficial", label: "en IA y Big Data" },
      { value: "Disponibilidad", label: "inmediata" },
    ],
    photoAlt: "Retrato de Antonio Álvarez Moyano",
  },

  projects: {
    eyebrow: "Proyectos",
    title: "Lo que estoy construyendo",
    subtitle:
      "Proyectos donde aplico IA y automatización a problemas concretos.",
    statusLabels: {
      "in-progress": "En desarrollo",
      completed: "Terminado",
    },
    demoLabel: "Demo",
    githubLabel: "GitHub",
    items: [
      {
        slug: "portfolio-ia",
        title: "Portfolio con asistente de IA",
        description:
          "Esta web: un portfolio con un chatbot que responde sobre mi perfil usando un LLM.",
        tags: ["Next.js", "TypeScript", "LLM API", "RAG"],
        status: "in-progress",
        image: "/projects/portfolio-ia.jpg",
        demo: "",
        github: "",
      },
      {
        slug: "reservas-ia",
        title: "Automatización de reservas con IA",
        description:
          "Agente con LLM que atiende consultas y gestiona la disponibilidad de una casa rural.",
        tags: ["Python", "LLMs", "Agentes", "SQL"],
        status: "in-progress",
        image: "/projects/reservas-ia.jpg",
        demo: "",
        github: "",
      },
    ],
  },

  stack: {
    eyebrow: "Stack",
    title: "Herramientas con las que trabajo",
    subtitle: "De los modelos de lenguaje a los datos, sin olvidar la web.",
    groups: [
      {
        id: "ia",
        title: "IA",
        description: "Modelos de lenguaje, agentes y recuperación de información.",
        items: [
          { name: "Python", icon: "python" },
          { name: "LangChain", icon: "langchain" },
          { name: "OpenAI API", icon: "openai" },
          { name: "Claude API", icon: "claude" },
          { name: "Gemini API", icon: "gemini" },
          { name: "RAG", icon: "rag" },
          { name: "MCP", icon: "mcp" },
        ],
      },
      {
        id: "datos",
        title: "Datos",
        description: "Consulta, análisis, modelos y procesamiento a escala.",
        items: [
          { name: "SQL", icon: "sql" },
          { name: "Pandas", icon: "pandas" },
          { name: "NumPy", icon: "numpy" },
          { name: "Scikit-learn", icon: "sklearn" },
          { name: "Spark", icon: "spark" },
          { name: "MongoDB", icon: "mongodb" },
          { name: "Docker", icon: "docker" },
        ],
      },
      {
        id: "web",
        title: "Web",
        description: "La base: interfaces, back-end y webs en producción.",
        items: [
          { name: "JavaScript", icon: "javascript" },
          { name: "React", icon: "react" },
          { name: "Next.js", icon: "nextjs" },
          { name: "PHP", icon: "php" },
          { name: "MySQL", icon: "mysql" },
          { name: "WordPress", icon: "wordpress" },
          { name: "Git", icon: "git" },
        ],
      },
    ],
  },

  timeline: {
    eyebrow: "Trayectoria",
    title: "Formación y experiencia",
    subtitle: "De la más reciente a la más antigua.",
    typeLabels: {
      work: "Experiencia",
      education: "Formación",
    },
    currentLabel: "En curso",
    items: [
      {
        type: "education",
        title: "Máster FP oficial en Inteligencia Artificial y Big Data",
        organization: "Cámara de Comercio de Madrid",
        start: "2026-09",
        period: "2026 – 2027",
        description:
          "Formación oficial en aprendizaje automático, Big Data e inteligencia artificial aplicada.",
        location: "Madrid",
        current: true,
      },
      {
        type: "work",
        title: "Web Developer",
        organization: "Xpandex (Abadesa Export Center) · Autónomo",
        start: "2025-08",
        period: "ago 2025 – sep 2026",
        description:
          "WordPress en producción: mejoras visuales, adaptación responsive y resolución de incidencias.",
      },
      {
        type: "work",
        title: "Web Developer",
        organization: "APPSUR",
        start: "2025-12",
        period: "dic 2025 – jul 2026",
        description:
          "Desarrollo y mantenimiento de webs en WordPress con foco en rendimiento y experiencia de usuario.",
      },
      {
        type: "work",
        title: "Web Developer",
        organization: "Nogomet Comunicación",
        start: "2025-04",
        period: "abr – jun 2025",
        description: "Desarrollo de webs en WordPress y soporte técnico a clientes.",
      },
      {
        type: "education",
        title: "Técnico Superior en Desarrollo de Aplicaciones Web",
        organization: "Instituto MEDAC Córdoba",
        start: "2023-09",
        period: "2023 – 2025",
        description:
          "Desarrollo front-end y back-end: JavaScript, PHP, bases de datos SQL y despliegue de aplicaciones.",
        location: "Córdoba",
      },
      {
        type: "work",
        title: "Marketing Digital",
        organization: "Diario Córdoba",
        start: "2023-04",
        period: "abr – jun 2023",
        description:
          "Informes de rendimiento de campañas: CTR, CPC, impresiones y conversiones.",
        location: "Córdoba",
      },
      {
        type: "education",
        title: "Técnico Superior en Marketing y Publicidad",
        organization: "Instituto MEDAC Córdoba",
        start: "2021-09",
        period: "2021 – 2023",
        description:
          "Estrategia digital, investigación de mercados y análisis de campañas.",
        location: "Córdoba",
      },
    ],
  },

  contact: {
    eyebrow: "Contacto",
    title: "¿Hablamos?",
    text: "Estoy buscando prácticas o un puesto junior en IA, datos o automatización. Tengo disponibilidad inmediata.",
    emailLabel: "Escríbeme un email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    copyLabel: "Copiar email",
    copiedLabel: "Copiado",
  },

  footer: {
    text: "© 2026 Antonio Álvarez Moyano · Hecho con Next.js e IA",
  },
};

/* ------------------------------------------------------------------ */
/*  Textos por idioma                                                  */
/* ------------------------------------------------------------------ */

export const content: Partial<Record<Locale, Content>> & { es: Content } = {
  es,
  // en: { ...traducción con la misma forma que `es`... }
};
