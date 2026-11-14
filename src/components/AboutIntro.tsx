"use client";

import { useReducedMotionSafe } from "./ui";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUp } from "lucide-react";
import type { About } from "@/lib/types";
import { firstName, paragraphs } from "@/lib/format";
import { AVATAR, AvatarTile, Eyebrow, SECTION_Y, TypingDots, WRAP } from "./site/kit";

/**
 * About, told as a conversation: the heading sits on the left like the
 * subject line, and the body arrives on the right as chat messages — each
 * paragraph (split on blank lines in the CMS) is one bubble, typed out in
 * turn once the thread scrolls into view. More paragraphs simply make a
 * longer thread. The text is in the page from the start for search and
 * assistive tech; only its reveal is animated.
 */
export function AboutIntro({ data, photo, name }: { data: About; photo?: string; name: string }) {
  const paras = paragraphs(data.body);
  const heading = data.heading.trim();
  const solo = paras.length === 0;

  return (
    <section id="about" className={`relative scroll-mt-24 ${SECTION_Y}`}>
      <div
        className={`${WRAP} grid grid-cols-1 items-start gap-10 md:gap-12 ${
          solo ? "justify-items-center text-center" : "lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 xl:gap-20"
        }`}
      >
        <div className={solo ? "flex flex-col items-center" : "lg:sticky lg:top-32"}>
          <Eyebrow>About me</Eyebrow>
          <h2
            className={`display mt-5 max-w-[16ch] break-words text-[clamp(32px,8.8vw,46px)] leading-[1.02] md:mt-6 md:text-[58px] lg:text-[54px] xl:text-[64px] 3xl:text-[86px] ${
              heading ? "" : "sr-only"
            }`}
          >
            {heading || "About me"}
          </h2>
        </div>
        {!solo && <ChatWindow paras={paras} photo={photo} name={name} />}
      </div>
    </section>
  );
}

function ChatWindow({ paras, photo, name }: { paras: string[]; photo?: string; name: string }) {
  const first = firstName(name);
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduced = useReducedMotionSafe();
  // How many bubbles have "arrived", and which one is being typed right now.
  const [arrived, setArrived] = useState(0);
  const [typing, setTyping] = useState(-1);

  useEffect(() => {
    if (!inView || reduced) return;
    const timers: number[] = [];
    let cancelled = false;
    const step = (i: number) => {
      if (cancelled) return;
      if (i >= paras.length) {
        setTyping(-1);
        return;
      }
      setTyping(i);
      timers.push(
        window.setTimeout(() => {
          setArrived(i + 1);
          setTyping(-1);
          timers.push(window.setTimeout(() => step(i + 1), 380));
        }, i === 0 ? 650 : 900),
      );
    };
    timers.push(window.setTimeout(() => step(0), 120));
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [inView, reduced, paras.length]);

  return (
    <div className="surface w-full overflow-hidden rounded-[30px] md:rounded-[36px]">
      {/* thread header */}
      <div className="flex items-center gap-3 border-b border-hairline px-4 py-3.5 md:px-6 md:py-4">
        <AvatarTile
          src={photo || AVATAR.owner}
          photo={Boolean(photo)}
          sizes="48px"
          tone="bg-tile-lemon"
          tilt={-6}
          border="border-[3px]"
          className="size-11 md:size-12"
        />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-onyx md:text-[16px] 3xl:text-[19px]">{first}</p>
          <p className="text-[12.5px] font-medium text-ash md:text-[13px] 3xl:text-[15px]">
            {typing >= 0 ? "typing…" : "The story so far"}
          </p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-well px-3 py-1 text-[12px] font-semibold text-ash 3xl:text-[14px]">
          {paras.length} {paras.length === 1 ? "message" : "messages"}
        </span>
      </div>

      {/* the messages */}
      <ol ref={ref} className="flex min-h-[200px] flex-col gap-2.5 px-3 py-5 sm:px-4 md:gap-3 md:px-6 md:py-7">
        {paras.map((p, i) => {
          // Reduced motion: the whole thread is simply there once it scrolls in.
          const visible = reduced ? true : i < arrived;
          const isLast = i === paras.length - 1;
          return (
            <li key={i} className={visible ? "flex items-end gap-2.5" : "hidden"}>
              <span className="w-8 shrink-0 md:w-9">
                {isLast && (
                  <AvatarTile
                    src={photo || AVATAR.owner}
                    photo={Boolean(photo)}
                    sizes="36px"
                    tone="bg-tile-lemon"
                    border="border-2"
                    className="size-8 md:size-9"
                  />
                )}
              </span>
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
                className={`relative max-w-[min(100%,620px)] origin-bottom-left break-words rounded-[22px] bg-well px-4 py-3 text-[15px] leading-[1.65] text-onyx/85 md:rounded-[24px] md:px-5 md:py-3.5 md:text-[16.5px] 3xl:text-[20px] ${
                  isLast ? "rounded-bl-[6px] md:rounded-bl-[6px]" : ""
                }`}
              >
                {p}
                {isLast && (
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-3 grid size-7 place-items-center rounded-full border border-hairline bg-card text-[13px] shadow-pill"
                  >
                    💛
                  </span>
                )}
              </motion.p>
            </li>
          );
        })}
        {typing >= 0 && (
          <li aria-hidden className="flex items-end gap-2.5">
            <span className="w-8 shrink-0 md:w-9" />
            <span className="rounded-[20px] bg-well px-4 py-3.5 text-ash">
              <TypingDots />
            </span>
          </li>
        )}
      </ol>

      {/* reply bar → the contact composer */}
      <div className="border-t border-hairline p-2.5 md:p-3.5">
        <a
          href="#contact"
          className="group flex items-center gap-3 rounded-full bg-well py-1.5 pl-5 pr-1.5 text-[15px] font-medium text-ash transition-colors hover:text-onyx 3xl:text-[18px]"
        >
          <span className="min-w-0 flex-1 truncate">Reply to {first}…</span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-onyx text-on-onyx shadow-cta transition-transform group-hover:-translate-y-0.5 3xl:size-12">
            <ArrowUp size={18} strokeWidth={2.4} aria-hidden />
          </span>
        </a>
      </div>
    </div>
  );
}
