import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/profile";

/** Favicon con las iniciales sobre el degradado del atardecer. */
export function renderIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: size * 0.22,
          // Colores del atardecer del fondo: melocotón del cielo y azul del lago
          backgroundImage: "linear-gradient(160deg, #F2A779 0%, #B07A66 45%, #1C2347 100%)",
          color: "white",
          fontSize: size * 0.36,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        {siteConfig.initials}
      </div>
    ),
    { width: size, height: size },
  );
}
