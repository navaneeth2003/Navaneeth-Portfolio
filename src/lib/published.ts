import { doc, getDoc } from "firebase/firestore";
import { firebaseEnabled, getDb } from "./firebase";
import { SEED_CONTENT } from "./seed";
import type { SiteContent, SiteDocument } from "./types";

export type PublishedSite = {
  content: SiteContent;
  version: number | null;
  live: boolean; // false → rendered from local seed (Firebase not configured/reachable)
};

/**
 * Server-side read of the published content. The public site never touches `draft`.
 * Falls back to the seed so the site renders before Firebase is provisioned.
 */
export async function getPublishedSite(): Promise<PublishedSite> {
  if (!firebaseEnabled()) {
    return { content: SEED_CONTENT, version: null, live: false };
  }
  try {
    const snap = await getDoc(doc(getDb(), "site", "main"));
    if (!snap.exists()) {
      return { content: SEED_CONTENT, version: null, live: false };
    }
    const data = snap.data() as SiteDocument;
    return { content: data.published, version: data.version, live: true };
  } catch {
    return { content: SEED_CONTENT, version: null, live: false };
  }
}
