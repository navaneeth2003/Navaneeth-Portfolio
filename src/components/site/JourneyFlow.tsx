"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useIsMobile } from "@/components/ui";

/**
 * The journey line: one flowing path that enters from beyond the page edge at
 * the Experience heading, drifts down behind Experience and Projects, and
 * leaves through the Tools heading — a quiet thread from what he has done, to
 * what he has built, to what he builds with.
 *
 * Nothing here knows the current content. The overlay finds the sections it
 * links by id, in the order they appear on the page, and measures them
 * against <main>; it re-measures whenever any of them (or the page) changes
 * size and re-discovers the chain when sections mount, unmount or reorder.
 * Add an Experience entry or a Project and the route simply stretches. Hidden
 * sections drop out of the chain; a chain that doesn't end at Tools ends near
 * its last section's bottom edge instead of a heading.
 *
 * The geometry is a slow wave with vertical tangents at each turn — denser
 * behind Experience, sparser behind the opaque Project cards — drawn on
 * scroll via pathLength. It sits at z-1: above every section's backdrop and
 * below every section's content (z-2), so text always wins. Reduced motion
 * shows the finished line.
 */

const CHAIN = ["experience", "projects", "tools"] as const;
/** How much route each section spends per pixel: lower = the line drifts more slowly there. */
const DENSITY: Record<string, number> = { experience: 1, projects: 0.72, tools: 1 };
/** The ghost section title inside a section — the line enters and leaves through these. */
const HEADING = ".ghost-huge";

type Stop = { id: string; top: number; bottom: number; headTop: number; headBottom: number };
type Layout = { top: number; height: number; width: number; stops: Stop[] };
type Pt = { x: number; y: number };

export function JourneyFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  // Measure the linked sections against <main>, the overlay's positioned parent.
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    let frame = 0;
    const watched = new Set<Element>();
    const ro = new ResizeObserver(() => schedule());

    function measure() {
      frame = 0;
      const stops: Stop[] = [];
      for (const id of CHAIN) {
        const section = document.getElementById(id);
        if (!(section instanceof HTMLElement) || !host!.contains(section)) continue;
        const head = section.querySelector<HTMLElement>(HEADING) ?? section;
        const top = offsetWithin(section, host!);
        const headTop = head === section ? top : top + offsetWithin(head, section);
        stops.push({
          id,
          top,
          bottom: top + section.offsetHeight,
          headTop,
          headBottom: headTop + head.offsetHeight,
        });
        if (!watched.has(section)) {
          watched.add(section);
          ro.observe(section);
        }
      }
      stops.sort((a, b) => a.top - b.top);
      setLayout((prev) => {
        if (stops.length === 0) return prev === null ? prev : null;
        const first = stops[0];
        const last = stops[stops.length - 1];
        const endsAtHeading = stops.length > 1 && last.id === "tools";
        const top = first.top;
        const bottom = endsAtHeading
          ? last.headBottom + (last.headBottom - last.headTop) * 0.7
          : last.bottom;
        const next: Layout = {
          top,
          height: Math.max(0, Math.round(bottom - top)),
          width: host!.clientWidth,
          stops,
        };
        return sameLayout(prev, next) ? prev : next;
      });
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure);
    }

    schedule();
    ro.observe(host);
    // Sections mount, unmount and reorder as the studio's draft changes.
    const mo = new MutationObserver(schedule);
    mo.observe(host, { childList: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  // Scroll progress of the overlay itself: 0 when its top reaches 85% down the
  // viewport, 1 when its bottom reaches 60% — so the tip leads the reader a
  // little. Measured directly, so a re-layout is picked up on the next scroll.
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !layout) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.6;
      const span = start - end + r.height;
      raw.set(span > 0 ? Math.min(1, Math.max(0, (start - r.top) / span)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [layout, raw]);

  const d = layout ? journeyPath(layout, mobile) : "";
  const drawn = reduced ? 1 : progress;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-[1] overflow-hidden"
      style={{ top: layout?.top ?? 0, height: layout?.height ?? 0 }}
    >
      {layout && layout.height > 0 && (
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          width={layout.width}
          height={layout.height}
          className="block"
        >
          <defs>
            <linearGradient
              id="journey-flow"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2={layout.height}
            >
              <stop offset="0%" stopColor="#34ffb5" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ffb03a" />
            </linearGradient>
          </defs>
          {/* faint track — the whole route, before it is drawn */}
          <path d={d} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
          {/* soft halo */}
          <motion.path
            d={d}
            fill="none"
            stroke="url(#journey-flow)"
            strokeWidth={mobile ? 4.5 : 6}
            strokeLinecap="round"
            opacity={0.14}
            style={{ pathLength: drawn }}
          />
          {/* the line */}
          <motion.path
            d={d}
            fill="none"
            stroke="url(#journey-flow)"
            strokeWidth={mobile ? 1.2 : 1.5}
            strokeLinecap="round"
            opacity={mobile ? 0.38 : 0.58}
            style={{ pathLength: drawn }}
          />
        </svg>
      )}
    </div>
  );
}

