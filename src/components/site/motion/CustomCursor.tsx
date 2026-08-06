"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMotionCtx } from "./MotionProvider";

type Mode = "default" | "link" | "text";

/**
 * Context-aware cursor: a small ink dot with a trailing gold ring. The ring
 * expands over interactive elements; over text fields the native cursor comes
 * back. Pointer-fine + motion-OK only; never rendered on touch or reduced motion.
 */
export function CustomCursor() {
  const { ok, fine } = useMotionCtx();
  const enabled = ok && fine;
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      if (t.closest("input, textarea, select")) setMode("text");
      else if (t.closest("a, button, [role='button'], summary, label")) setMode("link");
      else setMode("default");
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const shown = visible && mode !== "text";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <motion.span
        className="absolute top-0 left-0 h-7 w-7 rounded-full border border-accent/70"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: pressed ? 0.85 : mode === "link" ? 1.55 : 1,
          opacity: shown ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-ink"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: mode === "link" ? 0.6 : 1, opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
