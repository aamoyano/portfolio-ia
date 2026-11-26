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
    // Otras opciones en /public/backgrounds: atardecer-playa.jpg y atardecer-palmeras.jpg
    background: "/backgrounds/atardecer-lago.jpg",
  },
  chatEnabled: true,
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
      { name: "Inglés", level: "B2, certificado con el EF SET (lo usa en reuniones con clientes)" },
    ],
  },

  nav: {
    links: [
      { id: "sobre-mi", label: "Sobre mí" },
      { id: "proyectos", label: "Proyectos" },
      { id: "stack", label: "Stack" },
      { id: "experiencia", label: "Experiencia" },
      { id: "formacion", label: "Formación" },
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
    intro: "IA y Big Data · Pregúntame lo que quieras sobre mi perfil",
    tagline:
      "Construyo soluciones con datos e inteligencia artificial, con la base de alguien que lleva años poniendo webs en producción.",
    ctaPrimary: "Ver proyectos",
    ctaSecondary: "Descargar CV",
    scrollLabel: "Ver el resto de la web",
  },

  chat: {
    title: "Asistente de Antonio",
    description: "IA · responde sobre mi perfil",
    placeholder: "Pregúntale a mi IA sobre mí…",
    badge: "Próximamente",
    comingSoon:
      "Mi asistente de IA está en construcción. Muy pronto podrás preguntarle lo que quieras sobre mi perfil.",
    suggestionsLabel: "Preguntas de ejemplo",
    suggestions: [
      "¿Qué proyectos ha hecho?",
      "¿Qué experiencia tiene?",
      "¿Por qué contratarle?",
    ],
    inputLabel: "Escribe tu pregunta sobre Antonio",
    followUpPlaceholder: "Escribe otra pregunta…",
    close: "Volver a la web",
    resume: "Continuar la conversación",
    sendLabel: "Enviar pregunta",
    typing: "Escribiendo…",
    disclaimer: "Respuestas generadas por IA a partir de mi perfil. Pueden contener errores. Las conversaciones se guardan para mejorar el asistente.",
    reset: "Nueva conversación",
    you: "Tú",
    assistant: "Asistente",
    errors: {
      generic: "Ahora mismo no puedo responder. Inténtalo de nuevo en un momento o escríbeme desde la sección de contacto.",
      rateLimited: "Has hecho muchas preguntas seguidas. Espera un poco antes de volver a intentarlo.",
      tooLong: "El mensaje es demasiado largo. Prueba con una pregunta más corta.",
    },
  },

  about: {
    eyebrow: "Sobre mí",
    title: "Del código en producción a los datos y la IA",
    paragraphs: [
      "Empecé en el marketing digital, analizando resultados de campañas publicitarias, y de ahí pasé al desarrollo web: más de un año creando webs para clientes finales, reuniéndome con ellos para entender sus necesidades y proponerles soluciones.",
      "Ahora estoy dando el salto a la Inteligencia Artificial y el Big Data con un máster oficial. Me interesan especialmente los datos, las automatizaciones y el desarrollo de aplicaciones con IA.",
    ],
    highlights: [
      { value: "+1 año", label: "con webs en producción" },
      { value: "Máster oficial", label: "en IA y Big Data" },
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
        tags: ["Next.js", "TypeScript", "LLM API"],
        status: "in-progress",
        image: "/projects/portfolio-ia.jpg",
        demo: "",
        github: "https://github.com/aamoyano/portfolio-ia",
      },
      {
        slug: "reservas-ia",
        title: "Automatización de reservas con IA",
        description:
          "Web para gestionar las reservas de una casa rural, con un chatbot con IA que resuelve dudas.",
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
          { name: "MCP", icon: "mcp" },
          { name: "n8n", icon: "n8n" },
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
          { name: "MongoDB", icon: "mongodb" },
          { name: "Docker", icon: "docker" },
        ],
      },
      {
        id: "web",
        title: "Web",
        description: "La base: interfaces, back-end y webs en producción.",
        items: [
          { name: "HTML", icon: "html" },
          { name: "CSS", icon: "css" },
          { name: "JavaScript", icon: "javascript" },
          { name: "React", icon: "react" },
          { name: "Next.js", icon: "nextjs" },
          { name: "Tailwind", icon: "tailwind" },
          { name: "PHP", icon: "php" },
          { name: "Laravel", icon: "laravel" },
          { name: "MySQL", icon: "mysql" },
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
        title: "Máster oficial en Inteligencia Artificial y Big Data",
        organization: "Cámara de Comercio de Madrid",
        start: "2026-09",
        period: "2026 – 2027",
        description:
          "Agentes de IA y gestión de bases de datos, entre otras materias.",
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
          "Proyectos web para clientes finales, en remoto: reuniones con los clientes, análisis de sus necesidades y propuesta de soluciones. Webs en producción: mejoras visuales, adaptación responsive y resolución de incidencias. Lo compaginaba con APPSUR.",
      },
      {
        type: "work",
        title: "Web Developer",
        organization: "APPSUR",
        start: "2025-12",
        period: "dic 2025 – jul 2026",
        description:
          "Diseño, desarrollo y personalización de soluciones web a medida para clientes, con foco en el rendimiento y la experiencia de usuario. Reuniones con los clientes para entender sus necesidades, resolución de incidencias en producción y ajustes funcionales con JavaScript, PHP y MySQL.",
      },
      {
        type: "work",
        title: "Web Developer",
        organization: "Nogomet Comunicación",
        start: "2025-04",
        period: "abr – jun 2025",
        description:
          "Contrato de prácticas del grado superior de Desarrollo de Aplicaciones Web: soluciones digitales y diseño web para empresas, y soporte técnico.",
      },
      {
        type: "education",
        title: "Técnico Superior en Desarrollo de Aplicaciones Web",
        organization: "Instituto MEDAC Córdoba",
        start: "2023-09",
        period: "2023 – 2025",
        description:
          "Desarrollo front-end y back-end: HTML, CSS, JavaScript, Tailwind, PHP, Laravel, SQL y Java.",
        location: "Córdoba",
      },
      {
        type: "work",
        title: "Marketing Digital",
        organization: "Diario Córdoba",
        start: "2023-04",
        period: "abr – jun 2023",
        description:
          "Prácticas del grado superior de Marketing y Publicidad: informes de resultados publicitarios (CTR, CPC, impresiones y conversiones) y seguimiento y supervisión de campañas.",
        location: "Córdoba",
      },
      {
        type: "education",
        title: "Técnico Superior en Marketing y Publicidad",
        organization: "Instituto MEDAC Córdoba",
        start: "2021-09",
        period: "2021 – 2023",
        description:
          "Marketing digital, publicidad y análisis de campañas.",
        location: "Córdoba",
      },
    ],
  },

  contact: {
    eyebrow: "Contacto",
    title: "¿Hablamos?",
    text: "Estoy buscando prácticas o un puesto junior en IA, datos o automatización.",
    emailLabel: "Escríbeme un email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    copyLabel: "Copiar email",
    copiedLabel: "Copiado",
  },

  footer: {
    text: "© 2026 Antonio Álvarez Moyano",
  },

  assistant: {
    experienceSummary: [
      "Más de un año de experiencia profesional como desarrollador web (agosto 2025 – septiembre 2026).",
      "Durante gran parte de ese tiempo compaginó dos empresas: Xpandex, como autónomo, y APPSUR.",
      "Trabajó con clientes reales y webs en producción, desde la reunión inicial hasta la solución.",
      "Antes hizo prácticas en desarrollo web (Nogomet Comunicación) y en marketing digital (Diario Córdoba).",
    ],
    motivation:
      "Da el salto a la IA para mantenerse actualizado en un sector que avanza muy rápido y poder desarrollar nuevas soluciones digitales. Le atraen especialmente los datos y las automatizaciones, y está convencido de que la IA puede ser una herramienta de gran utilidad para las empresas.",
    strengths: [
      "Autonomía: ha gestionado proyectos en remoto con clientes finales, de principio a fin.",
      "Aprende rápido y se adapta con facilidad a nuevos entornos.",
      "Buenas relaciones sociales y trato con clientes: reuniones para entender sus necesidades y proponer soluciones.",
      "Compromiso y muchas ganas de desarrollar su carrera profesional.",
    ],
    workPreferences: [
      "Busca prácticas o un puesto junior; ambas opciones le interesan.",
      "Se adapta a cualquier rol relacionado con la IA y el Big Data; le gustan especialmente las automatizaciones, el desarrollo de aplicaciones con IA y los datos.",
      "Modalidad: presencial, híbrido o remoto.",
      "Ubicación: Madrid y localidades cercanas; no se trasladaría lejos.",
      "Horario: disponibilidad completa por las mañanas y parcial por las tardes, porque el máster es presencial de tarde.",
      "Incorporación inmediata.",
      "Prácticas: no necesitan convenio con la Cámara de Comercio, aunque es posible si la empresa lo prefiere. No exige una duración concreta y está abierto a hablar de la remuneración.",
    ],
    skills: {
      main: ["Python", "APIs de LLMs (OpenAI, Claude, Gemini)", "MCP", "JavaScript", "HTML", "CSS", "PHP"],
      solid: [
        "React",
        "Next.js",
        "Tailwind",
        "Laravel",
        "WordPress con Elementor Pro y plugins técnicos",
        "MySQL",
        "SQL",
        "Git",
        "SEO básico",
        "Hosting",
        "Java",
      ],
      learning: ["LangChain", "Pandas", "NumPy", "n8n", "MongoDB", "Docker"],
    },
    certifications:
      "Certificado de inglés B2 (EF SET). Por ahora no tiene otras certificaciones, pero está preparándolas.",
    projects: [
      "Durante su experiencia profesional ha trabajado en muchos proyectos web para clientes, desde la reunión inicial hasta la web en producción.",
      "Además, tiene dos proyectos propios con IA:",
      "Portfolio con asistente de IA (en desarrollo, publicado en https://amoyano.es): esta misma web, con un chatbot que responde sobre su perfil usando un LLM. Código público en https://github.com/aamoyano/portfolio-ia. Más detalles en la ficha técnica.",
      "Sistema de reservas para una casa rural (en desarrollo): una web para gestionar las reservas, con un agente de IA que resuelve las dudas de los clientes. Python, LLMs, agentes y SQL. Más detalles en su ficha técnica.",
    ],
    portfolioTech: [
      "Web: Next.js 16 (App Router) y TypeScript, con Tailwind CSS y Framer Motion. Diseño mobile-first con paneles de vidrio translúcido (liquid glass). Desplegada en Vercel con dominio propio (amoyano.es).",
      "Todo el contenido de la web está en un único archivo de datos, que también alimenta al asistente: si Antonio cambia su perfil, el asistente lo sabe en el siguiente despliegue.",
      "Asistente: Claude Sonnet 5.5 (Anthropic) a través de OpenRouter, con las respuestas en streaming (se ven mientras se escriben).",
      "El perfil completo va en el contexto del modelo (system prompt) con prompt caching para abaratar las preguntas. No usa RAG porque el contenido es pequeño y cabe entero en el contexto.",
      "Instrucciones del asistente: tono, respuestas breves, no inventar nada que no esté en el perfil, temas permitidos y protección frente a intentos de manipulación (prompt injection).",
      "Control de abuso y de coste: límite de 10 preguntas por minuto y 30 al día por visitante, compartido entre todos los servidores con Upstash Redis; tope de gasto mensual en la clave de la API; mensajes de 600 caracteres como máximo e historial limitado a los últimos 12 mensajes.",
      "Privacidad: no se guarda la IP de los visitantes; para el límite de uso solo se guarda un hash irreversible que caduca solo.",
      "El código es público en GitHub: https://github.com/aamoyano/portfolio-ia.",
    ],
    reservasTech: [
      "Está en desarrollo: describe siempre cómo se está construyendo y qué incluirá, nunca como algo terminado o publicado.",
      "Web pública de la casa rural: fotos, servicios y normas, calendario de disponibilidad, formulario de solicitud de reserva y precio calculado según las fechas (temporada, fines de semana y mínimo de noches).",
      "Panel de administración para los propietarios: ver, aceptar o rechazar solicitudes, bloquear fechas y cambiar precios.",
      "Asistente con IA que no solo responde dudas, sino que actúa como agente con herramientas (tool use): consultar disponibilidad, calcular el precio de unas fechas, dar información de la casa y crear una solicitud de reserva, siempre confirmando con el usuario antes.",
      "Automatizaciones con n8n: aviso a los propietarios cuando llega una solicitud, email de confirmación al cliente y un resumen diario.",
      "Tecnologías: backend y agente en Python con FastAPI y Claude con tool use; base de datos PostgreSQL con SQLAlchemy; web en Next.js; automatizaciones con n8n. Cuando esté listo se desplegará en Vercel (web) y Render o Railway (API).",
      "Fases: datos y API con tests; web y panel; agente con su batería de pruebas; y por último n8n, despliegue y documentación.",
      "La demo pública usará datos de ejemplo, sin datos reales de la casa.",
    ],
    onlyIfAsked: [
      {
        topic: "Carnet de conducir y coche",
        answer: "Tiene carnet de conducir y coche.",
      },
      {
        topic: "Edad",
        answer: "Tiene 25 años.",
      },
      {
        topic: "Idiomas o inglés (solo si preguntan por idiomas)",
        answer:
          "Español nativo. Inglés de nivel B2, certificado con el EF SET (EF Standard English Test); lo usa en reuniones con clientes.",
      },
      {
        topic: "Aficiones",
        answer: "Le gusta jugar al ajedrez, tocar el piano y la naturaleza.",
      },
      {
        topic: "Cómo se ha hecho este portfolio",
        answer:
          "Lo ha desarrollado él con ayuda de herramientas de IA, que ha usado para corregir errores y avanzar más rápido en el desarrollo.",
      },
    ],
  },

  a11y: {
    skipToContent: "Saltar al contenido",
    mainNav: "Navegación principal",
    opensNewTab: "se abre en una pestaña nueva",
    technologies: "Tecnologías",
    projectImageAlt: "Captura del proyecto",
  },
};

/* ------------------------------------------------------------------ */
/*  Textos por idioma                                                  */
/* ------------------------------------------------------------------ */

export const content: Partial<Record<Locale, Content>> & { es: Content } = {
  es,
  // en: { ...traducción con la misma forma que `es`... }
};
