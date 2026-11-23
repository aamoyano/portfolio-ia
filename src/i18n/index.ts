import { content } from "@/data/profile";
import type { Content } from "@/data/types";
import { defaultLocale, type Locale } from "./config";

/**
 * Devuelve los textos de un idioma. Si ese idioma aún no está
 * traducido, devuelve el español para que la web nunca quede vacía.
 */
export function getContent(locale: Locale = defaultLocale): Content {
  return content[locale] ?? content.es;
}

export { defaultLocale, enabledLocales, locales, type Locale } from "./config";
