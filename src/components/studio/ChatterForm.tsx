"use client";

import { ChevronDown, ChevronUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { CAST, DEFAULT_CONTACT_VOICES, DEFAULT_HERO_VOICES } from "@/lib/chatter";
import { firstName } from "@/lib/format";
import { CHAR_LIMITS, ITEM_LIMITS } from "@/lib/limits";
import { CHATTER_AVATARS, type ChatterAvatar, type ChatterVoice, type SiteChatter } from "@/lib/types";
import { newId } from "./fields";
import { StringListEditor } from "./lists";

/**
 * Studio → Team chatter: the lines the crowd says on the site — the huddle
 * in the hero, and the crowd perched on the contact composer. Until a group is edited it shows the default cast; the
 * first edit copies the defaults into the draft so nothing jumps.
 */
export function ChatterForm({
  chatter,
  name,
  photo,
  onChange,
}: {
  chatter?: SiteChatter;
  name: string;
  photo?: string;
  onChange: (chatter: SiteChatter | undefined) => void;
}) {
  const set = (patch: Partial<SiteChatter>) => {
    const next: SiteChatter = { hero: chatter?.hero, contact: chatter?.contact, ...patch };
    onChange(next.hero || next.contact ? next : undefined);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-[28px] font-extrabold tracking-[-0.04em] text-ink">Team chatter</h2>
        <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-muted">
          The little crowd that chats in speech bubbles around your site. Pick who stands where, their corner emoji and up to three
          lines each — they type them out one after another. Write <code className="rounded-md bg-bg px-1.5 py-0.5 text-[13px]">{"{name}"}</code>{" "}
          to drop in your first name.
        </p>
      </div>

      <Group
        title="In the hero"
        hint="Huddled together above your greeting, taking turns to talk — one bubble at a time, and anyone the visitor points at speaks up. The first voice stands in the middle, the rest fill in left and right. Phones show the first 3, tablets and laptops 5, big monitors all 7."
        voices={chatter?.hero ?? DEFAULT_HERO_VOICES}
        isDefault={!chatter?.hero}
        max={ITEM_LIMITS.heroVoices}
        centre
        name={name}
        photo={photo}
        prefix="hero"
        onChange={(hero) => set({ hero })}
        onReset={() => set({ hero: undefined })}
      />

      <Group
        title="On the message box"
        hint="Perched on the contact composer — what people come to talk to you about. Phones show the first 3."
        voices={chatter?.contact ?? DEFAULT_CONTACT_VOICES}
        isDefault={!chatter?.contact}
        max={ITEM_LIMITS.contactVoices}
        name={name}
        photo={photo}
        prefix="contact"
        onChange={(contact) => set({ contact })}
        onReset={() => set({ contact: undefined })}
      />
    </div>
  );
}

function Group({
  title,
  hint,
  voices,
  isDefault,
  max,
  centre = false,
  name,
  photo,
  prefix,
  onChange,
  onReset,
}: {
  title: string;
  hint: string;
  voices: ChatterVoice[];
  isDefault: boolean;
  max: number;
  centre?: boolean;
  name: string;
  photo?: string;
  prefix: string;
  onChange: (voices: ChatterVoice[]) => void;
  onReset: () => void;
}) {
  const full = voices.length >= max;

  function move(from: number, to: number) {
    if (to < 0 || to >= voices.length) return;
    const next = [...voices];
    const [v] = next.splice(from, 1);
    next.splice(to, 0, v);
    onChange(next);
  }

  function add() {
    if (full) return;
    const used = new Set(voices.map((v) => v.avatar));
    const avatar = (CHATTER_AVATARS.find((a) => !used.has(a)) ?? "fiona") as ChatterAvatar;
    onChange([...voices, { id: newId(prefix), avatar, badge: "✨", lines: ["Hello! 👋"] }]);
  }

  return (
    <section className="card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[18px] font-bold text-ink">{title}</h3>
          <p className="mt-1 max-w-[60ch] text-[13px] leading-relaxed text-muted">{hint}</p>
        </div>
        {isDefault ? (
          <span className="rounded-full bg-accent-soft px-3 py-1 text-[12px] font-semibold text-accent-ink">Default crowd</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Bring back the default crowd for this spot?")) onReset();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-ink hover:bg-bg"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
            Reset to default
          </button>
        )}
      </div>

      <ol className="mt-5 space-y-3">
        {voices.map((v, i) => (
          <VoiceCard
            key={v.id}
            voice={v}
            index={i}
            count={voices.length}
            centre={centre && i === 0}
            name={name}
            photo={photo}
            onChange={(nv) => onChange(voices.map((x) => (x.id === v.id ? nv : x)))}
            onMove={move}
            onRemove={() => {
              if (window.confirm("Remove this character?")) onChange(voices.filter((x) => x.id !== v.id));
            }}
          />
        ))}
      </ol>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={full}
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Add a character
        </button>
        <span className="text-xs tabular-nums text-muted">
          {voices.length} of {max}
          {full ? " · that's everyone" : ""}
        </span>
      </div>
    </section>
  );
}

function VoiceCard({
  voice,
  index,
  count,
  centre,
  name,
  photo,
  onChange,
  onMove,
  onRemove,
}: {
  voice: ChatterVoice;
  index: number;
  count: number;
  centre: boolean;
  name: string;
  photo?: string;
  onChange: (v: ChatterVoice) => void;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  const first = firstName(name);
  const cast = CAST[voice.avatar] ?? CAST.gus;
  const src = voice.avatar === "owner" && photo ? photo : cast.src;
  const preview = (voice.lines.find((l) => l.trim()) ?? "").replaceAll("{name}", first);

  return (
    <li className="rounded-[22px] border border-line bg-bg/50 p-4">
      <div className="flex items-start gap-3">
        <span
          className={`relative block size-14 shrink-0 overflow-hidden rounded-[30%] border-[3px] border-white shadow-pop ${cast.tone}`}
          style={{ transform: `rotate(${index % 2 ? 5 : -5}deg)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink">
            {voice.avatar === "owner" ? `${first} (you)` : cast.label}
            {centre && (
              <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Centre stage</span>
            )}
          </p>
          {preview ? (
            <span className="relative mt-2 inline-flex max-w-full rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
              <span className="truncate">{preview}</span>
            </span>
          ) : (
            <p className="mt-1.5 text-xs text-muted">No lines yet — this character stays quiet.</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label="Move earlier"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
            className="rounded-full p-1.5 text-muted hover:bg-surface hover:text-ink disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label="Move later"
            disabled={index === count - 1}
            onClick={() => onMove(index, index + 1)}
            className="rounded-full p-1.5 text-muted hover:bg-surface hover:text-ink disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            aria-label="Remove character"
            onClick={onRemove}
            className="rounded-full p-1.5 text-muted hover:bg-surface hover:text-danger"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">Character</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CHATTER_AVATARS.map((a) => {
              const c = CAST[a];
              const on = voice.avatar === a;
              const thumb = a === "owner" && photo ? photo : c.src;
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={on}
                  aria-label={a === "owner" ? "You" : c.label}
                  title={a === "owner" ? "You" : c.label}
                  onClick={() => onChange({ ...voice, avatar: a })}
                  className={`size-11 overflow-hidden rounded-[30%] border-2 transition-transform hover:-translate-y-0.5 ${c.tone} ${
                    on ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-surface" : "border-white"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt="" className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        <label className="block max-w-[200px]">
          <span className="text-sm font-semibold text-ink">Corner emoji</span>
          <input
            value={voice.badge ?? ""}
            maxLength={CHAR_LIMITS.chatter.badge}
            onChange={(e) => onChange({ ...voice, badge: e.target.value.slice(0, CHAR_LIMITS.chatter.badge) || undefined })}
            placeholder="e.g. 💻"
            className="mt-1.5 w-full rounded-[14px] border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none"
          />
        </label>

        <StringListEditor
          label="Lines"
          values={voice.lines}
          onChange={(lines) => onChange({ ...voice, lines })}
          maxItems={ITEM_LIMITS.chatterLines}
          maxChars={CHAR_LIMITS.chatter.line}
          addLabel="Add a line"
          placeholder="e.g. Ship it? 🚀"
        />
      </div>
    </li>
  );
}
