"use client";

import { Award } from "lucide-react";
import type { StatItem } from "@/lib/types";
import { CountUp } from "@/components/Journey";
import { GridLines, ScrollReveal } from "@/components/ui";

/**
 * The reference's 4-up number row: counting numbers, hairline dividers,
 * 2×2 on mobile. A value like "12+" counts up; a plain string is shown as
 * is; an empty value hands the slot to the icon (or a neutral glyph).
 */
export function StatsSection({ items }: { items: StatItem[] }) {
  return (
    <section
      id="stats"
      className="relative scroll-mt-24 px-5 py-10 sm:px-6 md:px-12 md:py-16 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)] to-transparent"
    >
      <GridLines />
      <h2 className="sr-only">Stats</h2>
      <div className="relative z-[2] mx-auto max-w-[1200px] text-center">
        <div className="grid grid-cols-2 md:grid-flow-col md:auto-cols-fr md:grid-cols-none">
          {items.map((s, i) => {
            const m = /^(\d+)(.*)$/.exec(s.value.trim());
            return (
              <ScrollReveal key={s.id} delay={i * 0.08}>
                <div
                  className={`min-w-0 px-4 py-6 md:py-2 ${i > 0 ? "border-l border-white/15" : ""} ${
                    i >= 2 ? "max-md:border-t max-md:border-white/15" : ""
                  } ${i % 2 === 0 ? "max-md:border-l-0" : ""}`}
                >
                  <p className="font-heading text-[32px] font-bold leading-none text-white sm:text-[40px] md:text-[56px]">
                    {m ? (
                      <CountUp end={Number(m[1])} suffix={m[2]} />
                    ) : s.value.trim() ? (
                      <span className="break-words">{s.value}</span>
                    ) : (
                      <span className="inline-flex size-[1em] items-center justify-center overflow-hidden rounded-xl align-middle">
                        {s.icon?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.icon.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Award className="size-[0.8em] text-white/85" strokeWidth={1.6} aria-hidden />
                        )}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 break-words font-heading text-[13px] text-white/60 sm:text-[14px] md:mt-3 md:text-[17px]">
                    {s.label}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
