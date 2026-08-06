import type { ContactInfo, Hero } from "@/lib/types";
import { ArrowRight, Download } from "lucide-react";
import { GoldDot } from "./shared";

function DotGrid() {
  return (
    <svg
      aria-hidden
      className="absolute -top-4 -right-2 h-24 w-24 text-accent/40"
      viewBox="0 0 96 96"
      fill="currentColor"
    >
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={8 + c * 16} cy={8 + r * 16} r={2} />
        )),
      )}
    </svg>
  );
}

export function HeroSection({
  hero,
  contact,
  workAnchor,
}: {
  hero: Hero;
  contact: ContactInfo;
  workAnchor?: string;
}) {
  const initials = hero.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");

  // "APM, Ex-Founder, CS Engineer" reads as separate credentials — render it as
  // wrapping pills so nothing ever truncates, at any width.
  const roles = hero.tagline
    .split(/\s*[,•·|]\s*/)
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <section id="top" className="px-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-12 py-16 md:grid-cols-[1.2fr_1fr] md:py-28">
        <div className="min-w-0">
          <div className="rise-in flex flex-wrap gap-2">
            {roles.map((role, i) => (
              <span
                key={i}
                className="inline-flex max-w-full rounded-full bg-accent-soft px-3.5 py-1.5"
              >
                <span className="utility min-w-0 truncate !text-accent-ink whitespace-nowrap">
                  {role}
                </span>
              </span>
            ))}
          </div>
          <h1 className="rise-in rise-in-d1 mt-6 text-5xl font-bold tracking-[-0.03em] text-balance sm:text-6xl md:text-7xl">
            <GoldDot text={hero.name} />
          </h1>
          <p className="rise-in rise-in-d2 mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted md:text-lg">
            {hero.shortBio}
          </p>
          <div className="rise-in rise-in-d3 mt-9 flex flex-wrap items-center gap-3">
            {workAnchor && (
              <a
                href={workAnchor}
                className="group inline-flex items-center gap-2 rounded-[14px] bg-ink px-5 py-3 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85"
              >
                View my work
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </a>
            )}
            {contact.resumeUrl && (
              <a
                href={contact.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-[14px] border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-ink/30"
              >
                Download resume
                <Download
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
            )}
          </div>
        </div>

        <div className="rise-in rise-in-d2 relative mx-auto w-56 sm:w-64 md:w-full md:max-w-xs">
          <DotGrid />
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-full bg-accent-soft" aria-hidden />
          <div className="relative aspect-square overflow-hidden rounded-full border border-line bg-surface shadow-card">
            {hero.photo.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.photo.url} alt={hero.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-accent-ink/40 select-none">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
