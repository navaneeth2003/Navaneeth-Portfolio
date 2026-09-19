"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy, FileText } from "lucide-react";
import type { ContactInfo } from "@/lib/types";
import { ButtonIcon, GridLines, LinkedInIcon, MagneticButton, ScrollReveal } from "./ui";

// The hero's primary button, verbatim, so the page's first and last CTA are
// unmistakably the same control.
const PRIMARY_BUTTON =
  "min-h-[52px] items-center justify-center gap-2.5 bg-[#f2eee7] px-6 py-4 text-[15px] font-semibold text-black transition-colors duration-300 group-hover:bg-white group-active:bg-[#e7e1d6] sm:px-7 md:text-[16px]";

type Channel = { key: string; label: string; action: string; href: string; icon: ReactNode };

/**
 * Contact is a shared value, not a section the owner toggles: it always
 * closes the page. One glass card (the Certifications container) under the
 * ghost title: the invitation and the email on the left — a "Send an email"
 * CTA plus the address itself, tap to copy — and the other places to find
 * him on the right, as the bordered cells the rest of the site uses. Every
 * value comes from the same ContactInfo the hero, nav and footer read; a
 * channel without a value (LinkedIn, resume) simply doesn't render, and with
 * neither the card is just the email column. The phone number is never shown.
 */
export function Contact({ contact }: { contact: ContactInfo }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: 140, y: 140 });
  const currentPos = useRef({ x: 140, y: 140 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animId: number;
    const update = () => {
      // Ultra-smooth delayed follow lerp (0.045 factor creates a fluid, floating liquid feel)
      const factor = 0.045;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * factor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * factor;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      targetPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly drift back toward the card center/left
    targetPos.current = { x: 180, y: 160 };
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const linkedin = contact.linkedinUrl?.trim() || null;
  const resume = contact.resumeUrl?.trim() || null;

  const elsewhere: Channel[] = [];
  if (linkedin) {
    elsewhere.push({
      key: "linkedin",
      label: "LinkedIn",
      action: "Connect on LinkedIn",
      href: linkedin,
      icon: <LinkedInIcon size={19} />,
    });
  }
  if (resume) {
    elsewhere.push({
      key: "resume",
      label: "Resume",
      action: "Open the resume",
      href: resume,
      icon: <FileText size={20} aria-hidden />,
    });
  }

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden bg-transparent">
      <GridLines />
      <h2 className="sr-only">Contact</h2>
      <p
        aria-hidden
        className="ghost-huge relative mt-6 overflow-hidden px-4 text-center text-[22vw] sm:text-[24vw] md:text-[13vw]"
      >
        Contact
      </p>

      <div className="relative mx-auto mt-8 max-w-[1240px] px-5 pb-16 sm:mt-12 sm:px-6 md:mt-16 md:px-12 md:pb-20 lg:mt-20">
        <ScrollReveal>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 backdrop-blur-xl"
          >
            {/* Themed top hairline */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent,#ff4a1a)]/80 to-transparent"
            />

            {/* Themed atmospheric glow with buttery delayed cursor follow — strictly contained in card */}
            <div
              ref={glowRef}
              aria-hidden
              className="pointer-events-none absolute -left-[280px] -top-[280px] h-[560px] w-[560px] rounded-full transition-opacity duration-700 ease-out will-change-transform"
              style={{
                opacity: isHovered ? 1 : 0.28,
                background:
                  "radial-gradient(circle, rgba(var(--color-glow-rgb, 255, 74, 26), 0.38) 0%, rgba(var(--color-glow-rgb, 255, 74, 26), 0.22) 32%, rgba(var(--color-glow-rgb, 255, 74, 26), 0.08) 55%, transparent 75%)",
                transform: "translate3d(180px, 160px, 0)",
              }}
            />

            <div
              className={`relative grid grid-cols-1 ${elsewhere.length > 0 ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}
            >
              {/* the invitation and the address */}
              <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Get in touch
                </p>
                <h3 className="mt-3 font-heading text-[clamp(34px,9vw,44px)] font-bold leading-[0.98] tracking-tight text-white md:text-[56px]">
                  Let&apos;s talk.
                </h3>
                <p className="mt-4 max-w-[460px] font-heading text-[15px] font-light leading-[1.6] text-white/70 sm:text-[16px] md:mt-5 md:text-[18px]">
                  Got a role, a product idea, or just a quick question? Email is the best way to reach me.
                </p>
                <div className="mt-7 grid grid-cols-1 sm:flex md:mt-8">
                  <MagneticButton href={`mailto:${contact.email.trim()}`} className={PRIMARY_BUTTON}>
                    Send an email
                    <ButtonIcon hover={{ x: 2, y: -2 }}>
                      <ArrowUpRight size={17} strokeWidth={2.2} />
                    </ButtonIcon>
                  </MagneticButton>
                </div>
                <button
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : `Copy ${contact.email}`}
                  className="mt-5 flex min-h-[44px] max-w-full items-center gap-2.5 break-all text-left font-heading text-[15px] font-medium text-white/85 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white active:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-[16px] md:text-[17px]"
                >
                  {copied ? (
                    <Check size={17} className="shrink-0 text-green-400" aria-hidden />
                  ) : (
                    <Copy size={16} className="shrink-0 text-white/50" aria-hidden />
                  )}
                  <span className="min-w-0">{copied ? "Copied!" : contact.email}</span>
                </button>
                <p aria-live="polite" className="sr-only">
                  {copied ? "Email copied" : ""}
                </p>
              </div>

              {/* elsewhere — the bordered cells; each fills its share of the
                  column so one or two links both read as a deliberate panel */}
              {elsewhere.length > 0 && (
                <div className="flex flex-col border-t border-white/10 lg:border-l lg:border-t-0">
                  {elsewhere.map((c) => (
                    <a
                      key={c.key}
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-[96px] flex-1 items-center gap-4 border-b border-white/10 px-6 py-5 font-heading transition-colors last:border-b-0 hover:bg-white/[0.06] active:bg-white/[0.08] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:px-8 md:px-10"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-white">
                        {c.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16px] font-medium text-white sm:text-[17px]">
                          {c.label}
                        </span>
                        <span className="mt-0.5 block truncate text-[13px] text-white/55 sm:text-[14px]">
                          {c.action}
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        className="-rotate-45 shrink-0 text-white/80 transition-transform duration-300 group-hover:rotate-0"
                        aria-hidden
                      />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
