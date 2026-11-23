import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { siteConfig } from "@/data/profile";
import type { Content } from "@/data/types";
import { Button } from "../ui/Button";
import { CopyEmailButton } from "../ui/CopyEmailButton";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";

export function Contact({ contact }: { contact: Content["contact"] }) {
  const { email, links } = siteConfig;

  return (
    <Section id="contacto" className="pb-16 sm:pb-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-16 text-center sm:px-12 sm:py-24">
          {/* Brillo de fondo */}
          <div aria-hidden className="bg-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div aria-hidden className="absolute left-1/2 top-0 h-64 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/30 blur-[100px]" />

          <div className="relative">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-accent-soft">{contact.eyebrow}</p>
            <h2
              id="contacto-title"
              className="text-gradient font-display text-[clamp(3rem,10vw,7rem)] font-bold leading-none tracking-[-0.035em]"
            >
              {contact.title}
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted">{contact.text}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button href={`mailto:${email}`} size="lg">
                <Mail className="h-4 w-4" aria-hidden />
                {contact.emailLabel}
              </Button>
              <CopyEmailButton email={email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
              <Button href={links.linkedin} external variant="ghost" size="lg">
                <FaLinkedinIn className="h-4 w-4" aria-hidden />
                {contact.linkedinLabel}
              </Button>
              {links.github && (
                <Button href={links.github} external variant="ghost" size="lg">
                  <FaGithub className="h-4 w-4" aria-hidden />
                  {contact.githubLabel}
                </Button>
              )}
            </div>

            <p className="mt-8 text-sm text-muted">
              <a href={`mailto:${email}`} className="underline-offset-4 transition-colors hover:text-fg hover:underline">
                {email}
              </a>
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
