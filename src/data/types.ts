/**
 * Tipos del contenido de la web.
 *
 * Todo lo que se ve en la página sale de `profile.ts` con esta forma.
 * El mismo objeto servirá como base de conocimiento del chatbot,
 * así que los campos están pensados para leerse también como "hechos".
 */

import type { Locale } from "@/i18n/config";
import type { TechIconKey } from "@/lib/tech-icons";

/** Datos que no dependen del idioma: nombre, enlaces y archivos. */
export interface SiteConfig {
  name: string;
  /** Iniciales para el logo y el favicon */
  initials: string;
  email: string;
  links: {
    linkedin: string;
    /** Déjalo vacío ("") y todos los botones de GitHub se ocultan solos */
    github: string;
  };
  /** Rutas dentro de /public. Si el archivo no existe se muestra un placeholder. */
  assets: {
    photo: string;
    cv: string;
    /** Foto de fondo fija de toda la web */
    background: string;
  };
  /** Interruptor del chatbot. En `false` se muestra el placeholder "Próximamente". */
  chatEnabled: boolean;
}

export type ProjectStatus = "in-progress" | "completed";

export interface Project {
  /** Identificador único (también sirve como `key`) */
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: ProjectStatus;
  /** Ruta dentro de /public, p. ej. "/projects/portfolio.jpg" (opcional) */
  image?: string;
  /** Enlaces opcionales: si están vacíos el botón no aparece */
  demo?: string;
  github?: string;
}

export interface StackItem {
  name: string;
  icon: TechIconKey;
}

export interface StackGroup {
  id: string;
  title: string;
  description: string;
  items: StackItem[];
}

export type TimelineType = "work" | "education";

export interface TimelineItem {
  type: TimelineType;
  /** Puesto o título */
  title: string;
  /** Empresa o centro */
  organization: string;
  /** Fecha de inicio en formato AAAA-MM, solo para ordenar */
  start: string;
  /** Texto de fechas tal y como se muestra */
  period: string;
  description: string;
  location?: string;
  /** Si sigue en curso */
  current?: boolean;
}

export interface Highlight {
  value: string;
  label: string;
}

/** Todos los textos de la web en un idioma concreto. */
export interface Content {
  locale: Locale;

  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  person: {
    location: string;
    role: string;
    summary: string;
    objective: string;
    availability: string;
    languages: { name: string; level: string }[];
  };

  nav: {
    links: { id: SectionId; label: string }[];
    cv: string;
    cvUnavailable: string;
    openMenu: string;
    closeMenu: string;
    home: string;
  };

  hero: {
    greeting: string;
    subtitle: string;
    tagline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollLabel: string;
  };

  chat: {
    title: string;
    description: string;
    placeholder: string;
    badge: string;
    comingSoon: string;
    suggestionsLabel: string;
    suggestions: string[];
  };

  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    highlights: Highlight[];
    photoAlt: string;
  };

  projects: {
    eyebrow: string;
    title: string;
    subtitle: string;
    statusLabels: Record<ProjectStatus, string>;
    demoLabel: string;
    githubLabel: string;
    items: Project[];
  };

  stack: {
    eyebrow: string;
    title: string;
    subtitle: string;
    groups: StackGroup[];
  };

  timeline: {
    eyebrow: string;
    title: string;
    subtitle: string;
    typeLabels: Record<TimelineType, string>;
    currentLabel: string;
    /** Versión resumida que se muestra en la web (3-4 líneas) */
    summary: { title: string; place: string; period: string; type: TimelineType }[];
    /** Detalle completo: base de conocimiento del chatbot */
    items: TimelineItem[];
  };

  contact: {
    eyebrow: string;
    title: string;
    text: string;
    emailLabel: string;
    linkedinLabel: string;
    githubLabel: string;
    copyLabel: string;
    copiedLabel: string;
  };

  footer: {
    text: string;
  };

  /** Textos solo para lectores de pantalla y atributos aria */
  a11y: {
    skipToContent: string;
    mainNav: string;
    opensNewTab: string;
    technologies: string;
    projectImageAlt: string;
  };
}

export type SectionId = "sobre-mi" | "proyectos" | "stack" | "trayectoria" | "contacto";
