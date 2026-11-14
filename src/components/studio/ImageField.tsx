"use client";

import { getSupabase, supabaseEnabled } from "@/lib/supabase";
import type { AspectRatio, ImageRef } from "@/lib/types";
import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { FieldShell } from "./fields";

const RATIO_NUM: Record<AspectRatio, number> = { "1:1": 1, "16:9": 16 / 9, "4:3": 4 / 3 };
const RATIO_CLASS: Record<AspectRatio, string> = {
  "1:1": "aspect-square w-24",
  "16:9": "aspect-video w-48",
  "4:3": "aspect-[4/3] w-40",
};

// 1:1 fields are icons, logos and badges — PNG keeps their transparency.
// Wide covers are photos/screens — JPEG keeps them light.
function outputFor(
  ratio: AspectRatio,
  maxWidth?: number,
): { type: string; ext: string; maxW: number; quality?: number } {
  const base =
    ratio === "1:1"
      ? { type: "image/png", ext: "png", maxW: 1024 }
      : { type: "image/jpeg", ext: "jpg", maxW: 1600, quality: 0.9 };
  return maxWidth ? { ...base, maxW: maxWidth } : base;
}

async function cropToBlob(src: string, area: Area, ratio: AspectRatio, maxWidth?: number): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = src;
  });
  const out = outputFor(ratio, maxWidth);
  const scale = Math.min(1, out.maxW / area.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Crop failed"))), out.type, out.quality),
  );
}

/**
 * Every upload passes through a mandatory crop to the field's declared aspect
 * ratio before it reaches Storage — a component never sees an arbitrary image.
 */
export function ImageField({
  label,
  image,
  ratio,
  pathPrefix,
  onChange,
  removable = true,
  maxWidth,
}: {
  label: string;
  image?: ImageRef;
  ratio: AspectRatio;
  pathPrefix: string;
  onChange: (image?: ImageRef) => void;
  removable?: boolean;
  /** Cap the saved image's width (px) below the ratio's default — e.g. a favicon. */
  maxWidth?: number;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled = supabaseEnabled();
  const hasImage = Boolean(image?.url);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(null);
    setSrc(URL.createObjectURL(file));
  }

  function closeCropper() {
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
  }

  async function confirmCrop() {
    if (!src || !area) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await cropToBlob(src, area, ratio, maxWidth);
      const out = outputFor(ratio, maxWidth);
      const path = `${pathPrefix}-${Date.now()}.${out.ext}`;
      const sb = getSupabase();
      const { error } = await sb.storage.from("images").upload(path, blob, { contentType: out.type });
      if (error) throw error;
      const { data } = sb.storage.from("images").getPublicUrl(path);
      onChange({ url: data.publicUrl, aspectRatio: ratio });
      closeCropper();
    } catch {
      setError("Upload didn't go through. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FieldShell as="div" label={label} hint={enabled ? `Cropped to ${ratio}` : "Connect Supabase to upload images."}>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={`${RATIO_CLASS[ratio]} flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-bg`}
        >
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image!.url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-5 w-5 text-muted/60" strokeWidth={2} />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!enabled}
            onClick={() => fileInput.current?.click()}
            className="rounded-[12px] border border-line bg-surface px-3.5 py-2 text-sm font-medium transition-colors duration-200 hover:border-ink/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {hasImage ? "Replace image" : "Upload image"}
          </button>
          {hasImage && removable && (
            <button
              type="button"
              onClick={() => onChange(image ? { ...image, url: "" } : undefined)}
              className="inline-flex items-center gap-1.5 rounded-[12px] px-2.5 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-danger"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label={`${label} file`}
          onChange={pickFile}
        />
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}

      {src && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Crop image to ${ratio}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
        >
          <div className="card w-full max-w-xl !rounded-2xl p-5">
            <p className="text-sm font-semibold">Crop to {ratio}</p>
            <p className="mt-1 text-xs text-muted">Drag to position, zoom to fit. The saved image is exactly this frame.</p>
            <div className="relative mt-4 h-72 overflow-hidden rounded-xl bg-ink sm:h-80">
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={RATIO_NUM[ratio]}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, px) => setArea(px)}
              />
            </div>
            <label className="mt-4 flex items-center gap-3 text-xs text-muted">
              Zoom
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#ff4a1a]"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={closeCropper}
                className="rounded-[12px] px-4 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || !area}
                onClick={confirmCrop}
                className="rounded-[12px] bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-85 disabled:opacity-50"
              >
                {busy ? "Uploading…" : "Crop & upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </FieldShell>
  );
}
