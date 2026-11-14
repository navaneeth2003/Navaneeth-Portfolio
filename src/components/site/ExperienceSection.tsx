"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { ExperienceItem } from "@/lib/types";
import { formatRange, initials, pad2 } from "@/lib/format";
import { GridLines, useReveal } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

/**
 * Experience as the reference's "journey" list: hairline-divided rows, a big
 * role title with a superscript index on the left, the story on the right,
 * hashtag tags. The journey line (site/JourneyFlow, mounted in PublicSite)
 * runs behind this section at z-1, which is why the content sits at z-2.
 */
export function ExperienceSection({ items, title }: { items: ExperienceItem[]; title?: string }) {
  return (
    <section
      id="experience"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-10 pt-6 sm:px-6 md:px-12 md:pt-10"
    >
      <GridLines />
      <div className="relative z-[2]">
        <GhostTitle>{title || "Experience"}</GhostTitle>
      </div>

      <div className="relative z-[2] mx-auto mt-4 max-w-[1440px] md:mt-8">
        {items.map((e, i) => (
          <ExperienceRow key={e.id} item={e} index={i} />
        ))}
      </div>
    </section>
  );
}

/**
 * One row. All three parts share a single in-view trigger and the title and
 * its meta pill travel the same distance (the pill trailing by 60ms), so the
 * title can never pass through the pill on the way in. The hover slide lives
 * on an inner span: a CSS transition on the element Motion animates would
 * re-tween every frame and make the title lag its siblings — the overlap
 * this fixes.
 */
function ExperienceRow({ item: e, index: i }: { item: ExperienceItem; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const r = useReveal();
  const bullets = e.bullets.filter((b) => b.trim());
  const tags = (e.tags ?? []).filter((t) => t.trim());

  const titleHidden = { opacity: 0, y: r.y, filter: r.blur };
  const metaHidden = { opacity: 0, y: r.y };
  const bodyHidden = { opacity: 0, y: r.yBody, filter: r.blur };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <article
      ref={ref}
      className="group grid grid-cols-1 gap-4 border-b border-white/20 py-7 first:border-t sm:py-8 md:gap-6 md:py-10 lg:grid-cols-2 lg:gap-12"
    >
      <div className="min-w-0">
        <motion.h3
          initial={titleHidden}
          animate={inView ? shown : titleHidden}
          transition={{ duration: r.duration, ease: r.ease }}
          className="font-heading text-[26px] leading-tight tracking-tight text-white sm:text-[30px] md:text-[34px] lg:text-[42px]"
        >
          <span className="inline-block max-w-full text-balance break-words transition-transform duration-500 lg:group-hover:translate-x-2">
            {e.role}
            <sup className="ml-2 align-super text-[12px] font-normal text-white/50">
              {pad2(i + 1)}
            </sup>
          </span>
        </motion.h3>
        <motion.div
          initial={metaHidden}
          animate={inView ? { opacity: 1, y: 0 } : metaHidden}
          transition={{ duration: r.duration, delay: 0.06, ease: r.ease }}
          className="mt-4 inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-black px-4 py-3 text-[14px] text-white/80 sm:text-[15px] md:mt-5 md:px-5"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-md bg-white/10 font-heading text-[11px] font-semibold text-white/80">
              {e.logo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.logo.url} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(e.company, 1)
              )}
            </span>
            <span className="truncate font-medium text-white">{e.company}</span>
          </span>
          <span aria-hidden className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
          <span className="tabular-nums text-white/60">{formatRange(e.startDate, e.endDate)}</span>
        </motion.div>
      </div>

      <motion.div
        initial={bodyHidden}
        animate={inView ? shown : bodyHidden}
        transition={{ duration: r.duration, delay: 0.08, ease: r.ease }}
        className="min-w-0"
      >
        {bullets.length > 0 && (
          <ul className="space-y-3">
            {bullets.map((b, bi) => (
              <li
                key={bi}
                className="flex gap-3 break-words font-heading text-[15px] font-light leading-[1.65] text-white/80 md:text-[17px]"
              >
                <span aria-hidden className="mt-[0.75em] h-1 w-1 shrink-0 rounded-full bg-white/40" />
                <span className="min-w-0">{b}</span>
              </li>
            ))}
          </ul>
        )}
        {e.highlight && (
          <p className="relative mt-5 break-words pl-4 font-heading text-[15px] font-medium leading-snug text-white before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:rounded-full before:bg-gradient-to-b before:from-[#34ffb5] before:via-[#a855f7] before:to-[#ffb03a] md:text-[18px]">
            {e.highlight}
          </p>
        )}
        {tags.length > 0 && (
          <p className="mt-4 flex flex-wrap gap-x-2 gap-y-2 font-heading text-[14px] text-white/60 md:text-[16px]">
            {tags.map((t) => (
              <span key={t} className="break-words border-l border-white/25 pl-3 first:border-l-0 first:pl-0">
                # {t}
              </span>
            ))}
          </p>
        )}
      </motion.div>
    </article>
  );
}
