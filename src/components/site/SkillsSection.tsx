import type { SkillGroup } from "@/lib/types";
import { Pill, SectionShell } from "./shared";

export function SkillsSection({ items }: { items: SkillGroup[] }) {
  // A group with zero skills hides rather than rendering an empty card.
  const groups = items.filter((g) => g.skills.length > 0);
  if (groups.length === 0) return null;

  return (
    <SectionShell id="skills" eyebrow="Core skills" heading="How I think and work">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="card p-6 md:p-7">
            <h3 className="font-semibold tracking-tight break-words">{group.category}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((s, i) => (
                <Pill key={i}>{s}</Pill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
