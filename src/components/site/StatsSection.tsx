"use client";

import { Award, Layers, Rocket, Sparkles, type LucideIcon } from "lucide-react";
import type { StatItem } from "@/lib/types";
import { pad2 } from "@/lib/format";
import { CountUp } from "@/components/Journey";
import { ScrollReveal } from "@/components/ui";
import { IconTile, SafeImg, WRAP, tintAt } from "./kit";

const GLYPHS: LucideIcon[] = [Rocket, Layers, Sparkles, Award];

/** md+ columns by count — written out so Tailwind sees them. */
const COLS: Record<number, string> = {
  1: "md:grid-cols-1 md:max-w-[420px] md:mx-auto",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/**
 * The numbers, as a row of pastel cards (the reference's "how it works"
 * cards): a white icon tile, a faded index, a big counting number and its
 * label. Phones get a 2×2 grid; an odd last card spans the row. A value like
 * "12+" counts up; plain text shows as is; an empty value hands the stage to
 * the stat's icon (or a neutral award glyph). Every value is sized to fit
 * its card on one line, and long values (7+ characters) get full-width
 * cards on phones and two-up on tablets, so they never clip.
 */
export function StatsSection({ items: raw }: { items: StatItem[] }) {
  // A card needs a value, a label or an icon; nothing at all → no section.
  const items = raw.filter((s) => s.value.trim() || s.label.trim() || s.icon?.url).slice(0, 4);
  if (items.length === 0) return null;
  const n = items.length;
  const long = items.some((s) => s.value.trim().length >= 7);
  const cols = long ? `grid-cols-1 ${n >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : (COLS[n] ?? "md:grid-cols-4")}` : `grid-cols-2 ${COLS[n] ?? "md:grid-cols-4"}`;
  return (
    <section id="stats" className="relative scroll-mt-24 py-6 md:py-10 xl:py-12">
      <h2 className="sr-only">Stats</h2>
      <div className={`${WRAP} grid gap-3 sm:gap-4 xl:gap-5 3xl:gap-6 ${cols}`}>
        {items.map((s, i) => {
          const value = s.value.trim();
          const m = /^(\d+)(.*)$/.exec(value);
          const Glyph = GLYPHS[i % GLYPHS.length];
          const odd = !long && n % 2 === 1 && i === n - 1;
          // Shrink only when the value would not fit its card on one line.
          const fit = (100 / (Math.max(3, Array.from(value).length) * 0.62)).toFixed(2);
          return (
            <ScrollReveal key={s.id} delay={i * 0.07} className={`min-w-0 ${odd ? "col-span-2 md:col-span-1" : ""}`}>
              <div
                className={`@container relative flex h-full min-h-[156px] flex-col justify-between overflow-hidden rounded-[26px] p-5 md:min-h-[210px] md:rounded-[32px] md:p-6 xl:p-7 3xl:min-h-[260px] 3xl:p-9 ${tintAt(i)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  {s.icon?.url ? (
                    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[30%] border border-hairline bg-card shadow-pill md:size-12 3xl:size-14">
                      <SafeImg src={s.icon.url} className="h-full w-full object-cover" fallback={<Glyph size={19} strokeWidth={1.9} className="text-onyx" />} />
                    </span>
                  ) : (
                    <IconTile icon={value ? Glyph : Award} className="size-11 md:size-12 3xl:size-14" size={19} />
                  )}
                  <span aria-hidden className="display text-[34px] text-onyx/10 md:text-[44px] 3xl:text-[56px]">
                    {pad2(i + 1)}
                  </span>
                </div>
                <div className="mt-6">
                  {value && (
                    <p
                      className="display whitespace-nowrap [--fit-max:44px] md:[--fit-max:54px] xl:[--fit-max:66px] 3xl:[--fit-max:88px]"
                      style={{ fontSize: `min(var(--fit-max), ${fit}cqw)` }}
                    >
                      {m ? <CountUp end={Number(m[1])} suffix={m[2]} /> : value}
                    </p>
                  )}
                  <p
                    className={`break-words font-semibold text-onyx/70 ${
                      value ? "mt-2 text-[14px] md:text-[16px] 3xl:text-[19px]" : "display text-[24px] text-onyx md:text-[28px] 3xl:text-[36px]"
                    }`}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