/** Vertical offset of `el` inside `ancestor`, ignoring transforms (the Projects ghost title drifts). */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement): number {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor && node !== document.body) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

function sameLayout(a: Layout | null, b: Layout): boolean {
  if (!a || a.top !== b.top || a.height !== b.height || a.width !== b.width) return false;
  if (a.stops.length !== b.stops.length) return false;
  return a.stops.every((s, i) => {
    const t = b.stops[i];
    return (
      s.id === t.id &&
      s.top === t.top &&
      s.bottom === t.bottom &&
      s.headTop === t.headTop &&
      s.headBottom === t.headBottom
    );
  });
}

const fmt = (n: number) => n.toFixed(1);

/**
 * The route, in overlay coordinates.
 * Enters smoothly from outside the screen strictly below the Experience title,
 * follows a harmonious, soft-curved wave through Experience and Projects,
 * and leaves smoothly through the Tools heading.
 */
function journeyPath(l: Layout, mobile: boolean): string {
  const W = l.width;
  const stops = l.stops;
  const first = stops[0];
  const last = stops[stops.length - 1];
  const endsAtHeading = stops.length > 1 && last.id === "tools";
  const cx = W / 2;

  // On mobile devices: do NOT squeeze the wave into a narrow strip or force sharp angles.
  // Allow a wide, natural amplitude that flows gracefully across the screen,
  // drifting slightly off-screen and re-entering as a continuous harmonic sine wave.
  const amp = mobile ? Math.max(W * 0.54, 230) : Math.min(W * 0.36, 480);
  const halfWave = mobile ? 520 : 600;
  const local = (abs: number) => abs - l.top;
  const headH = (s: Stop) => s.headBottom - s.headTop;

  // Starts below Experience title, originating outside the screen on the left
  const entryY = local(first.headBottom) + (mobile ? 20 : 28);
  const entry: Pt = { x: -Math.max(W * 0.12, 72), y: entryY };

  const exit: Pt = endsAtHeading
    ? { x: W + Math.max(W * 0.12, 72), y: local(last.headBottom) + headH(last) * 0.25 }
    : { x: W + Math.max(W * 0.12, 72), y: local(last.bottom) - (mobile ? 48 : 96) };

  const waveBottom = endsAtHeading
    ? local(last.headTop) - headH(last) * 0.4
    : exit.y - 120;

  const totalHeight = Math.max(0, waveBottom - entryY);
  const pts: Pt[] = [entry];

  if (totalHeight >= 320) {
    const n = Math.max(2, Math.round(totalHeight / halfWave));
    const stepY = totalHeight / n;

    // Alternating wave turns (extrema with vertical tangents).
    // Because the line enters from the left (x < 0), the first crest is on the right (cx + amp),
    // smoothly reached over a full vertical step (stepY) with zero sharp turns or kinks.
    for (let i = 0; i < n; i++) {
      const isRightTurn = i % 2 === 0;
      const turnX = isRightTurn ? cx + amp : cx - amp;
      const turnY = entryY + (i + 1) * stepY;
      pts.push({ x: turnX, y: turnY });
    }
  }

  pts.push(exit);

  const lastIndex = pts.length - 1;
  let d = `M ${fmt(entry.x)} ${fmt(entry.y)}`;

  for (let i = 0; i < lastIndex; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    let cp0: Pt;
    let cp1: Pt;

    if (i === 0) {
      // Harmonic entrance: broad, gentle diagonal sweep from outside the screen
      // that curves smoothly into the vertical tangent of the first wave turn.
      cp0 = {
        x: p0.x + dx * 0.38,
        y: p0.y + dy * 0.28,
      };
      cp1 = {
        x: p1.x,
        y: p1.y - dy * 0.3642,
      };
    } else if (i + 1 === lastIndex) {
      // Harmonic exit: curves gracefully out off-screen to the right
      cp0 = {
        x: p0.x,
        y: p0.y + dy * 0.3642,
      };
      cp1 = {
        x: p1.x - Math.max(Math.abs(dx) * 0.36, 48),
        y: p1.y - dy * 0.16,
      };
    } else {
      // Harmonic sinusoidal curve between alternating turns (C1 smooth, natural flow)
      cp0 = {
        x: p0.x,
        y: p0.y + dy * 0.3642,
      };
      cp1 = {
        x: p1.x,
        y: p1.y - dy * 0.3642,
      };
    }

    d += ` C ${fmt(cp0.x)} ${fmt(cp0.y)}, ${fmt(cp1.x)} ${fmt(cp1.y)}, ${fmt(p1.x)} ${fmt(p1.y)}`;
  }

  return d;
}
