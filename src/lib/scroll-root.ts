/**
 * La página no hace scroll en `window`, sino dentro de este contenedor
 * (ver `page.tsx`). Así la foto de fondo no necesita `position: fixed`,
 * y Safari en iOS 26 deja verla también detrás de la barra de estado
 * y de la barra inferior: con un elemento fijo pegado al borde, Safari
 * pinta esas zonas de un color sólido.
 */
export const SCROLL_ROOT_ID = "scroll-root";

/** Contenedor que hace scroll (solo en el navegador). */
export function getScrollRoot(): HTMLElement | null {
  return document.getElementById(SCROLL_ROOT_ID);
}
