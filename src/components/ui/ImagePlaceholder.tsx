import { cn } from "@/lib/utils";

/**
 * Placeholder elegante mientras falta una imagen en /public:
 * degradado sutil, rejilla de puntos y un contenido centrado.
 */
export function ImagePlaceholder({
  label,
  children,
  className,
}: {
  /** Texto alternativo para lectores de pantalla */
  label: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative flex items-center justify-center overflow-hidden bg-surface-2", className)}
    >
      <div aria-hidden className="bg-dots absolute inset-0 opacity-70" />
      <div aria-hidden className="absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-accent/25 blur-3xl" />
      <div aria-hidden className="absolute -bottom-1/4 -right-1/4 h-2/3 w-2/3 rounded-full bg-cyan/15 blur-3xl" />
      <div aria-hidden className="relative">
        {children}
      </div>
    </div>
  );
}
