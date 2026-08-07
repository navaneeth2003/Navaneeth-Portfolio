"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";

export const EASE = [0.2, 0.6, 0.2, 1] as const;

type MotionCtx = {
  /** Motion allowed (mounted and no reduced-motion preference). */
  ok: boolean;
  /** Precise pointer available (enables tilt, spotlight, magnetism, cursor). */
  fine: boolean;
};

const Ctx = createContext<MotionCtx>({ ok: false, fine: false });

export function useMotionCtx(): MotionCtx {
  return useContext(Ctx);
}

/**
 * The one place motion policy lives: reduced-motion detection, pointer class,
 * and the Lenis smooth-scroll lifecycle (desktop pointer-fine only).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MotionCtx>({ ok: false, fine: false });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setState({ ok: !reduce, fine });
    if (reduce || !fine) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease: EASE }}>
      <Ctx.Provider value={state}>{children}</Ctx.Provider>
    </MotionConfig>
  );
}
