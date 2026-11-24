/**
 * URL pública de la web, usada en metadatos, sitemap y robots.
 * En Vercel se detecta sola; con dominio propio, define
 * NEXT_PUBLIC_SITE_URL (p. ej. https://amoyano.es). Vercel usa ya el dominio
 * de producción del proyecto (VERCEL_PROJECT_PRODUCTION_URL).
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
