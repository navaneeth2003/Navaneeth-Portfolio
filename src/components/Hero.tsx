"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ContactInfo, Hero as HeroContent } from "@/lib/types";
import { ButtonIcon, GridLines, MagneticButton } from "./ui";
import { LogoStrip, type StripItem } from "./LogoStrip";

const EASE = [0.16, 1, 0.3, 1] as const;

function TypewriterName({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayed.length < text.length) {
      const nextChar = text[displayed.length];
      const prevChar = displayed.length > 0 ? text[displayed.length - 1] : "";

      // Natural human-like latency:
      // Base speed slowed down for elegance (approx 125ms - 150ms)
      let latency = 125 + (Math.random() * 32 - 16);

      // Human rhythm nuances:
      // 1. Brief pause when starting a new word after space
      if (prevChar === " ") {
        latency += 85;
      }
      // 2. Slight deliberation before typing space
      else if (nextChar === " ") {
        latency += 50;
      }
      // 3. Shift key deliberation for capital initials (like 'C' or 'L')
      else if (nextChar >= "A" && nextChar <= "Z" && displayed.length > 0) {
        latency += 70;
      }

      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, latency);
    } else if (!isDeleting && displayed.length === text.length) {
      // Full name reached: exactly 3 seconds cool-off time before cycle repeats
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 3000);
    } else if (isDeleting && displayed.length > 0) {
      // Deleting phase: smooth, steady backspacing (45ms)
      const deleteLatency = 45 + (Math.random() * 10 - 5);
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length - 1));
      }, deleteLatency);
    } else if (isDeleting && displayed.length === 0) {
      // Reset complete: brief pause then replay typing
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 400);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, text]);

  return (
    <div className="relative inline-block whitespace-nowrap">
      {/* Ghost placeholder text: reserves full height & width permanently so the tagline/bio below never shifts */}
      <span
        aria-hidden="true"
        className="invisible select-none opacity-0 pointer-events-none font-heading text-[clamp(34px,8.2vw,50px)] sm:text-[54px] md:text-[64px] lg:text-[clamp(56px,5.4vw,80px)] xl:text-[88px] 2xl:text-[100px] font-bold tracking-tight inline-block leading-[1.05]"
      >
        {text}
      </span>

      {/* Visible active layer: absolutely positioned over the ghost text */}
      <span className="absolute inset-0 flex items-center">
        <span className="sr-only">{text}</span>
        <span
          aria-hidden="true"
          className="name-sheen font-heading text-[clamp(34px,8.2vw,50px)] sm:text-[54px] md:text-[64px] lg:text-[clamp(56px,5.4vw,80px)] xl:text-[88px] 2xl:text-[100px] font-bold tracking-tight text-transparent bg-clip-text inline-block leading-[1.05]"
        >
          {displayed}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.75, ease: "easeInOut" }}
          className="ml-1.5 inline-block h-[0.78em] w-[3.5px] lg:w-[4.5px] 2xl:w-[5.5px] rounded-full bg-[var(--color-accent,#ff5a1a)]"
        />
      </span>
    </div>
  );
}

const PRIMARY_BUTTON =
  "min-h-[50px] sm:min-h-[52px] lg:min-h-[56px] xl:min-h-[62px] items-center justify-center gap-2.5 lg:gap-3 bg-[#f2eee7] px-5 sm:px-7 lg:px-8 xl:px-9 py-3.5 sm:py-4 lg:py-4.5 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16.5px] xl:text-[18px] font-semibold text-black transition-all duration-300 group-hover:bg-white group-active:bg-[#e7e1d6] shadow-sm";
const SECONDARY_BUTTON =
  "min-h-[50px] sm:min-h-[52px] lg:min-h-[56px] xl:min-h-[62px] items-center justify-center gap-2.5 lg:gap-3 border border-white/10 bg-[#111] px-5 sm:px-7 lg:px-8 xl:px-9 py-3.5 sm:py-4 lg:py-4.5 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16.5px] xl:text-[18px] font-medium text-white transition-all duration-300 group-hover:border-white/25 group-hover:bg-[#1b1b1b] group-active:border-white/25 group-active:bg-[#1b1b1b] shadow-sm";

