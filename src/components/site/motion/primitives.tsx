"use client";

import { animate, motion, useInView, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE, useMotionCtx } from "./MotionProvider";

export { EASE };

/**
 * Counts the numeric part of a value string ("12+", "58%") up from zero once
 * in view. The real string is always in the DOM for assistive tech; without a
 * numeric part (or under reduced motion) it simply renders static.
 */
export function CountValue({ value }: { value: string }) {
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
 * The in-view trigger lives on the (unclipped) heading itself and drives the
 * masked words via variants — a word translated out of its overflow-hidden mask
 * has a zero-size intersection rect, so it must never observe itself.
 * Screen readers get the plain text via aria-label.
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
    <motion.span
      className={className}
      role="text"
      aria-label={`${words.join(" ")}.`}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-top">
          <motion.span
            className="inline-block"
            variants={{
              hide: { y: "110%" },
              show: {
                y: "0%",
                transition: { duration: 0.55, ease: EASE, delay: Math.min(i, 10) * 0.05 },
              },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
      <span aria-hidden className="relative inline-block">
        <motion.span
          className="inline-block text-accent"
          variants={{
            hide: { scale: 0.4, opacity: 0 },
            show: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: EASE, delay: dotDelay } },
          }}
        >
          .
        </motion.span>
        {ring && (
          <motion.span
            className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/4 rounded-full border border-accent"
            variants={{
              hide: { scale: 0.4, opacity: 0 },
              show: {
                scale: 2.4,
                opacity: [0, 0.5, 0],
                transition: { duration: 0.9, ease: "easeOut", delay: dotDelay + 0.15 },
              },
            }}
          />
        )}
      </span>
    </motion.span>
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
