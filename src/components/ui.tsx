"use client";

import { motion, useInView } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- scrolling ---------- */

/**
 * Smooth-scroll the page to a y offset. The site's smooth-scroll engine
 * (LenisProvider) claims the request when it is running; otherwise — e.g.
 * for reduced motion — the browser scrolls natively.
 */
export function siteScrollTo(top: number) {
  const claimed = !window.dispatchEvent(new CustomEvent("site:scroll", { detail: { top }, cancelable: true }));
  if (!claimed) window.scrollTo({ top, behavior: "smooth" });
}

/** Freeze / release page scrolling (for sheets and dialogs). */
export function setPageScrollLocked(locked: boolean) {
  window.dispatchEvent(new CustomEvent(locked ? "site:lock" : "site:unlock"));
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/* ---------- viewport ---------- */

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeMobile(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Live result of a media query. Server-renders as false; settles right after hydration. */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * The visitor's reduced-motion preference, safe to branch markup on: false
 * during server rendering and hydration (so both agree), then the real
 * value. motion's own useReducedMotion reads it on the very first client
 * render, which can disagree with the server HTML and leave it stale.
 */
export function useReducedMotionSafe(): boolean {
  return useMedia("(prefers-reduced-motion: reduce)");
}

/** True below the md breakpoint. Server-renders as false; settles right after hydration. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

/**
 * The site's reveal choreography, per viewport. Desktop keeps the reference's
 * long blurred rise; phones get a shorter, quicker cut of the same move so
 * content lands sooner on a small screen and less of it animates mid-read.
 */
export function useReveal() {
  const mobile = useIsMobile();
  return mobile
    ? { y: 24, yBody: 22, blur: "blur(4px)", duration: 0.65, ease: EASE }
    : { y: 36, yBody: 32, blur: "blur(6px)", duration: 0.85, ease: EASE };
}

/* ---------- reveals ---------- */

export function ScrollReveal({
  children,
  delay = 0,
  distance,
  className,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const r = useReveal();
  const d = distance === undefined ? r.yBody : Math.min(distance, r.yBody);
  const hidden = { opacity: 0, y: d };
  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? { opacity: 1, y: 0 } : hidden}
      transition={{ duration: r.duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextReveal({
  children,
  as = "div",
  className,
  delay = 0,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "div" | "p";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const r = useReveal();
  const Tag = motion[as] as typeof motion.div;
  const hidden = { opacity: 0, y: r.y, filter: r.blur };
  return (
    <Tag
      ref={ref as never}
      initial={hidden}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : hidden}
      transition={{ duration: r.duration + 0.1, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/* ---------- buttons ---------- */

const BUTTON_SPRING = { type: "spring", stiffness: 520, damping: 32, mass: 0.7 } as const;

/**
 * The hero / CTA button. The anchor is the fixed hit area; only the inner
 * surface moves — a 2px lift on hover (mouse only), a light press on tap
 * (mouse and touch) — so the button never moves out from under the pointer
 * and jitters at its edge. Child motion elements can pick up the same
 * "rest" / "hover" / "tap" variants for icon nudges. Reduced motion makes
 * the transforms instant via the site-wide MotionConfig.
 */
export function MagneticButton({
  children,
  className,
  href,
  target,
  rounded = "rounded-full",
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rounded?: string;
}) {
  const isExternal = target === "_blank";
  return (
    <motion.a
      href={href}
      target={target}
      rel={isExternal ? "noreferrer" : undefined}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={`group inline-flex touch-manipulation ${rounded} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-onyx`}
    >
      <motion.span
        variants={{
          rest: { y: 0, scale: 1 },
          hover: { y: -2, scale: 1 },
          tap: { y: 0, scale: 0.97 },
        }}
        transition={BUTTON_SPRING}
        className={`inline-flex w-full ${rounded} ${className ?? ""}`}
      >
        {children}
      </motion.span>
    </motion.a>
  );
}

/** Icon nudge inside a MagneticButton — follows the button's hover state. */
export function ButtonIcon({
  children,
  hover,
  className,
}: {
  children: ReactNode;
  hover: { x?: number; y?: number };
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden
      variants={{ rest: { x: 0, y: 0 }, hover, tap: { x: 0, y: 0 } }}
      transition={BUTTON_SPRING}
      className={`inline-flex shrink-0 ${className ?? ""}`}
    >
      {children}
    </motion.span>
  );
}

/* ---------- buttons ---------- */

/** The black pill — the site's one primary action shape. */
export const BTN_BLACK =
  "min-h-[52px] items-center justify-center gap-2.5 bg-onyx px-6 text-[15px] font-semibold text-on-onyx shadow-cta transition-[filter] duration-300 group-hover:brightness-110 sm:min-h-[56px] sm:px-7 sm:text-[16px] 3xl:min-h-[64px] 3xl:px-9 3xl:text-[18px]";
/** The quiet partner: an off-white pill with a hairline. */
export const BTN_LIGHT =
  "min-h-[52px] items-center justify-center gap-2.5 border border-hairline bg-card px-6 text-[15px] font-semibold text-onyx shadow-pill transition-[filter] duration-300 group-hover:brightness-105 sm:min-h-[56px] sm:px-7 sm:text-[16px] 3xl:min-h-[64px] 3xl:px-9 3xl:text-[18px]";

/* ---------- decoration ---------- */

export function GridLines({ count = 6 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-4 md:grid-cols-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`border-l border-white/[0.08] last:border-r ${
              i > 3 ? "hidden md:block" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** The LinkedIn "in" mark (lucide dropped brand icons). Inherits currentColor. */
export function LinkedInIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
