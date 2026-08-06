"use client";

import type { About } from "@/lib/types";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { useMotionCtx } from "./motion/MotionProvider";
import { Rise } from "./motion/primitives";
import { SectionShell } from "./shared";

/**
 * Scroll-scrubbed read: each word of the lead paragraph inks in as it crosses
 * the reading band — reversible, tied to scroll position, never autoplaying.
 * Screen readers get the paragraph as one unbroken string.
 */
function ScrubParagraph({ text }: { text: string }) {
  const { ok } = useMotionCtx();
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/).filter(Boolean);
  const [litCount, setLitCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setLitCount(Math.round(p * words.length));
  });

  return (
    <p
      ref={ref}
      className="text-lg leading-relaxed font-medium tracking-tight text-pretty md:text-xl"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span
            key={i}
            className="transition-colors duration-150"
            style={{ color: !ok || i < litCount ? "var(--color-ink)" : "rgba(11, 13, 16, 0.22)" }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </p>
  );
}

export function AboutSection({ data }: { data: About }) {
  const paragraphs = data.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <SectionShell id="about" eyebrow="About" heading={data.heading}>
      <div className="max-w-3xl space-y-6">
        {paragraphs.map((p, i) =>
          i === 0 ? (
            <ScrubParagraph key={i} text={p} />
          ) : (
            <Rise key={i} delay={0.05 * i}>
              <p className="text-base leading-relaxed text-pretty text-ink-soft/85 md:text-lg">{p}</p>
            </Rise>
          ),
        )}
      </div>
    </SectionShell>
  );
}
