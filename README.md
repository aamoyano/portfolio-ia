# Portfolio · Antonio Álvarez Moyano

Web personal *one-page* de **Antonio Álvarez Moyano**, perfil junior en **Inteligencia Artificial y Big Data** (Madrid).
Diseño minimalista *liquid glass* sobre una foto de atardecer fija, *mobile-first* y preparada para incorporar un **chatbot de IA que responde preguntas sobre mi perfil**.

> Estado: publicada en español, con chatbot de IA (necesita `OPENROUTER_API_KEY` o `ANTHROPIC_API_KEY`).

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
| Trayectoria resumida (4 líneas)         | `es.timeline.summary`                     |
| Proyectos                               | `es.projects.items`                       |
| Tecnologías del stack                   | `es.stack.groups`                         |
| Formación y experiencia completas       | `es.timeline.items` (base del chatbot)    |
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

Mientras no existan, simplemente no se muestran (el botón de CV aparece como "CV próximamente" en la navbar):

| Archivo                          | Uso                                          |
| -------------------------------- | -------------------------------------------- |
| `public/cv-antonio-alvarez.pdf`  | CV descargable desde la navbar y el hero     |
| `public/projects/portfolio-ia.jpg` | Captura del proyecto "Portfolio con asistente de IA" (16:10) |
| `public/projects/reservas-ia.jpg`  | Captura del proyecto "Automatización de reservas con IA" (16:10) |

> La comprobación se hace al generar la página: después de añadir un archivo, reinicia `npm run dev` o vuelve a desplegar.

## Fondo

La foto fija de fondo se define en `siteConfig.assets.background`. Hay tres opciones en `public/backgrounds/`:
`atardecer-lago.jpg` (la actual), `atardecer-playa.jpg` y `atardecer-palmeras.jpg`.

El diseño oscuro anterior está guardado en la etiqueta de Git `diseno-oscuro` (`git checkout diseno-oscuro` para verlo).

## Estructura

```
src/
├─ app/
│  ├─ layout.tsx            # fuentes, metadatos SEO y datos estructurados
│  ├─ page.tsx              # monta las secciones
│  ├─ globals.css           # tema y clases .glass (vidrio líquido)
│  ├─ api/chat/route.ts     # endpoint del chatbot (streaming)
│  ├─ opengraph-image.tsx   # imagen para compartir en redes
│  ├─ twitter-image.tsx
│  ├─ icon.tsx · apple-icon.tsx
│  └─ sitemap.ts · robots.ts
├─ components/
│  ├─ Background.tsx        # foto de fondo fija
│  ├─ sections/             # Navbar, Hero, Projects, Stack, Timeline, Contact, Footer
│  ├─ ui/                   # Button, Tag, SectionTitle, Reveal, SocialLinks…
│  └─ chat/ChatWidget.tsx   # interfaz del asistente
├─ data/
│  ├─ profile.ts            # ← TODO EL CONTENIDO
│  └─ types.ts
├─ i18n/                    # idiomas (es activo, en preparado)
├─ hooks/                   # useActiveSection
└─ lib/                     # knowledge.ts, chat/ (prompt, límite de uso, tipos), utilidades
```

## Idiomas

Los textos están agrupados por idioma en `content` dentro de `profile.ts`. Para publicar en inglés:

1. Crea `en: Content` con la misma forma que `es` (TypeScript te avisará si falta algo).
2. Añade `"en"` a `enabledLocales` en [`src/i18n/config.ts`](src/i18n/config.ts).
3. Mueve la página a `src/app/[locale]/page.tsx` y genera las rutas `/es` y `/en`.

## Variables de entorno

Copia `.env.example` como `.env.local` y rellena los valores. En Vercel se configuran en **Settings → Environment Variables**.

| Variable | Para qué |
| --- | --- |
| `OPENROUTER_API_KEY` o `ANTHROPIC_API_KEY` | Activa el chatbot (basta una; si están las dos, se usa OpenRouter). Sin ninguna, el chat muestra "Próximamente". |
| `CHAT_MODEL` | Opcional: cambia el modelo (por defecto Claude Sonnet 5.5). |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Límite de uso compartido entre instancias (recomendado en producción). |
| `NEXT_PUBLIC_SITE_URL` | Tu dominio propio, para metadatos y sitemap. |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Opcional: avisos en Telegram cuando alguien usa el chat (ver más abajo). |
| `NOTIFY_SECRET` | Opcional: palabra secreta para excluir tus propias pruebas de los avisos. |

## Chatbot

El asistente del hero responde preguntas sobre mi perfil usando **Claude**, a través de **OpenRouter** o de la API de Anthropic.

```
ChatWidget ──POST /api/chat──▶ límite por IP ──▶ OpenRouter / Anthropic (perfil en el system prompt) ──streaming──▶ ChatWidget
```

| Pieza | Archivo |
| --- | --- |
| Interfaz (barra, conversación, chips) | `src/components/chat/ChatWidget.tsx` |
| Endpoint con streaming | `src/app/api/chat/route.ts` |
| Proveedores y modelo | `src/lib/chat/providers.ts` |
| Instrucciones + perfil | `src/lib/chat/system-prompt.ts` (usa `buildKnowledgeBase()` de `src/lib/knowledge.ts`) |
| Límite de uso (10/min y 30/día por IP) | `src/lib/chat/rate-limit.ts` |

