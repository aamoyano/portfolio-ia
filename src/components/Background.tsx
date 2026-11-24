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
        Móvil: degradados fijos arriba y abajo, siempre visibles.
        - Arriba: color sólido detrás de la barra de estado que se funde con la foto.
        - Abajo: la foto se funde con el color de la zona de la barra de Safari.
          Safari solo dibuja ese degradado con su barra desplegada; al hacer scroll
          desaparecía. Con este, se mantiene siempre.
        Van por encima del contenido (que pasa por debajo, como en una app) y por
        debajo de la navbar (z-50) y del chat (z-80). El de abajo se oculta mientras
        se escribe: en iOS los elementos fijos abajo flotan sobre el teclado.
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[calc(env(safe-area-inset-top)+3.5rem)] bg-[linear-gradient(180deg,var(--color-edge-top)_0%,var(--color-edge-top)_env(safe-area-inset-top),transparent_100%)] lg:hidden"
      />
      <div
        aria-hidden
        className="edge-fade-bottom pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[calc(env(safe-area-inset-bottom)+3.5rem)] bg-[linear-gradient(0deg,var(--color-edge-bottom)_0%,var(--color-edge-bottom)_env(safe-area-inset-bottom),transparent_100%)] lg:hidden"
      />
    </>
  );
}
