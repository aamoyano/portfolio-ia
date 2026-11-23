/**
 * Configuración de idiomas.
 *
 * La web está preparada para español e inglés, pero de momento
 * solo se publica en español. Para activar el inglés:
 *   1. Añade `en` en `content` dentro de `src/data/profile.ts`.
 *   2. Añade "en" a `enabledLocales`.
 *   3. Crea las rutas por idioma (p. ej. `src/app/[locale]/page.tsx`).
 */

export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";

/** Idiomas publicados actualmente */
export const enabledLocales: readonly Locale[] = ["es"];
