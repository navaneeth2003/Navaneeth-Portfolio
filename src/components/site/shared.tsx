import type { ImageRef } from "@/lib/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const idx = Number(m) - 1;
  if (!y || idx < 0 || idx > 11 || Number.isNaN(idx)) return ym;
  return `${MONTHS[idx]} ${y}`;
}

export function formatRange(start: string, end: string): string {
  return `${formatMonth(start)} — ${end === "present" ? "Present" : formatMonth(end)}`;
}

const RATIO_CLASS: Record<ImageRef["aspectRatio"], string> = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
};

/**
 * Every image renders inside a fixed-ratio box with object-cover — a component can
 * never be distorted by an image, and an empty url falls back to a flat tile with
 * an initial instead of a broken img.
 */
export function RatioImage({
  image,
  alt,
  fallbackText,
  className = "",
  imgClassName = "",
}: {
  image?: ImageRef;
  alt: string;
  fallbackText?: string;
  className?: string;
  imgClassName?: string;
}) {
  const ratio = RATIO_CLASS[image?.aspectRatio ?? "1:1"];
  if (!image?.url) {
    return (
      <div
        aria-hidden
        className={`${ratio} flex items-center justify-center overflow-hidden bg-accent-soft text-accent-ink/50 ${className}`}
      >
        <span className="text-xl font-semibold select-none">{fallbackText?.trim().charAt(0) ?? ""}</span>
      </div>
    );
  }
  return (
    <div className={`${ratio} overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt={alt} className={`h-full w-full object-cover ${imgClassName}`} />
    </div>
  );
}

/** The signature mark: near-black text finished with a warm gold period. */
export function GoldDot({ text, className = "" }: { text: string; className?: string }) {
  const trimmed = text.replace(/\.+$/, "");
  return (
    <span className={className}>
      {trimmed}
      <span className="text-accent">.</span>
    </span>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center truncate rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium text-ink-soft">
      {children}
    </span>
  );
}

/** Consistent section frame: generous whitespace, utility eyebrow, gold-dot heading. */
export function SectionShell({
  id,
  eyebrow,
  heading,
  children,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl py-12 md:py-16">
        <p className="utility text-accent-ink">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">
          <GoldDot text={heading} />
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
