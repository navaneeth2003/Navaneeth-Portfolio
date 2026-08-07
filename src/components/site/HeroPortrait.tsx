"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { useMotionCtx } from "./motion/MotionProvider";

function DotGrid() {
  return (
    <svg
      aria-hidden
      className="absolute -top-4 -right-2 h-24 w-24 text-accent/40"
      viewBox="0 0 96 96"
      fill="currentColor"
    >
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={8 + c * 16} cy={8 + r * 16} r={2} />
        )),
      )}
    </svg>
  );
}

/**
 * Three depth layers: photo (1×), tan disc (deeper), dot grid (deepest).
 * They answer the mouse with a lerped translate and drift apart slightly on
 * scroll. Static on touch and under reduced motion.
 */
export function ParallaxPortrait({ name, photoUrl }: { name: string; photoUrl: string }) {
  const { ok, fine } = useMotionCtx();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useSpring(0, { stiffness: 60, damping: 18 });
  const my = useSpring(0, { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const discY = useTransform(scrollYProgress, [0, 1], [0, -26]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -52]);

  const interactive = ok && fine;

  function onMove(e: React.PointerEvent) {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const photoX = useTransform(mx, (v) => v * 6);
  const photoY = useTransform(my, (v) => v * 6);
  const discX = useTransform(mx, (v) => v * 10);
  const gridX = useTransform(mx, (v) => v * 14);
  const discMouseY = useTransform(my, (v) => v * 10);
  const gridMouseY = useTransform(my, (v) => v * 14);
  const discCombinedY = useTransform([discY, discMouseY], ([a, b]) => (a as number) + (b as number));
  const gridCombinedY = useTransform([gridY, gridMouseY], ([a, b]) => (a as number) + (b as number));

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="rise-in relative mx-auto w-56 sm:w-64 md:w-full md:max-w-xs"
      style={{ animationDelay: "0.45s" }}
    >
      <motion.div aria-hidden style={ok ? { x: gridX, y: gridCombinedY } : undefined}>
        <DotGrid />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-full bg-accent-soft"
        style={ok ? { x: discX, y: discCombinedY } : undefined}
      />
      <motion.div
        className="relative aspect-square overflow-hidden rounded-full border border-line bg-surface shadow-card"
        style={interactive ? { x: photoX, y: photoY } : undefined}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-accent-ink/40 select-none">
            {initials}
          </div>
        )}
      </motion.div>
    </div>
  );
}
