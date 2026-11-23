import { ExternalLink, Layers } from "lucide-react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import type { Content, Project } from "@/data/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";
import { Tag } from "../ui/Tag";

interface ProjectsProps {
  projects: Content["projects"];
  a11y: Content["a11y"];
  /** Proyectos con `image` ya comprobada: null si la captura no existe */
  items: (Project & { imageSrc: string | null })[];
}

export function Projects({ projects, a11y, items }: ProjectsProps) {
  return (
    <Section id="proyectos">
      <SectionTitle
        id="proyectos"
        eyebrow={projects.eyebrow}
        title={projects.title}
        subtitle={projects.subtitle}
      />

      <ul className="grid gap-6 md:grid-cols-2">
        {items.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={(index % 2) * 0.1}>
            <ProjectCard project={project} labels={{ ...projects, a11y }} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function ProjectCard({
  project,
  labels,
}: {
  project: Project & { imageSrc: string | null };
  labels: Content["projects"] & { a11y: Content["a11y"] };
}) {
  const imageAlt = `${labels.a11y.projectImageAlt}: ${project.title}`;

  return (
    <Card as="article" className="group flex h-full flex-col overflow-hidden">
      <div className="relative overflow-hidden border-b border-line">
        {project.imageSrc ? (
          <Image
            src={project.imageSrc}
            alt={imageAlt}
            width={1200}
            height={750}
            sizes="(min-width: 768px) 560px, 100vw"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <ImagePlaceholder label={imageAlt} className="aspect-[16/10] w-full">
            <span className="flex flex-col items-center gap-3 text-fg/70">
              <Layers className="h-10 w-10" strokeWidth={1.4} />
              <span className="font-display text-sm tracking-wide">{project.title}</span>
            </span>
          </ImagePlaceholder>
        )}

        {project.status === "in-progress" && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-bg/80 px-3 py-1 text-xs font-medium text-amber-200 backdrop-blur-md">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
            {labels.statusLabels["in-progress"]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-2xl font-semibold text-fg">{project.title}</h3>
        <p className="mt-3 text-pretty leading-relaxed text-muted">{project.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={labels.a11y.technologies}>
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        {(project.demo || project.github) && (
          <div className="mt-auto flex flex-wrap gap-3 pt-7">
            {project.demo && (
              <Button href={project.demo} external size="md">
                <ExternalLink className="h-4 w-4" aria-hidden />
                {labels.demoLabel}
              </Button>
            )}
            {project.github && (
              <Button href={project.github} external variant="secondary" size="md">
                <FaGithub className="h-4 w-4" aria-hidden />
                {labels.githubLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
