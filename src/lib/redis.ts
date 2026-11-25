import "server-only";
import { Redis } from "@upstash/redis";

/**
 * Cliente de Upstash Redis compartido (límite de uso del chat y avisos).
 *
 * Acepta los nombres de variables de Upstash (UPSTASH_REDIS_REST_*) y los que
 * crea la integración de Vercel (KV_REST_API_*). Sin ninguno, devuelve null y
 * cada módulo usa su alternativa sin Redis.
 */
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const redis = url && token ? new Redis({ url, token }) : null;
