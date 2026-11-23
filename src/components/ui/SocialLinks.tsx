import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { siteConfig } from "@/data/profile";
import { getContent } from "@/i18n";
import { cn } from "@/lib/utils";

/** Iconos de LinkedIn y GitHub. GitHub se oculta si el enlace está vacío. */
export function SocialLinks({ className }: { className?: string }) {
  const { linkedin, github } = siteConfig.links;
  const { a11y } = getContent();
  const items = [
    { href: linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
    { href: github, label: "GitHub", Icon: FaGithub },
  ].filter((item) => item.href);

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} · ${siteConfig.name} (${a11y.opensNewTab})`}
            className="glass glass-hover grid h-12 w-12 place-items-center rounded-full text-fg"
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
