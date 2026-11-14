"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FieldShell } from "./fields";

export function arrayMove<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function MoveButtons({
  index,
  count,
  label,
  onMove,
}: {
  index: number;
  count: number;
  label: string;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <div className="flex shrink-0 flex-col">
      <button
        type="button"
        aria-label={`Move ${label} up`}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="rounded p-0.5 text-muted transition-colors duration-200 hover:text-ink disabled:opacity-30"
      >
        <ChevronUp className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label={`Move ${label} down`}
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        className="rounded p-0.5 text-muted transition-colors duration-200 hover:text-ink disabled:opacity-30"
      >
        <ChevronDown className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

/**
 * Ordered list of entities (experience items, projects, …). Entries reorder
 * with keyboard-friendly move buttons, collapse to a title row, and the add
 * control disables at the cap — the primary layout guardrail for list length.
 */
export function EntityList<T extends { id: string }>({
  items,
  onChange,
  max,
  addLabel,
  emptyLabel,
  create,
  itemTitle,
  renderFields,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  max: number;
  addLabel: string;
  emptyLabel: string;
  create: () => T;
  itemTitle: (item: T) => string;
  renderFields: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const full = items.length >= max;

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    onChange(arrayMove(items, from, to));
  }

  function add() {
    if (full) return;
    const item = create();
    onChange([...items, item]);
    setOpen((o) => ({ ...o, [item.id]: true }));
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
          {emptyLabel}
        </p>
      )}
      {items.map((item, index) => {
        const title = itemTitle(item).trim() || "Untitled";
        const expanded = open[item.id] ?? false;
        return (
          <div key={item.id} className="rounded-2xl border border-line bg-surface">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <MoveButtons index={index} count={items.length} label={title} onMove={move} />
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen((o) => ({ ...o, [item.id]: !expanded }))}
                className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors duration-200 hover:bg-bg"
              >
                <span className="truncate text-sm font-semibold">{title}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>
              <button
                type="button"
                aria-label={`Remove ${title}`}
                onClick={() => {
                  if (window.confirm("Remove this item from the draft?")) {
                    onChange(items.filter((i) => i.id !== item.id));
                  }
                }}
                className="shrink-0 rounded-md p-1.5 text-muted transition-colors duration-200 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            {expanded && (
              <div className="border-t border-line px-4 pb-4 pt-4">
                {renderFields(item, (patch) =>
                  onChange(items.map((i) => (i.id === item.id ? { ...i, ...patch } : i))),
                )}
              </div>
            )}
          </div>
        );
      })}
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={full}
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-[14px] border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          {addLabel}
        </button>
        <span className="text-xs text-muted tabular-nums">
          {items.length} of {max}
          {full ? " · limit reached" : ""}
        </span>
      </div>
    </div>
  );
}

/** Short string lists (bullets, tags, skills): reorder with arrows, capped add. */
export function StringListEditor({
  label,
  values,
  onChange,
  maxItems,
  maxChars,
  addLabel,
  placeholder,
  multiline = false,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  maxItems: number;
  maxChars: number;
  addLabel: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= values.length) return;
    onChange(arrayMove(values, from, to));
  };
  const full = values.length >= maxItems;
  const inputClass =
    "w-full rounded-[12px] border border-line bg-surface px-3.5 py-2.5 text-sm transition-colors duration-200 focus:border-accent focus:outline-none";

  return (
    <FieldShell
      label={label}
      counter={
        <span className="text-xs text-muted tabular-nums">
          {values.length} of {maxItems}
        </span>
      }
    >
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <div className="min-w-0 flex-1">
              {multiline ? (
                <textarea
                  className={`${inputClass} resize-y leading-relaxed`}
                  rows={2}
                  value={v}
                  maxLength={maxChars}
                  placeholder={placeholder}
                  aria-label={`${label} ${i + 1}`}
                  onChange={(e) =>
                    onChange(values.map((x, j) => (j === i ? e.target.value.slice(0, maxChars) : x)))
                  }
                />
              ) : (
                <input
                  className={inputClass}
                  value={v}
                  maxLength={maxChars}
                  placeholder={placeholder}
                  aria-label={`${label} ${i + 1}`}
                  onChange={(e) =>
                    onChange(values.map((x, j) => (j === i ? e.target.value.slice(0, maxChars) : x)))
                  }
                />
              )}
              <span
                className={`mt-1 block text-right text-[11px] tabular-nums ${
                  v.length >= maxChars ? "text-danger" : "text-muted"
                }`}
              >
                {v.length}/{maxChars}
              </span>
            </div>
            <MoveButtons index={i} count={values.length} label={`${label} ${i + 1}`} onMove={move} />
            <button
              type="button"
              aria-label={`Remove ${label} ${i + 1}`}
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="mt-1 shrink-0 rounded-md p-1.5 text-muted transition-colors duration-200 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={full}
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-1.5 rounded-[12px] border border-dashed border-line px-3.5 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          {addLabel}
        </button>
      </div>
    </FieldShell>
  );
}