export function Hero({
  hero,
  contact,
  strip = [],
}: {
  hero: HeroContent;
  contact: ContactInfo;
  strip?: StripItem[];
}) {
  // Resume is the one optional CTA; it only exists when the studio holds a URL.
  const resume = contact.resumeUrl?.trim() || null;

  return (
    <section
      id="hero"
      className="noise relative flex min-h-[100svh] flex-col overflow-hidden bg-transparent"
    >
      {/* Background Portrait & Themed Atmospheres */}
      <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]">
        {hero.photo.url && (
          <>
            {/* Mobile & Tablet Portrait (< lg):
                Positioned with top anchor so the subject's face is prominent in the upper half.
                The lower half has an atmospheric dark scrim so text never covers the face. */}
            <div className="absolute inset-x-0 top-0 bottom-0 lg:hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]">
              <Image
                src={hero.photo.url}
                alt={`${hero.name} portrait`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[50%_10%] sm:object-[50%_14%]"
              />
            </div>

            {/* Desktop & 4K Portrait (>= lg):
                Anchored to the right side matching the desktop proportions */}
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[55vw] xl:w-[53vw] 2xl:w-[50vw] max-w-[1300px] [mask-image:linear-gradient(to_right,transparent,black_25%)]">
              <Image
                src={hero.photo.url}
                alt={`${hero.name} portrait`}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="scale-[1.03] object-cover object-[50%_18%]"
              />
            </div>
          </>
        )}

        {/* Global horizontal vignette: keeps left text area dark and legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg,#09090b)] via-[var(--color-bg,#09090b)]/40 to-transparent lg:from-[var(--color-bg,#09090b)]/95 lg:via-[var(--color-bg,#09090b)]/25" />

        {/* Dedicated Mobile Gradient Scrim:
            Feathers the lower half on mobile phones/tablets so tagline, bio, and CTAs
            sit on a deep, crisp dark backdrop without colliding into the face */}
        <div className="absolute inset-x-0 bottom-0 top-[34%] sm:top-[38%] bg-gradient-to-t from-[var(--color-bg,#09090b)] via-[var(--color-bg,#09090b)]/95 via-35% to-transparent lg:hidden" />

        {/* Theme Accent Gradients: reactive to the selected color palette */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent,#ff3d0a)]/45 via-transparent to-black/25"
          style={{ opacity: 0.88 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 60% at 70% 20%, rgba(var(--color-glow-rgb, 255, 60, 10), 0.2), transparent 65%)",
          }}
        />
      </div>

      <GridLines />

      {/* Hero Content Container — unified single line name and scaled typography/CTAs */}
      <div className="relative z-20 flex flex-1 flex-col justify-end px-5 pb-24 sm:px-6 sm:pb-28 md:px-12 lg:justify-center lg:pb-16 lg:pt-24 xl:pb-20 xl:pt-28">
        <div className="mx-auto w-full max-w-[1260px] xl:max-w-[1440px] 2xl:max-w-[1640px]">
          <div className="max-w-[620px] lg:max-w-[680px] xl:max-w-[800px] 2xl:max-w-[920px]">
            {/* Unified Single-Line Name across ALL devices with human-like typewriter loop */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.85, ease: EASE }}
              className="mb-2.5 sm:mb-3 lg:mb-3.5 xl:mb-4"
            >
              <TypewriterName text={hero.name} />
            </motion.div>

            {/* Tagline — scaled for laptop & monitor screens for a fuller look */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9, ease: EASE }}
              className="font-heading text-balance text-[clamp(22px,5.5vw,30px)] font-bold leading-[1.12] sm:text-[32px] md:text-[36px] lg:text-[34px] xl:text-[42px] 2xl:text-[48px] lg:leading-[1.12] xl:leading-[1.1] 2xl:leading-[1.08] text-white"
            >
              <span className="sr-only">{hero.name} — </span>
              {hero.tagline}
            </motion.h1>

            {/* Bio — scaled for laptop & monitor screens for a fuller look */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, duration: 0.9, ease: EASE }}
              className="mt-3.5 sm:mt-4 lg:mt-4 xl:mt-5 max-w-[500px] lg:max-w-[560px] xl:max-w-[640px] 2xl:max-w-[720px] font-heading text-[clamp(14px,3.8vw,16px)] font-light leading-[1.6] text-white/85 sm:text-[15px] md:text-[16px] lg:text-[17.5px] xl:text-[19px] 2xl:text-[20px] lg:leading-[1.62] xl:leading-[1.66]"
            >
              {hero.shortBio}
            </motion.p>

            {/* CTAs — scaled buttons with responsive icons */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
              className={`mt-5 sm:mt-6 lg:mt-7 xl:mt-8 grid gap-2.5 sm:flex sm:flex-wrap md:gap-3.5 lg:gap-4 xl:gap-5 ${
                resume ? "grid-cols-2 sm:grid-cols-none" : "grid-cols-1"
              }`}
            >
              <MagneticButton href="#contact" className={PRIMARY_BUTTON}>
                Let&apos;s talk
                <ButtonIcon hover={{ y: 2 }}>
                  <ArrowDown size={17} strokeWidth={2.2} className="size-[17px] lg:size-[19px] xl:size-[21px]" />
                </ButtonIcon>
              </MagneticButton>
              {resume && (
                <MagneticButton href={resume} target="_blank" className={SECONDARY_BUTTON}>
                  Resume
                  <span className="sr-only"> (opens in a new tab)</span>
                  <ButtonIcon hover={{ x: 2, y: -2 }} className="text-[var(--color-accent,#ff7a3d)]">
                    <ArrowUpRight size={17} strokeWidth={2.2} className="size-[17px] lg:size-[19px] xl:size-[21px]" />
                  </ButtonIcon>
                </MagneticButton>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Running banner — sits at bottom over lower edge */}
      {strip.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-10">
          <LogoStrip items={strip} />
        </div>
      )}
    </section>
  );
}
