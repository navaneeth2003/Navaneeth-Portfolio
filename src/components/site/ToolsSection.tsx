"use client";

import type { ProficiencyLevel, ToolItem } from "@/lib/types";
import { motion } from "motion/react";
import { EASE } from "./motion/primitives";
import { RatioImage, SectionShell } from "./shared";

const LEVEL_DOTS: Record<ProficiencyLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Expert: 3,
};

/** Filled dots pop in sequence after the tile lands — animated proficiency. */
function LevelDots({ level, baseDelay }: { level: ProficiencyLevel; baseDelay: number }) {
  const filled = LEVEL_DOTS[level];
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {[1, 2, 3].map((n) =>
        n <= filled ? (
          <motion.span
            key={n}
            className="h-1.5 w-1.5 rounded-full bg-accent"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, ease: EASE, delay: baseDelay + 0.2 + n * 0.12 }}
          />
        ) : (
          <span key={n} className="h-1.5 w-1.5 rounded-full bg-line" />
        ),
      )}
    </span>
  );
}

export function ToolsSection({ items }: { items: ToolItem[] }) {
  return (
    <SectionShell id="tools" eyebrow="Tools" heading="What I work with">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((tool, i) => {
          // Diagonal wave: delay grows across rows and columns together.
          const delay = ((i % 4) + Math.floor(i / 4)) * 0.055;
          return (
            <motion.div
              key={tool.id}
              className="card flex items-center gap-3.5 !rounded-2xl !p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/15"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.45, ease: EASE, delay }}
            >
              <RatioImage
                image={tool.icon}
                alt=""
                fallbackText={tool.name}
                className="h-10 w-10 shrink-0 rounded-xl border border-line"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{tool.name}</p>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                  <LevelDots level={tool.level} baseDelay={delay} />
                  {tool.level}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionShell>
  );
}
