import Image from "next/image";
import { siteConfig } from "@/data/profile";

/**
 * Foto de atardecer fija detrás de toda la web.
 * Para cambiarla, edita `siteConfig.assets.background` en profile.ts
 * (y recalcula --color-edge-top / --color-edge-bottom en globals.css).
 */
export function Background() {
  return (
    <>
      {/* 100lvh: en Safari iOS cubre también la zona detrás de las barras (inset-0 solo mide el viewport pequeño) */}
      <div aria-hidden className="fixed left-0 top-0 -z-10 h-[100lvh] w-full overflow-hidden">
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

      {/*
        Franja de la barra de estado (Safari en iOS 26 se fija en el elemento fijo
        pegado al borde superior). En vez de un color sólido es vidrio translúcido:
        así Safari deja ver la foto desenfocada detrás de la barra, como hace con la
        barra inferior al hacer scroll. La barra inferior toma el color de html.
      */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 -z-[5] h-[env(safe-area-inset-top)] min-h-px bg-white/5 backdrop-blur-xl"
      />
    </>
  );
}
