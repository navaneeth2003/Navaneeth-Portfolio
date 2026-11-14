import { firstName } from "./format";
import type { ChatterAvatar, ChatterVoice, SiteContent } from "./types";

/**
 * The line-art cast (Notionists by Zoish, CC0 1.0 — credited in each SVG's
 * metadata) and the speech-bubble crowds built from it. The CMS stores only
 * avatar keys and lines; everything visual lives here and in the components.
 */
export const CAST: Record<ChatterAvatar, { src: string; tone: string; label: string }> = {
  owner: { src: "/avatars/owner.svg", tone: "bg-tile-lemon", label: "You" },
  gus: { src: "/avatars/gus.svg", tone: "bg-tile-periwinkle", label: "Engineer" },
  ezra: { src: "/avatars/ezra.svg", tone: "bg-tile-seafoam", label: "Designer" },
  iris: { src: "/avatars/iris.svg", tone: "bg-tile-bubblegum", label: "Analyst" },
  rosa: { src: "/avatars/rosa.svg", tone: "bg-tile-apricot", label: "User" },
  hazel: { src: "/avatars/hazel.svg", tone: "bg-tile-orchid", label: "Business" },
  maya: { src: "/avatars/maya.svg", tone: "bg-tile-lemon", label: "Founder" },
  fiona: { src: "/avatars/fiona.svg", tone: "bg-tile-seafoam", label: "Teammate" },
  uma: { src: "/avatars/uma.svg", tone: "bg-tile-periwinkle", label: "Friend" },
};

/** The owner waving — used where they greet the visitor. */
export const OWNER_WAVE = "/avatars/owner-wave.svg";

/** The hero huddle. The first voice stands in the middle; the rest fill in left, right, left… */
export const DEFAULT_HERO_VOICES: ChatterVoice[] = [
  { id: "hero-owner", avatar: "owner", badge: "👋", lines: ["Welcome in! 👋", "Glad you stopped by ✨", "Let's build something"] },
  { id: "hero-gus", avatar: "gus", badge: "💻", lines: ["Ship it? 🚀", "PR is up for review", "Works on my machine 😅"] },
  { id: "hero-ezra", avatar: "ezra", badge: "🎨", lines: ["Pixel perfect ✨", "New mockups are in!", "Love this flow"] },
  { id: "hero-iris", avatar: "iris", badge: "📊", lines: ["Data says yes 📈", "Retention is up!", "Checking the funnel…"] },
  { id: "hero-rosa", avatar: "rosa", badge: "💬", lines: ["Users love it! 💛", "Can it do dark mode?", "So easy to use"] },
  { id: "hero-hazel", avatar: "hazel", badge: "💼", lines: ["Q3 roadmap? 🗺️", "Let's launch it!", "Customers asked for this"] },
  { id: "hero-maya", avatar: "maya", badge: "🧭", lines: ["What's the MVP?", "Big vision 🌍", "Love the strategy"] },
];

/** The crowd perched on the contact composer — what people come to talk about. */
export const DEFAULT_CONTACT_VOICES: ChatterVoice[] = [
  { id: "contact-owner", avatar: "owner", badge: "✨", lines: ["My inbox is open 📬", "Say hi! 👋"] },
  { id: "contact-hazel", avatar: "hazel", badge: "💼", lines: ["Hiring? 💼", "Coffee chat? ☕"] },
  { id: "contact-gus", avatar: "gus", badge: "🚀", lines: ["Let's build 🚀", "Ship it together?"] },
  { id: "contact-uma", avatar: "uma", badge: "👋", lines: ["Hello!! 👋", "Got a question?"] },
];

/** Lines with {name} filled in and blanks dropped. */
function resolve(voices: ChatterVoice[], name: string): ChatterVoice[] {
  const first = firstName(name);
  return voices.map((v) => ({
    ...v,
    lines: v.lines.map((l) => l.replaceAll("{name}", first).trim()).filter(Boolean),
  }));
}

/** The hero crowd: the CMS's voices, or the default cast until the owner edits them. */
export function heroVoices(content: SiteContent): ChatterVoice[] {
  return resolve(content.settings?.chatter?.hero ?? DEFAULT_HERO_VOICES, content.hero.name);
}

/** The contact crowd: the CMS's voices, or the defaults. */
export function contactVoices(content: SiteContent): ChatterVoice[] {
  return resolve(content.settings?.chatter?.contact ?? DEFAULT_CONTACT_VOICES, content.hero.name);
}
