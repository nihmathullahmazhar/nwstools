"use client";

import { useEffect, useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Input, Check, Segmented, Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download, formatBytes } from "@/lib/utils";
import { loadImage, drawToCanvas, canvasToBlob, extFor } from "@/lib/image";
import { Download, X } from "lucide-react";

export default function ImageResize() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [origSize, setOrigSize] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9);
  const [preview, setPreview] = useState<{ url: string; size: number } | null>(null);

  async function onFile(file: File) {
    const image = await loadImage(file);
    setImg(image);
    setName(file.name.replace(/\.[^.]+$/, ""));
    setOrigSize(file.size);
    setW(image.naturalWidth);
    setH(image.naturalHeight);
  }

  useEffect(() => {
    if (!img || w < 1 || h < 1) return;
    let cancelled = false;
    (async () => {
      const canvas = drawToCanvas(img, w, h);
      const blob = await canvasToBlob(canvas, format, quality);
      if (cancelled) return;
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url: URL.createObjectURL(blob), size: blob.size };
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [img, w, h, format, quality]);

  const ratio = img ? img.naturalWidth / img.naturalHeight : 1;
  function setWidth(v: number) {
    setW(v);
    if (lock) setH(Math.round(v / ratio));
  }
  function setHeight(v: number) {
    setH(v);
    if (lock) setW(Math.round(v * ratio));
  }
  function scale(pct: number) {
    if (!img) return;
    setW(Math.round(img.naturalWidth * pct));
    setH(Math.round(img.naturalHeight * pct));
  }

  async function save() {
    if (!preview) return;
    download(await (await fetch(preview.url)).blob(), `${name}-${w}x${h}.${extFor(format)}`);
  }

  const lossy = format !== "image/png";

  if (!img) return <Dropzone onFile={onFile} />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="panel flex items-center justify-center overflow-hidden p-4">
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.url}
            alt="preview"
            className="max-h-[440px] w-auto rounded-lg"
            style={{ imageRendering: "auto" }}
          />
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium">{name}</span>
          <button
            onClick={() => {
              setImg(null);
              setPreview(null);
            }}
            className="text-fg-faint hover:text-fg"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1.5 text-sm font-medium">Width</div>
            <Input type="number" value={w} onChange={(e) => setWidth(Number(e.target.value))} />
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium">Height</div>
            <Input type="number" value={h} onChange={(e) => setHeight(Number(e.target.value))} />
          </div>
        </div>

        <Check checked={lock} onChange={setLock}>Lock aspect ratio</Check>

        <div className="flex gap-2">
          {[0.25, 0.5, 0.75, 1].map((p) => (
            <Button key={p} variant="secondary" size="sm" onClick={() => scale(p)}>
              {p * 100}%
            </Button>
          ))}
        </div>

        <div>
          <div className="mb-1.5 text-sm font-medium">Format</div>
          <Segmented
            value={format}
            onChange={setFormat}
            options={[
              { value: "image/png", label: "PNG" },
              { value: "image/jpeg", label: "JPG" },
              { value: "image/webp", label: "WebP" },
            ]}
          />
        </div>

        {lossy && (
          <div>
            <div className="mb-1.5 flex justify-between text-sm font-medium">
              <span>Quality</span>
              <span className="text-accent">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[hsl(var(--accent))]"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Original" value={formatBytes(origSize)} hint={`${img.naturalWidth}×${img.naturalHeight}`} />
          <Stat
            label="New size"
            value={preview ? formatBytes(preview.size) : "—"}
            hint={`${w}×${h}`}
          />
        </div>

        <Button onClick={save} className="w-full" size="lg" disabled={!preview}>
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>
    </div>
  );
}
