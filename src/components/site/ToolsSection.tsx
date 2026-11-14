"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ProficiencyLevel, ToolItem } from "@/lib/types";
import { initials, listJoin, plural } from "@/lib/format";
import { ScrollReveal } from "@/components/ui";
import { ChipRail, SafeImg, SECTION_Y, SectionHeader, WRAP, tileAt } from "./kit";

const LEVEL_STEPS: Record<ProficiencyLevel, number> = { Expert: 3, Intermediate: 2, Beginner: 1 };

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

function Meter({ level, light = false }: { level: ProficiencyLevel; light?: boolean }) {
  const steps = LEVEL_STEPS[level];
  return (
    <span aria-hidden className="inline-flex gap-1">
      {[0, 1, 2].map((s) => (
        <span
          key={s}
          className={`size-1.5 rounded-full 3xl:size-2 ${s < steps ? (light ? "bg-white" : "bg-onyx") : light ? "bg-white/30" : "bg-onyx/15"}`}
        />
      ))}
    </span>
  );
}

/**
 * Tools as a phone home screen: each tool is an app icon (its logo, or its
 * initial on a pastel squircle) with its name and a three-dot proficiency
 * meter. Category tabs filter the grid when the tools span more than one
 * category — a row of chips that swipes on phones, one segmented track
 * from tablets up. Columns: 4 on phones → 5 → 6 on tablets → 8 on laptops and up.
 */
export function ToolsSection({ items, title }: { items: ToolItem[]; title?: string }) {
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((t) => cats.add(getToolCategory(t.name)));
    return cats.size > 1 ? ["All", ...Array.from(cats)] : [];
  }, [items]);

  const shown = active === "All" ? items : items.filter((t) => getToolCategory(t.name) === active);
  const names = items.map((t) => t.name.trim()).filter(Boolean);
  const sub =
    names.length > 3
      ? `${listJoin(names.slice(0, 3))} — and ${names.length - 3} more I reach for.`
      : names.length > 0
        ? `${listJoin(names)}.`
        : undefined;

  return (
    <section id="tools" className={`relative scroll-mt-24 ${SECTION_Y}`}>
      <div className={WRAP}>
        <ScrollReveal>
          <SectionHeader
            eyebrow={`${plural(items.length, "tool")}${categories.length ? ` · ${plural(categories.length - 1, "category", "categories")}` : ""}`}
            title={title || "Tools"}
            sub={sub}
          />
        </ScrollReveal>

        <ScrollReveal className="mt-10 md:mt-14 3xl:mt-16">
          <div className="surface relative overflow-hidden rounded-[32px] p-4 sm:p-6 md:rounded-[40px] md:p-8 xl:p-10 3xl:p-14">
            {/* tabs + legend */}
            <div className="flex flex-col items-center gap-4 xl:flex-row xl:justify-between">
              {categories.length > 0 ? (
                // Phones: a row of chips that swipes, running to the card's
                // edges. Tablets up: one segmented track.
                <ChipRail
                  label="Filter tools by category"
                  active={active}
                  className="-mx-4 self-stretch sm:-mx-6 md:mx-0 md:self-auto"
                  scrollerClassName="-my-1.5 px-4 py-1.5 sm:px-6 md:my-0 md:overflow-visible md:px-0 md:py-0 md:[mask-image:none]"
                  trackClassName="gap-1.5 md:gap-1 md:rounded-full md:bg-well md:p-1"
                >
                  {categories.map((cat) => {
                    const on = active === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setActive(cat)}
                        className={`relative shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors md:text-[14px] 3xl:px-5 3xl:py-2.5 3xl:text-[16px] ${
                          on ? "text-onyx" : "bg-well text-ash hover:text-onyx md:bg-transparent"
                        }`}
                      >
                        {on && (
                          <motion.span
                            layoutId="tools-tab"
                            className="absolute inset-0 rounded-full border border-hairline bg-card shadow-pill"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className="relative">{cat}</span>
                      </button>
                    );
                  })}
                </ChipRail>
              ) : (
                <span />
              )}
              <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12.5px] font-semibold text-ash md:text-[13px] 3xl:text-[15px]">
                {(Object.keys(LEVEL_STEPS) as ProficiencyLevel[]).map((lv) => (
                  <span key={lv} className="inline-flex items-center gap-1.5">
                    <Meter level={lv} />
                    {lv}
                  </span>
                ))}
              </p>
            </div>

            {/* the home screen */}
            <motion.ul
              layout
              className="mt-8 grid grid-cols-4 gap-x-2 gap-y-7 sm:grid-cols-5 sm:gap-x-4 md:mt-10 md:grid-cols-6 md:gap-y-9 lg:grid-cols-8 3xl:gap-x-8 3xl:gap-y-12"
            >
              <AnimatePresence mode="popLayout">
                {shown.map((t) => {
                  const i = items.indexOf(t);
                  return (
                    <motion.li
                      layout
                      key={t.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="flex min-w-0 flex-col items-center text-center"
                    >
                      <span
                        className={`hover-jiggle grid size-[58px] place-items-center overflow-hidden rounded-[30%] border-[3px] border-white text-[20px] font-extrabold text-on-pop shadow-float sm:size-[64px] md:size-[70px] md:border-4 xl:size-[78px] 3xl:size-[100px] 3xl:text-[30px] ${
                          t.icon.url ? "bg-white" : tileAt(i)
                        }`}
                      >
                        {t.icon.url ? (
                          <SafeImg src={t.icon.url} loading="lazy" className="h-full w-full object-contain p-2" fallback={initials(t.name, 1)} />
                        ) : (
                          initials(t.name, 1)
                        )}
                      </span>
                      <span className="mt-2.5 w-full truncate text-[12px] font-semibold text-onyx sm:text-[13px] md:text-[14px] 3xl:text-[17px]">
                        {t.name}
                      </span>
                      <span className="mt-1.5 flex items-center gap-1.5">
                        <Meter level={t.level} />
                        <span className="sr-only">{t.level}</span>
                      </span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
