import { renderOgImage } from "@/lib/og";

export const alt = "Antonio Álvarez Moyano · IA y Big Data";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage();
}
