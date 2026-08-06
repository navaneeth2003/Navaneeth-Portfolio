import type { ProjectItem } from "@/lib/types";
import { PROJECT_VERTICALS } from "@/lib/types";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Pill, RatioImage, SectionShell } from "./shared";

function ProjectCard({ item }: { item: ProjectItem }) {
  return (
    <article className="group card flex flex-col overflow-hidden !p-0 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-ink/15">
      <RatioImage
        image={item.coverImage}
        alt=""
        fallbackText={item.title}
        className="border-b border-line"
        imgClassName="transition-transform duration-200 group-hover:scale-[1.02]"
      />
      <div className="flex grow flex-col p-6 md:p-7">
        <h4 className="text-lg leading-snug font-semibold tracking-tight break-words">{item.title}</h4>
        <p className="mt-3 text-sm leading-relaxed text-muted break-words">{item.overview}</p>

        {item.resultsAndImpact && (
          <div className="mt-5 rounded-2xl bg-accent-soft/60 px-5 py-4">
            <p className="utility !text-accent-ink">Results & impact</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft/90 break-words">
              {item.resultsAndImpact}
            </p>
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {item.tags.map((t, i) => (
              <Pill key={i}>{t}</Pill>
            ))}
          </div>
        )}

        {(item.caseStudyUrl || item.liveUrl) && (
          <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6">
            {item.caseStudyUrl && (
              <a
                href={item.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent-ink"
              >
                <BookOpen className="h-4 w-4" strokeWidth={2} />
                Read case study
              </a>
            )}
            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors duration-200 hover:text-accent-ink"
              >
                View live
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function ProjectsSection({ items }: { items: ProjectItem[] }) {
  // Verticals render in their canonical order; an empty vertical simply doesn't appear.
  const groups = PROJECT_VERTICALS.map((v) => ({
    vertical: v,
    items: items.filter((p) => p.vertical === v),
  })).filter((g) => g.items.length > 0);

  return (
    <SectionShell id="projects" eyebrow="Projects" heading="Work & case studies">
      <div className="space-y-14">
        {groups.map((group) => (
          <div key={group.vertical}>
            <div className="flex items-baseline gap-3">
              <h3 className="text-xl font-semibold tracking-tight">{group.vertical}</h3>
              <span className="utility">
                {group.items.length} {group.items.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {group.items.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
