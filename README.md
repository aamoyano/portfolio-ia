# Antonio Álvarez Moyano · Portfolio

**🌐 [amoyano.es](https://amoyano.es)**

Portfolio personal de **Antonio Álvarez Moyano**, perfil junior en **Inteligencia Artificial y Big Data** (Madrid).
Su pieza central es un **asistente de IA** que responde, en tiempo real, cualquier pregunta sobre mi perfil.

- **Chat como protagonista:** al entrar solo se ve el saludo y la barra del asistente; la conversación se abre a pantalla completa.
- **Diseño *liquid glass*:** paneles de vidrio translúcido sobre una foto de atardecer fija, *mobile-first*.
- **Una sola fuente de contenido:** todos los textos de la web y lo que sabe el asistente salen de un único archivo.

## Índice

- [Tecnologías](#tecnologías)
- [Ejecutar en local](#ejecutar-en-local)
- [Editar el contenido](#editar-el-contenido)
- [El asistente de IA](#el-asistente-de-ia)
- [Variables de entorno](#variables-de-entorno)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Despliegue](#despliegue)

## Tecnologías

| Área | Herramientas |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Cache Components) · TypeScript |
| Estilos | Tailwind CSS 4 · Framer Motion (respeta `prefers-reduced-motion`) |
| Iconos y fuentes | lucide-react · react-icons · Space Grotesk e Inter con `next/font` |
| Asistente de IA | Claude (Sonnet 5.5 por defecto) vía OpenRouter o la API de Anthropic · respuestas en *streaming* |
| Límite de uso | Upstash Redis (opcional, con respaldo en memoria) |
| SEO | Metadatos, imagen Open Graph, `sitemap.xml`, `robots.txt` y datos estructurados |
| Despliegue | Vercel |

## Ejecutar en local

Requisitos: **Node.js 20** o superior.

```bash
npm install
cp .env.example .env.local   # añade tu clave de OpenRouter o Anthropic
npm run dev                  # http://localhost:3000
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (lo mismo que hace Vercel) |
| `npm run start` | Sirve el build en local |
| `npm run lint` | Revisa el código con ESLint |

Sin clave de API la web funciona igual: el chat muestra «Próximamente».

## Editar el contenido

> **Todos los textos están en [`src/data/profile.ts`](src/data/profile.ts).** Los componentes no tienen textos propios.

| Quiero cambiar… | Dónde, dentro de `profile.ts` |
| --- | --- |
| Email, LinkedIn, GitHub, foto, CV y fondo | `siteConfig` |
| Saludo y preguntas sugeridas del chat | `es.hero` · `es.chat` |
| Sobre mí y cifras destacadas | `es.about` |
| Proyectos | `es.projects.items` |
| Tecnologías del stack | `es.stack.groups` |
| Experiencia y formación | `es.timeline.items` |
| Información que solo conoce el asistente | `es.assistant` |
| Título, descripción y palabras clave SEO | `es.seo` |

<details>
<summary><b>Añadir un proyecto</b></summary>

Añade un objeto a `es.projects.items`:

```ts
{
  slug: "mi-proyecto",
  title: "Mi proyecto",
  description: "Qué hace en una o dos líneas.",
  tags: ["Python", "LLMs"],
  status: "completed",                // o "in-progress" → etiqueta «En desarrollo»
  image: "/projects/mi-proyecto.jpg", // opcional (16:10)
  demo: "https://…",                  // opcional: si está vacío no sale el botón
  github: "https://github.com/…",     // opcional
}
```

Las imágenes que no existen en `public/` simplemente no se muestran.
</details>

<details>
<summary><b>Añadir una tecnología al stack</b></summary>

Usa una de las claves de [`src/lib/tech-icons.tsx`](src/lib/tech-icons.tsx) (`python`, `docker`, `react`…).
Si necesitas un logo nuevo, impórtalo de `react-icons` y añádelo a ese mapa.
</details>

<details>
<summary><b>Archivos de <code>public/</code></b></summary>

| Archivo | Uso |
| --- | --- |
| `foto-antonio.jpg` | Foto de la sección Sobre mí |
| `cv-antonio-alvarez.pdf` | CV que se descarga desde la barra de navegación |
| `backgrounds/atardecer-lago.jpg` | Foto de fondo (hay otras dos opciones en la misma carpeta) |
| `projects/*.jpg` | Capturas de los proyectos (opcionales) |

La comprobación de si existen se hace al generar la página: tras añadir un archivo, reinicia `npm run dev` o vuelve a desplegar.
</details>

<details>
<summary><b>Imagen para compartir en redes</b></summary>

Es un JPG estático en `src/app/opengraph-image.jpg` (y `twitter-image.jpg`).
Para regenerarlo con otra foto o texto, usa [`scripts/generar-imagen-og.py`](scripts/generar-imagen-og.py).
</details>

<details>
<summary><b>Publicar en inglés</b></summary>

1. Crea `en: Content` en `profile.ts` con la misma forma que `es` (TypeScript avisa si falta algo).
2. Añade `"en"` a `enabledLocales` en [`src/i18n/config.ts`](src/i18n/config.ts).
3. Mueve la página a `src/app/[locale]/page.tsx` y genera las rutas `/es` y `/en`.

El asistente ya responde en el idioma en que le escriban.
</details>

## El asistente de IA

```
ChatWidget ──POST /api/chat──▶ límite de uso ──▶ Claude (perfil en el system prompt) ──streaming──▶ ChatWidget
```

Todo `profile.ts` se convierte en texto y va en el *system prompt*, con *prompt caching* para abaratar las preguntas.
Las instrucciones fijan el tono (tercera persona, cercano y profesional), respuestas breves y qué temas puede tratar.
Si cambias el perfil, el asistente lo sabe en el siguiente despliegue.

| Pieza | Archivo |
| --- | --- |
| Interfaz (barra, conversación, sugerencias) | [`src/components/chat/`](src/components/chat) |
| Endpoint con *streaming* | [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts) |
| Instrucciones del asistente | [`src/lib/chat/system-prompt.ts`](src/lib/chat/system-prompt.ts) |
| Perfil en texto para el modelo | [`src/lib/knowledge.ts`](src/lib/knowledge.ts) |
| Proveedor y modelo | [`src/lib/chat/providers.ts`](src/lib/chat/providers.ts) |
| Límite de uso (10/min y 30/día por IP) | [`src/lib/chat/rate-limit.ts`](src/lib/chat/rate-limit.ts) |

Para apagarlo en cualquier momento: `siteConfig.chatEnabled = false`.

### Modelo y coste

Se cambia con la variable `CHAT_MODEL`. Coste aproximado por pregunta (unos 3.000 tokens de entrada y 300 de salida):

| Modelo | OpenRouter | Anthropic | Por pregunta |
| --- | --- | --- | --- |
| Claude Sonnet 5.5 *(por defecto)* | `anthropic/claude-sonnet-5.5` | `claude-sonnet-5-5` | ~0,009 $ |
| Claude Opus 5.5 | `anthropic/claude-opus-5.5` | `claude-opus-5-5` | ~0,018 $ |
| Claude Haiku 5.5 | `anthropic/claude-haiku-5.5` | `claude-haiku-5-5` | ~0,0005 $ |

## Variables de entorno

Copia `.env.example` como `.env.local`. En Vercel se configuran en **Settings → Environment Variables**.

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `OPENROUTER_API_KEY` o `ANTHROPIC_API_KEY` | Para el chat | Activa el asistente. Basta una; si están las dos, se usa OpenRouter. |
| `CHAT_MODEL` | No | Cambia el modelo (ver tabla anterior). |
| `UPSTASH_REDIS_REST_URL` · `UPSTASH_REDIS_REST_TOKEN` | Recomendada en producción | Límite de uso compartido entre todas las instancias de Vercel. |
| `NEXT_PUBLIC_SITE_URL` | No | URL pública. En Vercel se usa el dominio de producción automáticamente. |

> Pon un **límite de crédito** a tu clave de OpenRouter o Anthropic. Nunca subas `.env.local` al repositorio.

## Estructura del proyecto

```
src/
├─ app/
│  ├─ layout.tsx               # fuentes, metadatos SEO y datos estructurados
│  ├─ page.tsx                 # monta las secciones
│  ├─ globals.css              # tema y clases .glass (vidrio líquido)
│  ├─ api/chat/route.ts        # endpoint del asistente
│  ├─ opengraph-image.jpg      # imagen para compartir en redes
│  └─ icon.tsx · sitemap.ts · robots.ts
├─ components/
│  ├─ Background.tsx           # foto de fondo fija
│  ├─ sections/                # Navbar, Hero, About, Projects, Stack, Timeline, Contact, Footer
│  ├─ chat/                    # ChatWidget, ChatPanel, MessageContent
│  └─ ui/                      # Section, SectionTitle, Reveal, Button, Tag…
├─ data/
│  ├─ profile.ts               # ← todo el contenido
│  └─ types.ts
├─ lib/                        # knowledge.ts, chat/, tech-icons.tsx, utilidades
├─ i18n/                       # idiomas (es activo)
└─ hooks/                      # useActiveSection
```

## Despliegue

Cada *push* a `main` se despliega automáticamente en **Vercel**, en [amoyano.es](https://amoyano.es).
Las variables de entorno nuevas se aplican en el siguiente despliegue.

---

© 2026 Antonio Álvarez Moyano
