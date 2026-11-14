import { cache } from "react";
import { SEED_CONTENT } from "./seed";
import { getSupabase, supabaseEnabled } from "./supabase";
import type { SiteContent } from "./types";

export type PublishedSite = {
  content: SiteContent;
  version: number | null;
  live: boolean; // false → rendered from the built-in seed (Supabase not configured / reachable)
};

const FALLBACK: PublishedSite = { content: SEED_CONTENT, version: null, live: false };

/**
 * Server-side read of the published content. The public site never touches
 * `draft`. Falls back to the seed so the site renders before the backend is
 * provisioned or if it is briefly unreachable.
 *
 * Reads `site_public` — the view that exposes only the published content
 * (minus the stored phone number) while the `site` table itself is owner-only
 * (supabase/setup.sql). A project whose SQL predates the view still answers
 * on the table, so the page keeps working either way.
 */
export const getPublishedSite = cache(async function getPublishedSite(): Promise<PublishedSite> {
  if (!supabaseEnabled()) return FALLBACK;
  try {
    const sb = getSupabase();
    const view = await sb.from("site_public").select("published, version").eq("id", "main").maybeSingle();
    if (!view.error && view.data) {
      return { content: view.data.published as SiteContent, version: view.data.version, live: true };
    }
    const table = await sb.from("site").select("published, version").eq("id", "main").maybeSingle();
    if (table.error || !table.data) return FALLBACK;
    return { content: table.data.published as SiteContent, version: table.data.version, live: true };
  } catch {
    return FALLBACK;
  }
});
