"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { loadImage, drawToCanvas, canvasToBlob } from "@/lib/image";
import { Download, X, Undo2, Trash2 } from "lucide-react";

type Rect = { x: number; y: number; w: number; h: number };
type Mode = "pixelate" | "blackout" | "blur";

const MAX_W = 720;

export default function Pixelate() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [regions, setRegions] = useState<Rect[]>([]);
  const [mode, setMode] = useState<Mode>("pixelate");
  const [block, setBlock] = useState(16);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const srcRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; cur: Rect } | null>(null);
  const [, force] = useState(0);

  async function onFile(file: File) {
    const image = await loadImage(file);
    setImg(image);
    setName(file.name.replace(/\.[^.]+$/, ""));
    setRegions([]);
    srcRef.current = drawToCanvas(image, image.naturalWidth, image.naturalHeight);
  }

  const scale = img ? Math.min(1, MAX_W / img.naturalWidth) : 1;

  const applyRegion = useCallback(
    (ctx: CanvasRenderingContext2D, r: Rect, src: HTMLCanvasElement) => {
      const x = Math.round(r.x);
      const y = Math.round(r.y);
      const w = Math.round(r.w);
      const h = Math.round(r.h);
      if (w < 2 || h < 2) return;
      if (mode === "blackout") {
        ctx.fillStyle = "#000";
        ctx.fillRect(x, y, w, h);
      } else if (mode === "blur") {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();
        ctx.filter = `blur(${Math.max(4, block)}px)`;
        ctx.drawImage(src, 0, 0);
        ctx.restore();
      } else {
        const bw = Math.max(1, Math.floor(w / block));
        const bh = Math.max(1, Math.floor(h / block));
        const tmp = document.createElement("canvas");
        tmp.width = bw;
        tmp.height = bh;
        const tctx = tmp.getContext("2d")!;
        tctx.drawImage(src, x, y, w, h, 0, 0, bw, bh);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tmp, 0, 0, bw, bh, x, y, w, h);
        ctx.imageSmoothingEnabled = true;
      }
    },
    [mode, block],
  );

  // full-resolution render (source of truth for download)
  const renderFull = useCallback(() => {
    const src = srcRef.current;
    if (!src) return null;
    const out = document.createElement("canvas");
    out.width = src.width;
    out.height = src.height;
    const ctx = out.getContext("2d")!;
    ctx.drawImage(src, 0, 0);
    for (const r of regions) applyRegion(ctx, r, src);
    return out;
  }, [regions, applyRegion]);

  // draw scaled view + in-progress rectangle
  useEffect(() => {
    const canvas = canvasRef.current;
    const full = renderFull();
    if (!canvas || !full || !img) return;
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(full, 0, 0, canvas.width, canvas.height);
    const d = dragRef.current;
    if (d) {
      ctx.strokeStyle = "hsl(255 85% 62%)";
      ctx.fillStyle = "hsl(255 85% 62% / 0.2)";
      ctx.lineWidth = 2;
      const r = d.cur;
      ctx.fillRect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);
      ctx.strokeRect(r.x * scale, r.y * scale, r.w * scale, r.h * scale);
    }
  }, [img, regions, renderFull, scale]);

  function toNatural(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  }
  function onDown(e: React.PointerEvent) {
    const p = toNatural(e);
    dragRef.current = { startX: p.x, startY: p.y, cur: { x: p.x, y: p.y, w: 0, h: 0 } };
    canvasRef.current?.setPointerCapture(e.pointerId);
  }
  function onMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const p = toNatural(e);
    d.cur = {
      x: Math.min(d.startX, p.x),
      y: Math.min(d.startY, p.y),
      w: Math.abs(p.x - d.startX),
      h: Math.abs(p.y - d.startY),
    };
    force((n) => n + 1);
  }
  function onUp() {
    const d = dragRef.current;
    if (d && d.cur.w > 4 && d.cur.h > 4) setRegions((r) => [...r, d.cur]);
    dragRef.current = null;
    force((n) => n + 1);
  }

  async function save() {
    const full = renderFull();
    if (full) download(await canvasToBlob(full, "image/png"), `${name}-redacted.png`);
  }

  if (!img) return <Dropzone onFile={onFile} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "pixelate", label: "Pixelate" },
            { value: "blur", label: "Blur" },
            { value: "blackout", label: "Blackout" },
          ]}
        />
        {mode !== "blackout" && (
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            Strength
            <input
              type="range"
              min={6}
              max={40}
              value={block}
              onChange={(e) => setBlock(Number(e.target.value))}
              className="w-32 accent-[hsl(var(--accent))]"
            />
          </label>
        )}
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setRegions((r) => r.slice(0, -1))} disabled={!regions.length}>
            <Undo2 className="h-4 w-4" /> Undo
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setRegions([])} disabled={!regions.length}>
            <Trash2 className="h-4 w-4" /> Clear
          </Button>
        </div>
      </div>

      <p className="text-sm text-fg-muted">
        Drag across the image to redact an area. Add as many regions as you need.
      </p>

      <div className="panel inline-block max-w-full overflow-hidden p-3">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          className="max-w-full cursor-crosshair touch-none rounded-lg"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={save} size="lg" disabled={!regions.length}>
          <Download className="h-4 w-4" /> Download PNG
        </Button>
        <Button variant="secondary" size="lg" onClick={() => setImg(null)}>
          <X className="h-4 w-4" /> New image
        </Button>
      </div>
    </div>
  );
}