**Fase 1 · Contexto en el prompt (implementada).** Todo `profile.ts` va en el *system prompt*, con *prompt caching*
para abaratar las preguntas repetidas. Si cambias tu perfil, el chatbot lo sabe en el siguiente despliegue.

### Ponerlo en marcha

1. Crea una API key en [openrouter.ai](https://openrouter.ai) (*Keys*) y ponle un **límite de crédito**.
   También vale una clave de [console.anthropic.com](https://console.anthropic.com) como `ANTHROPIC_API_KEY`.
2. Añádela como `OPENROUTER_API_KEY` en `.env.local` (local) y en Vercel (producción).
3. Para producción, crea una base **Upstash Redis** gratis (Vercel → *Storage* → *Upstash*) y añade sus dos variables.
4. Para apagarlo en cualquier momento: `siteConfig.chatEnabled = false` en `profile.ts`.

### Modelo y coste

Se cambia con la variable `CHAT_MODEL`. Con unos 3.000 tokens de entrada y 300 de salida por pregunta (mismos precios en OpenRouter y Anthropic):

| Modelo | Coste aprox. por pregunta |
| --- | --- |
| Claude Opus 5.5 (`anthropic/claude-opus-5.5`) | ~0,018 $ |
| Claude Sonnet 5.5 (`anthropic/claude-sonnet-5.5`, por defecto) | ~0,009 $ |
| Claude Haiku 5.5 (`anthropic/claude-haiku-5.5`) | ~0,0005 $ |

Con Anthropic directo, los nombres son `claude-opus-5-5`, `claude-sonnet-5-5` y `claude-haiku-5-5`.

### Fase 2 · RAG con embeddings (pendiente)

Cuando haya más contenido (artículos, documentación de proyectos, el CV completo):

1. Trocear el contenido por secciones y generar **embeddings**.
2. Guardarlos en una **base vectorial** (pgvector en Supabase/Neon, Upstash Vector…).
3. En cada pregunta, recuperar los fragmentos más relevantes y pasarlos como contexto al LLM.
4. Citar la fuente de cada respuesta (proyecto, experiencia…) y registrar preguntas para mejorar el contenido.

## Avisos en Telegram

Cada vez que alguien usa el chatbot, te llega un aviso por Telegram con la pregunta, la respuesta (recortada)
y datos básicos del visitante: ciudad y país (cabeceras de Vercel), dispositivo, navegador y de qué web viene.
**Nunca se envía ni se guarda la IP.** El código está en `src/lib/chat/notify.ts` y se ejecuta con `after()`
cuando ya ha terminado la respuesta, así que nunca retrasa ni rompe el chat.

```
💬 Nueva conversación
📍 Madrid, ES · 📱 iPhone, Safari · 🔗 LinkedIn
❓ ¿Qué experiencia tiene?
🤖 Antonio tiene más de un año de experiencia…
```

- Si la pregunta habla de **oferta, entrevista, contratar, puesto, trabajo, salario, job, hire** o incluye un email,
  el aviso empieza con 🔥 y suena siempre.
- Los mensajes siguientes de la misma conversación llegan **en silencio** (salvo los 🔥).

### Variables de entorno

| Variable | Para qué |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Token del bot. Sin él (o sin el chat ID) no se envía nada y el chat funciona igual. |
| `TELEGRAM_CHAT_ID` | Tu ID de usuario de Telegram: a quién escribe el bot. |
| `NOTIFY_SECRET` | Palabra secreta. Visita la web con `?yo=<NOTIFY_SECRET>` y ese navegador queda excluido de los avisos durante un año (cookie `no_notify`). Sin esta variable, la exclusión está desactivada. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Opcionales, pero necesarias para los **hilos**. |

### Cómo obtener el token y el chat ID

1. En Telegram, habla con [@BotFather](https://t.me/BotFather), envía `/newbot` y sigue los pasos: te da el **token**.
2. Abre tu bot y pulsa **Start** (si no, el bot no puede escribirte).
3. Para tu **chat ID**, escribe a [@userinfobot](https://t.me/userinfobot); también aparece en
   `https://api.telegram.org/bot<TOKEN>/getUpdates` después de escribirle algo a tu bot.
4. Añade las variables en `.env.local` y en Vercel (*Settings → Environment Variables*) y vuelve a desplegar.

### Con y sin Redis

- **Con Upstash Redis**: los mensajes de una conversación llegan como respuesta al primer aviso, formando un hilo.
  El ID del primer aviso se guarda en la clave `notify:{sessionId}` durante 24 horas.
- **Sin Redis**: cada mensaje llega como aviso independiente con los 8 primeros caracteres del ID de la
  conversación, para agruparlos a ojo.

El ID de la conversación lo genera el navegador (`crypto.randomUUID`) y se guarda en `sessionStorage`:
dura lo que la pestaña abierta.

---

© 2026 Antonio Álvarez Moyano · Hecho con Next.js e IA
