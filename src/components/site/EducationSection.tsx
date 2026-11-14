"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { EducationItem } from "@/lib/types";
import { pad2 } from "@/lib/format";
import { GridLines, useReveal } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

/**
 * Education as divided rows: the degree on the left, and on the right the
 * reference's black meta pill (institution · years) — the same pill the
 * Experience rows use, so the two sections read as one system.
 */
export function EducationSection({ items, title }: { items: EducationItem[]; title?: string }) {
  return (
    <section
      id="education"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-10 pt-6 sm:px-6 md:px-12 md:pt-10"
    >
      <GridLines />
      <GhostTitle>{title || "Education"}</GhostTitle>
      <div className="relative z-[2] mx-auto mt-4 max-w-[1440px] md:mt-8">
        {items.map((e, i) => (
          <EducationRow key={e.id} item={e} index={i} />
        ))}
      </div>
    </section>
  );
}

// Same reveal contract as the Experience rows: one trigger, equal travel for
// the title and the pill, hover slide on an inner span.
function EducationRow({ item: e, index: i }: { item: EducationItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const r = useReveal();
  const titleHidden = { opacity: 0, y: r.y, filter: r.blur };
  const metaHidden = { opacity: 0, y: r.y };
  const years = [e.startYear, e.endYear].filter(Boolean).join(" — ");

  return (
    <div
      ref={ref}
      className="group grid grid-cols-1 gap-4 border-b border-white/20 py-6 first:border-t sm:py-8 md:gap-6 md:py-10 lg:grid-cols-2 lg:gap-12"
    >
      <motion.h3
        initial={titleHidden}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : titleHidden}
        transition={{ duration: r.duration, ease: r.ease }}
        className="font-heading text-[22px] leading-tight tracking-tight text-white sm:text-[26px] md:text-[30px] lg:text-[34px]"
      >
        <span className="inline-block max-w-full text-balance break-words transition-transform duration-500 lg:group-hover:translate-x-2">
          {e.degree}
          <sup className="ml-2 align-super text-[12px] font-normal text-white/50">{pad2(i + 1)}</sup>
        </span>
      </motion.h3>
      <motion.div
        initial={metaHidden}
        animate={inView ? { opacity: 1, y: 0 } : metaHidden}
        transition={{ duration: r.duration, delay: 0.08, ease: r.ease }}
        className="min-w-0 self-center"
      >
        <div className="inline-flex max-w-full flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-black px-5 py-4 text-[14px] text-white/80 sm:text-[15px] md:px-6">
          {e.institution && <span className="break-words font-medium text-white">{e.institution}</span>}
          {e.institution && years && (
            <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
          )}
          {years && <span className="tabular-nums">{years}</span>}
        </div>
      </motion.div>
    </div>
  );
}
