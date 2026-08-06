import type { EducationItem } from "@/lib/types";
import { GraduationCap } from "lucide-react";
import { SectionShell } from "./shared";

export function EducationSection({ items }: { items: EducationItem[] }) {
  return (
    <SectionShell id="education" eyebrow="Education" heading="Where I studied">
      <div className="card divide-y divide-line !p-0">
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-6 md:px-8">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
              <GraduationCap className="h-5 w-5 text-accent-ink" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1 basis-56">
              <h3 className="font-semibold tracking-tight break-words">{item.degree}</h3>
              {item.institution && (
                <p className="mt-0.5 text-sm text-muted break-words">{item.institution}</p>
              )}
            </div>
            <span className="utility whitespace-nowrap">
              {item.startYear} — {item.endYear}
            </span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
