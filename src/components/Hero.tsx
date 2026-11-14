"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, FileText, Plus } from "lucide-react";
import type { ChatterVoice, ContactInfo, Hero as HeroContent } from "@/lib/types";
import { firstName } from "@/lib/format";
import { OWNER_WAVE } from "@/lib/chatter";
import { BTN_BLACK, BTN_LIGHT, ButtonIcon, MagneticButton, useMedia, useReducedMotionSafe } from "./ui";
import { LogoStrip, type StripItem } from "./LogoStrip";
import { Eyebrow, Line, Voice, useConversation, voiceState, type VoiceState } from "./site/kit";

const EASE = [0.16, 1, 0.3, 1] as const;

/** How many of the team stand in the huddle per device tier. */
const SHOW = { base: 3, md: 5, x3: 7 };
const TILTS = [-4, -8, 7, 6, -6, 5, -5];

/** Tile size by distance from the middle (0 = whoever stands centre stage). */
const SIZE = [
  "size-[92px] sm:size-[104px] md:size-[120px] lg:size-[124px] xl:size-[136px] lg:short:size-[104px] 2xl:size-[144px] 3xl:size-[168px]",
  "size-[70px] sm:size-[78px] md:size-[92px] lg:size-[96px] xl:size-[104px] lg:short:size-[82px] 2xl:size-[110px] 3xl:size-[130px]",
  "size-[60px] md:size-[76px] lg:size-[80px] xl:size-[86px] lg:short:size-[68px] 2xl:size-[92px] 3xl:size-[108px]",
  "size-[60px] 3xl:size-[90px]",
];
/** How far each ring leans toward the pointer (the middle most). */
const DEPTH = [1, 0.7, 0.45, 0.3];
/** Anyone not standing in the huddle on this screen size stays quiet. */
const SILENT: VoiceState = { visible: false, typing: false, text: "", index: 0, beat: 0, turn: 0 };
/** What the empty seat at the end of the huddle says, in turn with the team. */
const SEAT_LINES = ["Your turn? 👀", "Room for one more", "Pull up a chair 🪑"];

/**
 * The visitor's seat: an empty, dashed spot at the end of the huddle with a
 * "+ You?". It takes its turn in the conversation like everyone else, speaks
 * up when pointed at, and opens the way to the contact section. It stands
 * just outside the row, so the huddle stays centred on him. Hidden on the
 * narrowest phones, where the trio already fills the width.
 */
