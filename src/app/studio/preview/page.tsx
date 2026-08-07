"use client";

import { CaseStudyView } from "@/components/site/CaseStudyView";
import { PublicSite } from "@/components/site/PublicSite";
import type { SiteContent } from "@/lib/types";
import { useEffect, useState } from "react";

/**
 * Blank shell loaded inside the studio's preview iframe. It renders the exact
 * same components as the live site — the home page or a draft case study —
 * fed the draft content via postMessage.
 */
export default function StudioPreviewPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [view, setView] = useState("home");

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "studio-preview-draft" && e.data.content) {
        setContent(e.data.content as SiteContent);
        setView(typeof e.data.view === "string" ? e.data.view : "home");
      }
    }
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "studio-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-sm text-muted">
        Loading preview…
      </div>
    );
  }

  if (view.startsWith("case:")) {
    const id = view.slice(5);
    const section = content.sections.find((s) => s.type === "projects");
    const project =
      section && section.type === "projects" ? section.items.find((p) => p.id === id) : undefined;
    if (project?.caseStudy?.blocks?.length) {
      return <CaseStudyView project={project} content={content} />;
    }
  }

  return <PublicSite content={content} />;
}
