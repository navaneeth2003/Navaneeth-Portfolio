"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ProficiencyLevel, ToolItem } from "@/lib/types";
import { initials } from "@/lib/format";
import { GridLines, ScrollReveal } from "@/components/ui";
import { GhostTitle } from "./GhostTitle";

const LEVEL_CONFIG: Record<ProficiencyLevel, { chip: string; dot: string }> = {
  Expert: {
    chip: "bg-[var(--color-accent,#ff4a1a)]/15 text-[var(--color-accent,#ff4a1a)] border border-[var(--color-accent,#ff4a1a)]/30",
    dot: "bg-[var(--color-accent,#ff4a1a)]",
  },
  Intermediate: {
    chip: "bg-white/10 text-white/90 border border-white/15",
    dot: "bg-white/90",
  },
  Beginner: {
    chip: "border border-white/10 text-white/60 bg-white/[0.04]",
    dot: "bg-white/40",
  },
};

function getToolCategory(name: string): "Design" | "Product & Delivery" | "Data & Analytics" | "Engineering" {
  const lower = name.toLowerCase();
  if (
    lower.includes("figma") ||
    lower.includes("canva") ||
    lower.includes("sketch") ||
    lower.includes("xd") ||
    lower.includes("photoshop") ||
    lower.includes("illustrator") ||
    lower.includes("design") ||
    lower.includes("framer") ||
    lower.includes("ui")
  ) {
    return "Design";
  }
  if (
    lower.includes("analytics") ||
    lower.includes("tableau") ||
    lower.includes("power bi") ||
    lower.includes("bi") ||
    lower.includes("sql") ||
    lower.includes("mixpanel") ||
    lower.includes("amplitude") ||
    lower.includes("posthog") ||
    lower.includes("data") ||
    lower.includes("excel")
  ) {
    return "Data & Analytics";
  }
  if (
    lower.includes("github") ||
    lower.includes("git") ||
    lower.includes("vscode") ||
    lower.includes("postman") ||
    lower.includes("terminal") ||
    lower.includes("docker")
  ) {
    return "Engineering";
  }
  return "Product & Delivery";
}

export function ToolsSection({ items, title }: { items: ToolItem[]; title?: string }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((t) => cats.add(getToolCategory(t.name)));
    return cats.size > 1 ? ["All", ...Array.from(cats)] : [];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((t) => getToolCategory(t.name) === activeCategory);
  }, [items, activeCategory]);

  return (
    <section
      id="tools"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-16 pt-6 sm:px-6 md:px-12 md:pb-24 md:pt-10"
    >
      <GridLines />
      {/* z-2: the journey line leaves the page through this heading, behind it */}
      <div className="relative z-[2] text-center">
        <GhostTitle>{title || "Tools"}</GhostTitle>
      </div>

      <ScrollReveal className="relative z-[2] mx-auto mt-6 max-w-[1240px] md:mt-10">
        {/* Interactive Category Filter Pills */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              const count = cat === "All" ? items.length : items.filter((t) => getToolCategory(t.name) === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    active ? "text-white" : "text-white/60 hover:text-white/90"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="tool-category-active"
                      className="absolute inset-0 rounded-full border border-white/20 bg-white/10 backdrop-blur-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                  <span className="relative z-10 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white/70">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Elevated Cards Grid */}
        <motion.div layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((t) => {
              const cfg = LEVEL_CONFIG[t.level];
              const category = getToolCategory(t.name);

              return (
                <motion.div
                  layout
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
                >
                  {/* Subtle top hairline shimmer on hover */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="flex items-start justify-between gap-2.5">
                    {/* Squircle tool icon */}
                    <div className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-inner sm:size-12">
                      {t.icon.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.icon.url} alt={t.name} loading="lazy" className="h-full w-full object-contain p-2" />
                      ) : (
                        <span className="font-heading text-[15px] font-bold text-white/80">{initials(t.name, 1)}</span>
                      )}
                    </div>

                    {/* Level chip with dot */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-heading text-[10px] sm:text-[11px] font-semibold tracking-wide ${cfg.chip}`}
                    >
                      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                      {t.level}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="line-clamp-1 font-heading text-[15px] sm:text-[16px] font-semibold text-white group-hover:text-white transition-colors">
                      {t.name}
                    </h4>
                    <p className="mt-0.5 text-[11px] sm:text-[12px] font-medium text-white/45 font-heading">
                      {category}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </ScrollReveal>
    </section>
  );
}
