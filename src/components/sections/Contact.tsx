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
    <Section id="contacto" className="pb-16 sm:pb-24">
      <Reveal>
        <div className="glass rounded-[36px] px-6 py-16 text-center sm:px-12 sm:py-20">
          <h2
            id="contacto-title"
            className="font-display text-[clamp(2.75rem,9vw,5.5rem)] font-medium leading-none tracking-[-0.04em] text-fg"
          >
            {contact.title}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-pretty text-lg text-muted">{contact.text}</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={`mailto:${email}`} size="lg">
              <Mail className="h-4 w-4" aria-hidden />
              {contact.emailLabel}
            </Button>
            <CopyEmailButton email={email} label={contact.copyLabel} copiedLabel={contact.copiedLabel} />
            <Button href={links.linkedin} external variant="glass" size="lg">
              <FaLinkedinIn className="h-4 w-4" aria-hidden />
              {contact.linkedinLabel}
            </Button>
            {links.github && (
              <Button href={links.github} external variant="glass" size="lg">
                <FaGithub className="h-4 w-4" aria-hidden />
                {contact.githubLabel}
              </Button>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
