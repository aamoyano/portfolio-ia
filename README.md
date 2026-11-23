# Portfolio · Antonio Álvarez Moyano

Web personal *one-page* de **Antonio Álvarez Moyano**, perfil junior en **Inteligencia Artificial y Big Data** (Madrid).
Diseño oscuro, moderno y *mobile-first*, preparada para incorporar un **chatbot de IA que responde preguntas sobre mi perfil**.

> Estado: primera versión publicada en español. El chatbot está maquetado como placeholder ("Próximamente").

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) + **TypeScript**
- **Tailwind CSS 4** para estilos
- **Framer Motion** para animaciones (respeta `prefers-reduced-motion`)
- **lucide-react** (iconos de interfaz) y **react-icons** (logos de tecnologías)
- Fuentes con `next/font`: **Space Grotesk** (títulos) e **Inter** (texto)
- Imagen Open Graph, favicon, `sitemap.xml` y `robots.txt` generados con las APIs de metadatos de Next.js
- Despliegue en **Vercel** sin configuración extra

## Ejecutar en local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros comandos:

```bash
npm run build      # build de producción (lo mismo que hace Vercel)
npm run start      # sirve el build en local
npm run lint       # revisa el código con ESLint
```

## Cómo editar los textos

**Todo el contenido está en un único archivo: [`src/data/profile.ts`](src/data/profile.ts).**
Los componentes no tienen textos propios, así que no hace falta tocarlos.

| Quiero cambiar…                         | Dónde, dentro de `profile.ts`             |
| --------------------------------------- | ----------------------------------------- |
| Email, LinkedIn, GitHub                 | `siteConfig.email` / `siteConfig.links`   |
| Textos del hero                         | `es.hero`                                 |
| Texto de "Sobre mí" y datos destacados  | `es.about`                                |
| Proyectos                               | `es.projects.items`                       |
| Tecnologías del stack                   | `es.stack.groups`                         |
| Formación y experiencia                 | `es.timeline.items`                       |
| Título, descripción y keywords SEO      | `es.seo`                                  |

### Añadir un proyecto

Añade un objeto a `es.projects.items`:

```ts
{
  slug: "mi-proyecto",
  title: "Mi proyecto",
  description: "Qué hace en una o dos líneas.",
  tags: ["Python", "LLMs"],
  status: "completed",             // o "in-progress" → muestra la etiqueta "En desarrollo"
  image: "/projects/mi-proyecto.jpg", // opcional
  demo: "https://…",                 // opcional: si está vacío no sale el botón
  github: "https://github.com/…",    // opcional
}
```

### Activar GitHub

`siteConfig.links.github` está vacío a propósito: **todos los botones e iconos de GitHub se ocultan solos**.
Cuando publiques tu perfil, rellena ese campo y aparecerán en el hero, en Contacto y en el footer.

### Añadir una tecnología al stack

Usa una de las claves de [`src/lib/tech-icons.tsx`](src/lib/tech-icons.tsx) (`python`, `docker`, `react`…).
Si necesitas un logo nuevo, impórtalo de `react-icons` y añádelo a ese mapa.

## Archivos que tienes que añadir

Mientras no existan, la web muestra un placeholder elegante (y el botón de CV aparece como "CV próximamente"):

| Archivo                          | Uso                                          |
| -------------------------------- | -------------------------------------------- |
| `public/foto-antonio.jpg`        | Foto de "Sobre mí" (vertical, 4:5, ~900 px de alto) |
| `public/cv-antonio-alvarez.pdf`  | CV descargable desde la navbar y el hero     |
| `public/projects/portfolio-ia.jpg` | Captura del proyecto "Portfolio con asistente de IA" (16:10) |
| `public/projects/reservas-ia.jpg`  | Captura del proyecto "Automatización de reservas con IA" (16:10) |

> La comprobación se hace al generar la página: después de añadir un archivo, reinicia `npm run dev` o vuelve a desplegar.

## Estructura

```
src/
├─ app/
│  ├─ layout.tsx            # fuentes, metadatos SEO y datos estructurados
│  ├─ page.tsx              # monta las secciones
│  ├─ globals.css           # tema (colores, animaciones, reduced-motion)
│  ├─ api/chat/route.ts     # endpoint del chatbot (de momento "Próximamente")
│  ├─ opengraph-image.tsx   # imagen para compartir en redes
│  ├─ twitter-image.tsx
│  ├─ icon.tsx · apple-icon.tsx
│  └─ sitemap.ts · robots.ts
├─ components/
│  ├─ sections/             # Navbar, Hero, About, Projects, Stack, Timeline, Contact, Footer
│  ├─ ui/                   # Button, Card, Tag, SectionTitle, Reveal, SocialLinks…
│  └─ chat/ChatWidget.tsx   # interfaz del asistente
├─ data/
│  ├─ profile.ts            # ← TODO EL CONTENIDO
│  └─ types.ts
├─ i18n/                    # idiomas (es activo, en preparado)
├─ hooks/                   # useActiveSection
└─ lib/                     # knowledge.ts (base de conocimiento del chat), utilidades
```

## Idiomas

Los textos están agrupados por idioma en `content` dentro de `profile.ts`. Para publicar en inglés:

1. Crea `en: Content` con la misma forma que `es` (TypeScript te avisará si falta algo).
2. Añade `"en"` a `enabledLocales` en [`src/i18n/config.ts`](src/i18n/config.ts).
3. Mueve la página a `src/app/[locale]/page.tsx` y genera las rutas `/es` y `/en`.

## Variables de entorno

Copia `.env.example` como `.env.local`. De momento solo es útil `NEXT_PUBLIC_SITE_URL` (cuando tengas dominio propio).
En Vercel se configuran en **Settings → Environment Variables**.

## Próximos pasos: el chatbot

La interfaz (`ChatWidget`), el endpoint (`/api/chat`), los tipos (`src/lib/chat/types.ts`) y la base de conocimiento
(`src/lib/knowledge.ts`, generada a partir de `profile.ts`) ya están preparados.

### Fase 1 · Contexto en el prompt

1. `npm install @anthropic-ai/sdk` y añadir `ANTHROPIC_API_KEY` en Vercel.
2. En `route.ts`, construir el *system prompt* con `buildKnowledgeBase()` e instrucciones claras:
   responder solo sobre mí, en el idioma de la pregunta, sin inventar datos y remitiendo al email si no lo sabe.
3. Devolver la respuesta en **streaming** y pintarla en el `ChatWidget` según llega.
4. **Límite de uso** por IP (p. ej. Upstash Redis + `@upstash/ratelimit`), `max_tokens` bajo y tope de gasto en la consola del proveedor.
5. Cambiar `siteConfig.chatEnabled` a `true` y activar los chips de preguntas de ejemplo.

Con un perfil del tamaño de `profile.ts` esta fase es suficiente y barata.

### Fase 2 · RAG con embeddings

Cuando haya más contenido (artículos, documentación de proyectos, el CV completo):

1. Trocear el contenido por secciones y generar **embeddings**.
2. Guardarlos en una **base vectorial** (pgvector en Supabase/Neon, Upstash Vector…).
3. En cada pregunta, recuperar los fragmentos más relevantes y pasarlos como contexto al LLM.
4. Citar la fuente de cada respuesta (proyecto, experiencia…) y registrar preguntas para mejorar el contenido.

---

© 2026 Antonio Álvarez Moyano · Hecho con Next.js e IA
