"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { CAST, OWNER_WAVE } from "@/lib/chatter";
import { optimizableImage } from "@/lib/urls";
import { useReducedMotionSafe } from "@/components/ui";
import type { ChatterVoice } from "@/lib/types";

/**
 * The shared vocabulary of the "conversation" design: page width, pastel
 * tints, line-art avatar tiles, speech bubbles that chat on their own,
 * perched characters, eyebrow pills, icon tiles, the brand mark and section
 * headers. Sections compose these, so a new CMS item or section inherits
 * the whole look — and every colour follows the studio's theme.
 */

/** Page column per device tier — phone → tablet → laptop → desktop → large monitor. */
export const WRAP = "mx-auto w-full max-w-[1180px] px-4 sm:px-6 md:px-8 xl:max-w-[1240px] 2xl:max-w-[1320px] 3xl:max-w-[1600px]";
/** Vertical rhythm between sections, compressed on short laptop screens. */
export const SECTION_Y = "py-16 md:py-24 xl:py-28 lg:short:py-20 3xl:py-36";

/** Line-art cast paths (Notionists by Zoish, CC0 1.0 — see the SVG metadata). */
export const AVATAR = {
  ownerWave: OWNER_WAVE,
  owner: CAST.owner.src,
  ezra: CAST.ezra.src,
  gus: CAST.gus.src,
  iris: CAST.iris.src,
  rosa: CAST.rosa.src,
  hazel: CAST.hazel.src,
  fiona: CAST.fiona.src,
  maya: CAST.maya.src,
  uma: CAST.uma.src,
} as const;

/** Big-card tints, written out so Tailwind sees them. New items cycle through. */
export const TINTS = ["bg-lavender", "bg-butter", "bg-mint", "bg-blush", "bg-sky", "bg-peach"] as const;
/** Squircle tile colours — a step more saturated than the tints, the same in every theme. */
export const TILES = [
  "bg-tile-periwinkle",
  "bg-tile-lemon",
  "bg-tile-seafoam",
  "bg-tile-bubblegum",
  "bg-tile-orchid",
  "bg-tile-apricot",
] as const;

const wrapIndex = (i: number, n: number) => ((i % n) + n) % n;
export const tintAt = (i: number) => TINTS[wrapIndex(i, TINTS.length)];
export const tileAt = (i: number) => TILES[wrapIndex(i, TILES.length)];

/* ---------- small parts ---------- */

/**
 * A logo or icon from the CMS that steps aside for `fallback` (an initial, an
 * icon) when the file is missing or blocked — including a failure that
 * happened before React was listening (checked when it mounts). SVGs without
 * a set size report no natural width, so only real errors count for them.
 */
