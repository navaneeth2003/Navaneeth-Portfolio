"use client";

import type { ImageRef, ProjectItem } from "@/lib/types";
import { PROJECT_VERTICALS } from "@/lib/types";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useMotionCtx } from "./motion/MotionProvider";
import { EASE, Rise } from "./motion/primitives";
import { Pill, RatioImage, SectionShell } from "./shared";

/** Cover with in-frame scroll parallax and a de-blur entrance. */
function ProjectCover({ image, title, className = "" }: { image: ImageRef; title: string; className?: string }) {
  const { ok } = useMotionCtx();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.div
      ref={ref}
      className={`relative aspect-video overflow-hidden border-line ${className}`}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {image.url ? (
        <motion.img
          src={image.url}
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.14] object-cover"
          style={ok ? { y } : undefined}
        />
      ) : (
        <motion.div className="absolute inset-0 scale-[1.14]" style={ok ? { y } : undefined}>
          <RatioImage image={image} alt="" fallbackText={title} className="h-full w-full !aspect-auto" />
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Gallery card: ≤2.5° tilt toward the cursor plus a faint warm spotlight that
 * tracks it. Pointer-fine only; a plain card everywhere else.
 */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ok, fine } = useMotionCtx();
  const interactive = ok && fine;
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  const rx = useSpring(0, { stiffness: 200, damping: 24 });
  const ry = useSpring(0, { stiffness: 200, damping: 24 });

  function onMove(e: React.PointerEvent) {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 5);
    rx.set((0.5 - py) * 5);
    setSpot({ x: px * 100, y: py * 100, on: true });
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
    setSpot((s) => ({ ...s, on: false }));
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={interactive ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      className={`card group relative flex flex-col overflow-hidden !p-0 transition-[border-color,box-shadow] duration-200 hover:border-ink/15 hover:shadow-pop ${className}`}
    >
      {children}
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: spot.on ? 1 : 0,
            background: `radial-gradient(320px circle at ${spot.x}% ${spot.y}%, rgba(185, 133, 76, 0.08), transparent 65%)`,
          }}
        />
      )}
    </motion.div>
  );
}

function ProjectBody({ item }: { item: ProjectItem }) {
  return (
    <div className="flex grow flex-col p-6 md:p-7">
      <h4 className="text-lg leading-snug font-semibold tracking-tight break-words">{item.title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-muted break-words">{item.overview}</p>

      {item.resultsAndImpact && (
        <div className="relative mt-5 overflow-hidden rounded-2xl bg-accent-soft/60 px-5 py-4">
          <motion.span
            aria-hidden
            className="absolute top-0 bottom-0 left-0 w-0.5 origin-top bg-accent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
          />
          <p className="utility !text-accent-ink">Results & impact</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/90 break-words">
            {item.resultsAndImpact}
          </p>
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((t, i) => (
            <Pill key={i}>{t}</Pill>
          ))}
        </div>
      )}

      {(item.caseStudyUrl || item.liveUrl) && (
        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6">
          {item.caseStudyUrl && (
            <a
              href={item.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent-ink"
            >
              <BookOpen className="h-4 w-4" strokeWidth={2} />
              Read case study
            </a>
          )}
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent-ink"
            >
              View live
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                strokeWidth={2}
              />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectsSection({ items }: { items: ProjectItem[] }) {
  // Verticals render in canonical order; an empty vertical simply doesn't appear.
  const groups = PROJECT_VERTICALS.map((v) => ({
    vertical: v,
    items: items.filter((p) => p.vertical === v),
  })).filter((g) => g.items.length > 0);

  return (
    <SectionShell id="projects" eyebrow="Projects" heading="Work & case studies">
      <div className="space-y-16">
        {groups.map((group) => (
          <div key={group.vertical}>
            <Rise y={10}>
              <div className="flex items-baseline gap-3">
                <h3 className="text-xl font-semibold tracking-tight">{group.vertical}</h3>
                <span className="utility">
                  {group.items.length} {group.items.length === 1 ? "project" : "projects"}
                </span>
              </div>
            </Rise>
            {group.items.length === 1 ? (
              // A lone project gets the featured treatment, not half an empty grid.
              <Rise className="mt-6">
                <TiltCard className="md:grid md:grid-cols-2">
                  <ProjectCover
                    image={group.items[0].coverImage}
                    title={group.items[0].title}
                    className="border-b md:h-full md:border-r md:border-b-0"
                  />
                  <ProjectBody item={group.items[0]} />
                </TiltCard>
              </Rise>
            ) : (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {group.items.map((item, i) => (
                  <Rise key={item.id} delay={0.08 * i}>
                    <TiltCard>
                      <ProjectCover image={item.coverImage} title={item.title} className="border-b" />
                      <ProjectBody item={item} />
                    </TiltCard>
                  </Rise>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
