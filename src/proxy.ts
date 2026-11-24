import { type NextRequest, NextResponse } from "next/server";
import { NO_NOTIFY_COOKIE } from "@/lib/chat/notify-cookie";

/**
 * Excluir las pruebas de Antonio de los avisos de Telegram:
 * visitando la web con `?yo=<NOTIFY_SECRET>` se guarda la cookie
 * `no_notify=1` (1 año) y se quita el parámetro de la URL.
 * Sin NOTIFY_SECRET esta función está desactivada.
 */
export function proxy(request: NextRequest) {
  const secret = process.env.NOTIFY_SECRET;
  const value = request.nextUrl.searchParams.get("yo");
  if (!secret || value !== secret) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.searchParams.delete("yo");
  const response = NextResponse.redirect(url);
  response.cookies.set(NO_NOTIFY_COOKIE, "1", {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}

export const config = {
  // Solo páginas (no API ni archivos estáticos) y solo si llevan ?yo=
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|.*\\..*).*)",
      has: [{ type: "query", key: "yo" }],
    },
  ],
};
