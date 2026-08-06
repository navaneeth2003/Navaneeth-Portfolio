import type { About } from "@/lib/types";
import { SectionShell } from "./shared";

export function AboutSection({ data }: { data: About }) {
  const paragraphs = data.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <SectionShell id="about" eyebrow="About" heading={data.heading}>
      <div className="max-w-3xl space-y-5">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-ink-soft/90 md:text-lg">
            {p}
          </p>
        ))}
      </div>
    </SectionShell>
  );
}
