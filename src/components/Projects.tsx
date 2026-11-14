"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Layers,
  Lightbulb,
  PenTool,
  Search,
  Sparkles,
  TrendingUp,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ProjectItem } from "@/lib/types";
import { PROJECT_VERTICALS } from "@/lib/types";
import { pad2, plural } from "@/lib/format";
import { ScrollReveal, setPageScrollLocked, siteScrollTo, useMedia } from "./ui";
import { AVATAR, AvatarTile, Bubble, ChipRail, IconTile, SECTION_Y, SectionHeader, WRAP, tintAt } from "./site/kit";

const VERTICAL_ICONS: Record<string, LucideIcon> = {
  "Product Creation": Lightbulb,
  "Product Design": PenTool,
  "Product Improvement": Wrench,
  "Analytical Case Studies": BarChart3,
  "Product Teardowns": Search,
};
const FALLBACK_ICONS: LucideIcon[] = [Layers, Sparkles, Lightbulb];
/** Teammates who peek into covers that have no image yet. */
const PEEKERS = [AVATAR.gus, AVATAR.ezra, AVATAR.iris, AVATAR.rosa, AVATAR.hazel, AVATAR.fiona, AVATAR.maya];

/**
 * In the grouped "All" view each category row shows a few cards: 2 on
 * tablets, 3 on laptops, 4 on large monitors (phones swipe up to 8).
 * Written out so Tailwind sees every class.
 */
const ROW_VISIBILITY = ["", "", "md:hidden lg:block", "md:hidden 3xl:block", "md:hidden"];
const GRID_ITEM = "md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(33.333%-18.67px)] 3xl:w-[calc(25%-21px)]";

type Look = { tone: string; Icon: LucideIcon; number: string; peeker: string };
type SheetState = { id: string; ids: string[] };

/**
 * Projects, built for a big catalogue across many categories:
 *  · a filter bar — category pills with counts and a search box — that
 *    pins under the nav on laptops while you browse;
 *  · "All" shows one row per category (App Store style): phones swipe a
 *    rail with a "See all" tile at the end, larger screens show the first
 *    2 / 3 / 4 cards and a "See all N →" link;
 *  · a category or a search shows everything that matches — compact rows
 *    on phones, a card grid elsewhere — a page at a time with "Show more".
 * Opening a card brings up the project as an app-style sheet (bottom sheet
 * on phones, dialog elsewhere) with prev / next through the same list.
 */
/** The built-in "everything" filter — a value no CMS category can collide with (even one named "All"). */
const ALL = "\u0000all";

