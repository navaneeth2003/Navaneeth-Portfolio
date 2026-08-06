import type { Section, SiteContent } from "@/lib/types";
import { renderableSections } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import { GoldDot } from "./shared";

const NAV_SECTIONS: Partial<Record<Section["type"], string>> = {
  about: "About",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
};

export function SiteNav({ content }: { content: SiteContent }) {
  const links = renderableSections(content)
    .filter((s) => NAV_SECTIONS[s.type])
    .map((s) => ({ href: `#${s.type}`, label: NAV_SECTIONS[s.type]! }));

  const firstName = content.hero.name.trim().split(/\s+/)[0] || "Portfolio";

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a href="#top" className="text-lg font-bold tracking-tight">
          <GoldDot text={firstName} />
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
          >
            Contact
          </a>
        </nav>
        {content.contact.resumeUrl ? (
          <a
            href={content.contact.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[14px] bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85"
          >
            Resume
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </a>
        ) : (
          <a
            href="#contact"
            className="inline-flex items-center rounded-[14px] bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85"
          >
            Contact
          </a>
        )}
      </div>
    </header>
  );
}
