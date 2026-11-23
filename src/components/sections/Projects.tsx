import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import type { Content, Project } from "@/data/types";
import { Button } from "../ui/Button";
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
      <SectionTitle id="proyectos" title={projects.eyebrow} />

      <ul className="grid gap-5 md:grid-cols-2">
        {items.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={(index % 2) * 0.1} className="h-full">
            <article className="glass glass-hover flex h-full flex-col overflow-hidden rounded-[28px]">
              {/* La captura solo aparece cuando existe en /public/projects */}
              {project.imageSrc && (
                <Image
                  src={project.imageSrc}
                  alt={`${a11y.projectImageAlt}: ${project.title}`}
                  width={1200}
                  height={750}
                  sizes="(min-width: 768px) 480px, 100vw"
                  className="aspect-[16/10] w-full object-cover"
                />
              )}

              <div className="flex flex-1 flex-col p-7">
                {project.status === "in-progress" && (
                  <span className="mb-5 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-wider text-peach">
                    <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-peach" />
                    {projects.statusLabels["in-progress"]}
                  </span>
                )}
                <h3 className="text-2xl font-medium text-fg">{project.title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted">{project.description}</p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label={a11y.technologies}>
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>

                {(project.demo || project.github) && (
                  <div className="mt-auto flex flex-wrap gap-2 pt-7">
                    {project.demo && (
                      <Button href={project.demo} external>
                        {projects.demoLabel}
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </Button>
                    )}
                    {project.github && (
                      <Button href={project.github} external variant="glass">
                        <FaGithub className="h-4 w-4" aria-hidden />
                        {projects.githubLabel}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
