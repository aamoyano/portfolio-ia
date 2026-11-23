import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/profile";

/** Favicon con las iniciales sobre el degradado de la marca. */
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
          backgroundImage: "linear-gradient(135deg, #8B5CF6 0%, #6D5DF6 50%, #22D3EE 120%)",
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
