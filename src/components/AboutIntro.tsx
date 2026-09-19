"use client";

import type { About } from "@/lib/types";
import { paragraphs } from "@/lib/format";
import { GridLines, ScrollReveal, TextReveal } from "./ui";

/** The About section: the statement composition that follows the hero. */
export function AboutIntro({ data }: { data: About }) {
  const paras = paragraphs(data.body);
  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-hidden bg-transparent px-5 pb-24 pt-14 sm:px-6 md:px-12 md:pb-44 md:pt-24"
    >
      <GridLines />
      {/* bottom melt — ambient hero glow smoothly transitions into the palette dark base.
          Melts via the palette's subtle melt-tint into var(--color-bg) so the seam between
          About and Stats disappears into a smooth continuous background across all palettes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-[var(--color-melt-tint)]/60 to-[var(--color-bg)] md:h-80"
      />
      <div className="relative z-[2] mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-6 md:gap-10 lg:grid-cols-2 lg:gap-16">
        <TextReveal
          as="h2"
          className="text-balance font-heading text-[clamp(28px,7.5vw,36px)] font-semibold leading-[1.12] tracking-tight text-white sm:text-[36px] md:text-[60px]"
        >
          {data.heading}
        </TextReveal>
        <ScrollReveal delay={0.15} className="min-w-0">
          <div className="max-w-[62ch] space-y-5 font-heading text-[15px] font-light leading-[1.7] text-white/85 sm:text-[16px] md:text-[19px]">
            {paras.map((p, i) => (
              <p key={i} className="break-words">
                {p}
              </p>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
