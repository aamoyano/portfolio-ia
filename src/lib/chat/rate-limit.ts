import "server-only";
import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

/**
 * Límite de uso por IP: 10 preguntas por minuto y 30 al día.
 *
 * - Con Upstash Redis configurado (ver src/lib/redis.ts),
 *   el límite se comparte entre todas las instancias de Vercel.
 * - Sin ellas, se usa un contador en memoria. Sirve en local, pero en
 *   Vercel cada instancia lleva su propia cuenta: configura Upstash
 *   antes de publicar el chat.
 */
const PER_MINUTE = 10;
const PER_DAY = 30;

const limiters = redis
  ? (() => {
      return [
        new Ratelimit({ redis, prefix: "chat:min", limiter: Ratelimit.slidingWindow(PER_MINUTE, "1 m") }),
        new Ratelimit({ redis, prefix: "chat:day", limiter: Ratelimit.fixedWindow(PER_DAY, "1 d") }),
      ];
    })()
  : null;

/* ---------- Respaldo en memoria (solo una instancia) ---------- */

const memory = new Map<string, number[]>();

function memoryLimit(key: string): boolean {
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < 24 * 60 * 60 * 1000);
  const lastMinute = recent.filter((t) => now - t < 60 * 1000).length;
  if (lastMinute >= PER_MINUTE || recent.length >= PER_DAY) {
    memory.set(key, recent);
    return false;
  }
  recent.push(now);
  memory.set(key, recent);
  return true;
}

/** Devuelve `true` si la IP aún puede preguntar. */
export async function checkRateLimit(ip: string): Promise<boolean> {
  if (!limiters) return memoryLimit(ip);
  // En Redis no se guarda la IP: solo un hash irreversible que identifica al visitante
  const key = createHash("sha256").update(ip).digest("hex").slice(0, 32);
  const results = await Promise.all(limiters.map((limiter) => limiter.limit(key)));
  return results.every((result) => result.success);
}

/** IP del visitante según las cabeceras de Vercel / proxies. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
}
