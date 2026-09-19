"use client";

import { useState } from "react";
import type { HistoryEntry } from "@/lib/types";
import { Check, Eye, History, Pencil, RotateCcw, Trash2, X } from "lucide-react";

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
  previewingVersion,
  onPreview,
  onRestore,
  onRename,
  onDelete,
  busy,
}: {
  history: HistoryEntry[];
  currentVersion: number;
  currentPublishedAt: string;
  previewingVersion?: number | null;
  onPreview: (entry: HistoryEntry) => void;
  onRestore: (entry: HistoryEntry) => void;
  onRename: (version: number, label: string) => Promise<void>;
  onDelete: (version: number) => Promise<void>;
  busy: boolean;
}) {
  const [editingVersion, setEditingVersion] = useState<number | null>(null);
  const [renameText, setRenameText] = useState("");
  const [confirmDeleteVersion, setConfirmDeleteVersion] = useState<number | null>(null);
  const [confirmRestoreEntry, setConfirmRestoreEntry] = useState<HistoryEntry | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  function startEditing(entry: HistoryEntry) {
    setEditingVersion(entry.version);
    setRenameText(entry.label || `Version ${entry.version}`);
  }

  async function handleSaveRename(version: number) {
    if (actionBusy) return;
    setActionBusy(true);
    try {
      await onRename(version, renameText.trim());
      setEditingVersion(null);
    } finally {
      setActionBusy(false);
    }
  }

  async function handleDeleteConfirm(version: number) {
    if (actionBusy) return;
    setActionBusy(true);
    try {
      await onDelete(version);
      setConfirmDeleteVersion(null);
    } finally {
      setActionBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Live Version Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-accent/40 bg-accent-soft/50 p-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-ink">Version {currentVersion}</p>
            <span className="utility !text-accent-ink rounded bg-accent-soft px-2 py-0.5 text-[10px] font-bold">
              Live now
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">Published {formatWhen(currentPublishedAt)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Historical Snapshots ({history.length})
        </h3>
        <span className="text-[11px] text-muted">
          Click Preview to view without restoring
        </span>
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
          No earlier versions yet — historical snapshots will appear here after your next publish.
        </p>
      ) : (
        <div className="space-y-2.5">
          {history.map((entry) => {
            const isPreviewing = previewingVersion === entry.version;
            const isEditing = editingVersion === entry.version;
            const displayName = entry.label?.trim() || `Version ${entry.version}`;

            return (
              <div
                key={`${entry.version}-${entry.publishedAt}`}
                className={`rounded-2xl border p-4 transition-all duration-200 ${
                  isPreviewing
                    ? "border-accent bg-accent-soft/30 ring-1 ring-accent"
                    : "border-line bg-surface hover:border-ink/20"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isPreviewing ? "bg-accent text-white" : "bg-bg text-muted"
                      }`}
                    >
                      <History className="h-4 w-4" strokeWidth={2} />
                    </span>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={renameText}
                            onChange={(e) => setRenameText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(entry.version);
                              if (e.key === "Escape") setEditingVersion(null);
                            }}
                            autoFocus
                            placeholder="Version name / note"
                            className="rounded-lg border border-accent bg-bg px-2.5 py-1 text-xs font-medium text-ink focus:outline-none"
                          />
                          <button
                            type="button"
                            disabled={actionBusy}
                            onClick={() => handleSaveRename(entry.version)}
                            className="rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingVersion(null)}
                            className="rounded-lg border border-line px-2 py-1 text-xs text-muted hover:text-ink"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
                            <span className="rounded bg-bg px-1.5 py-0.5 text-[10px] font-medium text-muted">
                              v{entry.version}
                            </span>
                            <button
                              type="button"
                              onClick={() => startEditing(entry)}
                              title="Rename this version"
                              className="rounded p-0.5 text-muted transition-colors hover:text-ink"
                            >
                              <Pencil className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            Published {formatWhen(entry.publishedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPreview(entry)}
                      className={`inline-flex items-center gap-1.5 rounded-[12px] px-3 py-2 text-xs font-medium transition-colors duration-200 ${
                        isPreviewing
                          ? "bg-accent text-white font-semibold"
                          : "border border-line bg-surface text-ink hover:bg-bg"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {isPreviewing ? "Viewing preview" : "Preview"}
                    </button>

                    <button
                      type="button"
                      disabled={busy || actionBusy}
                      onClick={() => setConfirmRestoreEntry(entry)}
                      className="inline-flex items-center gap-1.5 rounded-[12px] border border-line bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors duration-200 hover:bg-bg disabled:opacity-40"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-muted" />
                      Restore
                    </button>

                    <button
                      type="button"
                      disabled={busy || actionBusy}
                      onClick={() => setConfirmDeleteVersion(entry.version)}
                      title="Delete version from history"
                      className="rounded-[12px] border border-line bg-surface p-2 text-muted transition-colors duration-200 hover:border-danger hover:text-danger disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Delete confirmation inline banner */}
                {confirmDeleteVersion === entry.version && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-danger/30 bg-danger/5 p-3 text-xs text-danger">
                    <span>Delete Version {entry.version} permanently from history? (Draft & live site are safe)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionBusy}
                        onClick={() => handleDeleteConfirm(entry.version)}
                        className="rounded-lg bg-danger px-2.5 py-1 font-semibold text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {actionBusy ? "Deleting…" : "Confirm Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteVersion(null)}
                        className="rounded-lg border border-line px-2 py-1 text-muted hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Restore confirmation inline banner */}
                {confirmRestoreEntry?.version === entry.version && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-warning/40 bg-warning/5 p-3 text-xs text-warning">
                    <span>
                      Restore Version {entry.version}? This will replace your current draft with this snapshot.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={busy || actionBusy}
                        onClick={() => {
                          onRestore(entry);
                          setConfirmRestoreEntry(null);
                        }}
                        className="rounded-lg bg-ink px-2.5 py-1 font-semibold text-white hover:opacity-90 disabled:opacity-50"
                      >
                        Confirm Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRestoreEntry(null)}
                        className="rounded-lg border border-line px-2 py-1 text-muted hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