export function SafeImg({
  src,
  className = "",
  fallback,
  loading,
}: {
  src: string;
  className?: string;
  fallback: ReactNode;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading={loading}
      draggable={false}
      className={className}
      ref={(img) => {
        if (img?.complete && img.naturalWidth === 0 && img.naturalHeight === 0 && !/\.svg(\?|#|$)/i.test(src)) setFailed(true);
      }}
      onError={() => setFailed(true)}
    />
  );
}

/** The pill above a heading: a theme-coloured dot and a short label. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`inline-flex max-w-full items-center gap-2 rounded-full border border-hairline bg-card px-4 py-1.5 text-[13px] font-semibold text-ash shadow-pill md:text-[14px] 3xl:px-5 3xl:py-2 3xl:text-[16px] ${className}`}
    >
      <span aria-hidden className="size-2 shrink-0 rounded-full bg-pop 3xl:size-2.5" />
      <span className="min-w-0 truncate">{children}</span>
    </p>
  );
}

/** A rounded-square tile holding a line icon. */
export function IconTile({
  icon: Icon,
  className = "size-12",
  size = 20,
  tone = "bg-card",
}: {
  icon: LucideIcon;
  className?: string;
  size?: number;
  tone?: string;
}) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-[30%] border border-hairline text-onyx shadow-pill ${tone} ${className}`}
    >
      <Icon size={size} strokeWidth={1.9} />
    </span>
  );
}

/** Three dots that bob like someone is typing. */
export function TypingDots({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`inline-flex items-center gap-1 ${className}`}>
      {[0, 0.15, 0.3].map((d) => (
        <span key={d} className="size-1.5 animate-typing rounded-full bg-current" style={{ animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}

/**
 * A row of chips that swipes sideways on narrow screens instead of
 * wrapping. Soft fades on the edges say there is more (the left one only
 * once you have scrolled, the right one until you reach the end), and the
 * chosen chip glides to the middle when picked. A short row sits centred
 * and never scrolls. Chips mark the chosen one with aria-pressed="true".
 * Callers switch the scrolling off from tablets up with `md:` classes.
 */
export function ChipRail({
  label,
  active,
  children,
  className = "",
  scrollerClassName = "",
  trackClassName = "",
}: {
  label: string;
  /** The chosen chip's key — when it changes, that chip glides into view. */
  active: string;
  children: ReactNode;
  className?: string;
  scrollerClassName?: string;
  trackClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const start = el.scrollLeft <= 2;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    const chip = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!el || !chip || el.scrollWidth <= el.clientWidth + 2) return;
    el.scrollTo({
      left: chip.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        className={`no-scrollbar relative overflow-x-auto overscroll-x-contain [mask-image:linear-gradient(to_right,transparent,#000_var(--fade-l),#000_calc(100%_-_var(--fade-r)),transparent)] ${scrollerClassName}`}
        style={
          {
            "--fade-l": edges.start ? "0px" : "28px",
            "--fade-r": edges.end ? "0px" : "48px",
          } as CSSProperties
        }
      >
        <div role="group" aria-label={label} className={`mx-auto flex w-max ${trackClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- the brand ---------- */

/**
 * The owner's little portrait for the navigation bar and footer: the avatar
 * (or photo) set in the studio, else the illustrated one — a tilted pastel
 * squircle that straightens up when its link is hovered.
 */
export function OwnerAvatar({ src, className = "size-10", tilt = -6 }: { src?: string; className?: string; tilt?: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <span aria-hidden className={`relative inline-block shrink-0 ${className}`}>
      <span
        className="relative block h-full w-full overflow-hidden rounded-[32%] border-[2.5px] border-white bg-tile-lemon shadow-pill transition-[rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rotate-[var(--tilt)] group-hover:rotate-0 group-hover:scale-105"
        style={{ "--tilt": `${tilt}deg` } as CSSProperties}
      >
        {src && !failed ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="96px"
            unoptimized={!optimizableImage(src)}
            className="object-cover object-[50%_20%]"
            ref={(img) => {
              if (img?.complete && img.naturalWidth === 0) setFailed(true);
            }}
            onError={() => setFailed(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={CAST.owner.src} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </span>
    </span>
  );
}

/* ---------- conversation ---------- */

/**
 * The engine behind every chatting character: shows typing dots, then the
 * next line, on a loop; `beat` ticks each time a new line lands so the
 * speaker can react. `offset` staggers neighbours so they never speak in
 * unison. Reduced motion simply holds the first line.
 */
export function useChatter(messages: string[], offset = 0) {
  const reduced = useReducedMotionSafe();
  const [i, setI] = useState(0);
  const [typing, setTyping] = useState(false);
  const [beat, setBeat] = useState(0);
  const key = messages.join("␞");

  useEffect(() => {
    if (reduced || messages.length < 2) return;
    const timers: number[] = [];
    const tick = () => {
      setTyping(true);
      timers.push(
        window.setTimeout(() => {
          setI((v) => v + 1);
          setTyping(false);
          setBeat((b) => b + 1);
        }, 1100),
      );
    };
    timers.push(
      window.setTimeout(() => {
        tick();
        timers.push(window.setInterval(tick, 5200));
      }, 2600 + offset),
    );
    return () =>
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    // `key` stands in for the message list's contents
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, key, offset]);

  const text = messages.length ? messages[i % messages.length] : "";
  return {
    text,
    typing,
    beat,
    index: messages.length ? i % messages.length : 0,
  };
}

/** A speech-bubble pill. Upright even when its tile is tilted. */
export function Bubble({ children, className = "", tone = "dark" }: { children: ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={`pointer-events-none absolute z-10 inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold shadow-pill md:text-[13px] 3xl:px-4 3xl:py-2 3xl:text-[15px] ${
        tone === "dark" ? "bg-onyx text-on-onyx" : "border border-hairline bg-card text-onyx"
      } ${className}`}
    >
      {children}
    </span>
  );
}

/** What a bubble says right now: typing dots, or the current line, cross-faded. */
export function Line({ typing, text, index }: { typing: boolean; text: string; index: number }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {typing ? (
        <motion.span
          key="typing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inline-flex h-[1.25em] items-center px-1"
        >
          <TypingDots />
        </motion.span>
      ) : (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.22 }}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/** A bubble that keeps the conversation going on its own (no character attached). */
export function Chatter({
  messages,
  offset = 0,
  className = "",
  tone = "dark",
}: {
  messages: string[];
  offset?: number;
  className?: string;
  tone?: "dark" | "light";
}) {
  const { text, typing, index } = useChatter(messages, offset);
  return (
    <Bubble className={className} tone={tone}>
      <Line typing={typing} text={text} index={index} />
    </Bubble>
  );
}

/**
 * The signature avatar tile: a rotated pastel squircle with a thick white
 * border and a soft drop shadow, holding a line-art avatar or a real photo.
 * Children (bubbles, badges) are positioned against the upright wrapper.
 */
export function AvatarTile({
  src,
  alt = "",
  tone = "bg-tile-periwinkle",
  tilt = 0,
  className = "size-24",
  border = "border-[5px]",
  photo = false,
  priority = false,
  sizes = "160px",
  float = false,
  delay = 0,
  fallbackSrc = CAST.owner.src,
  children,
}: {
  src: string;
  alt?: string;
  tone?: string;
  tilt?: number;
  className?: string;
  border?: string;
  photo?: boolean;
  priority?: boolean;
  sizes?: string;
  float?: boolean;
  delay?: number;
  /** Shown if a photo fails to load (a 404, a blocked host). */
  fallbackSrc?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const style: CSSProperties | undefined = float ? { animationDelay: `${delay}s` } : undefined;
  return (
    <span className={`relative inline-block shrink-0 ${float ? "animate-float" : ""} ${className}`} style={style}>
      <span
        className={`relative block h-full w-full overflow-hidden rounded-[30%] border-white shadow-float ${border} ${tone}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {photo && !failed ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            unoptimized={!optimizableImage(src)}
            className="object-cover object-[50%_20%]"
            ref={(img) => {
              if (img?.complete && img.naturalWidth === 0) setFailed(true);
            }}
            onError={() => setFailed(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={failed ? fallbackSrc : src} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        )}
      </span>
      {children}
    </span>
  );
}

/** The little white circle in a tile's corner. */
export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute -bottom-1.5 -right-1.5 z-10 grid size-8 place-items-center rounded-full border border-hairline bg-card text-[15px] shadow-pill md:size-9 md:text-[16px] 3xl:size-11 3xl:text-[19px] ${className}`}
    >
      {children}
    </span>
  );
}

/* ---------- perched voices ---------- */

/**
 * Whose turn it is to talk: a shared clock for a group of `count` voices.
 * Phones use it so one bubble speaks at a time — there's no room for a
 * whole crowd talking at once on a narrow screen.
 */
export function useTurns(count: number, period = 3400): number {
  const reduced = useReducedMotionSafe();
  const [turn, setTurn] = useState(0);
  useEffect(() => {
    if (reduced || count < 2) return;
    const id = window.setInterval(() => setTurn((t) => t + 1), period);
    return () => window.clearInterval(id);
  }, [reduced, count, period]);
  return count > 0 ? turn % count : 0;
}

/** What a conducted voice shows right now. */
export type VoiceState = {
  visible: boolean;
  typing: boolean;
  text: string;
  index: number;
  beat: number;
  /** Ticks when a new turn starts, so the bubble opens on typing dots rather than the last line. */
  turn: number;
};

/**
 * A conversation for a group of `count` voices: one speaks at a time —
 * typing dots, then their next line — and hands over to the next. `said`
 * counts each voice's lines so far (their next line, and their hop).
 * `nudge(k)` lets someone jump the queue (the pointer reached them). It
 * pauses while `active` is false (off screen); reduced motion holds the
 * first voice's first line.
 */
export function useConversation(
  count: number,
  { start = 1200, typing = 950, hold = 2700, active = true }: { start?: number; typing?: number; hold?: number; active?: boolean } = {},
) {
  const reduced = useReducedMotionSafe();
  const [talk, setTalk] = useState<{
    speaker: number;
    typing: boolean;
    said: number[];
  }>({ speaker: -1, typing: false, said: [] });
  const speakRef = useRef<(k: number, quick?: boolean) => void>(() => {});

  useEffect(() => {
    if (reduced || count < 1 || !active) return;
    let timer = 0;
    const speak = (k: number, quick = false) => {
      window.clearTimeout(timer);
      setTalk((t) => ({ ...t, speaker: k, typing: true }));
      timer = window.setTimeout(
        () => {
          setTalk((t) => {
            const said = t.said.slice();
            said[k] = (said[k] ?? 0) + 1;
            return { speaker: k, typing: false, said };
          });
          timer = window.setTimeout(() => speak((k + 1) % count), hold);
        },
        quick ? 380 : typing,
      );
    };
    speakRef.current = speak;
    timer = window.setTimeout(() => speak(0), start);
    return () => {
      window.clearTimeout(timer);
      speakRef.current = () => {};
      setTalk((t) => ({ ...t, speaker: -1, typing: false }));
    };
  }, [reduced, count, active, start, typing, hold]);

  if (reduced) return { speaker: 0, typing: false, said: [1], nudge: () => {} };
  return {
    ...talk,
    nudge: (k: number) => {
      if (k !== talk.speaker) speakRef.current(k, true);
    },
  };
}

/** A voice's state inside a conversation: visible while it's their turn, holding their latest line. */
export function voiceState(talk: { speaker: number; typing: boolean; said: number[] }, k: number, lines: string[]): VoiceState {
  const said = talk.said[k] ?? 0;
  const at = lines.length ? (Math.max(said, 1) - 1) % lines.length : 0;
  const typing = talk.speaker === k && talk.typing;
  return {
    visible: talk.speaker === k && lines.length > 0,
    typing,
    text: lines[at] ?? "",
    index: at,
    beat: said,
    turn: said + (typing ? 1 : 0),
  };
}

export type BubbleSide = "start" | "center" | "end";
export type BubbleAlign = {
  base: BubbleSide;
  md?: BubbleSide;
  x3?: BubbleSide;
};

/* Literal class maps (Tailwind needs to see every class written out). */
const BOX: Record<BubbleSide, { base: string; md: string; x3: string }> = {
  center: {
    base: "left-1/2 right-auto -translate-x-1/2",
    md: "md:left-1/2 md:right-auto md:-translate-x-1/2",
    x3: "3xl:left-1/2 3xl:right-auto 3xl:-translate-x-1/2",
  },
  start: {
    base: "-left-3 right-auto translate-x-0",
    md: "md:-left-3 md:right-auto md:translate-x-0",
    x3: "3xl:-left-3 3xl:right-auto 3xl:translate-x-0",
  },
  end: {
    base: "-right-3 left-auto translate-x-0",
    md: "md:-right-3 md:left-auto md:translate-x-0",
    x3: "3xl:-right-3 3xl:left-auto 3xl:translate-x-0",
  },
};
const TAIL: Record<BubbleSide, { base: string; md: string; x3: string }> = {
  center: {
    base: "left-1/2 right-auto -translate-x-1/2",
    md: "md:left-1/2 md:right-auto md:-translate-x-1/2",
    x3: "3xl:left-1/2 3xl:right-auto 3xl:-translate-x-1/2",
  },
  start: {
    base: "left-6 right-auto translate-x-0",
    md: "md:left-6 md:right-auto md:translate-x-0",
    x3: "3xl:left-8 3xl:right-auto 3xl:translate-x-0",
  },
  end: {
    base: "right-6 left-auto translate-x-0",
    md: "md:right-6 md:left-auto md:translate-x-0",
    x3: "3xl:right-8 3xl:left-auto 3xl:translate-x-0",
  },
};
function sideClasses(map: typeof BOX, a: BubbleAlign) {
  return [map[a.base].base, a.md ? map[a.md].md : "", a.x3 ? map[a.x3].x3 : ""].join(" ");
}

/**
 * A character from the crowd: their tile, a speech bubble with a tail that
 * cycles through their lines, and their badge. They sway gently on their
 * feet and hop each time they say something new. Decorative — the lines
 * are flavour, so the whole thing is hidden from assistive tech.
 *
 * From tablets up every bubble is on screen at once, so a crowd sets
 * `--bubble-max` to the width of each speaker's lane: a long line wraps
 * inside its lane instead of running into the neighbour's bubble.
 */
export function Voice({
  voice,
  ownerPhoto,
  ownerSrc,
  size,
  tilt = 0,
  offset = 0,
  align = { base: "center" },
  sway = true,
  className = "",
  border = "border-[4px] md:border-[5px] 3xl:border-[6px]",
  priority = false,
  phoneQuiet = false,
  state,
  inline = false,
  onNudge,
}: {
  voice: ChatterVoice;
  ownerPhoto?: string;
  ownerSrc?: string;
  size: string;
  tilt?: number;
  offset?: number;
  align?: BubbleAlign;
  sway?: boolean;
  className?: string;
  border?: string;
  priority?: boolean;
  /** On phones, hold this voice's bubble back while someone else is talking. */
  phoneQuiet?: boolean;
  /** Driven from outside (a `useConversation`): who talks, and when, on every screen. */
  state?: VoiceState;
  /** Stand in the flow of a row instead of being placed absolutely. */
  inline?: boolean;
  /** The pointer reached this character — ask them to say something. */
  onNudge?: () => void;
}) {
  const own = useChatter(state ? [] : voice.lines, offset);
  const { text, typing, beat, index } = state ?? own;
  const [scope, animate] = useAnimate();
  const reduced = useReducedMotionSafe();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced || !scope.current) return;
    animate(scope.current, { y: [0, -12, 0] }, { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] });
  }, [beat, reduced, animate, scope]);

  const isOwner = voice.avatar === "owner";
  const cast = CAST[voice.avatar] ?? CAST.gus;
  const src = isOwner ? ownerPhoto || ownerSrc || cast.src : cast.src;
  const photo = isOwner && Boolean(ownerPhoto);

  return (
    <span aria-hidden className={`pointer-events-none ${inline ? "relative block" : "absolute"} text-[16px] leading-normal ${className}`}>
      <span ref={scope} className="relative block">
        <span
          onPointerEnter={onNudge}
          className={`block origin-bottom ${sway ? "animate-sway" : ""} ${onNudge ? "pointer-events-auto" : ""}`}
          style={{
            animationDelay: `${-(offset % 6000) / 1000}s`,
            animationDuration: `${5.5 + (offset % 3000) / 1000}s`,
          }}
        >
          <AvatarTile
            src={src}
            photo={photo}
            fallbackSrc={ownerSrc || cast.src}
            priority={priority}
            sizes="180px"
            tone={cast.tone}
            tilt={tilt}
            border={border}
            className={size}
          >
            {voice.badge && <Badge>{voice.badge}</Badge>}
          </AvatarTile>
        </span>
        {voice.lines.length > 0 && (
          <span
            className={`absolute bottom-[calc(100%+12px)] z-10 inline-flex w-max max-w-[min(62vw,240px)] origin-bottom items-center rounded-[16px] bg-onyx px-3 py-1.5 text-[12px] font-semibold leading-snug text-on-onyx shadow-pill transition-[opacity,scale] duration-300 md:max-w-[var(--bubble-max,320px)] md:rounded-[18px] md:text-balance md:text-center md:text-[13px] 3xl:bottom-[calc(100%+16px)] 3xl:rounded-[20px] 3xl:px-4 3xl:py-2 3xl:text-[15px] ${
              state
                ? state.visible
                  ? "scale-100 opacity-100"
                  : "scale-75 opacity-0"
                : `${phoneQuiet ? "scale-90 opacity-0" : "scale-100 opacity-100"} md:scale-100 md:opacity-100`
            } ${sideClasses(BOX, align)}`}
          >
            <Line key={state?.turn} typing={typing} text={text} index={index} />
            <span className={`absolute -bottom-[5px] size-3 rotate-45 rounded-[3px] bg-onyx ${sideClasses(TAIL, align)}`} />
          </span>
        )}
      </span>
    </span>
  );
}

/* ---------- section header ---------- */

/**
 * Eyebrow pill + huge heading + optional sub line. The heading is the
 * section label the owner sets in the CMS; eyebrows and subs are derived
 * from the section's own data, so they stay true as content changes.
 */
export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "center",
  className = "",
  size = "lg",
}: {
  eyebrow?: ReactNode;
  title: string;
  sub?: ReactNode;
  align?: "center" | "left";
  className?: string;
  size?: "lg" | "md";
}) {
  const text = title.trim();
  // A full stop in the accent colour — unless the label already ends in punctuation.
  const dot = /[\p{L}\p{N}]$/u.test(text);
  return (
    <div className={`flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {text && (
        <h2
          className={`display max-w-full break-words ${eyebrow ? "mt-5 md:mt-6" : ""} ${
            size === "lg"
              ? "text-[clamp(40px,11vw,54px)] md:text-[68px] lg:text-[76px] lg:short:text-[64px] 3xl:text-[104px]"
              : "text-[clamp(34px,9vw,44px)] md:text-[54px] lg:text-[60px] 3xl:text-[80px]"
          }`}
        >
          {text}
          {dot && <span className="text-pop">.</span>}
        </h2>
      )}
      {sub && (
        <p
          className={`mt-4 max-w-[58ch] text-pretty text-[16px] leading-relaxed text-ash md:mt-5 md:text-[18px] 3xl:text-[21px] ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
