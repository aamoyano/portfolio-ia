import Image from "next/image";
import { siteConfig } from "@/data/profile";

/**
 * Foto de atardecer detrás de toda la web.
 * Para cambiarla, edita `siteConfig.assets.background` en profile.ts.
 *
 * No usa `position: fixed` a propósito: la página hace scroll dentro de
 * #scroll-root, así que esta capa ya se queda quieta. Con un elemento fijo
 * pegado al borde, Safari en iOS 26 tapa la barra de estado y la zona de
 * la barra inferior con un color sólido en vez de dejar ver la foto.
 * 100lvh: cubre también la zona de detrás de las barras de Safari.
 */
export function Background() {
  return (
    <div aria-hidden className="absolute left-0 top-0 -z-10 h-[100lvh] w-full overflow-hidden">
      <Image
        src={siteConfig.assets.background}
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover object-[62%_50%]"
      />
      {/* Velo suave arriba y abajo para que el texto blanco se lea bien */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20,25,55,0.35)_0%,rgb(20,25,55,0.08)_35%,rgb(20,25,55,0.12)_65%,rgb(20,25,55,0.45)_100%)]" />
    </div>
  );
}
