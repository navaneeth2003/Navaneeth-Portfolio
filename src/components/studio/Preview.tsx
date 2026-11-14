"use client";

import type { SiteContent } from "@/lib/types";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DeviceKey = "mobile" | "tablet" | "desktop";
type Size = { w: number; h: number; name: string };

const DEVICES: { key: DeviceKey; label: string; Icon: typeof Monitor; sizes: Size[] }[] = [
  {
    key: "mobile",
    label: "Mobile",
    Icon: Smartphone,
    sizes: [
      { w: 390, h: 844, name: "iPhone 15" },
      { w: 375, h: 812, name: "iPhone 13 mini" },
      { w: 360, h: 800, name: "Android" },
      { w: 430, h: 932, name: "iPhone 15 Plus" },
    ],
  },
  {
    key: "tablet",
    label: "Tablet",
    Icon: Tablet,
    sizes: [
      { w: 820, h: 1180, name: "iPad Air" },
      { w: 768, h: 1024, name: "iPad mini" },
      { w: 1024, h: 1366, name: "iPad Pro 12.9" },
      { w: 1180, h: 820, name: "iPad Air landscape" },
    ],
  },
  {
    key: "desktop",
    label: "Desktop",
    Icon: Monitor,
    sizes: [
      { w: 1440, h: 900, name: "Laptop" },
      { w: 1280, h: 800, name: "Small laptop" },
      { w: 1920, h: 1080, name: "Monitor" },
    ],
  },
];

// The bezel around each device, in CSS px at 1:1. Phones and tablets get the
// rounded slab; desktops a slim window with a title bar.
const SHELL: Record<DeviceKey, { pad: number; radius: number; screenRadius: number; bar: number }> = {
  mobile: { pad: 12, radius: 46, screenRadius: 34, bar: 0 },
  tablet: { pad: 14, radius: 30, screenRadius: 18, bar: 0 },
  desktop: { pad: 1, radius: 14, screenRadius: 0, bar: 30 },
};

const PREVIEW_TYPE = "studio-preview-draft";
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * A device preview, not a scaled page: the frame takes the selected device's
 * real dimensions and the iframe inside renders the site at exactly that
 * viewport, so every breakpoint, wrap and grid behaves as it will on the
 * device. When the device is bigger than the panel, the whole device (bezel
 * and all) is fitted uniformly — the page inside still sees its true width.
 * The same PublicSite as the live page renders inside, fed the draft over
 * postMessage; nothing here reads `published`.
 */
export function Preview({ draft }: { draft: SiteContent }) {
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [sizeIndex, setSizeIndex] = useState<Record<DeviceKey, number>>({
    mobile: 0,
    tablet: 0,
    desktop: 0,
  });
  const frameRef = useRef<HTMLIFrameElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const latest = useRef(draft);
  const [stage, setStage] = useState({ w: 0, h: 0 });

  function post(content: SiteContent) {
    frameRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_TYPE, content },
      window.location.origin,
    );
  }

  useEffect(() => {
    latest.current = draft;
    post(draft);
  }, [draft]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "studio-preview-ready") post(latest.current);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStage({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const def = DEVICES.find((d) => d.key === device)!;
  const size = def.sizes[sizeIndex[device]] ?? def.sizes[0];
  const shell = SHELL[device];
  const shellW = size.w + shell.pad * 2;
  const shellH = size.h + shell.pad * 2 + shell.bar;
  // Breathing room inside the stage, then fit — never upscale.
  const fit =
    stage.w > 0 && stage.h > 0
      ? Math.min(1, (stage.w - 24) / shellW, (stage.h - 24) / shellH)
      : 1;
  const sizing = `width 360ms ${EASE}, height 360ms ${EASE}`;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="utility shrink-0">Live preview</span>
          <span className="truncate text-xs tabular-nums text-muted">
            {size.w} × {size.h}
            {fit < 1 ? ` · ${Math.round(fit * 100)}%` : ""}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select
            aria-label="Device size"
            value={sizeIndex[device]}
            onChange={(e) =>
              setSizeIndex((s) => ({ ...s, [device]: Number(e.target.value) }))
            }
            className="max-w-[170px] rounded-[10px] border border-line bg-surface px-2 py-1.5 text-xs font-medium text-ink"
          >
            {def.sizes.map((s, i) => (
              <option key={s.name} value={i}>
                {s.name} · {s.w}×{s.h}
              </option>
            ))}
          </select>
          <div className="flex rounded-[12px] border border-line bg-surface p-0.5">
            {DEVICES.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                aria-label={`Preview on ${label}`}
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

      {/* the stage: the device sits centred on a dotted mat */}
      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-[#e9e7e2] [background-image:radial-gradient(rgba(0,0,0,0.09)_1px,transparent_1px)] [background-size:18px_18px]"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: shellW * fit, height: shellH * fit, transition: sizing }}
        >
          <div
            className="border border-black/50 bg-[#1b1b1e] shadow-[0_30px_70px_-24px_rgba(0,0,0,0.55)]"
            style={{
              width: shellW,
              height: shellH,
              padding: shell.pad,
              borderRadius: shell.radius,
              transform: `scale(${fit})`,
              transformOrigin: "top left",
              transition: `${sizing}, transform 360ms ${EASE}, border-radius 360ms ${EASE}, padding 360ms ${EASE}`,
            }}
          >
            {shell.bar > 0 && (
              <div className="flex items-center gap-1.5 px-3" style={{ height: shell.bar }} aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
            )}
            <div
              className="overflow-hidden bg-[#070708]"
              style={{
                width: size.w,
                height: size.h,
                borderRadius: shell.screenRadius,
                transition: `${sizing}, border-radius 360ms ${EASE}`,
              }}
            >
              <iframe
                ref={frameRef}
                src="/studio/preview"
                title="Draft preview"
                onLoad={() => post(latest.current)}
                style={{ width: size.w, height: size.h, border: 0, display: "block", transition: sizing }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
