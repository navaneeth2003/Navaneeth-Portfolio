"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import type { ProjectItem, ProjectVertical } from "@/lib/types";
import { PROJECT_VERTICALS } from "@/lib/types";
import { pad2 } from "@/lib/format";
import { GridLines, useIsMobile, useReveal } from "./ui";

function LaptopMock({
  p,
  onHoverChange,
}: {
  p: ProjectItem;
  onHoverChange: (v: boolean) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const hasCover = Boolean(p.coverImage.url);

  const screen = (
    <div className="relative aspect-[16/10] overflow-hidden bg-[#101013]">
      {hasCover ? (
        <>
          {/* loading shimmer while the cover fades in */}
          {!loaded && <div aria-hidden className="absolute inset-0 animate-pulse bg-white/[0.04]" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.coverImage.url}
            alt=""
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.08] ${
              loaded ? "opacity-100 blur-0" : "scale-[1.02] opacity-0 blur-md"
            }`}
          />
          {/* Subtle bottom gradient behind the title — only over the lower half, never darkening the whole image */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-3.5 md:p-4">
            <p className="line-clamp-2 font-heading text-[14px] font-bold leading-snug tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] sm:text-[15px] md:text-[16px] xl:text-[17px]">
              {p.title}
            </p>
          </div>
        </>
      ) : (
        /* no cover yet — text mock screen */
        <div className="flex h-full w-full flex-col justify-end bg-[radial-gradient(120%_90%_at_20%_0%,rgba(255,74,26,0.28),transparent_60%),linear-gradient(160deg,#1a1a1f,#0b0b0e)] p-4 sm:p-5 lg:p-6 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <p className="font-heading text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/45">{p.vertical}</p>
          <p className="mt-1.5 sm:mt-2 line-clamp-3 font-heading text-[clamp(16px,2.8vw,22px)] font-semibold leading-[1.18] text-white/90 md:text-[19px] lg:text-[22px]">
            {p.title}
          </p>
        </div>
      )}
      {/* subtle hover shade */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
    </div>
  );

  return (
    <div
      className="relative overflow-hidden bg-[#0c0c0e] px-4 pt-5 sm:px-5 sm:pt-6 md:px-5 md:pt-6 lg:px-6 lg:pt-7 xl:px-7 xl:pt-8"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {/* studio glow — dark card backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_0%,rgba(255,255,255,0.09),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-8 bottom-0 h-24 bg-black/60 blur-2xl" />

      {/* vertical pill — floating top-left over the backdrop */}
      <span className="absolute left-4 top-4 z-10 max-w-[calc(100%-2rem)] truncate rounded-md bg-white/[0.08] px-2.5 py-1 text-[12px] font-medium text-white/85 backdrop-blur-md">
        {p.vertical}
      </span>

      {/* laptop */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-xl border border-white/10 border-b-0 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
          {screen}
        </div>
        {/* laptop base */}
        <div className="relative mx-auto h-[10px] w-[96%] rounded-b-xl bg-gradient-to-b from-[#2b2b30] to-[#101012]" />
        <div className="mx-auto h-[4px] w-[14%] rounded-b-lg bg-[#333338]" />
        {/* desk shadow */}
        <div className="mx-auto mt-1 h-5 w-[80%] rounded-full bg-black/70 blur-xl" />
      </div>
    </div>
  );
}

function ProjectCard({
  p,
  index,
  isExpanded,
  onToggleExpand,
}: {
  p: ProjectItem;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const [previewHover, setPreviewHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const r = useReveal();
  const mobile = useIsMobile();
  const row = Math.floor(index / 3);
  const delay = mobile ? 0 : (index % 3) * 0.08 + (row % 3) * 0.05;
  const hidden = { opacity: 0, y: r.yBody + 16, scale: 0.96, filter: mobile ? "blur(6px)" : "blur(8px)" };

  // Action links
  const primary = p.liveUrl
    ? { href: p.liveUrl, label: "View Project" }
    : p.caseStudyUrl
      ? { href: p.caseStudyUrl, label: "Read Case Study" }
      : null;
  const secondaryCaseStudy = p.liveUrl && p.caseStudyUrl ? p.caseStudyUrl : null;
  const tags = (p.tags ?? []).filter((t) => t.trim());

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : hidden}
      transition={{ duration: r.duration, delay, ease: r.ease }}
      className="min-w-0"
    >
      <article
        data-project-card
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] focus-within:border-white/25 ${
          isExpanded
            ? "border-white/30 bg-[#161616]"
            : "cursor-pointer border-white/10 bg-[#141414] hover:border-white/25"
        }`}
        onClick={() => {
          if (!isExpanded) onToggleExpand();
        }}
        onMouseLeave={() => {
          setPreviewHover(false);
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        {/* desktop cursor-following cue: Click to Expand */}
        {!isExpanded && (
          <motion.div
            aria-hidden
            animate={{
              opacity: previewHover ? 1 : 0,
              scale: previewHover ? 1 : 0.85,
            }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-[160%] whitespace-nowrap rounded-full bg-black/85 px-4 py-2 text-[13px] font-medium text-white shadow-xl backdrop-blur-md md:block"
            style={{ left: pos.x, top: pos.y }}
          >
            Click to Expand
          </motion.div>
        )}

        {/* Laptop mock with project cover image & title over image */}
        <LaptopMock p={p} onHoverChange={setPreviewHover} />

        {/* Compact bottom bar for the collapsed card */}
        {!isExpanded && (
          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#181818] px-4 py-3 sm:px-5">
            <span className="truncate font-heading text-[12px] font-medium tracking-wide text-white/55 sm:text-[13px]">
              {p.vertical}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              aria-label={`Expand ${p.title}`}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 font-heading text-[12px] font-medium text-white/85 transition-colors duration-200 group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white"
            >
              <span>Expand</span>
              <ChevronDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        )}

        {/* Expanded detail drawer */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/10"
            >
              {/* Header with Title, Vertical and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181818] px-4 py-3.5 sm:px-5 md:px-6">
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 font-heading text-[17px] font-semibold leading-snug text-white sm:text-[18px] md:text-[20px]">
                    {p.title}
                  </h4>
                  <p className="truncate font-heading text-[13px] text-white/50">{p.vertical}</p>
                </div>
                <div className="flex items-center gap-2">
                  {primary && (
                    <a
                      href={primary.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${primary.label}: ${p.title}`}
                      onClick={(e) => e.stopPropagation()}
                      className="group/btn relative inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3.5 py-2 font-heading text-[13px] font-medium text-white transition-all duration-300 hover:border-white/35 hover:bg-white/[0.12] active:bg-white/[0.16] sm:text-[14px]"
                    >
                      {primary.label}
                      <ArrowUpRight size={15} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand();
                    }}
                    aria-label="Collapse details"
                    className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-heading text-[12px] font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <span>Close</span>
                    <ChevronUp size={14} />
                  </button>
                </div>
              </div>

              {/* Story content: overview, results/impact, tags */}
              <div className="flex flex-col gap-4 bg-[#141414] px-4 py-5 sm:px-5 md:px-6 md:py-6">
                {p.overview && (
                  <p className="break-words font-heading text-[14px] font-light leading-[1.7] text-white/70 sm:text-[15px] md:text-[16px]">
                    {p.overview}
                  </p>
                )}
                {p.resultsAndImpact && (
                  <div>
                    <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                      Results &amp; impact
                    </p>
                    <p className="mt-2 break-words font-heading text-[14px] font-light leading-[1.7] text-white/85 sm:text-[15px] md:text-[16px]">
                      {p.resultsAndImpact}
                    </p>
                  </div>
                )}
                {(tags.length > 0 || secondaryCaseStudy) && (
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-2">
                    {tags.length > 0 && (
                      <p className="flex min-w-0 flex-wrap gap-x-2 gap-y-2 font-heading text-[13px] text-white/60 md:text-[14px]">
                        {tags.map((t) => (
                          <span key={t} className="break-words border-l border-white/25 pl-3 first:border-l-0 first:pl-0">
                            # {t}
                          </span>
                        ))}
                      </p>
                    )}
                    {secondaryCaseStudy && (
                      <a
                        href={secondaryCaseStudy}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="-my-2 inline-flex min-h-[40px] items-center gap-1 rounded font-heading text-[13px] font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white active:text-white md:text-[14px]"
                      >
                        Read case study <ArrowUpRight size={14} aria-hidden />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </motion.div>
  );
}

/**
 * Projects, grouped by vertical.
 * Supports custom categories registry and single-item expansion interaction.
 */
export function Projects({
  items,
  title,
  categories,
}: {
  items: ProjectItem[];
  title?: string;
  categories?: string[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Derive categories order: predefined + configured custom + any present in items
  const baseCategories = categories && categories.length > 0 ? categories : (PROJECT_VERTICALS as readonly string[]);
  const allCategoryNames = Array.from(new Set([...baseCategories, ...items.map((p) => p.vertical)]));

  // Non-empty verticals in order, with continuous index stagger
  const groups = allCategoryNames
    .map((v) => ({
      vertical: v as ProjectVertical,
      items: items.filter((p) => p.vertical === v),
    }))
    .filter((g) => g.items.length > 0)
    .reduce<{ vertical: ProjectVertical; items: ProjectItem[]; start: number }[]>((acc, g) => {
      const prev = acc[acc.length - 1];
      const start = prev ? prev.start + prev.items.length : 0;
      return [...acc, { ...g, start }];
    }, []);

  const toggleSectionExpand = (vertical: string) => {
    setExpandedSections((prev) => {
      const isExpanding = !prev[vertical];
      if (!isExpanding && expandedId) {
        // If collapsing, check if the currently expanded project card is in the hidden portion (beyond first 3)
        const group = groups.find((g) => g.vertical === vertical);
        const isHidden = group?.items.slice(3).some((p) => p.id === expandedId);
        if (isHidden) {
          setExpandedId(null);
        }
      }
      return { ...prev, [vertical]: isExpanding };
    });
  };

  const { scrollYProgress } = useScroll({
    target: ref as never,
    offset: ["start end", "end start"],
  });
  // ghost title drifts slower than the cards
  const ghostY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.35, 0.8, 1], [0, 1, 1, 0.4]);

  // Click outside listener: collapse expanded card when clicking outside any project card
  useEffect(() => {
    if (!expandedId) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && !target.closest("[data-project-card]")) {
        setExpandedId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("touchend", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("touchend", handleOutsideClick);
    };
  }, [expandedId]);

  const sectionHeading = title?.trim() || "Projects";

  return (
    <section
      id="projects"
      ref={ref}
      className="relative -mt-px scroll-mt-24 overflow-hidden bg-transparent px-4 pb-16 pt-10 sm:px-6 md:px-10 md:pb-20 md:pt-16"
    >
      {/* black stage feathered top and bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#0a0a0c_10%,#0a0a0c_90%,transparent_100%)]"
      />
      <GridLines />
      <h2 className="sr-only">{sectionHeading}</h2>
      <motion.span
        aria-hidden
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="ghost-huge pointer-events-none absolute -top-4 left-0 z-[2] text-[27vw] md:text-[15vw]"
      >
        {sectionHeading}
      </motion.span>

      <div className="relative z-[2] mx-auto max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1440px] pt-[13vw] md:pt-[7.5vw]">
        {groups.map((g, gi) => {
          const isSectionExpanded = expandedSections[g.vertical] ?? false;
          const hasMore = g.items.length > 3;
          const visibleItems = isSectionExpanded ? g.items : g.items.slice(0, 3);
          const remainingCount = g.items.length - 3;

          return (
            <div key={g.vertical} className={gi > 0 ? "mt-14 md:mt-20" : ""}>
              <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-white/15 pb-4 md:mb-6">
                <h3 className="text-balance font-heading text-[22px] leading-tight tracking-tight text-white sm:text-[26px] md:text-[34px]">
                  {g.vertical}
                  <sup className="ml-2 align-super text-[12px] font-normal text-white/50">
                    {pad2(gi + 1)}
                  </sup>
                </h3>
                <span className="shrink-0 font-heading text-[13px] tabular-nums text-white/50 md:text-[14px]">
                  {g.items.length} {g.items.length === 1 ? "project" : "projects"}
                </span>
              </div>
              <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {visibleItems.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    p={p}
                    index={g.start + i}
                    isExpanded={expandedId === p.id}
                    onToggleExpand={() => setExpandedId((prev) => (prev === p.id ? null : p.id))}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 flex justify-center sm:mt-10">
                  <button
                    type="button"
                    onClick={() => toggleSectionExpand(g.vertical)}
                    aria-expanded={isSectionExpanded}
                    aria-label={
                      isSectionExpanded
                        ? `Show fewer projects in ${g.vertical}`
                        : `View ${remainingCount} more projects in ${g.vertical}`
                    }
                    className="group relative inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 font-heading text-[13px] font-medium text-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-[1.5] transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-6 sm:py-3 sm:text-[14px]"
                  >
                    {/* Subtle top hairline highlight */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <span>{isSectionExpanded ? "Show less" : "View more"}</span>
                    {!isSectionExpanded && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white/70">
                        +{remainingCount}
                      </span>
                    )}
                    {isSectionExpanded ? (
                      <ChevronUp
                        size={15}
                        className="text-white/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-white"
                        aria-hidden
                      />
                    ) : (
                      <ChevronDown
                        size={15}
                        className="text-white/60 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-white"
                        aria-hidden
                      />
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
