import type { ProficiencyLevel, ToolItem } from "@/lib/types";
import { RatioImage, SectionShell } from "./shared";

const LEVEL_DOTS: Record<ProficiencyLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Expert: 3,
};

function LevelDots({ level }: { level: ProficiencyLevel }) {
  const filled = LEVEL_DOTS[level];
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`h-1.5 w-1.5 rounded-full ${n <= filled ? "bg-accent" : "bg-line"}`}
        />
      ))}
    </span>
  );
}

export function ToolsSection({ items }: { items: ToolItem[] }) {
  return (
    <SectionShell id="tools" eyebrow="Tools" heading="What I work with">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((tool) => (
          <div
            key={tool.id}
            className="card flex items-center gap-3.5 !rounded-2xl !p-4 transition-colors duration-200 hover:border-ink/15"
          >
            <RatioImage
              image={tool.icon}
              alt=""
              fallbackText={tool.name}
              className="h-10 w-10 shrink-0 rounded-xl border border-line"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{tool.name}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                <LevelDots level={tool.level} />
                {tool.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
