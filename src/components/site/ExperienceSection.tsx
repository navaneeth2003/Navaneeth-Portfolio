import type { ExperienceItem } from "@/lib/types";
import { formatRange, Pill, RatioImage, SectionShell } from "./shared";

function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <article className="card p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-center gap-4">
          <RatioImage
            image={item.logo}
            alt=""
            fallbackText={item.company}
            className="h-12 w-12 shrink-0 rounded-xl border border-line"
          />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight break-words">{item.role}</h3>
            <p className="text-sm font-medium text-muted break-words">{item.company}</p>
          </div>
        </div>
        <span className="utility rounded-full bg-bg px-3 py-1.5 whitespace-nowrap">
          {formatRange(item.startDate, item.endDate)}
        </span>
      </div>

      {item.bullets.length > 0 && (
        <ul className="mt-6 space-y-3">
          {item.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft/90">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="min-w-0 break-words">{b}</span>
            </li>
          ))}
        </ul>
      )}

      {item.highlight && (
        <p className="mt-6 rounded-2xl border-l-2 border-accent bg-accent-soft/60 px-5 py-4 text-[15px] leading-relaxed font-medium text-accent-ink break-words">
          {item.highlight}
        </p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((t, i) => (
            <Pill key={i}>{t}</Pill>
          ))}
        </div>
      )}
    </article>
  );
}

export function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  return (
    <SectionShell id="experience" eyebrow="Experience" heading="Where I've worked">
      <div className="space-y-6">
        {items.map((item) => (
          <ExperienceCard key={item.id} item={item} />
        ))}
      </div>
    </SectionShell>
  );
}
