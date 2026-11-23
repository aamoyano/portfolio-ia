"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { useRef } from "react";
import type { Content, TimelineItem } from "@/data/types";
import { cn } from "@/lib/utils";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { SectionTitle } from "../ui/SectionTitle";

const icons = {
  work: Briefcase,
  education: GraduationCap,
} as const;

export function Timeline({ timeline }: { timeline: Content["timeline"] }) {
  const listRef = useRef<HTMLOListElement>(null);

  // La línea se "dibuja" según avanza el scroll por la lista
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // De más reciente a más antigua
  const items = [...timeline.items].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <Section id="trayectoria">
      <SectionTitle
        id="trayectoria"
        eyebrow={timeline.eyebrow}
        title={timeline.title}
        subtitle={timeline.subtitle}
      />

      <ol ref={listRef} className="relative mx-auto max-w-3xl">
        {/* Línea base y línea de progreso */}
        <span aria-hidden className="absolute bottom-2 left-[19px] top-2 w-px bg-line" />
        <motion.span
          aria-hidden
          style={{ scaleY }}
          className="absolute bottom-2 left-[19px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent to-cyan"
        />

        {items.map((item) => (
          <Reveal as="li" key={`${item.organization}-${item.start}`} className="relative pb-10 pl-14 last:pb-0 sm:pl-16">
            <TimelineEntry item={item} labels={timeline} />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function TimelineEntry({ item, labels }: { item: TimelineItem; labels: Content["timeline"] }) {
  const Icon = icons[item.type];
  const isWork = item.type === "work";

  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border bg-bg",
          isWork ? "border-accent/50 text-accent-soft" : "border-cyan/40 text-cyan",
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>

      <div className="rounded-2xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-line-strong sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-medium",
              isWork ? "bg-accent/15 text-accent-soft" : "bg-cyan/10 text-cyan",
            )}
          >
            {labels.typeLabels[item.type]}
          </span>
          <span className="text-muted">
            <time>{item.period}</time>
          </span>
          {item.current && (
            <span className="inline-flex items-center gap-1.5 text-emerald-300">
              <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {labels.currentLabel}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-xl font-semibold text-fg">{item.title}</h3>
        <p className="mt-1 text-sm text-fg/80">
          {item.organization}
          {item.location && <span className="text-muted"> · {item.location}</span>}
        </p>
        <p className="mt-3 text-pretty leading-relaxed text-muted">{item.description}</p>
      </div>
    </>
  );
}
