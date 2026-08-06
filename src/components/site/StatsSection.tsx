"use client";

import type { StatItem } from "@/lib/types";
import { BadgeCheck } from "lucide-react";
import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { useMotionCtx } from "./motion/MotionProvider";
import { Rise } from "./motion/primitives";
import { RatioImage } from "./shared";

const COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3 lg:grid-cols-6",
};

/** Counts the numeric part of "12+" up from zero once in view; static otherwise. */
function StatValue({ value }: { value: string }) {
  const { ok } = useMotionCtx();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const started = useRef(false);
  const match = value.match(/^(\D*?)(\d+)(.*)$/);

  useEffect(() => {
    if (!ok || !inView || !match || started.current || !ref.current) return;
    started.current = true;
    const [, prefix, num, suffix] = match;
    const target = parseInt(num, 10);
    const controls = animate(0, target, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${Math.round(v)}`;
      },
      onComplete: () => {
        if (ref.current) ref.current.textContent = `${prefix}${target}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [ok, inView, match]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden>
        {value}
      </span>
    </>
  );
}

export function StatsSection({ items }: { items: StatItem[] }) {
  const cols = COLS[Math.min(items.length, 6)] ?? COLS[4];

  return (
    <section id="stats" className="scroll-mt-24 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl py-6">
        <Rise>
          <div className="card overflow-hidden !p-0">
            <div className={`grid grid-cols-2 gap-px bg-line ${cols}`}>
              {items.map((item, i) => (
                <Rise
                  key={item.id}
                  delay={0.08 * i}
                  y={10}
                  className="flex flex-col items-center justify-center gap-1.5 bg-surface px-4 py-8 text-center"
                >
                  <div className="flex h-10 items-center justify-center">
                    {item.value ? (
                      <span className="text-3xl font-bold tracking-tight md:text-4xl">
                        <StatValue value={item.value} />
                      </span>
                    ) : item.icon?.url ? (
                      <RatioImage
                        image={item.icon}
                        alt=""
                        className="h-9 w-9 rounded-lg"
                        fallbackText={item.label}
                      />
                    ) : (
                      <BadgeCheck className="h-8 w-8 text-accent" strokeWidth={2} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-muted">{item.label}</span>
                </Rise>
              ))}
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
