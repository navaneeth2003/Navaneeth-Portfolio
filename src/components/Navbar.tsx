"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  GraduationCap,
  Link2,
  Menu,
  User,
  FileText,
  Wrench,
  X,
  Zap,
} from "lucide-react";

export type NavLink = { id: string; href: string; label: string };
export type NavCta = { href: string; label: string; external?: boolean };

const icons: Record<string, typeof User> = {
  hero: User,
  projects: Briefcase,
  skills: Zap,
  experience: FileText,
  contact: Link2,
  about: BookOpen,
  stats: BarChart3,
  tools: Wrench,
  certifications: Award,
  education: GraduationCap,
};

export function Navbar({
  links,
  brand,
  cta,
}: {
  links: NavLink[];
  brand: string;
  cta: NavCta | null;
}) {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [links]);

  // Intuitive mobile menu: close on Escape, on resize to desktop,
  // and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const ctaRel = cta?.external ? "noreferrer" : undefined;
  const ctaTarget = cta?.external ? "_blank" : undefined;

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-3 z-[80] flex justify-center px-3 md:top-5 lg:top-5 xl:top-6"
      >
        <nav
          aria-label="Primary"
          // Matched to reference screenshot: warm translucent glass,
          // constant opacity (no scroll darkening), heavy blur + saturation
          // scaled gracefully on laptop and monitor screens for a fuller presence
          className="flex w-full max-w-[1060px] xl:max-w-[1180px] 2xl:max-w-[1280px] items-center justify-between gap-2 rounded-full border border-white/[0.08] bg-[rgb(22_11_9/0.44)] py-[7px] lg:py-[8px] xl:py-[10px] pl-[7px] lg:pl-[9px] xl:pl-[11px] pr-[7px] lg:pr-[9px] xl:pr-[11px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-[18px] backdrop-saturate-[1.4]"
        >
          <div className="hidden flex-1 items-center justify-center gap-1 lg:gap-2 md:flex">
            {links.map((l) => {
              const Icon = icons[l.id] ?? User;
              const isActive = active === l.id;
              return (
                <a
                  key={l.id}
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-[10px] text-[14px] font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:px-5 lg:py-[10px] lg:text-[15px] xl:px-6 xl:py-[11px] xl:text-[16px] 2xl:text-[17px] ${
                    isActive
                      ? "bg-[#e9e1d3] text-[#2a2018]"
                      : "text-white/[0.88] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.9} aria-hidden className="size-[17px] lg:size-[18px] xl:size-[20px]" />
                  {l.label}
                </a>
              );
            })}
          </div>

          {/* mobile brand */}
          <a
            href="#hero"
            className="flex min-h-[44px] min-w-0 items-center gap-2 rounded-full px-4 py-2 text-[15px] font-semibold md:hidden"
          >
            <User size={17} aria-hidden /> <span className="truncate">{brand}</span>
          </a>

          <div className="flex items-center gap-2">
            {cta && (
              <a
                href={cta.href}
                target={ctaTarget}
                rel={ctaRel}
                className="hidden whitespace-nowrap rounded-full bg-[#f2eee7] px-5 py-3 text-[14px] font-semibold text-black transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:block lg:px-6 lg:py-3.5 lg:text-[15px] xl:px-7 xl:py-3.5 xl:text-[16px] 2xl:text-[17px]"
              >
                {cta.label}
              </a>
            )}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
            >
              {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.button
            key="nav-overlay"
            aria-hidden
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[78] cursor-default bg-black/40 backdrop-blur-[6px] md:hidden"
          />
        )}
        {open && (
          <motion.div
            key="nav-menu"
            id="mobile-menu"
            role="dialog"
            aria-label="Site navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-3 top-[68px] sm:inset-x-6 sm:top-[74px] z-[79] max-h-[calc(100svh-88px)] overflow-y-auto rounded-3xl border border-white/[0.12] bg-[rgb(22_11_9/0.52)] p-3.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-[24px] backdrop-saturate-[1.6] ring-1 ring-white/10 md:hidden"
          >
            {links.map((l) => {
              const Icon = icons[l.id] ?? User;
              return (
                <a
                  key={l.id}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`flex min-h-[48px] items-center gap-3 rounded-2xl px-4 py-3 text-[16px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    active === l.id
                      ? "bg-[#e9e1d3] font-medium text-[#2a2018] shadow-sm"
                      : "text-white/[0.88] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={17} aria-hidden /> {l.label}
                </a>
              );
            })}
            {cta && (
              <a
                href={cta.href}
                target={ctaTarget}
                rel={ctaRel}
                className="mt-2.5 block min-h-[48px] rounded-2xl bg-[#f2eee7] px-4 py-3.5 text-center font-semibold text-black transition-transform duration-200 active:scale-[0.98] shadow-sm"
              >
                {cta.label}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
