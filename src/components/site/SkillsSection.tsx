"use client";

import { Zap } from "lucide-react";
import type { SkillGroup } from "@/lib/types";
import { plural } from "@/lib/format";
import { ScrollReveal } from "@/components/ui";
import { AVATAR, AvatarTile, Chatter, IconTile, SECTION_Y, WRAP, tileAt } from "./kit";

/**
 * Skills as one big lavender card (the reference's "Safety by design"
 * block): the heading, a count derived from the groups and a curious
 * teammate on the left; on the right, a white row per skill group — the
 * category with its own pastel marker and the skills as pills. Phones and
 * tablets stack the two halves; laptops sit them side by side with the left
 * half pinned while the rows scroll.
 */
export function SkillsSection({ items: raw, title }: { items: SkillGroup[]; title?: string }) {
  // Only groups that hold at least one skill; nothing at all → no section.
  const items = raw.map((g) => ({ ...g, skills: g.skills.filter((s) => s.trim()) })).filter((g) => g.skills.length > 0);
  if (items.length === 0) return null;
  const label = (title || "Skills").trim();
  const dot = /[\p{L}\p{N}]$/u.test(label);
  const total = items.reduce((n, g) => n + g.skills.filter((s) => s.trim()).length, 0);

  return (
    <section id="skills" className={`relative scroll-mt-24 ${SECTION_Y}`}>
      <div className={WRAP}>
        <ScrollReveal>
          <div className="relative grid grid-cols-1 gap-8 rounded-[32px] bg-lavender p-5 sm:p-7 md:gap-10 md:rounded-[44px] md:p-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:p-12 xl:p-14 3xl:p-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <IconTile icon={Zap} className="size-14 md:size-16 3xl:size-20" size={24} />
              <h2 className="display mt-6 break-words text-[clamp(40px,11vw,54px)] md:mt-8 md:text-[66px] lg:text-[60px] xl:text-[72px] 3xl:text-[96px]">
                {label}
                {dot && <span className="text-pop">.</span>}
              </h2>
              <p className="mt-4 max-w-[34ch] text-[16px] leading-relaxed text-onyx/70 md:text-[18px] 3xl:text-[21px]">
                {plural(total, "skill")} across {plural(items.length, "area")} — the craft behind the work.
              </p>
              {/* a teammate taking notes (laptop and up) */}
              <div aria-hidden className="relative mt-12 hidden lg:block">
                <AvatarTile src={AVATAR.fiona} tone="bg-tile-lemon" tilt={-6} float className="size-24 xl:size-28 3xl:size-36">
                  <Chatter
                    messages={["Teach me that! 🙌", "Ooh, prioritisation 🧠", "Taking notes ✍️"]}
                    offset={900}
                    className="-top-5 left-[45%]"
                  />
                </AvatarTile>
              </div>
            </div>

            <ul className="flex min-w-0 flex-col gap-3 md:gap-4">
              {items.map((g, i) => {
                const skills = g.skills.filter((s) => s.trim());
                return (
                  <li key={g.id}>
                    <ScrollReveal delay={Math.min(i * 0.05, 0.2)}>
                      <div className="rounded-[24px] border border-hairline bg-card p-4 shadow-pill sm:p-5 md:rounded-[28px] md:p-6 3xl:p-8">
                        <div className="flex items-center gap-3">
                          <span aria-hidden className={`size-3 shrink-0 rounded-full ring-4 ring-card ${tileAt(i)}`} />
                          <h3 className="min-w-0 flex-1 break-words text-[17px] font-bold tracking-[-0.02em] text-onyx md:text-[19px] 3xl:text-[23px]">
                            {g.category.trim() || "General"}
                          </h3>
                          <span className="shrink-0 rounded-full bg-well px-2.5 py-0.5 text-[12px] font-bold tabular-nums text-ash 3xl:text-[14px]">
                            {skills.length}
                          </span>
                        </div>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {skills.map((s, si) => (
                            <li
                              key={`${si}-${s}`}
                              className="max-w-full break-words rounded-full border border-hairline bg-well px-3.5 py-1.5 text-[13.5px] font-medium text-onyx/80 md:text-[14.5px] 3xl:px-4 3xl:py-2 3xl:text-[17px]"
                            >
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </ScrollReveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
