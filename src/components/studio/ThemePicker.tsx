"use client";

import { Check, Moon, Sun } from "lucide-react";
import { CAST } from "@/lib/chatter";
import { THEMES, getTheme, type Theme } from "@/lib/palettes";

/**
 * Studio → Theme. Every card is a miniature of the real site painted in
 * that theme's own colours (canvas, glow, ink, cards, accent, the team's
 * stickers on the name), so the owner chooses by looking, not by reading.
 * One click applies the theme to the draft — it autosaves at once and the
 * live preview repaints — and Publish makes it live.
 */
export function ThemePicker({
  value,
  onChange,
  dirty,
  busy,
  onPublish,
}: {
  value?: string;
  onChange: (id: string) => void;
  dirty: boolean;
  busy: boolean;
  onPublish: () => void;
}) {
  const current = getTheme(value);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[28px] font-extrabold tracking-[-0.04em] text-ink">Pick a theme</h2>
        <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-muted">
          One click re-colours the whole site — canvas, cards, type, accents and the team&apos;s stickers. It saves to your draft
          straight away; publish when you&apos;re happy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {THEMES.map((t) => (
          <ThemeCard key={t.id} theme={t} active={t.id === current.id} onPick={() => onChange(t.id)} />
        ))}
      </div>

      <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full" style={{ background: current.colors.pop }}>
            <Check className="h-5 w-5 text-[#121211]" strokeWidth={2.6} />
          </span>
          <div>
            <p className="text-[15px] font-bold text-ink">{current.name} is on your draft</p>
            <p className="text-[13px] text-muted">{dirty ? "Publish to make it live for visitors." : "It's live — everything is published."}</p>
          </div>
        </div>
        <button
          type="button"
          disabled={!dirty || busy}
          onClick={onPublish}
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-ink px-5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "Publishing…" : "Publish now"}
        </button>
      </div>
    </div>
  );
}

function ThemeCard({ theme, active, onPick }: { theme: Theme; active: boolean; onPick: () => void }) {
  const c = theme.colors;
  const huddle = [
    { src: CAST.iris.src, tone: "#f4cbe6", tilt: 6, size: "size-6" },
    { src: CAST.gus.src, tone: "#c9cdf9", tilt: -8, size: "size-7" },
    { src: CAST.owner.src, tone: "#f8df8b", tilt: -4, size: "size-9" },
    { src: CAST.ezra.src, tone: "#c5f0d8", tilt: 7, size: "size-7" },
    { src: CAST.rosa.src, tone: "#ffd1b6", tilt: -6, size: "size-6" },
  ];
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={`group flex flex-col overflow-hidden rounded-[26px] border bg-surface p-2 text-left transition-all duration-300 hover:-translate-y-0.5 ${
        active ? "border-ink shadow-pop ring-2 ring-ink" : "border-line hover:border-ink/30"
      }`}
    >
      {/* the miniature site */}
      <span
        aria-hidden
        className="relative block h-[176px] overflow-hidden rounded-[20px]"
        style={{
          background: `radial-gradient(120% 80% at 50% -20%, rgba(${c.glow}, 0.95), rgba(${c.glow}, 0) 70%), ${c.canvas}`,
        }}
      >
        {/* nav islands */}
        <span className="absolute left-3 right-3 top-3 flex items-center justify-between">
          <span className="h-4 w-14 rounded-full" style={{ background: c.card, boxShadow: `0 0 0 1px ${c.hairline}` }} />
          <span className="h-4 w-20 rounded-full" style={{ background: c.card, boxShadow: `0 0 0 1px ${c.hairline}` }}>
            <span className="ml-0.5 mt-0.5 block h-3 w-6 rounded-full" style={{ background: c.onyx }} />
          </span>
          <span className="h-4 w-10 rounded-full" style={{ background: c.onyx }} />
        </span>
        {/* the huddle, one of them talking */}
        <span className="absolute left-0 right-0 top-[46px] flex items-end justify-center gap-1">
          {huddle.map((m, i) => (
            <span key={i} className="relative">
              {i === 3 && (
                <span className="absolute -top-[13px] left-1/2 h-2.5 w-11 -translate-x-1/2 rounded-full" style={{ background: c.onyx }} />
              )}
              <span
                className={`block overflow-hidden rounded-[30%] border-2 border-white ${m.size}`}
                style={{ background: m.tone, transform: `rotate(${m.tilt}deg)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.src} alt="" className="h-full w-full object-cover" />
              </span>
            </span>
          ))}
        </span>
        {/* the eyebrow, the greeting, the tagline, the two calls to action */}
        <span
          className="absolute left-1/2 top-[92px] block h-2.5 w-16 -translate-x-1/2 rounded-full"
          style={{ background: c.card, boxShadow: `0 0 0 1px ${c.hairline}` }}
        />
        <span
          className="absolute inset-x-0 top-[103px] block text-center text-[21px] font-extrabold leading-none tracking-[-0.05em]"
          style={{ color: c.onyx }}
        >
          Hey, I&apos;m Name<span style={{ color: c.pop }}>.</span>
        </span>
        <span className="absolute left-1/2 top-[130px] block h-1.5 w-28 -translate-x-1/2 rounded-full opacity-50" style={{ background: c.ash }} />
        <span className="absolute left-1/2 top-[145px] flex -translate-x-1/2 gap-1.5">
          <span className="block h-4 w-14 rounded-full" style={{ background: c.onyx }}>
            <span className="ml-auto mr-2 mt-[6px] block h-1 w-2.5 rounded-full" style={{ background: c.pop }} />
          </span>
          <span className="block h-4 w-14 rounded-full" style={{ background: c.card, boxShadow: `0 0 0 1px ${c.hairline}` }} />
        </span>
      </span>

      <span className="flex items-start justify-between gap-3 px-3 pb-2 pt-4">
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-[16px] font-bold text-ink">
            {theme.name}
            {theme.mode === "dark" ? (
              <Moon className="h-4 w-4 text-muted" strokeWidth={2.2} />
            ) : (
              <Sun className="h-4 w-4 text-muted" strokeWidth={2.2} />
            )}
          </span>
          <span className="mt-1 block text-[13px] leading-snug text-muted">{theme.description}</span>
        </span>
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-full border transition-colors ${
            active ? "border-ink bg-ink text-white" : "border-line text-transparent group-hover:border-ink/40"
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      </span>
      <span className="flex gap-1.5 px-3 pb-3">
        {[c.canvas, c.card, c.onyx, c.pop, c.lavender, c.mint, c.blush].map((sw, i) => (
          <span key={i} className="size-4 rounded-full border border-black/10" style={{ background: sw }} />
        ))}
      </span>
    </button>
  );
}
