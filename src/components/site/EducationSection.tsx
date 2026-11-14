"use client";

import { GraduationCap } from "lucide-react";
import type { EducationItem } from "@/lib/types";
import { yearOf } from "@/lib/format";
import { ScrollReveal } from "@/components/ui";
import { IconTile, SECTION_Y, SectionHeader, WRAP, tintAt } from "./kit";

/** Card width by count from md up (a short last row centres) — written out so Tailwind sees them. */
const WIDTH: Record<number, string> = {
  1: "md:w-full md:max-w-[560px]",
  2: "md:w-[calc(50%-10px)]",
  3: "md:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.34px)] 3xl:w-[calc(33.333%-16px)]",
};

/**
 * Education as the reference's "how it works" cards: pastel tiles with a
 * white icon tile and the finishing year in big faded type, then the degree,
 * the institution and the years. One column on phones, two on tablets, three
 * on laptops and up when there are three or more.
 */
export function EducationSection({ items, title }: { items: EducationItem[]; title?: string }) {
  const starts = items.map((e) => yearOf(e.startYear)).filter((y): y is number => y !== null);
  const ends = items.map((e) => yearOf(e.endYear)).filter((y): y is number => y !== null);
  const span = starts.length && ends.length ? `${Math.min(...starts)} — ${Math.max(...ends)}` : undefined;

  return (
    <section id="education" className={`relative scroll-mt-24 ${SECTION_Y}`}>
      <div className={WRAP}>
        <ScrollReveal>
          <SectionHeader eyebrow={span ?? "Where it started"} title={title || "Education"} />
        </ScrollReveal>
        <ul className="mt-10 flex flex-col gap-4 md:mt-14 md:flex-row md:flex-wrap md:justify-center md:gap-5 3xl:mt-16 3xl:gap-6">
          {items.map((e, i) => {
            const years = [e.startYear, e.endYear].filter(Boolean).join(" — ");
            const end = yearOf(e.endYear) ?? yearOf(e.startYear);
            return (
              <li key={e.id} className={WIDTH[Math.min(items.length, 3)]}>
                <ScrollReveal delay={Math.min(i * 0.06, 0.18)} className="h-full">
                  <div
                    className={`relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-[28px] p-6 md:min-h-[280px] md:rounded-[36px] md:p-8 3xl:min-h-[340px] 3xl:p-10 ${tintAt(i)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <IconTile icon={GraduationCap} className="size-12 md:size-14 3xl:size-16" size={22} />
                      {end && (
                        <span aria-hidden className="display text-[52px] text-onyx/10 md:text-[64px] 3xl:text-[84px]">
                          {end}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-auto break-words pt-8 text-[20px] font-bold leading-snug tracking-[-0.025em] text-onyx md:text-[23px] 3xl:text-[28px]">
                      {e.degree}
                    </h3>
                    {e.institution && (
                      <p className="mt-2 break-words text-[15px] font-medium text-onyx/70 md:text-[16px] 3xl:text-[19px]">{e.institution}</p>
                    )}
                    {years && (
                      <p className="mt-4 inline-flex self-start rounded-full bg-card/70 px-3 py-1 text-[13px] font-semibold tabular-nums text-onyx/70 3xl:text-[15px]">
                        {years}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
