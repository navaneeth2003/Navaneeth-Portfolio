"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { firstName } from "@/lib/format";
import { CAST, OWNER_WAVE } from "@/lib/chatter";
import { TypingDots } from "./site/kit";
import { useReducedMotionSafe } from "./ui";

/** One member of the gathering huddle: their picture and tile colour. */
export type SplashMember = { src: string; tone: string };

const EASE = [0.16, 1, 0.3, 1] as const;
const TILTS = [-4, -9, 8, 6, -6];
/** Tile size by distance from the middle. */
const SIZE = [
  "size-[84px] md:size-[100px] 3xl:size-[124px]",
  "size-[62px] md:size-[76px] 3xl:size-[92px]",
  "size-[50px] md:size-[60px] 3xl:size-[74px]",
];
/** How long the gathering lasts before the room opens (ms). */
const HOLD = 1650;

/**
 * The first moment on the site: the team gathers. One by one his people pop
 * in and huddle round him, his bubble types out a "Hey! 👋", and his name
 * writes itself in underneath — "Gathering the team…", then "Everyone's
 * here". Then a window opens from his tile and grows until the site is
 * revealed behind it, where the same huddle is waiting in the hero.
 * Reduced motion: everything in place at once, then a quick fade.
 */
export function Preloader({ name, cast }: { name: string; cast: SplashMember[] }) {
  const reduced = useReducedMotionSafe();
  const [said, setSaid] = useState(false);
  const [done, setDone] = useState(false);
  const [hole, setHole] = useState({ x: "50%", y: "42%" });
  const ownerRef = useRef<HTMLSpanElement>(null);
  const first = firstName(name) || name.trim() || "Hello";
  const letters = Array.from(first);
  // Never an empty room: without a cast, he waits on his own.
  const members = cast.length ? cast.slice(0, 5) : [{ src: OWNER_WAVE, tone: CAST.owner.tone }];

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const t1 = window.setTimeout(() => {
      // the huddle has settled: the window will open from his tile
      const r = ownerRef.current?.getBoundingClientRect();
      if (r && r.width > 0) setHole({ x: `${Math.round(r.left + r.width / 2)}px`, y: `${Math.round(r.top + r.height / 2)}px` });
      setSaid(true);
    }, 950);
    const t2 = window.setTimeout(() => setDone(true), HOLD);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  const mask = "radial-gradient(circle at var(--cx) var(--cy), transparent var(--hole), #000 calc(var(--hole) + 1px))";

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden
          initial={{ "--hole": "0vmax" } as never}
          animate={{ "--hole": "0vmax" } as never}
          exit={reduced ? { opacity: 0 } : ({ "--hole": "150vmax" } as never)}
          transition={{ duration: reduced ? 0.3 : 0.95, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas px-6 text-onyx"
          style={
            {
              "--cx": hole.x,
              "--cy": hole.y,
              backgroundImage: "radial-gradient(70% 55% at 50% 0%, rgba(var(--glow), 0.9), rgba(var(--glow), 0) 70%)",
              maskImage: mask,
              WebkitMaskImage: mask,
            } as CSSProperties
          }
        >
          {/* the huddle, gathering */}
          <div className="relative flex items-end justify-center gap-2 pt-14 md:gap-3 md:pt-16">
            {members.map((m, k) => {
              const d = Math.min(2, Math.ceil(k / 2));
              const side = k === 0 ? 0 : k % 2 ? -1 : 1;
              return (
                <motion.span
                  key={k}
                  style={{ order: side * d }}
                  className={`relative ${k > 2 ? "hidden md:block" : "block"}`}
                  initial={reduced ? false : { opacity: 0, y: 28, scale: 0.55, rotate: side * 14 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1 + k * 0.08, type: "spring", stiffness: 280, damping: 17 }}
                >
                  <span
                    ref={k === 0 ? ownerRef : undefined}
                    className={`block overflow-hidden rounded-[30%] border-[4px] border-white shadow-float md:border-[5px] ${m.tone} ${SIZE[d]}`}
                    style={{ transform: `rotate(${TILTS[k] ?? 0}deg)` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.src} alt="" draggable={false} className="h-full w-full object-cover" />
                  </span>
                  {k === 0 && (
                    <motion.span
                      initial={reduced ? false : { opacity: 0, scale: 0.6, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.45, type: "spring", stiffness: 320, damping: 20 }}
                      className="absolute bottom-[calc(100%+12px)] left-1/2 inline-flex h-9 min-w-[60px] -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-full bg-onyx px-3.5 text-[14px] font-semibold text-on-onyx shadow-pill"
                    >
                      {said || reduced ? (
                        <motion.span initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                          Hey! 👋
                        </motion.span>
                      ) : (
                        <TypingDots />
                      )}
                      <span className="absolute -bottom-[5px] left-1/2 size-3 -translate-x-1/2 rotate-45 rounded-[3px] bg-onyx" />
                    </motion.span>
                  )}
                </motion.span>
              );
            })}
          </div>

          {/* his name, writing itself in */}
          <p className="display mt-8 flex max-w-full text-[clamp(40px,12vw,56px)] leading-none md:mt-10 md:text-[72px] 3xl:text-[96px]">
            {letters.map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="inline-block"
                  initial={reduced ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3 + i * 0.045, duration: 0.65, ease: EASE }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
            <motion.span
              className="inline-block text-pop"
              initial={reduced ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35 + letters.length * 0.045, type: "spring", stiffness: 420, damping: 14 }}
            >
              .
            </motion.span>
          </p>

          {/* what's happening */}
          <p className="mt-3 h-5 text-[14px] font-semibold text-ash md:text-[15px]">
            <motion.span
              key={said ? "here" : "gathering"}
              className="inline-block"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {said ? "Everyone's here ✨" : "Gathering the team…"}
            </motion.span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
