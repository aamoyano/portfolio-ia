import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/profile";
import { getContent } from "@/i18n";

export const ogSize = { width: 1200, height: 630 };

/** Imagen para compartir en redes (Open Graph y Twitter/X). */
export function renderOgImage() {
  const { hero } = getContent();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0B0B0F",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(139,92,246,0.45), transparent 45%), radial-gradient(circle at 90% 85%, rgba(34,211,238,0.25), transparent 40%)",
          color: "#F5F5F7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 20,
              backgroundImage: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
              fontSize: 28,
              fontWeight: 700,
              color: "white",
            }}
          >
            {siteConfig.initials}
          </div>
          <div style={{ fontSize: 26, color: "#A1A1AA" }}>Portfolio</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {siteConfig.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28, fontSize: 36, color: "#C4B5FD" }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: "#22D3EE" }} />
            {hero.subtitle}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#A1A1AA" }}>{getContent().person.location}</div>
      </div>
    ),
    ogSize,
  );
}
