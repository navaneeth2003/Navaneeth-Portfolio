import { HISTORY_LIMIT } from "./limits";
import { SEED_CONTENT } from "./seed";
import { getSupabase } from "./supabase";
import type { HistoryEntry, SiteContent, SiteDocument } from "./types";

// The whole site lives in one row of the `site` table (id = 'main'):
// draft/published/history as jsonb, plus version and published_at.
// Single owner-editor, so read-then-update is safe: each update is one
// atomic statement and nothing else writes concurrently.

const SITE_ID = "main";

type SiteRow = {
  id: string;
  draft: SiteContent;
  published: SiteContent;
  version: number;
  published_at: string;
  history: HistoryEntry[];
};

function rowToDoc(row: SiteRow): SiteDocument {
  return {
    draft: row.draft,
    published: row.published,
    version: row.version,
    publishedAt: row.published_at,
    history: row.history ?? [],
  };
}

/** JSON columns reject `undefined` inside objects — strip it, changing nothing else. */
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function initialDocument(): SiteDocument {
  return {
    draft: SEED_CONTENT,
    published: SEED_CONTENT,
    version: 1,
    publishedAt: new Date().toISOString(),
    history: [],
  };
}

async function fetchRow(): Promise<SiteRow | null> {
  const { data, error } = await getSupabase().from("site").select("*").eq("id", SITE_ID).maybeSingle();
  if (error) throw error;
  return data as SiteRow | null;
}

/** Load the site document, seeding it on first run (requires an owner session). */
export async function loadOrSeedSite(): Promise<SiteDocument> {
  const row = await fetchRow();
  if (row) return rowToDoc(row);
  const fresh = clean(initialDocument());
  const { error } = await getSupabase().from("site").insert({
    id: SITE_ID,
    draft: fresh.draft,
    published: fresh.published,
    version: fresh.version,
    published_at: fresh.publishedAt,
    history: fresh.history,
  });
  if (error) throw error;
  return fresh;
}

/** Autosave target — studio edits only ever touch `draft`. */
export async function saveDraft(draft: SiteContent): Promise<void> {
  const { error } = await getSupabase()
    .from("site")
    .update({ draft: clean(draft) })
    .eq("id", SITE_ID);
  if (error) throw error;
}

export type PublishResult = { version: number; publishedAt: string };

/**
 * Publish — spec §4.3: append current published to history (keep 20), copy
 * draft→published, bump version, stamp publishedAt.
 */
export async function publishDraft(draft: SiteContent): Promise<PublishResult> {
  const row = await fetchRow();
  const now = new Date().toISOString();
  if (!row) {
    const fresh: SiteDocument = { ...initialDocument(), draft, published: draft, publishedAt: now };
    const { error } = await getSupabase().from("site").insert({
      id: SITE_ID,
      draft: clean(fresh.draft),
      published: clean(fresh.published),
      version: fresh.version,
      published_at: now,
      history: [],
    });
    if (error) throw error;
    return { version: fresh.version, publishedAt: now };
  }
  const entry: HistoryEntry = {
    version: row.version,
    publishedAt: row.published_at,
    content: row.published,
  };
  const next = {
    draft: clean(draft),
    published: clean(draft),
    version: row.version + 1,
    published_at: now,
    history: clean([entry, ...(row.history ?? [])].slice(0, HISTORY_LIMIT)),
  };
  const { error } = await getSupabase().from("site").update(next).eq("id", SITE_ID);
  if (error) throw error;
  return { version: next.version, publishedAt: now };
}

/**
 * Restore — spec §4.3: append the version being replaced to history first, then
 * the chosen entry's content becomes both published and draft. Nothing is lost.
 */
export async function restoreVersion(entry: HistoryEntry): Promise<SiteDocument> {
  const row = await fetchRow();
  if (!row) throw new Error("Nothing published yet.");
  const replaced: HistoryEntry = {
    version: row.version,
    publishedAt: row.published_at,
    content: row.published,
  };
  const now = new Date().toISOString();
  const next = {
    draft: clean(entry.content),
    published: clean(entry.content),
    version: row.version + 1,
    published_at: now,
    history: clean([replaced, ...(row.history ?? [])].slice(0, HISTORY_LIMIT)),
  };
  const { error } = await getSupabase().from("site").update(next).eq("id", SITE_ID);
  if (error) throw error;
  return {
    draft: next.draft,
    published: next.published,
    version: next.version,
    publishedAt: now,
    history: next.history,
  };
}
