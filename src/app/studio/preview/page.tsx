"use client";

import { useEffect, useState } from "react";
import { PublicSite } from "@/components/site/PublicSite";
import type { SiteContent } from "@/lib/types";

/**
 * Blank shell loaded inside the studio's preview iframe. It renders the exact
 * same PublicSite component as the live page, fed the draft via postMessage.
 */
export default function StudioPreviewPage() {
  const [content, setContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "studio-preview-draft" && e.data.content) {
        setContent(e.data.content as SiteContent);
      }
    }
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "studio-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070708] font-heading text-[13px] uppercase tracking-[0.2em] text-white/40">
        Loading preview…
      </div>
    );
  }

  return <PublicSite content={content} preloader={false} />;
}
