"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  FolderOpen,
  GraduationCap,
  Home,
  MessageCircle,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { OwnerAvatar } from "./site/kit";

export type NavLink = { id: string; href: string; label: string };

const icons: Record<string, typeof Home> = {
  hero: Home,
  projects: FolderOpen,
  skills: Zap,
  experience: Briefcase,
  contact: MessageCircle,
  about: BookOpen,
  stats: BarChart3,
  tools: Wrench,
  certifications: Award,
  education: GraduationCap,
};

/** The nav link whose section the reader is in: the last one whose top has passed 35% of the viewport. */
function useActiveSection(ids: string[]): string {
  const key = ids.join("|");
  const [active, setActive] = useState(ids[0] ?? "hero");
  useEffect(() => {
    const list = key.split("|");
    const update = () => {
      const line = window.innerHeight * 0.35;
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = list[list.length - 1];
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [key]);
  return active;
}

/** Phones and tablets tuck the top islands away while scrolling down, and bring them back on the way up. */
function useHideOnScroll(): boolean {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

const ISLAND = "rounded-full border border-hairline bg-card/80 shadow-card backdrop-blur-xl backdrop-saturate-150";

export function Navbar({
  links,
  name,
  avatar,
  resumeUrl,
  talk = true,
}: {
  links: NavLink[];
  name: string;
  /** The studio's avatar (or photo); missing = the illustrated one. */
  avatar?: string;
  resumeUrl?: string | null;
  /** Whether there is a contact section for "Let's talk" to open. */
  talk?: boolean;
}) {
  const first = name.trim().split(/\s+/)[0] || name.trim();
  const active = useActiveSection(links.map((l) => l.id));
  const hidden = useHideOnScroll();

  return (
    <>
      {/* ---------- top: three floating islands ---------- */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] px-3 pt-3 md:px-5 md:pt-4 xl:pt-5"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-[1360px] items-center justify-between gap-3 transition-transform duration-500 lg:translate-y-0 3xl:max-w-[1760px] ${
            hidden ? "-translate-y-[150%]" : ""
          }`}
        >
          {/* brand island */}
          <a
            href="#hero"
            aria-label={name.trim() ? `${name.trim()} — back to top` : "Back to top"}
            className={`group pointer-events-auto flex h-14 items-center gap-2.5 py-1.5 pl-1.5 md:h-[60px] md:gap-3 3xl:h-[72px] 3xl:pl-2 ${
              first ? "pr-5 md:pr-6 3xl:pr-7" : "pr-1.5 3xl:pr-2"
            } ${ISLAND}`}
          >
            <OwnerAvatar src={avatar} className="size-10 md:size-11 3xl:size-[54px]" />
            {first && (
              <span className="max-w-[40vw] truncate text-[18px] font-extrabold tracking-[-0.035em] text-onyx md:max-w-none md:text-[19px] 3xl:text-[23px]">
                {first}
              </span>
            )}
          </a>

          {/* links island (laptop and up): an inset track with a sliding pill */}
          <ul className={`pointer-events-auto hidden items-center gap-1 p-1.5 lg:flex 3xl:p-2 ${ISLAND}`}>
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={l.href}
                    title={l.label}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block whitespace-nowrap rounded-full px-4 py-2.5 text-[14.5px] font-semibold transition-colors xl:px-5 3xl:px-6 3xl:py-3 3xl:text-[17px] ${
                      isActive ? "text-on-onyx" : "text-ash hover:text-onyx"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-onyx"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative block max-w-[6.5rem] truncate xl:max-w-[8rem] 2xl:max-w-[10rem] 3xl:max-w-[13rem]">{l.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* actions island: the resume (when the CMS has one) and "Let's talk" (when there is a contact section) */}
          {(talk || resumeUrl) && (
            <div className={`pointer-events-auto flex h-14 items-center gap-1 p-1.5 md:h-[60px] 3xl:h-[72px] 3xl:p-2 ${ISLAND}`}>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`h-full items-center gap-1 whitespace-nowrap rounded-full px-4 text-[14.5px] font-semibold transition-colors 3xl:text-[17px] ${
                    talk ? "hidden text-ash hover:text-onyx md:inline-flex lg:hidden xl:inline-flex" : "inline-flex bg-onyx text-on-onyx md:px-5"
                  }`}
                >
                  Resume
                  <ArrowUpRight size={16} strokeWidth={2.3} aria-hidden className={talk ? undefined : "text-pop"} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {talk && (
                <a
                  href="#contact"
                  className="inline-flex h-full items-center gap-2 whitespace-nowrap rounded-full bg-onyx px-4 text-[14px] font-semibold text-on-onyx transition-transform duration-300 hover:-translate-y-0.5 md:px-5 md:text-[15px] 3xl:px-7 3xl:text-[17px]"
                >
                  <MessageCircle size={17} strokeWidth={2.2} aria-hidden className="text-pop" />
                  Let&apos;s talk
                </a>
              )}
            </div>
          )}
        </nav>
      </motion.header>

      {/* ---------- bottom tab bar: phones & tablets ---------- */}
      <motion.nav
        aria-label="Sections"
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        className="fixed inset-x-0 bottom-0 z-[80] flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden"
      >
        <ul className="flex w-full max-w-[440px] items-center justify-between gap-0.5 rounded-full border border-hairline bg-card/70 p-1.5 shadow-float backdrop-blur-xl backdrop-saturate-150 md:w-auto md:max-w-full md:gap-1 md:p-2">
          {links.map((l) => {
            const Icon = icons[l.id] ?? Sparkles;
            const isActive = active === l.id;
            return (
              <li key={l.id} className={`min-w-0 ${isActive ? "flex-[1.6] md:flex-initial" : "flex-1 md:flex-initial"}`}>
                <a
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={l.label}
                  className={`relative flex h-12 min-w-0 items-center justify-center gap-2 rounded-full px-3 text-[13px] font-semibold transition-colors md:h-[52px] md:px-5 md:text-[15px] ${
                    isActive ? "text-on-onyx" : "text-ash hover:text-onyx"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-onyx shadow-cta"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon size={19} strokeWidth={2.1} aria-hidden className="relative z-10 shrink-0" />
                  <span className={`relative z-10 truncate md:max-w-[7.5rem] ${isActive ? "" : "max-md:hidden"}`}>{l.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
}
