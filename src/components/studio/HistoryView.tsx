"use client";

import type { HistoryEntry } from "@/lib/types";
import { History } from "lucide-react";

export function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function HistoryView({
  history,
  currentVersion,
  currentPublishedAt,
  onRestore,
  busy,
}: {
  history: HistoryEntry[];
  currentVersion: number;
  currentPublishedAt: string;
  onRestore: (entry: HistoryEntry) => void;
  busy: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl border border-accent/40 bg-accent-soft/50 px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold">Version {currentVersion}</p>
          <p className="text-xs text-muted">Published {formatWhen(currentPublishedAt)}</p>
        </div>
        <span className="utility !text-accent-ink">Live now</span>
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
          No earlier versions yet — they&apos;ll appear here after your next publish.
        </p>
      ) : (
        history.map((entry) => (
          <div
            key={`${entry.version}-${entry.publishedAt}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg">
                <History className="h-4 w-4 text-muted" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">Version {entry.version}</p>
                <p className="truncate text-xs text-muted">Published {formatWhen(entry.publishedAt)}</p>
              </div>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={() => onRestore(entry)}
              className="rounded-[12px] border border-line bg-surface px-3.5 py-2 text-sm font-medium transition-colors duration-200 hover:border-ink/30 disabled:opacity-40"
            >
              Restore
            </button>
          </div>
        ))
      )}
    </div>
  );
}
