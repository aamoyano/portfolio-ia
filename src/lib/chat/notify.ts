import "server-only";
import { Redis } from "@upstash/redis";
import { NO_NOTIFY_COOKIE } from "./notify-cookie";

/**
 * Avisos por Telegram cada vez que alguien usa el chatbot.
 *
 * - Sin TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no hace nada.
 * - Con Upstash Redis, los mensajes de una misma conversación se envían
 *   como respuesta al primer aviso (un hilo por visitante).
 * - Sin Redis, cada mensaje es un aviso suelto con el inicio del sessionId.
 * - Nunca se envía ni se guarda la IP del visitante.
 */

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;

/** El hilo de cada conversación se recuerda 24 horas */
const THREAD_TTL_SECONDS = 24 * 60 * 60;
const MAX_ANSWER_CHARS = 300;


export function notificationsEnabled(): boolean {
  return Boolean(TOKEN && CHAT_ID);
}

export function isValidSessionId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function hasNoNotifyCookie(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${NO_NOTIFY_COOKIE}=1(?:;|$)`).test(cookie);
}

/* ---------- Datos del visitante ---------- */

export interface VisitorInfo {
  location: string;
  device: string;
  origin: string;
}

/** Ubicación (cabeceras de Vercel), dispositivo y origen. Sin IP. */
export function getVisitorInfo(request: Request, referrer: unknown): VisitorInfo {
  const headers = request.headers;
  let city = headers.get("x-vercel-ip-city") ?? "";
  try {
    city = decodeURIComponent(city);
  } catch {
    // Valor mal codificado: se deja tal cual
  }
  const country = headers.get("x-vercel-ip-country") ?? "";
  const location = [city, country].filter(Boolean).join(", ") || "desconocida";

  return {
    location,
    device: describeUserAgent(headers.get("user-agent") ?? ""),
    origin: describeReferrer(referrer, headers.get("host")),
  };
}

/** "iPhone, Safari", "Windows, Chrome"… a partir del user-agent, sin librerías. */
export function describeUserAgent(ua: string): string {
  const device = /iPad/.test(ua)
    ? "iPad"
    : /iPhone/.test(ua)
      ? "iPhone"
      : /Android/.test(ua)
        ? /Mobile/.test(ua)
          ? "Android"
          : "Tablet Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /Macintosh|Mac OS X/.test(ua)
            ? "Mac"
            : /CrOS/.test(ua)
              ? "Chromebook"
              : /Linux/.test(ua)
                ? "Linux"
                : "desconocido";

  const browser = /Edg(e|A|iOS)?\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung Internet"
        : /Firefox|FxiOS/.test(ua)
          ? "Firefox"
          : /Chrome|CriOS|Chromium/.test(ua)
            ? "Chrome"
            : /Safari/.test(ua)
              ? "Safari"
              : "navegador desconocido";

  return `${device}, ${browser}`;
}

const KNOWN_ORIGINS: [RegExp, string][] = [
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, "LinkedIn"],
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)github\.com$/, "GitHub"],
  [/(^|\.)(t\.co|twitter\.com|x\.com)$/, "X"],
  [/(^|\.)(facebook\.com|fb\.com)$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, "WhatsApp"],
  [/(^|\.)(t\.me|telegram\.org)$/, "Telegram"],
  [/(^|\.)infojobs\.net$/, "InfoJobs"],
];

/** Dominio de la web de la que viene el visitante: LinkedIn, Google, directo… */
export function describeReferrer(referrer: unknown, ownHost: string | null): string {
  if (typeof referrer !== "string" || !referrer) return "directo";
  let host: string;
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "directo";
  }
  if (!host || (ownHost && ownHost.split(":")[0].replace(/^www\./, "") === host)) return "directo";
  return KNOWN_ORIGINS.find(([pattern]) => pattern.test(host))?.[1] ?? host;
}

/* ---------- Aviso destacado ---------- */

const HOT_WORDS = /\b(ofert\w*|entrevist\w*|contrat\w*|puestos?|trabajos?|salari\w*|jobs?|hir(e|es|ed|ing))\b/i;
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;

/** Preguntas que suenan a oportunidad laboral o que dejan un email */
export function isHotQuestion(question: string): boolean {
  const plain = question.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return HOT_WORDS.test(plain) || EMAIL.test(question);
}

/* ---------- Envío ---------- */

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function truncate(text: string, max: number) {
  const clean = text.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

interface NotifyInput {
  sessionId: string;
  /** true si es el primer mensaje de la conversación según el navegador */
  firstInClient: boolean;
  question: string;
  answer: string;
  visitor: VisitorInfo;
}

/**
 * Envía el aviso a Telegram. Se llama desde `after()`, cuando ya ha terminado
 * la respuesta del chat: si falla, solo se registra el error.
 */
export async function notifyChat({ sessionId, firstInClient, question, answer, visitor }: NotifyInput) {
  if (!notificationsEnabled()) return;
  try {
    const hot = isHotQuestion(question);
    const threadKey = `notify:${sessionId}`;

    // Con Redis se sabe si la conversación ya tiene un aviso (y se responde en su hilo)
    const threadId = redis ? await redis.get<number>(threadKey) : null;
    const isNew = redis ? !threadId : firstInClient;

    const qa = [`❓ ${escapeHtml(question)}`, `🤖 ${escapeHtml(truncate(answer, MAX_ANSWER_CHARS) || "(sin respuesta)")}`];
    const visitorLine = `📍 ${escapeHtml(visitor.location)} · 📱 ${escapeHtml(visitor.device)} · 🔗 ${escapeHtml(visitor.origin)}`;
    const fire = hot ? "🔥 " : "";

    let text: string;
    if (threadId) {
      // Seguimiento dentro del hilo: solo pregunta y respuesta
      text = [`${fire}↪️ Seguimiento`, ...qa].join("\n");
    } else {
      const title = isNew ? "💬 Nueva conversación" : "💬 Seguimiento";
      // Sin Redis, el inicio del ID permite agrupar a ojo los avisos de una misma persona
      const id = redis ? "" : ` · <code>${sessionId.slice(0, 8)}</code>`;
      text = [`${fire}${title}${id}`, visitorLine, ...qa].join("\n");
    }

    const message = await sendTelegram({
      text,
      // Suenan las conversaciones nuevas y las destacadas; el resto llega en silencio
      silent: !isNew && !hot,
      replyTo: threadId ?? undefined,
    });

    if (redis && !threadId && message) {
      await redis.set(threadKey, message, { ex: THREAD_TTL_SECONDS });
    }
  } catch (error) {
    console.error("[notify]", error);
  }
}

/** Devuelve el message_id del aviso enviado */
async function sendTelegram({ text, silent, replyTo }: { text: string; silent: boolean; replyTo?: number }) {
  const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_notification: silent,
      link_preview_options: { is_disabled: true },
      ...(replyTo && { reply_parameters: { message_id: replyTo, allow_sending_without_reply: true } }),
    }),
    signal: AbortSignal.timeout(8000),
  });
  const data = (await response.json().catch(() => null)) as {
    ok?: boolean;
    description?: string;
    result?: { message_id: number };
  } | null;
  if (!response.ok || !data?.ok) {
    throw new Error(`Telegram ${response.status}: ${data?.description ?? "sin detalle"}`);
  }
  return data.result?.message_id ?? null;
}
