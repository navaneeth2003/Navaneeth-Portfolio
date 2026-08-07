import { CaseStudyView } from "@/components/site/CaseStudyView";
import { getPublishedSite } from "@/lib/published";
import type { ProjectItem, SiteContent } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function findProject(content: SiteContent, id: string): ProjectItem | undefined {
  const section = content.sections.find((s) => s.type === "projects");
  if (!section || section.type !== "projects") return undefined;
  return section.items.find((p) => p.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { content } = await getPublishedSite();
  const project = findProject(content, id);
  if (!project) return {};
  return { title: project.title, description: project.overview.slice(0, 160) };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { content } = await getPublishedSite();
  const project = findProject(content, id);
  if (!project || !project.caseStudy?.blocks?.length) notFound();
  return <CaseStudyView project={project} content={content} />;
}
