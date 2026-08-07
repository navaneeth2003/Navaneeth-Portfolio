"use client";

import type { Section, SiteContent } from "@/lib/types";
import { renderableSections } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { GoldDot } from "./shared";

const NAV_SECTIONS: Partial<Record<Section["type"], string>> = {
  about: "About",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
};

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      aria-current={active ? "true" : undefined}
      className={`group relative py-1 text-sm font-medium transition-colors duration-200 ${
        active ? "text-ink" : "text-muted hover:text-ink"
      }`}
    >
      {label}
      {active ? (
        // Shared underline slides between links as the active section changes.
        <motion.span
          layoutId="nav-active"
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
        />
      ) : (
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-accent/50 transition-transform duration-200 group-hover:scale-x-50"
        />
      )}
    </a>
  );
}

export function SiteNav({ content }: { content: SiteContent }) {
  const links = renderableSections(content)
    .filter((s) => NAV_SECTIONS[s.type])
    .map((s) => ({ href: `#${s.type}`, label: NAV_SECTIONS[s.type]! }));

  const firstName = content.hero.name.trim().split(/\s+/)[0] || "Portfolio";
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const sectionIds = [...links.map((l) => l.href.slice(1)), "contact"].join(",");

  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sectionIds.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sectionIds]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-line/70 bg-bg/85 backdrop-blur" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="#top" className="text-lg font-bold tracking-tight">
          <GoldDot text={firstName} />
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} active={active === l.href.slice(1)} />
          ))}
          <NavLink href="#contact" label="Contact" active={active === "contact"} />
        </nav>
        {content.contact.resumeUrl ? (
          <a
            href={content.contact.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[14px] bg-ink px-4 py-2 text-sm font-medium text-white transition-[opacity,transform] duration-200 hover:opacity-85 active:scale-[0.98]"
          >
            Resume
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </a>
        ) : (
          <a
            href="#contact"
            className="inline-flex items-center rounded-[14px] bg-ink px-4 py-2 text-sm font-medium text-white transition-[opacity,transform] duration-200 hover:opacity-85 active:scale-[0.98]"
          >
            Contact
          </a>
        )}
      </div>
      {/* The gold measure: scroll progress under the header hairline. */}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
