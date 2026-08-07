"use client";

import type { SiteContent } from "@/lib/types";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DEVICES = [
  { key: "mobile", label: "Mobile", width: 375, Icon: Smartphone },
  { key: "tablet", label: "Tablet", width: 768, Icon: Tablet },
  { key: "desktop", label: "Desktop", width: 1440, Icon: Monitor },
] as const;

type DeviceKey = (typeof DEVICES)[number]["key"];

/**
 * The preview is a real iframe at real device widths, so media queries behave
 * exactly as they will in production — it renders the same components as the
 * live site, fed the draft via postMessage. The view select switches between
 * the home page and any draft case study.
 */
export function Preview({ draft }: { draft: SiteContent }) {
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [view, setView] = useState("home");
  const frameRef = useRef<HTMLIFrameElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef(draft);
  const viewRef = useRef(view);
  const [box, setBox] = useState({ w: 0, h: 0 });

  draftRef.current = draft;
  viewRef.current = view;

  const projectsSection = draft.sections.find((s) => s.type === "projects");
  const caseStudies =
    projectsSection && projectsSection.type === "projects"
      ? projectsSection.items.filter((p) => p.caseStudy?.blocks?.length)
      : [];

  // If the selected case study lost its blocks, fall back to home.
  useEffect(() => {
    if (view !== "home" && !caseStudies.some((p) => `case:${p.id}` === view)) {
      setView("home");
    }
  }, [view, caseStudies]);

  function send() {
    frameRef.current?.contentWindow?.postMessage(
      { type: "studio-preview-draft", content: draftRef.current, view: viewRef.current },
      window.location.origin,
    );
  }

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "studio-preview-ready") send();
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    send();
  }, [draft, view]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const width = DEVICES.find((d) => d.key === device)!.width;
  const scale = box.w > 0 ? Math.min(1, box.w / width) : 1;
  const frameHeight = box.h > 0 ? box.h / scale : 800;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 pb-3">
        <span className="utility shrink-0">Live preview</span>
        <div className="flex min-w-0 items-center gap-2">
          {caseStudies.length > 0 && (
            <select
              aria-label="Preview page"
              className="min-w-0 rounded-[12px] border border-line bg-surface px-2.5 py-1.5 text-xs font-medium"
              value={view}
              onChange={(e) => setView(e.target.value)}
            >
              <option value="home">Home</option>
              {caseStudies.map((p) => (
                <option key={p.id} value={`case:${p.id}`}>
                  {p.title.trim().slice(0, 40) || "Untitled case study"}
                </option>
              ))}
            </select>
          )}
          <div className="flex shrink-0 rounded-[12px] border border-line bg-surface p-0.5">
            {DEVICES.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                aria-label={`Preview at ${label} width`}
                aria-pressed={device === key}
                onClick={() => setDevice(key)}
                className={`rounded-[10px] px-3 py-1.5 transition-colors duration-200 ${
                  device === key ? "bg-ink text-white" : "text-muted hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={boxRef}
        className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-surface"
      >
        <iframe
          ref={frameRef}
          src="/studio/preview"
          title="Draft preview"
          onLoad={send}
          style={{
            width,
            height: frameHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: "0",
          }}
        />
      </div>
    </div>
  );
}
