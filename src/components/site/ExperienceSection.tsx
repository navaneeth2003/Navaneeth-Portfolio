"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, Trophy } from "lucide-react";
import type { ExperienceItem } from "@/lib/types";
import { formatRange, initials, plural, yearOf } from "@/lib/format";
import { ScrollReveal, siteScrollTo } from "@/components/ui";
import { Eyebrow, SafeImg, SECTION_Y, WRAP, tileAt } from "./kit";

/**
 * Experience as a timeline. Laptops and up: a sticky header column (the
 * CMS label, a summary derived from the entries and a stack of company
 * tiles) beside a dashed rail of role cards. Tablets: the header stacks on
 * top. Phones: the same rail, tighter — each card keeps its role, dates and
 * highlight in full, while the details fold to a few lines that fade out
 * above a "Read more" pill. Every count, year and company here comes from
 * the entries.
 */

/** How much of a role's details a phone shows before "Read more" (px). */
const FOLDED = 76;
export function ExperienceSection({ items, title }: { items: ExperienceItem[]; title?: string }) {
  const label = (title || "Experience").trim();
  const companies = Array.from(
    new Map(items.map((e) => [e.company.trim().toLowerCase(), e])).values(),
  ).filter((e) => e.company.trim());
  const starts = items.map((e) => yearOf(e.startDate)).filter((y): y is number => y !== null);
  const ends = items.map((e) => (e.endDate === "present" ? null : yearOf(e.endDate))).filter((y): y is number => y !== null);
  const current = items.some((e) => e.endDate === "present");
  const from = starts.length ? Math.min(...starts) : null;
  const to = current ? "today" : ends.length ? String(Math.max(...ends)) : null;
  const dot = /[\p{L}\p{N}]$/u.test(label);

  return (
    <section id="experience" className={`relative scroll-mt-24 ${SECTION_Y}`}>
      <div className={`${WRAP} grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)] lg:gap-14 xl:gap-20`}>
        {/* header column */}
        <ScrollReveal className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>
            {plural(items.length, "role")} · {plural(companies.length, "company", "companies")}
          </Eyebrow>
          <h2 className="display mt-5 break-words text-[clamp(40px,11vw,54px)] md:mt-6 md:text-[68px] lg:text-[48px] xl:text-[58px] 2xl:text-[64px] 3xl:text-[80px]">
            {label}
            {dot && <span className="text-pop">.</span>}
          </h2>
          {from && to && (
            <p className="mt-4 text-[16px] text-ash md:text-[18px] 3xl:text-[21px]">
              From {from} to {to}, across {companies.length === 1 ? "one team" : `${companies.length} teams`}.
            </p>
          )}
          {/* the company stack */}
          <div className="mt-6 flex items-center md:mt-8">
            <div className="flex -space-x-3">
              {companies.slice(0, 6).map((e, i) => (
                <span
                  key={e.company}
                  title={e.company}
                  className={`grid size-12 place-items-center overflow-hidden rounded-[30%] border-[3px] border-white text-[15px] font-extrabold text-on-pop shadow-pill md:size-14 3xl:size-16 ${
                    e.logo?.url ? "bg-white" : tileAt(i)
                  }`}
                  style={{ transform: `rotate(${i % 2 ? 5 : -5}deg)`, zIndex: 10 - i }}
                >
                  {e.logo?.url ? (
                    <SafeImg src={e.logo.url} className="h-full w-full object-cover" fallback={initials(e.company, 1)} />
                  ) : (
                    initials(e.company, 1)
                  )}
                </span>
              ))}
            </div>
            {companies.length > 6 && (
              <span className="ml-3 rounded-full bg-card px-3 py-1 text-[13px] font-bold text-ash shadow-pill">
                +{companies.length - 6}
              </span>
            )}
          </div>
        </ScrollReveal>

        {/* the rail */}
        <ol className="relative">
          <span
            aria-hidden
            className="absolute bottom-10 left-[21px] top-8 border-l-2 border-dashed border-onyx/15 md:left-[27px]"
          />
          {items.map((e, i) => (
            <ExperienceRow key={e.id} item={e} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ExperienceRow({ item: e, index: i }: { item: ExperienceItem; index: number }) {
  const [open, setOpen] = useState(false);
  const bullets = e.bullets.filter((b) => b.trim());
  const tags = (e.tags ?? []).filter((t) => t.trim());
  const current = e.endDate === "present";
  const detailsId = `exp-${e.id}-details`;

  // The details' natural height, and whether they run past the fold.
  // Until measured, assume they do — so phones never jump on load.
  const cardRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ full: number; long: boolean; measured: boolean }>({ full: 0, long: true, measured: false });
  useEffect(() => {
    const inner = bodyRef.current?.firstElementChild as HTMLElement | null | undefined;
    if (!inner) return;
    const measure = () => {
      const full = inner.offsetHeight;
      setFit({ full, long: full > FOLDED + 10, measured: true });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);
  const folded = fit.long && !open;

  const toggle = () => {
    // Folding back up: bring the card's top into view if it scrolled away.
    if (open) {
      const top = cardRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 80) siteScrollTo(window.scrollY + top - 96);
    }
    setOpen((v) => !v);
  };

  return (
    <li className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-3 pb-5 last:pb-0 md:grid-cols-[56px_minmax(0,1fr)] md:gap-5 md:pb-7">
      {/* the company node on the rail */}
      <span
        aria-hidden
        className={`relative z-[1] mt-5 grid size-11 place-items-center overflow-hidden rounded-[30%] border-[3px] border-white text-[14px] font-extrabold text-on-pop shadow-pill md:mt-7 md:size-14 md:text-[17px] ${
          e.logo?.url ? "bg-white" : tileAt(i)
        }`}
        style={{ transform: `rotate(${i % 2 ? 4 : -4}deg)` }}
      >
        {e.logo?.url ? (
          <SafeImg src={e.logo.url} className="h-full w-full object-cover" fallback={initials(e.company, 1)} />
        ) : (
          initials(e.company, 1)
        )}
      </span>

      <ScrollReveal className="min-w-0">
        <article
          ref={cardRef}
          className="surface rounded-[26px] p-5 transition-transform duration-500 hover:-translate-y-0.5 md:rounded-[32px] md:p-7 xl:p-8 3xl:p-10"
        >
          <div className="flex flex-wrap items-center gap-2">
            {current && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 text-[12px] font-bold text-onyx 3xl:text-[14px]">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2fb36b] opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#2fb36b]" />
                </span>
                Now
              </span>
            )}
            <span className="text-[13px] font-semibold tabular-nums text-ash md:text-[14px] 3xl:text-[16px]">
              {formatRange(e.startDate, e.endDate)}
            </span>
          </div>
          <h3 className="display mt-3 break-words text-[23px] leading-[1.1] tracking-[-0.035em] md:text-[29px] xl:text-[32px] 3xl:text-[40px]">
            {e.role}
          </h3>
          <p className="mt-1.5 text-[15px] font-semibold text-onyx/65 md:text-[16px] 3xl:text-[19px]">{e.company}</p>

          {e.highlight && (
            <div className="mt-5 flex gap-3 rounded-[20px] bg-pop-soft p-3.5 md:p-4 3xl:p-5">
              {/* the standout outcome: a quiet trophy, tinted with the theme accent */}
              <span
                aria-hidden
                className="grid size-9 shrink-0 -rotate-6 place-items-center rounded-[30%] border border-hairline bg-card text-pop-ink shadow-pill md:size-10 3xl:size-12"
              >
                <Trophy size={17} strokeWidth={2.2} className="3xl:size-5" />
              </span>
              <p className="min-w-0 break-words pt-1 text-[14.5px] font-semibold leading-snug text-onyx md:text-[16px] 3xl:text-[19px]">
                {e.highlight}
              </p>
            </div>
          )}

          {bullets.length > 0 && (
            <>
              <div
                id={detailsId}
                ref={bodyRef}
                className={`relative mt-5 max-h-[var(--fold)] overflow-hidden md:max-h-none md:overflow-visible ${
                  fit.measured ? "transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
                } ${folded ? "[mask-image:linear-gradient(to_bottom,#000_40%,transparent)] md:[mask-image:none]" : ""}`}
                style={{ "--fold": folded ? `${FOLDED}px` : fit.measured ? `${fit.full}px` : "none" } as CSSProperties}
              >
                <ul className="space-y-3">
                  {bullets.map((b, bi) => (
                    <li key={bi} className="flex gap-3 break-words text-[14.5px] leading-[1.65] text-ash md:text-[16px] 3xl:text-[19px]">
                      <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-onyx/40" />
                      <span className="min-w-0">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {fit.long && (
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={open}
                  aria-controls={detailsId}
                  className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-hairline bg-well px-4 text-[13.5px] font-semibold text-onyx transition-transform active:scale-[0.97] md:hidden"
                >
                  {open ? "Show less" : "Read more"}
                  <ChevronDown
                    size={15}
                    strokeWidth={2.3}
                    className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
              )}
            </>
          )}

          {tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {tags.map((t, ti) => (
                <li
                  key={`${ti}-${t}`}
                  className="max-w-full break-words rounded-full border border-hairline bg-well px-3 py-1 text-[12.5px] font-semibold text-ash md:text-[13px] 3xl:text-[15px]"
                >
                  # {t}
                </li>
              ))}
            </ul>
          )}
        </article>
      </ScrollReveal>
    </li>
  );
}
