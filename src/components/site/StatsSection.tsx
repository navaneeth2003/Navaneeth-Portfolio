import type { StatItem } from "@/lib/types";
import { BadgeCheck } from "lucide-react";
import { RatioImage } from "./shared";

const COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3 lg:grid-cols-6",
};

export function StatsSection({ items }: { items: StatItem[] }) {
  const cols = COLS[Math.min(items.length, 6)] ?? COLS[4];

  return (
    <section id="stats" className="scroll-mt-24 px-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl py-6" data-reveal>
        <div className="card overflow-hidden !p-0">
          <div className={`grid grid-cols-2 gap-px bg-line ${cols}`}>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center justify-center gap-1.5 bg-surface px-4 py-8 text-center"
              >
                <div className="flex h-10 items-center justify-center">
                  {item.value ? (
                    <span className="text-3xl font-bold tracking-tight md:text-4xl">
                      {item.value}
                    </span>
                  ) : item.icon?.url ? (
                    <RatioImage
                      image={item.icon}
                      alt=""
                      className="h-9 w-9 rounded-lg"
                      fallbackText={item.label}
                    />
                  ) : (
                    <BadgeCheck className="h-8 w-8 text-accent" strokeWidth={2} />
                  )}
                </div>
                <span className="text-sm font-medium text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
