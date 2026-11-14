const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-06" → "Jun 2026"; "present" → "Present"; anything else passes through. */
export function formatMonth(value: string): string {
  if (!value) return "";
  if (value.toLowerCase() === "present") return "Present";
  const m = /^(\d{4})-(\d{2})/.exec(value);
  if (!m) return value;
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : m[1];
}

export function formatRange(start: string, end: string): string {
  const a = formatMonth(start);
  const b = formatMonth(end);
  if (a && b) return `${a} — ${b}`;
  return a || b;
}

/** Paragraphs split on blank lines — build prompt §8. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Initials for image fallbacks — never an invented asset, just the letters. */
export function initials(name: string, count = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, count)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