export function Projects({
  items: raw,
  title,
  categories: rawCategories,
}: {
  items: ProjectItem[];
  title?: string;
  categories?: string[];
}) {
  // Every project has a category and a title to show: blanks become "Other" / "Untitled project",
  // and stray spaces never split one category into two.
  const items = useMemo(
    () =>
      raw.map((p) => {
        const vertical = p.vertical.trim() || "Other";
        const title = p.title.trim() || "Untitled project";
        return vertical === p.vertical && title === p.title ? p : { ...p, vertical, title };
      }),
    [raw],
  );
  const categories = useMemo(() => rawCategories?.map((c) => c.trim()).filter(Boolean), [rawCategories]);
  // Category order: the CMS registry (or the defaults), then any stragglers — only those with work.
  const order = useMemo(() => {
    const base = categories && categories.length > 0 ? categories : (PROJECT_VERTICALS as readonly string[]);
    return Array.from(new Set([...base, ...items.map((p) => p.vertical)])).filter((v) =>
      items.some((p) => p.vertical === v),
    );
  }, [categories, items]);
  const ordered = useMemo(() => order.flatMap((v) => items.filter((p) => p.vertical === v)), [order, items]);
  const byId = useMemo(() => new Map(items.map((p) => [p.id, p])), [items]);
  const numberOf = useMemo(() => {
    const m = new Map<string, number>();
    order.forEach((v) => items.filter((p) => p.vertical === v).forEach((p, i) => m.set(p.id, i + 1)));
    return m;
  }, [order, items]);

  const [filter, setFilter] = useState(ALL);
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState(1);
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const md = useMedia("(min-width: 768px)");
  const lg = useMedia("(min-width: 1024px)");
  const huge = useMedia("(min-width: 1920px)");
  const pageSize = huge ? 8 : lg ? 6 : md ? 4 : 5;
  const sectionRef = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const q = query.trim().toLowerCase();
  const matches = (p: ProjectItem) =>
    [p.title, p.overview, p.vertical, p.resultsAndImpact ?? "", ...(p.tags ?? [])].join(" ").toLowerCase().includes(q);
  const grouped = !q && filter === ALL && order.length > 1;
  const list = q ? ordered.filter(matches) : filter === ALL ? ordered : ordered.filter((p) => p.vertical === filter);
  const shown = list.slice(0, pages * pageSize);

  const lookOf = (p: ProjectItem): Look => {
    const vi = Math.max(0, order.indexOf(p.vertical));
    return {
      tone: tintAt(vi),
      Icon: VERTICAL_ICONS[p.vertical] ?? FALLBACK_ICONS[vi % FALLBACK_ICONS.length],
      number: pad2(numberOf.get(p.id) ?? 1),
      peeker: PEEKERS[Math.max(0, ordered.indexOf(p)) % PEEKERS.length],
    };
  };

  /** Bring the top of the section (just under the nav) into view after a big layout change. */
  const toTop = () => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (window.scrollY > top) siteScrollTo(top - 24);
  };
  const choose = (cat: string) => {
    setFilter(cat);
    setQuery("");
    setPages(1);
    toTop();
  };

  const open = (id: string, ids: string[]) => {
    opener.current = document.activeElement as HTMLElement | null;
    setSheet({ id, ids });
  };
  const close = () => {
    setSheet(null);
    window.setTimeout(() => opener.current?.focus(), 0);
  };
  const step = (d: number) =>
    setSheet((s) => {
      if (!s || s.ids.length < 2) return s;
      const i = s.ids.indexOf(s.id);
      return { ...s, id: s.ids[(i + d + s.ids.length) % s.ids.length] };
    });

  const current = sheet ? byId.get(sheet.id) : undefined;
  const label = title?.trim() || "Projects";
  const listIds = list.map((p) => p.id);

  return (
    <section id="projects" ref={sectionRef} className={`relative scroll-mt-24 ${SECTION_Y}`}>
      <div className={WRAP}>
        <ScrollReveal>
          <SectionHeader
            eyebrow={`${plural(items.length, "project")} · ${plural(order.length, "category", "categories")}`}
            title={label}
          />
        </ScrollReveal>

        {/* the filter bar */}
        <div className="z-30 mt-9 md:mt-12 lg:sticky lg:top-[92px] 3xl:top-[112px]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 md:rounded-full md:border md:border-hairline md:bg-card/85 md:p-1.5 md:shadow-card md:backdrop-blur-xl">
            {order.length > 1 ? (
              // One row of category chips that swipes when there are more than
              // fit — edge to edge on phones, inside the bar from tablets up.
              <ChipRail
                label="Filter projects by category"
                active={q ? "search" : filter}
                className="-mx-4 sm:-mx-6 md:mx-0 md:min-w-0 md:flex-1"
                scrollerClassName="-my-2 px-4 py-2 sm:px-6 md:px-0"
                trackClassName="gap-1.5 md:mx-0"
              >
                {[ALL, ...order].map((cat) => {
                  const active = !q && filter === cat;
                  const count = cat === ALL ? items.length : items.filter((p) => p.vertical === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={active}
                      onClick={() => choose(cat)}
                      className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-colors 3xl:min-h-[52px] 3xl:px-5 3xl:text-[17px] ${
                        active
                          ? "bg-onyx text-on-onyx shadow-cta"
                          : "border border-hairline bg-card text-ash shadow-pill hover:text-onyx md:border-transparent md:bg-transparent md:shadow-none"
                      }`}
                    >
                      {cat === ALL ? "All" : cat}
                      <span className={`tabular-nums ${active ? "text-on-onyx/60" : "text-dust"}`}>{count}</span>
                    </button>
                  );
                })}
              </ChipRail>
            ) : (
              <p className="px-1 text-[15px] font-semibold text-ash md:px-4">{plural(items.length, "project")}</p>
            )}
            <label className="flex h-12 w-full shrink-0 items-center gap-2.5 rounded-full border border-hairline bg-card px-4 shadow-pill md:h-11 md:w-[230px] md:border-transparent md:bg-well md:shadow-none lg:w-[260px] 3xl:h-[52px] 3xl:w-[320px]">
              <Search size={17} className="shrink-0 text-ash" aria-hidden />
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPages(1);
                }}
                placeholder="Search projects…"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-onyx placeholder:text-dust focus-visible:outline-none 3xl:text-[17px]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="grid size-7 shrink-0 place-items-center rounded-full bg-onyx/10 text-onyx hover:bg-onyx/15"
                >
                  <X size={14} aria-hidden />
                </button>
              )}
            </label>
          </div>
        </div>

        {grouped ? (
          /* ---------- All: one row per category ---------- */
          <div className="mt-10 space-y-14 md:mt-14 md:space-y-16 3xl:space-y-20">
            {order.map((cat, ci) => {
              const catItems = ordered.filter((p) => p.vertical === cat);
              const ids = catItems.map((p) => p.id);
              const Icon = VERTICAL_ICONS[cat] ?? FALLBACK_ICONS[ci % FALLBACK_ICONS.length];
              return (
                <div key={cat}>
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <IconTile icon={Icon} tone={tintAt(ci)} className="size-11 md:size-12 3xl:size-14" size={20} />
                      <h3 className="truncate text-[21px] font-extrabold tracking-[-0.03em] text-onyx md:text-[27px] 3xl:text-[34px]">{cat}</h3>
                      <span className="shrink-0 rounded-full bg-well px-2.5 py-0.5 text-[13px] font-bold tabular-nums text-ash 3xl:text-[15px]">
                        {catItems.length}
                      </span>
                    </div>
                    {catItems.length > 2 && (
                      <button
                        type="button"
                        onClick={() => choose(cat)}
                        className="group inline-flex shrink-0 items-center gap-1.5 text-[14.5px] font-semibold text-onyx underline decoration-onyx/25 decoration-2 underline-offset-[5px] hover:decoration-onyx 3xl:text-[17px]"
                      >
                        <span className="hidden sm:inline">See all {catItems.length}</span>
                        <span className="sm:hidden">All</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                      </button>
                    )}
                  </div>
                  <ul className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 pt-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:mt-6 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 xl:gap-7 3xl:grid-cols-4">
                    {catItems.slice(0, 8).map((p, i) => (
                      <li key={p.id} className={`w-[80%] shrink-0 snap-start sm:w-[46%] md:w-auto ${ROW_VISIBILITY[Math.min(i, 4)]}`}>
                        <ProjectCard p={p} look={lookOf(p)} onOpen={() => open(p.id, ids)} />
                      </li>
                    ))}
                    {catItems.length > 8 && (
                      <li className="w-[56%] shrink-0 snap-start md:hidden">
                        <button
                          type="button"
                          onClick={() => choose(cat)}
                          className={`flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-3 rounded-[28px] border border-hairline text-center ${tintAt(ci)}`}
                        >
                          <span className="grid size-14 place-items-center rounded-full bg-onyx text-on-onyx shadow-cta">
                            <ArrowRight size={22} aria-hidden />
                          </span>
                          <span className="text-[16px] font-bold text-onyx">See all {catItems.length}</span>
                          <span className="px-4 text-[13px] text-onyx/70">{cat}</span>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          /* ---------- one category, a search, or a single-category site ---------- */
          <div className="mt-9 md:mt-12">
            {(q || filter !== ALL) && (
              <div className="mb-6 flex flex-wrap items-center gap-3 md:mb-8">
                {order.length > 1 && (
                  <button
                    type="button"
                    onClick={() => choose(ALL)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-hairline bg-card px-4 text-[14px] font-semibold text-onyx shadow-pill transition-transform hover:-translate-x-0.5"
                  >
                    <ArrowLeft size={15} aria-hidden /> All projects
                  </button>
                )}
                <p className="text-[15px] font-semibold text-ash 3xl:text-[17px]" aria-live="polite">
                  {q ? (
                    <>
                      {plural(list.length, "result")} for “<span className="text-onyx">{query.trim()}</span>”
                    </>
                  ) : (
                    <>
                      {plural(list.length, "project")} in <span className="text-onyx">{filter}</span>
                    </>
                  )}
                </p>
              </div>
            )}

            {list.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center md:py-16">
                <AvatarTile src={AVATAR.iris} tone="bg-tile-bubblegum" tilt={-6} className="size-20 md:size-24">
                  <Bubble className="-top-7 left-1/2 -translate-x-1/2">Hmm… 🤔</Bubble>
                </AvatarTile>
                <p className="mt-8 text-[18px] font-bold text-onyx md:text-[20px]">Nothing matches that yet</p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-3 text-[15px] font-semibold text-onyx underline decoration-onyx/25 decoration-2 underline-offset-[5px] hover:decoration-onyx"
                >
                  Clear the search
                </button>
              </div>
            ) : (
              <>
                {/* phones: compact rows */}
                <ul className="grid gap-3 md:hidden">
                  {shown.map((p) => (
                    <li key={p.id}>
                      <CompactCard p={p} look={lookOf(p)} onOpen={() => open(p.id, listIds)} />
                    </li>
                  ))}
                </ul>
                {/* md+: cards, a short last row centres */}
                <ul className="hidden md:flex md:flex-wrap md:justify-center md:gap-6 xl:gap-7">
                  {shown.map((p) => (
                    <li key={p.id} className={GRID_ITEM}>
                      <ProjectCard p={p} look={lookOf(p)} onOpen={() => open(p.id, listIds)} />
                    </li>
                  ))}
                </ul>

                {list.length > shown.length ? (
                  <div className="mt-10 flex flex-col items-center gap-3 md:mt-12">
                    <button
                      type="button"
                      onClick={() => setPages((n) => n + 1)}
                      className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-onyx px-6 text-[15px] font-semibold text-on-onyx shadow-cta transition-transform hover:-translate-y-0.5 3xl:min-h-[60px] 3xl:text-[17px]"
                    >
                      Show more
                      <span className="rounded-full bg-on-onyx/15 px-2 py-0.5 text-[12px] font-bold tabular-nums">
                        +{Math.min(pageSize, list.length - shown.length)}
                      </span>
                    </button>
                    <p className="text-[13px] font-medium tabular-nums text-ash">
                      Showing {shown.length} of {list.length}
                    </p>
                  </div>
                ) : list.length > pageSize ? (
                  <div className="mt-10 flex justify-center md:mt-12">
                    <button
                      type="button"
                      onClick={() => {
                        setPages(1);
                        toTop();
                      }}
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-hairline bg-card px-5 text-[14.5px] font-semibold text-onyx shadow-pill"
                    >
                      Show fewer <ChevronDown size={16} className="rotate-180" aria-hidden />
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {sheet && current && (
          <ProjectSheet
            key="sheet"
            p={current}
            look={lookOf(current)}
            position={`${sheet.ids.indexOf(sheet.id) + 1} / ${sheet.ids.length}`}
            canStep={sheet.ids.length > 1}
            onClose={close}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- covers ---------- */

function Cover({ p, look, size = "card" }: { p: ProjectItem; look: Look; size?: "card" | "big" | "thumb" }) {
  // "loading" → "loaded", or "failed" (a 404, a blocked host) → the illustrated cover below.
  const [state, setState] = useState<"loading" | "loaded" | "failed">("loading");
  if (p.coverImage.url && state !== "failed") {
    return (
      <>
        {state !== "loaded" && <span aria-hidden className="absolute inset-0 animate-pulse bg-well" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.coverImage.url}
          alt=""
          loading="lazy"
          // already settled before React was listening (cached, or hydrated late)
          ref={(img) => {
            if (img?.complete && state === "loading") setState(img.naturalWidth > 0 ? "loaded" : "failed");
          }}
          onLoad={() => setState("loaded")}
          onError={() => setState("failed")}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-700 group-hover:scale-[1.04] ${
            state === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      </>
    );
  }
  const { Icon } = look;
  if (size === "thumb") {
    return (
      <span aria-hidden className={`absolute inset-0 grid place-items-center ${look.tone}`}>
        <Icon size={24} strokeWidth={1.9} className="text-onyx" />
      </span>
    );
  }
  const big = size === "big";
  return (
    <span aria-hidden className={`absolute inset-0 block ${look.tone}`}>
      <span className="absolute inset-0 block bg-[radial-gradient(color-mix(in_oklab,var(--color-onyx)_12%,transparent)_1.2px,transparent_1.3px)] bg-[size:14px_14px] [mask-image:linear-gradient(160deg,black,transparent_75%)]" />
      <span className={`absolute flex items-start justify-between ${big ? "inset-x-6 top-6" : "inset-x-4 top-4 md:inset-x-5 md:top-5"}`}>
        <IconTile icon={Icon} className={big ? "size-16" : "size-12 md:size-14"} size={big ? 26 : 22} />
        {!big && <span className="display text-[56px] text-onyx/12 md:text-[64px]">{look.number}</span>}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={look.peeker}
        alt=""
        draggable={false}
        className={`absolute -bottom-[18%] right-[7%] w-[42%] rotate-[-5deg] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-0 ${
          big ? "max-w-[260px]" : "max-w-[190px]"
        }`}
      />
    </span>
  );
}

function ProjectCard({ p, look, onOpen }: { p: ProjectItem; look: Look; onOpen: () => void }) {
  const tags = (p.tags ?? []).filter((t) => t.trim());
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Open ${p.title}`}
      className="group surface flex h-full w-full flex-col rounded-[28px] p-2 text-left transition-transform duration-500 hover:-translate-y-1.5 md:rounded-[32px] md:p-2.5 3xl:rounded-[38px] 3xl:p-3"
    >
      <span className="relative block aspect-[16/11] w-full overflow-hidden rounded-[22px] bg-well md:rounded-[25px] 3xl:rounded-[30px]">
        <Cover p={p} look={look} />
        {p.coverImage.url && (
          <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-hairline bg-card/90 px-3 py-1 text-[12px] font-semibold text-onyx shadow-pill backdrop-blur 3xl:text-[14px]">
            {p.vertical}
          </span>
        )}
      </span>
      <span className="flex flex-1 flex-col px-3 pb-3 pt-4 md:px-4 md:pb-4 md:pt-5 3xl:px-5 3xl:pb-5">
        {!p.coverImage.url && (
          <span className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ash 3xl:text-[14px]">{p.vertical}</span>
        )}
        <span className="line-clamp-2 text-[18px] font-bold leading-snug tracking-[-0.02em] text-onyx md:text-[19px] 3xl:text-[23px]">
          {p.title}
        </span>
        {p.overview && (
          <span className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ash md:text-[15px] 3xl:text-[17px]">{p.overview}</span>
        )}
        <span className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="flex min-w-0 flex-wrap gap-1.5">
            {tags.slice(0, 2).map((t, ti) => (
              <span key={`${ti}-${t}`} className="truncate rounded-full bg-well px-2.5 py-1 text-[12px] font-semibold text-ash 3xl:text-[14px]">
                #{t}
              </span>
            ))}
            {tags.length === 0 && <span className="text-[13px] font-semibold text-onyx/70 3xl:text-[15px]">Read the story</span>}
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-onyx text-on-onyx shadow-cta transition-transform duration-300 group-hover:rotate-45 3xl:size-12">
            <ArrowUpRight size={18} strokeWidth={2.3} aria-hidden />
          </span>
        </span>
      </span>
    </button>
  );
}

/** Phones, inside a category or a search: one dense row per project. */
function CompactCard({ p, look, onOpen }: { p: ProjectItem; look: Look; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Open ${p.title}`}
      className="group surface flex w-full items-center gap-3 rounded-[22px] p-2 pr-3 text-left"
    >
      <span className="relative block size-[76px] shrink-0 overflow-hidden rounded-[16px] bg-well">
        <Cover p={p} look={look} size="thumb" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-bold uppercase tracking-[0.12em] text-ash">{p.vertical}</span>
        <span className="mt-0.5 line-clamp-2 text-[15px] font-bold leading-snug text-onyx">{p.title}</span>
      </span>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-onyx text-on-onyx">
        <ArrowUpRight size={16} strokeWidth={2.3} aria-hidden />
      </span>
    </button>
  );
}

/* ---------- the sheet ---------- */

function ProjectSheet({
  p,
  look,
  position,
  canStep,
  onClose,
  onPrev,
  onNext,
}: {
  p: ProjectItem;
  look: Look;
  position: string;
  canStep: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const desktop = useMedia("(min-width: 768px)");
  const dragControls = useDragControls();
  const closeRef = useRef<HTMLButtonElement>(null);
  const tags = (p.tags ?? []).filter((t) => t.trim());
  const primary = p.liveUrl
    ? { href: p.liveUrl, label: "View project" }
    : p.caseStudyUrl
      ? { href: p.caseStudyUrl, label: "Read case study" }
      : null;
  const secondary = p.liveUrl && p.caseStudyUrl ? p.caseStudyUrl : null;

  useEffect(() => {
    setPageScrollLocked(true);
    closeRef.current?.focus();
    return () => setPageScrollLocked(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div className="fixed inset-0 z-[95] flex items-end justify-center md:items-center md:p-6">
      <motion.button
        type="button"
        tabIndex={-1}
        aria-label="Close project"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[6px]"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-sheet-title"
        initial={desktop ? { opacity: 0, y: 26, scale: 0.97 } : { y: "100%" }}
        animate={desktop ? { opacity: 1, y: 0, scale: 1 } : { y: 0 }}
        exit={desktop ? { opacity: 0, y: 18, scale: 0.98 } : { y: "100%" }}
        transition={{ type: "spring", stiffness: 330, damping: 34 }}
        drag={desktop ? false : "y"}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 650) onClose();
        }}
        className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[32px] border border-hairline bg-card shadow-float md:max-h-[88vh] md:max-w-[780px] md:rounded-[36px] 3xl:max-w-[980px]"
      >
        {/* grabber — phones drag the sheet down to close */}
        <div onPointerDown={(e) => dragControls.start(e)} className="flex shrink-0 touch-none justify-center pb-2 pt-3 md:hidden">
          <span className="h-1.5 w-12 rounded-full bg-onyx/15" />
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-7 z-10 grid size-11 place-items-center rounded-full border border-hairline bg-card/90 text-onyx shadow-pill backdrop-blur transition-transform hover:rotate-90 md:right-8 md:top-8"
        >
          <X size={19} strokeWidth={2.3} />
        </button>

        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6 md:px-5 md:pb-8 md:pt-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
            >
              <div
                className={`group relative overflow-hidden rounded-[24px] bg-well md:rounded-[28px] ${
                  p.coverImage.url ? "aspect-[16/9]" : "aspect-[16/9] md:aspect-[5/2]"
                }`}
              >
                <Cover p={p} look={look} size="big" />
              </div>

              <div className="px-2 pt-6 md:px-4 md:pt-8 3xl:px-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3.5 py-1.5 text-[13px] font-semibold text-ash shadow-pill">
                    <span aria-hidden className="size-2 rounded-full bg-pop" />
                    {p.vertical}
                  </span>
                  <span className="rounded-full bg-well px-3 py-1.5 text-[13px] font-semibold tabular-nums text-ash">{position}</span>
                </div>
                <h3 id="project-sheet-title" className="display mt-4 text-[30px] leading-[1.04] md:text-[40px] 3xl:text-[52px]">
                  {p.title}
                </h3>
                {p.overview && (
                  <p className="mt-4 whitespace-pre-line text-[15.5px] leading-[1.7] text-ash md:text-[17px] 3xl:text-[20px]">{p.overview}</p>
                )}

                {p.resultsAndImpact && (
                  <div className="mt-6 rounded-[24px] bg-mint p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <IconTile icon={TrendingUp} className="size-10" size={18} />
                      <p className="text-[14px] font-bold text-onyx md:text-[15px]">Results &amp; impact</p>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-[15px] font-medium leading-[1.7] text-onyx/80 md:text-[16.5px] 3xl:text-[19px]">
                      {p.resultsAndImpact}
                    </p>
                  </div>
                )}

                {tags.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {tags.map((t, ti) => (
                      <li key={`${ti}-${t}`} className="rounded-full border border-hairline bg-well px-3 py-1 text-[13px] font-semibold text-ash">
                        # {t}
                      </li>
                    ))}
                  </ul>
                )}

                {(primary || secondary) && (
                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                    {primary && (
                      <a
                        href={primary.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-onyx px-6 text-[15px] font-semibold text-on-onyx shadow-cta transition-transform hover:-translate-y-0.5"
                      >
                        {primary.label}
                        <ArrowUpRight size={17} strokeWidth={2.3} className="text-pop" aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                    {secondary && (
                      <a
                        href={secondary}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-onyx underline decoration-onyx/30 decoration-2 underline-offset-[6px] hover:decoration-onyx"
                      >
                        Read case study <ArrowUpRight size={16} aria-hidden />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {canStep && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-hairline px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] md:px-6 md:py-4">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline bg-card px-4 text-[14px] font-semibold text-onyx shadow-pill transition-transform hover:-translate-x-0.5"
            >
              <ArrowLeft size={16} aria-hidden /> Previous
            </button>
            <span className="hidden text-[13px] font-medium text-ash md:inline">Use ← → to browse</span>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-onyx px-4 text-[14px] font-semibold text-on-onyx shadow-cta transition-transform hover:translate-x-0.5"
            >
              Next <ArrowRight size={16} className="text-pop" aria-hidden />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
