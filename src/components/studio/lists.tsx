"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { FieldShell } from "./fields";

function SortableRow({
  id,
  header,
  children,
}: {
  id: string;
  header: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-2xl border border-line bg-surface ${isDragging ? "z-10 shadow-pop" : ""}`}
    >
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-0">
        <button
          type="button"
          aria-label="Drag to reorder"
          className="cursor-grab touch-none rounded-md p-1 text-muted hover:text-ink active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" strokeWidth={2} />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">{header}</div>
      </div>
      {children && <div className="px-4 pt-3 pb-4 pl-11">{children}</div>}
    </div>
  );
}

/**
 * Drag-to-reorder list of entities (experience items, projects, …). The add
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from < 0 || to < 0) return;
    onChange(arrayMove(items, from, to));
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
          {emptyLabel}
        </p>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <SortableRow
                key={item.id}
                id={item.id}
                header={
                  <>
                    <span className="truncate text-sm font-semibold">
                      {itemTitle(item).trim() || "Untitled"}
                    </span>
                    <button
                      type="button"
                      aria-label="Remove item"
                      onClick={() => {
                        if (window.confirm("Remove this item from the draft?")) {
                          onChange(items.filter((i) => i.id !== item.id));
                        }
                      }}
                      className="rounded-md p-1.5 text-muted transition-colors duration-200 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </>
                }
              >
                {renderFields(item, (patch) =>
                  onChange(items.map((i) => (i.id === item.id ? { ...i, ...patch } : i))),
                )}
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={items.length >= max}
          onClick={() => onChange([...items, create()])}
          className="inline-flex items-center gap-1.5 rounded-[14px] border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          {addLabel}
        </button>
        <span className="text-xs text-muted tabular-nums">
          {items.length} of {max}
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
            {multiline ? (
              <textarea
                className="w-full resize-y rounded-[12px] border border-line bg-surface px-3.5 py-2.5 text-sm leading-relaxed transition-colors duration-200 focus:border-accent focus:outline-none"
                rows={2}
                value={v}
                maxLength={maxChars}
                placeholder={placeholder}
                onChange={(e) =>
                  onChange(values.map((x, j) => (j === i ? e.target.value.slice(0, maxChars) : x)))
                }
              />
            ) : (
              <input
                className="w-full rounded-[12px] border border-line bg-surface px-3.5 py-2.5 text-sm transition-colors duration-200 focus:border-accent focus:outline-none"
                value={v}
                maxLength={maxChars}
                placeholder={placeholder}
                onChange={(e) =>
                  onChange(values.map((x, j) => (j === i ? e.target.value.slice(0, maxChars) : x)))
                }
              />
            )}
            <div className="flex shrink-0 flex-col">
              <button
                type="button"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => move(i, i - 1)}
                className="rounded p-0.5 text-muted hover:text-ink disabled:opacity-30"
              >
                <ChevronUp className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={i === values.length - 1}
                onClick={() => move(i, i + 1)}
                className="rounded p-0.5 text-muted hover:text-ink disabled:opacity-30"
              >
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="mt-1 shrink-0 rounded-md p-1.5 text-muted transition-colors duration-200 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={values.length >= maxItems}
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
