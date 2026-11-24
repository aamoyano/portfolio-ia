import Image from "next/image";
import type { Content } from "@/data/types";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";

interface AboutProps {
  about: Content["about"];
  /** Ruta de la foto ya comprobada: null si no existe en /public */
  photoSrc: string | null;
}

/** "Sobre mí": foto, texto y tres cifras destacadas (`about` en profile.ts). */
export function About({ about, photoSrc }: AboutProps) {
  return (
    <Section id="sobre-mi" className="pt-20 sm:pt-28">
      <SectionTitle id="sobre-mi" title={about.eyebrow} />

      <Reveal>
        <div className="glass rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
            {photoSrc && (
              <Image
                src={photoSrc}
                alt={about.photoAlt}
                width={160}
                height={160}
                sizes="(min-width: 640px) 160px, 128px"
                className="h-32 w-32 shrink-0 rounded-full object-cover ring-2 ring-white/40 sm:h-40 sm:w-40"
              />
            )}
            <div className="min-w-0">
              <h3 className="text-xl font-medium leading-snug text-fg sm:text-2xl">{about.title}</h3>
              <div className="mt-3 space-y-3 text-pretty leading-relaxed text-muted">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {about.highlights.map((highlight) => (
              <li key={highlight.label} className="rounded-2xl bg-white/10 px-4 py-4 text-center">
                <p className="font-display text-xl font-medium text-fg sm:text-2xl">{highlight.value}</p>
                <p className="mt-1 text-sm text-muted">{highlight.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
