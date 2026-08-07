"use client";

import type { SkillGroup } from "@/lib/types";
import { motion } from "motion/react";
import { EASE, Rise } from "./motion/primitives";
import { SectionShell } from "./shared";

export function SkillsSection({ items }: { items: SkillGroup[] }) {
  // A group with zero skills hides rather than rendering an empty card.
  const groups = items.filter((g) => g.skills.length > 0);
  if (groups.length === 0) return null;

  return (
    <SectionShell id="skills" eyebrow="Core skills" heading="How I think and work">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, col) => (
          <Rise key={group.id} delay={col * 0.08}>
            <div className="card group h-full p-6 transition-colors duration-200 hover:border-ink/15 md:p-7">
              <h3 className="flex items-center gap-2 font-semibold tracking-tight break-words">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
                {group.category}
              </h3>
              {/* Thoughts collecting into a cluster: pills pop in a quick burst. */}
              <motion.div
                className="mt-4 flex flex-wrap gap-2"
                initial="hide"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                variants={{ show: { transition: { staggerChildren: 0.035, delayChildren: col * 0.08 + 0.15 } } }}
              >
                {group.skills.map((s, i) => (
                  <motion.span
                    key={i}
                    className="inline-flex max-w-full items-center truncate rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-ink-soft"
                    variants={{
                      hide: { opacity: 0, scale: 0.85 },
                      show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } },
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </Rise>
        ))}
      </div>
    </SectionShell>
  );
}