function Seat({
  state,
  onNudge,
  intro,
  mx,
  my,
}: {
  state: VoiceState;
  onNudge: () => void;
  intro: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const reduced = useReducedMotionSafe();
  return (
    <motion.a
      href="#contact"
      tabIndex={-1}
      aria-hidden
      onPointerEnter={onNudge}
      initial={reduced ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: intro + 0.6, type: "spring", stiffness: 230, damping: 19 }}
      className={`group absolute bottom-0 left-full ml-3 hidden sm:block md:ml-3.5 xl:ml-4 3xl:ml-5 ${state.visible ? "z-20" : "z-0"}`}
    >
      <Lean mx={mx} my={my} depth={DEPTH[3]}>
        <span className="relative block">
          <span className="grid size-[70px] rotate-6 place-items-center rounded-[30%] border-2 border-dashed border-onyx/25 bg-card/40 backdrop-blur-sm transition-[rotate,border-color,background-color] duration-300 group-hover:rotate-0 group-hover:border-onyx/45 group-hover:bg-card/85 md:size-[76px] lg:size-[80px] xl:size-[86px] lg:short:size-[68px] 2xl:size-[92px] 3xl:size-[90px]">
            <span className="flex flex-col items-center gap-0.5 text-onyx/45 transition-colors duration-300 group-hover:text-onyx/75">
              <Plus className="size-5 transition-transform duration-300 group-hover:rotate-90 xl:size-6" strokeWidth={2.4} />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] xl:text-[11px]">You?</span>
            </span>
          </span>
          <span
            className={`absolute -right-3 bottom-[calc(100%+12px)] z-10 inline-flex w-max max-w-[220px] origin-bottom-right items-center rounded-[18px] bg-onyx px-3 py-1.5 text-[12px] font-semibold leading-snug text-on-onyx shadow-pill transition-[opacity,scale] duration-300 md:text-[13px] 3xl:bottom-[calc(100%+16px)] 3xl:px-4 3xl:py-2 3xl:text-[15px] ${
              state.visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <Line key={state.turn} typing={state.typing} text={state.text} index={state.index} />
            <span className="absolute -bottom-[5px] right-6 size-3 rotate-45 rounded-[3px] bg-onyx" />
          </span>
        </span>
      </Lean>
    </motion.a>
  );
}

/** Visibility per tier, written out so Tailwind sees every class. */
function visibility(k: number, total: number): string {
  const base = Math.min(SHOW.base, total);
  const md = Math.min(SHOW.md, total);
  const x3 = Math.min(SHOW.x3, total);
  return [k < base ? "block" : "hidden", k < md ? "md:block" : "md:hidden", k < x3 ? "3xl:block" : "3xl:hidden"].join(" ");
}

/** A character leaning gently toward the pointer. */
function Lean({ mx, my, depth, children }: { mx: MotionValue<number>; my: MotionValue<number>; depth: number; children: ReactNode }) {
  const x = useTransform(mx, (v) => v * depth * 12);
  const y = useTransform(my, (v) => v * depth * 6);
  return <motion.div style={{ x, y }}>{children}</motion.div>;
}

/**
 * The huddle: the team standing together, shoulder to shoulder, the first
 * voice (by default, him) in the middle. One of them talks at a time —
 * typing dots, a line, then the next person — so the hero stays calm while
 * the chatter never stops. Point at someone and they speak up. Phones keep
 * three, tablets and laptops five, large monitors all seven
 * (Studio → Team chatter decides who and what they say).
 */
function Huddle({
  voices,
  ownerPhoto,
  intro,
  mx,
  my,
}: {
  voices: ChatterVoice[];
  ownerPhoto?: string;
  intro: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const reduced = useReducedMotionSafe();
  const md = useMedia("(min-width: 48rem)");
  const x3 = useMedia("(min-width: 120rem)");
  const total = voices.length;
  const shown = Math.min(total, x3 ? SHOW.x3 : md ? SHOW.md : SHOW.base);

  // Talk only while the hero is on screen.
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The visitor's seat joins the conversation as its last speaker (from sm up).
  const seat = useMedia("(min-width: 40rem)") && total > 0;
  const talk = useConversation(shown + (seat ? 1 : 0), { start: (intro + 1.05) * 1000, active: onScreen });

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative flex items-end justify-center gap-2.5 pt-[60px] sm:gap-3 md:gap-3.5 md:pt-[68px] xl:gap-4 3xl:gap-5 3xl:pt-[84px]"
      style={{ "--bubble-max": "280px" } as CSSProperties}
    >
      {/* the floor they stand on */}
      <span
        className="pointer-events-none absolute -bottom-2.5 left-1/2 h-6 w-[78%] -translate-x-1/2 rounded-[50%] blur-lg"
        style={{ background: "rgb(var(--shade) / calc(0.12 * var(--shade-k)))" }}
      />
      {voices.map((v, k) => {
        const d = Math.min(3, Math.ceil(k / 2));
        const side = k === 0 ? 0 : k % 2 ? -1 : 1;
        const speaking = talk.speaker === k;
        return (
          <motion.div
            key={`${v.id}-${v.avatar}-${v.lines.join("|")}`}
            className={`relative ${visibility(k, total)} ${speaking ? "z-20" : "z-0"}`}
            style={{ order: side * d }}
            initial={reduced ? false : { opacity: 0, scale: 0.55, x: -side * (34 + d * 30) }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: intro + 0.1 + d * 0.12, type: "spring", stiffness: 230, damping: 19 }}
          >
            <Lean mx={mx} my={my} depth={DEPTH[d]}>
              <Voice
                inline
                voice={v}
                ownerPhoto={ownerPhoto}
                ownerSrc={OWNER_WAVE}
                priority={k === 0}
                tilt={TILTS[k % TILTS.length]}
                offset={k * 900}
                size={SIZE[d]}
                state={k < shown ? voiceState(talk, k, v.lines) : SILENT}
                onNudge={k < shown ? () => talk.nudge(k) : undefined}
                align={{ base: side < 0 ? "start" : side > 0 ? "end" : "center", md: "center" }}
              />
            </Lean>
          </motion.div>
        );
      })}
      {total > 0 && (
        <Seat state={voiceState(talk, shown, SEAT_LINES)} onNudge={() => talk.nudge(shown)} intro={intro} mx={mx} my={my} />
      )}
    </div>
  );
}

/**
 * The hero, centred and calm: the team huddled together up top, then where
 * he works now, the greeting, the tagline, the bio and two calls to action —
 * "Let's talk", and his resume as soon as the CMS has one (else his work).
 * The companies he has worked with close it. Every word comes from the CMS.
 */
export function Hero({
  hero,
  contact,
  strip = [],
  nowAt,
  workHref,
  voices,
  talk = true,
  intro = 0,
}: {
  hero: HeroContent;
  contact: ContactInfo;
  strip?: StripItem[];
  /** The current employer, from an Experience entry that runs to "present". */
  nowAt?: string | null;
  /** Where "See my work" points — the projects section when it is shown. */
  workHref?: string | null;
  voices: ChatterVoice[];
  /** Whether there is a contact section to talk through ("Let's talk"). */
  talk?: boolean;
  /** Seconds to hold the entrance (while the preloader lifts). */
  intro?: number;
}) {
  const name = hero.name.trim();
  const first = firstName(name);
  const bio = hero.shortBio.trim();
  const resume = contact.resumeUrl?.trim() || null;
  const tagline = hero.tagline.trim();
  const reduced = useReducedMotionSafe();
  const fine = useMedia("(pointer: fine)");

  // The pointer, as -1…1 across the hero, eased — the huddle leans toward it.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 60, damping: 18 });
  const my = useSpring(py, { stiffness: 60, damping: 18 });
  const lean = fine && !reduced;

  // The calls to action: "Let's talk" when there is a contact section, then the
  // resume as soon as the CMS has one (else the work) — at most two, best first.
  const actions: { kind: "talk" | "resume" | "work"; href: string; label: string }[] = [];
  if (talk) actions.push({ kind: "talk", href: "#contact", label: "Let's talk" });
  if (resume) actions.push({ kind: "resume", href: resume, label: "View resume" });
  if (workHref && actions.length < 2 && !(talk && resume)) actions.push({ kind: "work", href: workHref, label: "See my work" });

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: intro + delay, duration: 0.9, ease: EASE },
  });

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
      onPointerMove={
        lean
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              px.set(((e.clientX - r.left) / r.width) * 2 - 1);
              py.set(((e.clientY - r.top) / r.height) * 2 - 1);
            }
          : undefined
      }
      onPointerLeave={
        lean
          ? () => {
              px.set(0);
              py.set(0);
            }
          : undefined
      }
    >
      {/* light from the top — the theme's glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(110% 72% at 50% -12%, rgba(var(--glow), 0.95) 0%, rgba(var(--glow), 0.5) 36%, rgba(var(--glow), 0) 72%)",
        }}
      />

      <div className="@container mx-auto flex min-h-[100svh] w-full max-w-[1180px] flex-col items-center justify-center px-5 pb-12 pt-24 text-center sm:px-8 md:pb-16 md:pt-32 lg:pt-28 lg:short:pb-8 lg:short:pt-[88px] xl:max-w-[1240px] 3xl:max-w-[1600px] 3xl:pb-12 3xl:pt-28">
        {voices.length > 0 && <Huddle voices={voices} ownerPhoto={hero.photo.url || undefined} intro={intro} mx={mx} my={my} />}

        {nowAt && (
          <motion.div {...rise(0.3)} className="mt-7 md:mt-8 lg:short:mt-6 3xl:mt-9">
            <Eyebrow>Currently at {nowAt}</Eyebrow>
          </motion.div>
        )}

        <motion.h1
          {...rise(0.38)}
          className={`display max-w-full text-[clamp(44px,12.4vw,58px)] sm:text-[68px] md:text-[80px] lg:text-[76px] lg:short:text-[60px] xl:text-[88px] 2xl:text-[96px] 3xl:text-[112px] ${
            nowAt ? "mt-5 md:mt-6 lg:short:mt-4" : voices.length > 0 ? "mt-8 md:mt-10 lg:short:mt-7" : ""
          }`}
        >
          {first ? (
            <>
              <span className="sr-only">{name} — </span>
              <span aria-hidden>
                Hey, I&apos;m{" "}
                {/* a long first name shrinks to fit the column instead of running off it */}
                <span
                  className="whitespace-nowrap"
                  style={{ fontSize: `min(1em, ${(100 / ((Array.from(first).length + 1) * 0.58)).toFixed(2)}cqw)` }}
                >
                  {first}
                  <span className="text-pop">.</span>
                </span>
              </span>
            </>
          ) : (
            <>
              Hey there<span className="text-pop">.</span>
            </>
          )}
        </motion.h1>

        {tagline && (
          <motion.p
            {...rise(0.48)}
            className="mt-4 max-w-[26ch] text-balance text-[20px] font-bold leading-[1.22] tracking-[-0.025em] text-onyx/80 sm:max-w-[34ch] sm:text-[23px] md:mt-5 md:text-[26px] lg:max-w-[58ch] lg:text-[25px] lg:short:mt-3 lg:short:text-[22px] xl:text-[28px] 3xl:text-[32px]"
          >
            {tagline}
          </motion.p>
        )}

        {bio && (
          <motion.p
            {...rise(0.56)}
            className="mt-4 max-w-[600px] text-pretty text-[15.5px] leading-[1.65] text-ash sm:text-[17px] md:mt-5 lg:text-[17px] lg:short:mt-3 lg:short:text-[15.5px] xl:max-w-[660px] xl:text-[18px] 3xl:max-w-[820px] 3xl:text-[20px]"
          >
            {bio}
          </motion.p>
        )}

        {actions.length > 0 && (
          <motion.div
            {...rise(0.66)}
            className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 lg:short:mt-6 3xl:mt-10 3xl:gap-5"
          >
            {actions.map((a, i) => (
              <MagneticButton
                key={a.kind}
                href={a.href}
                target={a.kind === "resume" ? "_blank" : undefined}
                className={`${i === 0 ? BTN_BLACK : BTN_LIGHT} w-full sm:w-auto`}
              >
                {a.kind === "resume" && <FileText size={17} strokeWidth={2.1} aria-hidden />}
                {a.label}
                {a.kind === "talk" ? (
                  <ButtonIcon hover={{ x: 3 }}>
                    <ArrowRight size={18} strokeWidth={2.4} className="text-pop" />
                  </ButtonIcon>
                ) : a.kind === "resume" ? (
                  <ButtonIcon hover={{ x: 2, y: -2 }}>
                    <ArrowUpRight size={17} strokeWidth={2.3} />
                  </ButtonIcon>
                ) : (
                  <ButtonIcon hover={{ y: 3 }}>
                    <ArrowDown size={17} strokeWidth={2.3} className={i === 0 ? "text-pop" : undefined} />
                  </ButtonIcon>
                )}
                {a.kind === "resume" && <span className="sr-only"> (opens in a new tab)</span>}
              </MagneticButton>
            ))}
          </motion.div>
        )}

        {strip.length > 0 && (
          <motion.div {...rise(0.8)} className="mt-12 w-full md:mt-14 lg:short:mt-9 3xl:mt-12">
            <LogoStrip items={strip} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
