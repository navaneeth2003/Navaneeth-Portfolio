import type { ContactInfo, Hero } from "@/lib/types";
import { ArrowRight, Download } from "lucide-react";
import { ParallaxPortrait } from "./HeroPortrait";

/**
 * The opening title. The text choreography is pure CSS (SSR-first: it plays
 * before hydration and without JS): pills cascade → name rises word by word →
 * the gold period lands → bio and CTAs follow. The portrait's depth response
 * is a client enhancement.
 */
export function HeroSection({
  hero,
  contact,
  workAnchor,
}: {
  hero: Hero;
  contact: ContactInfo;
  workAnchor?: string;
}) {
  const roles = hero.tagline
    .split(/\s*[,•·|]\s*/)
    .map((r) => r.trim())
    .filter(Boolean);

  const words = hero.name.replace(/\.+$/, "").split(/\s+/).filter(Boolean);
  const wordBase = 0.25;
  const wordStep = 0.09;
  const dotDelay = wordBase + words.length * wordStep + 0.12;

  return (
    <section id="top" className="relative overflow-hidden px-5 sm:px-6 lg:px-8">
      {/* Ambient warmth behind the portrait side — the footer bookends this. */}
      <div
        aria-hidden
        className="ambient absolute -top-32 -right-40 h-[540px] w-[540px] rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(243,234,217,0.9) 0%, rgba(243,234,217,0) 65%)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 py-16 md:grid-cols-[1.2fr_1fr] md:py-28">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {roles.map((role, i) => (
              <span
                key={i}
                className="rise-in inline-flex max-w-full rounded-full bg-accent-soft px-3.5 py-1.5"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="utility min-w-0 truncate !text-accent-ink whitespace-nowrap">
                  {role}
                </span>
              </span>
            ))}
          </div>
          <h1
            className="mt-6 text-5xl font-bold tracking-[-0.03em] text-balance sm:text-6xl md:text-7xl"
            aria-label={`${words.join(" ")}.`}
          >
            {words.map((w, i) => (
              <span key={i} aria-hidden className="word-mask">
                <span style={{ animationDelay: `${wordBase + i * wordStep}s` }}>{w}</span>
                {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
              </span>
            ))}
            <span
              aria-hidden
              className="dot-land text-accent"
              style={{ animationDelay: `${dotDelay}s` }}
            >
              .
            </span>
          </h1>
          <p
            className="rise-in mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted md:text-lg"
            style={{ animationDelay: `${dotDelay + 0.1}s` }}
          >
            {hero.shortBio}
          </p>
          <div
            className="rise-in mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: `${dotDelay + 0.2}s` }}
          >
            {workAnchor && (
              <a
                href={workAnchor}
                className="group inline-flex items-center gap-2 rounded-[14px] bg-ink px-5 py-3 text-sm font-medium text-white transition-[opacity,transform] duration-200 hover:opacity-85 active:scale-[0.98]"
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
                className="group inline-flex items-center gap-2 rounded-[14px] border border-line bg-surface px-5 py-3 text-sm font-medium text-ink transition-[border-color,transform] duration-200 hover:border-ink/30 active:scale-[0.98]"
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

        <ParallaxPortrait name={hero.name} photoUrl={hero.photo.url} />
      </div>
    </section>
  );
}
