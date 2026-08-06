"use client";

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function Counter({ length, max }: { length: number; max: number }) {
  const tone =
    length >= max ? "text-danger" : length >= max * 0.9 ? "text-warning" : "text-muted";
  return (
    <span className={`text-xs tabular-nums ${tone}`}>
      {length}/{max}
    </span>
  );
}

export function FieldShell({
  label,
  hint,
  counter,
  children,
}: {
  label: string;
  hint?: string;
  counter?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">{label}</span>
        {counter}
      </span>
      <span className="mt-1.5 block">{children}</span>
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-[12px] border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors duration-200 focus:border-accent focus:outline-none";

export function TextField({
  label,
  value,
  onChange,
  max,
  hint,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
  hint?: string;
  placeholder?: string;
  type?: "text" | "url" | "email" | "month";
}) {
  return (
    <FieldShell
      label={label}
      hint={hint}
      counter={max !== undefined && <Counter length={value.length} max={max} />}
    >
      <input
        type={type}
        className={inputClass}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(max !== undefined ? e.target.value.slice(0, max) : e.target.value)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  max,
  rows = 4,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  rows?: number;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <FieldShell label={label} hint={hint} counter={<Counter length={value.length} max={max} />}>
      <textarea
        className={`${inputClass} resize-y leading-relaxed`}
        value={value}
        rows={rows}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
      />
    </FieldShell>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <FieldShell label={label}>
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-ink" : "bg-line"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
