"use client";

import { useEffect, useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Segmented, Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download, formatBytes } from "@/lib/utils";
import { loadImage, drawToCanvas, canvasToBlob, extFor } from "@/lib/image";
import { Download, X, ArrowRight } from "lucide-react";

export default function ImageConvert() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [origSize, setOrigSize] = useState(0);
  const [origType, setOrigType] = useState("");
  const [target, setTarget] = useState("image/webp");
  const [quality, setQuality] = useState(0.92);
  const [bg, setBg] = useState("#ffffff");
  const [out, setOut] = useState<{ url: string; size: number } | null>(null);

  async function onFile(file: File) {
    const image = await loadImage(file);
    setImg(image);
    setName(file.name.replace(/\.[^.]+$/, ""));
    setOrigSize(file.size);
    setOrigType(file.type || "image/*");
  }

  useEffect(() => {
    if (!img) return;
    let cancelled = false;
    (async () => {
      const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
      // flatten transparency onto bg when converting to jpeg
      if (target === "image/jpeg") {
        const ctx = canvas.getContext("2d")!;
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      const blob = await canvasToBlob(canvas, target, quality);
      if (cancelled) return;
      setOut((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url: URL.createObjectURL(blob), size: blob.size };
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [img, target, quality, bg]);

  const lossy = target !== "image/png";

  if (!img) return <Dropzone onFile={onFile} />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="panel grid place-items-center overflow-hidden p-4">
        {out && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={out.url} alt="converted" className="max-h-[420px] w-auto rounded-lg" />
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="uppercase text-fg-muted">
              {extFor(origType)}
            </span>
            <ArrowRight className="h-4 w-4 text-fg-faint" />
            <span className="uppercase text-accent">{extFor(target)}</span>
          </div>
          <button
            onClick={() => { setImg(null); setOut(null); }}
            className="text-fg-faint hover:text-fg"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div>
          <div className="mb-1.5 text-sm font-medium">Convert to</div>
          <Segmented
            value={target}
            onChange={setTarget}
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
              step={0.02}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[hsl(var(--accent))]"
            />
          </div>
        )}

        {target === "image/jpeg" && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Background</span>
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
            />
            <span className="text-xs text-fg-muted">(fills transparency)</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Original" value={formatBytes(origSize)} />
          <Stat label="Converted" value={out ? formatBytes(out.size) : "—"} />
        </div>

        <Button
          onClick={async () =>
            out &&
            download(
              await (await fetch(out.url)).blob(),
              `${name}.${extFor(target)}`,
            )
          }
          className="w-full"
          size="lg"
          disabled={!out}
        >
          <Download className="h-4 w-4" /> Download {extFor(target).toUpperCase()}
        </Button>
      </div>
    </div>
  );
}
