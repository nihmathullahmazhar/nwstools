"use client";

import { useEffect, useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Segmented, Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download, formatBytes } from "@/lib/utils";
import { loadImage, drawToCanvas, canvasToBlob, extFor } from "@/lib/image";
import { Download, X } from "lucide-react";

export default function ImageCompress() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [origSize, setOrigSize] = useState(0);
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.7);
  const [out, setOut] = useState<{ url: string; size: number } | null>(null);

  async function onFile(file: File) {
    const image = await loadImage(file);
    setImg(image);
    setName(file.name.replace(/\.[^.]+$/, ""));
    setOrigSize(file.size);
  }

  useEffect(() => {
    if (!img) return;
    let cancelled = false;
    (async () => {
      const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
      const blob = await canvasToBlob(canvas, format, quality);
      if (cancelled) return;
      setOut((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url: URL.createObjectURL(blob), size: blob.size };
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [img, format, quality]);

  const savings = out && origSize ? 1 - out.size / origSize : 0;

  if (!img) return <Dropzone onFile={onFile} />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <figure className="panel overflow-hidden">
          <div className="grid place-items-center bg-panel-raised p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="original" className="max-h-64 w-auto rounded" />
          </div>
          <figcaption className="border-t border-border px-4 py-2 text-sm">
            Original · {formatBytes(origSize)}
          </figcaption>
        </figure>
        <figure className="panel overflow-hidden">
          <div className="grid place-items-center bg-panel-raised p-3">
            {out && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={out.url} alt="compressed" className="max-h-64 w-auto rounded" />
            )}
          </div>
          <figcaption className="flex items-center justify-between border-t border-border px-4 py-2 text-sm">
            <span>Compressed · {out ? formatBytes(out.size) : "—"}</span>
            {savings > 0 && (
              <span className="font-medium text-success">−{Math.round(savings * 100)}%</span>
            )}
          </figcaption>
        </figure>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 text-sm font-medium">Output format</div>
            <Segmented
              value={format}
              onChange={setFormat}
              options={[
                { value: "image/jpeg", label: "JPG" },
                { value: "image/webp", label: "WebP" },
              ]}
            />
          </div>
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
              className="w-full max-w-md accent-[hsl(var(--accent))]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={async () =>
              out &&
              download(
                await (await fetch(out.url)).blob(),
                `${name}-compressed.${extFor(format)}`,
              )
            }
            size="lg"
            disabled={!out}
          >
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button variant="secondary" size="lg" onClick={() => { setImg(null); setOut(null); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:max-w-md">
        <Stat label="Before" value={formatBytes(origSize)} />
        <Stat label="After" value={out ? formatBytes(out.size) : "—"} />
        <Stat label="Saved" value={`${Math.round(savings * 100)}%`} />
      </div>
    </div>
  );
}
