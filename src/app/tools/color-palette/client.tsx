"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { loadImage, drawToCanvas } from "@/lib/image";
import { X, Loader2 } from "lucide-react";

type Swatch = { hex: string; count: number };

function hex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function extractPalette(img: HTMLImageElement, count = 8): Swatch[] {
  const scale = Math.min(1, 120 / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = drawToCanvas(img, img.naturalWidth * scale, img.naturalHeight * scale);
  const { data } = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height);
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 125) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // quantize to 5 bits/channel for bucketing
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const e = buckets.get(key);
    if (e) {
      e.r += r; e.g += g; e.b += b; e.n++;
    } else buckets.set(key, { r, g, b, n: 1 });
  }
  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((e) => ({ hex: hex(Math.round(e.r / e.n), Math.round(e.g / e.n), Math.round(e.b / e.n)), count: e.n }));
}

export default function ColorPalette() {
  const [preview, setPreview] = useState<string | null>(null);
  const [palette, setPalette] = useState<Swatch[]>([]);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File) {
    setBusy(true);
    try {
      const img = await loadImage(file);
      setPreview(img.src);
      setPalette(extractPalette(img));
    } finally {
      setBusy(false);
    }
  }

  if (!preview && !busy) return <Dropzone onFile={onFile} hint="JPG, PNG or WebP" label="Drop an image to extract its colors" />;

  const cssVars = palette.map((s, i) => `  --color-${i + 1}: ${s.hex};`).join("\n");

  return (
    <div className="space-y-6">
      {busy ? (
        <div className="panel grid place-items-center py-16 text-fg-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <div className="panel overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="" className="h-48 w-full object-cover" />
              <button
                onClick={() => { setPreview(null); setPalette([]); }}
                className="flex w-full items-center justify-center gap-2 border-t border-border py-2 text-sm text-fg-muted hover:text-fg"
              >
                <X className="h-4 w-4" /> New image
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {palette.map((s) => (
                <div key={s.hex} className="panel overflow-hidden">
                  <div className="h-24" style={{ backgroundColor: s.hex }} />
                  <div className="flex items-center justify-between px-3 py-2">
                    <code className="text-sm font-medium">{s.hex.toUpperCase()}</code>
                    <CopyButton value={s.hex} size="sm" label="" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-faint">CSS variables</span>
              <CopyButton value={`:root {\n${cssVars}\n}`} size="sm" />
            </div>
            <pre className="panel overflow-x-auto p-4 font-mono text-xs text-fg-muted">{`:root {\n${cssVars}\n}`}</pre>
          </div>
        </>
      )}
    </div>
  );
}
