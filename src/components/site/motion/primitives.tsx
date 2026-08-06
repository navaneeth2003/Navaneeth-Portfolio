"use client";

import { motion, useSpring } from "motion/react";
import { useRef } from "react";
import { EASE, useMotionCtx } from "./MotionProvider";

export { EASE };

/** Section entrance workhorse: rise + fade, once, viewport-triggered. */
export function Rise({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * The shared heading beat: words rise through masks, then the gold period lands.
 * Screen readers get the plain text via aria-label; the animated spans are hidden.
 */
export function AnimatedHeading({
  text,
  className,
  ring = false,
}: {
  text: string;
  className?: string;
  ring?: boolean;
}) {
  const words = text.replace(/\.+$/, "").split(/\s+/).filter(Boolean);
  const dotDelay = Math.min(words.length, 10) * 0.05 + 0.3;
  return (
    <span className={className} role="text" aria-label={`${words.join(" ")}.`}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-top">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.55, ease: EASE, delay: Math.min(i, 10) * 0.05 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
      <span aria-hidden className="relative inline-block">
        <motion.span
          className="inline-block text-accent"
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.4, ease: EASE, delay: dotDelay }}
        >
          .
        </motion.span>
        {ring && (
          <motion.span
            className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/4 rounded-full border border-accent"
            initial={{ scale: 0.4, opacity: 0 }}
            whileInView={{ scale: 2.4, opacity: [0, 0.5, 0] }}
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.9, ease: "easeOut", delay: dotDelay + 0.15 }}
          />
        )}
      </span>
    </span>
  );
}

/**
 * Magnetic pull toward the cursor — reserved for the single CTA that matters.
 * Pointer-fine + motion-OK only; children render untouched otherwise.
 */
export function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ok, fine } = useMotionCtx();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });
  const active = ok && fine;

  function onMove(e: React.PointerEvent) {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(Math.max(-4, Math.min(4, dx * 0.12)));
    y.set(Math.max(-4, Math.min(4, dy * 0.12)));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={active ? { x, y } : undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
