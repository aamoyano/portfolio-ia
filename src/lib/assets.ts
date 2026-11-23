import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Comprueba en el servidor (al generar la página) si un archivo
 * existe dentro de /public. Así la foto, el CV y las capturas
 * muestran un placeholder elegante hasta que los añadas.
 *
 * Al añadir un archivo nuevo hay que volver a desplegar
 * (o reiniciar `npm run dev`) para que se detecte.
 */
export function publicFileExists(path?: string): path is string {
  if (!path) return false;
  return existsSync(join(process.cwd(), "public", path.replace(/^\//, "")));
}
