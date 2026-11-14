"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { SkillGroup } from "@/lib/types";
import { pad2 } from "@/lib/format";
import { GridLines, useReveal } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

/**
 * Skill groups as the reference's divided rows: category on the left with
 * a superscript index, the skills on the right as the frosted tag chips.
 */
export function SkillsSection({ items, title }: { items: SkillGroup[]; title?: string }) {
  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-10 pt-6 sm:px-6 md:px-12 md:pt-10"
    >
      <GridLines />
      <GhostTitle>{title || "Skills"}</GhostTitle>
      <div className="relative z-[2] mx-auto mt-4 max-w-[1440px] md:mt-8">
        {items.map((g, i) => (
          <SkillRow key={g.id} group={g} index={i} />
        ))}
      </div>
    </section>
  );
}

// One in-view trigger per row; the hover slide sits on an inner span so it
// never fights Motion's transform (see ExperienceSection).
function SkillRow({ group: g, index: i }: { group: SkillGroup; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const r = useReveal();
  const titleHidden = { opacity: 0, y: r.y, filter: r.blur };
  const bodyHidden = { opacity: 0, y: r.yBody, filter: r.blur };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const skills = g.skills.filter((s) => s.trim());

  return (
    <div
      ref={ref}
      className="group grid grid-cols-1 gap-4 border-b border-white/20 py-6 first:border-t sm:py-8 md:gap-6 md:py-10 lg:grid-cols-2 lg:gap-12"
    >
      <motion.h3
        initial={titleHidden}
        animate={inView ? shown : titleHidden}
        transition={{ duration: r.duration, ease: r.ease }}
        className="font-heading text-[22px] leading-tight tracking-tight text-white sm:text-[26px] md:text-[30px] lg:text-[42px]"
      >
        <span className="inline-block max-w-full text-balance break-words transition-transform duration-500 lg:group-hover:translate-x-2">
          {g.category}
          <sup className="ml-2 align-super text-[12px] font-normal text-white/50">{pad2(i + 1)}</sup>
        </span>
      </motion.h3>
      <motion.ul
        initial={bodyHidden}
        animate={inView ? shown : bodyHidden}
        transition={{ duration: r.duration, delay: 0.08, ease: r.ease }}
        className="flex min-w-0 flex-wrap gap-2.5 self-center sm:gap-3"
      >
        {skills.map((s) => (
          <li
            key={s}
            className="max-w-full break-words rounded-md bg-white/10 px-3.5 py-2 font-heading text-[13px] text-white/80 sm:px-4 sm:py-2.5 sm:text-[14px]"
          >
            {s}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
