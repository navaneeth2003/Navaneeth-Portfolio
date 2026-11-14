const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-05" → "May 2024", "2024" → "2024", "present" → "Present"; anything else → "" (never raw junk). */
export function formatMonth(value: string | undefined): string {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v) return "";
  if (/^(present|current|now|today)$/i.test(v)) return "Present";
  // 2024-05 · 2024/05 · 2024.05 · 2024
  let m = /^(\d{4})(?:[-/.](\d{1,2}))?/.exec(v);
  if (m) {
    const month = m[2] ? MONTHS[Number(m[2]) - 1] : undefined;
    return month ? `${month} ${m[1]}` : m[1];
  }
  // 05/2024 · 5-2024
  m = /^(\d{1,2})[-/.](\d{4})$/.exec(v);
  if (m) {
    const month = MONTHS[Number(m[1]) - 1];
    return month ? `${month} ${m[2]}` : m[2];
  }
  // June 2024 · Jun 2024 · jun. 2024
  m = /^([A-Za-z]{3,})\.?,?\s+(\d{4})$/.exec(v);
  if (m) {
    const i = MONTHS.findIndex((x) => x.toLowerCase() === m![1].slice(0, 3).toLowerCase());
    return i >= 0 ? `${MONTHS[i]} ${m[2]}` : m[2];
  }
  return "";
}

export function formatRange(start: string | undefined, end: string | undefined): string {
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
  return (name ?? "")
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

/** The first word of a name — "Navaneeth C L" → "Navaneeth". */
export function firstName(name: string): string {
  const n = (name ?? "").trim();
  return n.split(/\s+/)[0] || n;
}

/** ["A","B","C"] → "A, B and C". */
export function listJoin(items: string[]): string {
  const xs = items.filter(Boolean);
  if (xs.length <= 1) return xs[0] ?? "";
  return `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
}

/** "2021-06" / "2021" / "June 2021" / "06/2021" → 2021; anything unparseable → null. */
export function yearOf(value: string | undefined): number | null {
  const m = /(\d{4})/.exec(value?.trim() ?? "");
  return m ? Number(m[1]) : null;
}

/** "3 roles" / "1 role". */
export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
