"use client";

import type { CaseStudyBlock, ProjectItem, SiteContent } from "@/lib/types";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CustomCursor } from "./motion/CustomCursor";
import { MotionProvider, useMotionCtx } from "./motion/MotionProvider";
import { AnimatedHeading, CountValue, EASE, Rise } from "./motion/primitives";
import { SiteFooter } from "./SiteFooter";
import { GoldDot, RatioImage } from "./shared";

function CaseStudyNav({ name }: { name: string }) {
  const firstName = name.trim().split(/\s+/)[0] || "Portfolio";
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="/" className="text-lg font-bold tracking-tight">
          <GoldDot text={firstName} />
        </a>
        <a
          href="/#projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          All projects
        </a>
      </div>
    </header>
  );
}

/** Full-bleed cover with a slow scroll parallax. Only rendered when a cover exists. */
function CoverHero({ project }: { project: ProjectItem }) {
  const { ok } = useMotionCtx();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div ref={ref} className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-3xl border border-line">
      <motion.div
        className="relative aspect-video"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
      >
        <motion.img
          src={project.coverImage.url}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover"
          style={ok ? { y } : undefined}
        />
      </motion.div>
    </div>
  );
}

function BlockScene({ block, index }: { block: CaseStudyBlock; index: number }) {
  const paragraphs = block.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id={`cs-${block.id}`} className="scroll-mt-28">
      <Rise y={12}>
        <p className="utility flex items-center gap-2 !text-accent-ink">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
          {String(index + 1).padStart(2, "0")} · {block.stage}
        </p>
      </Rise>
      {block.heading && (
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-balance md:text-3xl">
          <AnimatedHeading text={block.heading} />
        </h2>
      )}
      <div className="mt-5 max-w-2xl space-y-5">
        {paragraphs.map((p, i) => (
          <Rise key={i} delay={0.05 * i}>
            <p className="text-base leading-relaxed text-pretty text-ink-soft/90 md:text-lg">{p}</p>
          </Rise>
        ))}
      </div>

      {block.metrics && block.metrics.length > 0 && (
        <Rise delay={0.1} className="mt-7">
          <div className="card overflow-hidden !p-0">
            <div
              className={`grid gap-px bg-line ${
                block.metrics.length === 1
                  ? "grid-cols-1"
                  : block.metrics.length === 3
                    ? "grid-cols-1 sm:grid-cols-3"
                    : "grid-cols-2"
              }`}
            >
              {block.metrics.map((m) => (
                <div key={m.id} className="flex flex-col gap-1 bg-surface px-6 py-6">
                  <span className="text-2xl font-bold tracking-tight md:text-3xl">
                    <CountValue value={m.value} />
                  </span>
                  <span className="text-sm font-medium text-muted">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Rise>
      )}

      {block.image?.url && (
        <motion.div
          className="mt-7 overflow-hidden rounded-2xl border border-line"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <RatioImage image={block.image} alt="" fallbackText={block.stage} />
        </motion.div>
      )}
    </section>
  );
}

/** Sticky stage rail: the story's table of contents, lit by scroll position. */
function StageRail({ blocks, activeId }: { blocks: CaseStudyBlock[]; activeId: string }) {
  return (
    <nav aria-label="Case study stages" className="hidden lg:block">
      <div className="sticky top-28 space-y-1">
        {blocks.map((b, i) => {
          const active = activeId === b.id;
          return (
            <a
              key={b.id}
              href={`#cs-${b.id}`}
              aria-current={active ? "true" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                active ? "bg-accent-soft/60 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                  active ? "bg-accent" : "bg-line"
                }`}
              />
              <span className="utility !tracking-[0.06em] !normal-case !text-inherit">
                {String(i + 1).padStart(2, "0")}
              </span>
              {b.stage}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export function CaseStudyView({ project, content }: { project: ProjectItem; content: SiteContent }) {
  const blocks = project.caseStudy?.blocks ?? [];
  const [activeId, setActiveId] = useState(blocks[0]?.id ?? "");
  const blockIds = blocks.map((b) => b.id).join(",");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id.replace(/^cs-/, ""));
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    blockIds.split(",").forEach((id) => {
      const el = document.getElementById(`cs-${id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [blockIds]);

  return (
    <MotionProvider>
      <div className="min-h-screen bg-bg text-ink">
        <CustomCursor />
        <CaseStudyNav name={content.hero.name} />
        <main className="px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl pt-14 md:pt-20">
            <div className="rise-in flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-accent-soft px-3.5 py-1.5">
                <span className="utility !text-accent-ink">{project.vertical}</span>
              </span>
              <span className="utility">Case study</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-[-0.02em] text-balance sm:text-5xl md:text-6xl">
              <AnimatedHeading text={project.title} />
            </h1>
            <Rise delay={0.2}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted md:text-lg">
                {project.overview}
              </p>
            </Rise>
            {project.liveUrl && (
              <Rise delay={0.3}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 inline-flex items-center gap-2 rounded-[14px] border border-line bg-surface px-5 py-3 text-sm font-medium transition-[border-color,transform] duration-200 hover:border-ink/30 active:scale-[0.98]"
                >
                  View live product
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </a>
              </Rise>
            )}
          </div>

          {project.coverImage.url ? <CoverHero project={project} /> : null}

          <div className="mx-auto grid max-w-6xl gap-12 py-16 md:py-24 lg:grid-cols-[220px_1fr]">
            <StageRail blocks={blocks} activeId={activeId} />
            <div className="min-w-0 space-y-16 md:space-y-24">
              {blocks.map((block, i) => (
                <BlockScene key={block.id} block={block} index={i} />
              ))}
            </div>
          </div>
        </main>
        <SiteFooter contact={content.contact} name={content.hero.name} />
        <noscript>
          <style>{`[style]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </div>
    </MotionProvider>
  );
}
