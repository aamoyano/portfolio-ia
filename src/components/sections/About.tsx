import Image from "next/image";
import { siteConfig } from "@/data/profile";
import type { Content } from "@/data/types";
import { Card } from "../ui/Card";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";

interface AboutProps {
  about: Content["about"];
  /** Ruta de la foto, o null si todavía no está en /public */
  photoSrc: string | null;
}

export function About({ about, photoSrc }: AboutProps) {
  return (
    <Section id="sobre-mi">
      <div className="grid items-center gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-16 lg:gap-24">
        {/* Foto con marco y brillo del color de acento */}
        <Reveal className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-accent/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-line-strong bg-surface p-2 shadow-[0_30px_80px_-30px_rgba(139,92,246,0.45)]">
            {photoSrc ? (
              <Image
                src={photoSrc}
                alt={about.photoAlt}
                width={720}
                height={900}
                sizes="(min-width: 768px) 40vw, 90vw"
                className="aspect-[4/5] w-full rounded-[1.6rem] object-cover"
              />
            ) : (
              <ImagePlaceholder label={about.photoAlt} className="aspect-[4/5] w-full rounded-[1.6rem]">
                <span className="text-gradient font-display text-7xl font-bold tracking-tight">
                  {siteConfig.initials}
                </span>
              </ImagePlaceholder>
            )}
          </div>
        </Reveal>

        <div>
          <SectionTitle id="sobre-mi" eyebrow={about.eyebrow} title={about.title} className="mb-8 sm:mb-10" />
          <Reveal delay={0.1} className="space-y-5 text-pretty text-lg leading-relaxed text-muted">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </div>

      {/* Datos destacados */}
      <ul className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-3">
        {about.highlights.map((item, index) => (
          <Reveal as="li" key={item.label} delay={index * 0.08}>
            <Card className="h-full p-6">
              <p className="font-display text-2xl font-bold text-fg sm:text-3xl">{item.value}</p>
              <p className="mt-1 text-muted">{item.label}</p>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
