import { SEED_CONTENT } from "./seed";
import { getSupabase, supabaseEnabled } from "./supabase";
import type { SiteContent } from "./types";

export type PublishedSite = {
  content: SiteContent;
  version: number | null;
  live: boolean; // false → rendered from local seed (Supabase not configured/reachable)
};

/**
 * Server-side read of the published content. The public site never touches `draft`.
 * Falls back to the seed so the site renders before Supabase is provisioned.
 */
export async function getPublishedSite(): Promise<PublishedSite> {
  if (!supabaseEnabled()) {
    return { content: SEED_CONTENT, version: null, live: false };
  }
  try {
    const { data, error } = await getSupabase()
      .from("site")
      .select("published, version")
      .eq("id", "main")
      .maybeSingle();
    if (error || !data) {
      return { content: SEED_CONTENT, version: null, live: false };
    }
    return { content: data.published as SiteContent, version: data.version, live: true };
  } catch {
    return { content: SEED_CONTENT, version: null, live: false };
  }
}
