import type { About } from "@/lib/types";
import { SectionShell } from "./shared";

export function AboutSection({ data }: { data: About }) {
  const paragraphs = data.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <SectionShell id="about" eyebrow="About" heading={data.heading}>
      <div className="max-w-3xl space-y-6">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-lg leading-relaxed font-medium tracking-tight text-pretty text-ink md:text-xl"
                : "text-base leading-relaxed text-pretty text-ink-soft/85 md:text-lg"
            }
          >
            {p}
          </p>
        ))}
      </div>
    </SectionShell>
  );
}
