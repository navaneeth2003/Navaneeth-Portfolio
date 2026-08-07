import { doc, getDoc, runTransaction, setDoc } from "firebase/firestore";
import { getDb } from "./firebase";
import { HISTORY_LIMIT } from "./limits";
import { SEED_CONTENT } from "./seed";
import type { HistoryEntry, SiteContent, SiteDocument } from "./types";

export const SITE_COLLECTION = "site";
export const SITE_DOC_ID = "main";

function siteRef() {
  return doc(getDb(), SITE_COLLECTION, SITE_DOC_ID);
}

/** Firestore rejects `undefined` — strip it without changing anything else. */
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

/** Load the site document, seeding it on first run. */
export async function loadOrSeedSite(): Promise<SiteDocument> {
  const ref = siteRef();
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as SiteDocument;
  const fresh = clean(initialDocument());
  await setDoc(ref, fresh);
  return fresh;
}

/** Autosave target — studio edits only ever touch `draft`. */
export async function saveDraft(draft: SiteContent): Promise<void> {
  await setDoc(siteRef(), { draft: clean(draft) }, { merge: true });
}

export type PublishResult = { version: number; publishedAt: string };

/**
 * Publish — spec §4.3: append current published to history (keep 20), copy
 * draft→published, bump version, stamp publishedAt.
 */
export async function publishDraft(draft: SiteContent): Promise<PublishResult> {
  const ref = siteRef();
  return runTransaction(getDb(), async (tx) => {
    const snap = await tx.get(ref);
    const now = new Date().toISOString();
    if (!snap.exists()) {
      const fresh: SiteDocument = {
        ...initialDocument(),
        draft,
        published: draft,
        publishedAt: now,
      };
      tx.set(ref, clean(fresh));
      return { version: fresh.version, publishedAt: now };
    }
    const data = snap.data() as SiteDocument;
    const entry: HistoryEntry = {
      version: data.version,
      publishedAt: data.publishedAt,
      content: data.published,
    };
    const next: SiteDocument = {
      draft,
      published: draft,
      version: data.version + 1,
      publishedAt: now,
      history: [entry, ...data.history].slice(0, HISTORY_LIMIT),
    };
    tx.set(ref, clean(next));
    return { version: next.version, publishedAt: now };
  });
}

/**
 * Restore — spec §4.3: append the version being replaced to history first, then the
 * chosen entry's content becomes both published and draft. Nothing is ever lost.
 */
export async function restoreVersion(entry: HistoryEntry): Promise<SiteDocument> {
  const ref = siteRef();
  return runTransaction(getDb(), async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Nothing published yet.");
    const data = snap.data() as SiteDocument;
    const replaced: HistoryEntry = {
      version: data.version,
      publishedAt: data.publishedAt,
      content: data.published,
    };
    const next: SiteDocument = {
      draft: entry.content,
      published: entry.content,
      version: data.version + 1,
      publishedAt: new Date().toISOString(),
      history: [replaced, ...data.history].slice(0, HISTORY_LIMIT),
    };
    tx.set(ref, clean(next));
    return next;
  });
}
