import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-accent text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_8px_30px_-8px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset,0_12px_40px_-8px_rgba(34,211,238,0.55)]",
  secondary:
    "border border-line-strong bg-white/[0.02] text-fg hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10",
  ghost: "text-muted hover:bg-white/5 hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
    /** Abre en pestaña nueva con rel seguro */
    external?: boolean;
  };

type NativeButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Botón o enlace con los estilos de la web. Si recibe `href` es un <a>. */
export function Button(props: AnchorProps | NativeButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, external, children, ...rest } = props;
    return (
      <a
        {...rest}
        className={buttonClasses({ variant, size, className })}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  const { variant, size, className, type = "button", children, ...rest } = props;
  return (
    <button {...rest} type={type} className={buttonClasses({ variant, size, className })}>
      {children}
    </button>
  );
}
