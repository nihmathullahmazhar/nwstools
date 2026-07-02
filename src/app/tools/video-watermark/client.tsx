"use client";

import { useEffect, useRef, useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useFFmpeg, fetchFile } from "@/lib/ffmpeg";
import { download, formatBytes, cn } from "@/lib/utils";
import { canvasToBlob } from "@/lib/image";
import { Download, Loader2, X, Play, Cpu } from "lucide-react";

type Pos = "tl" | "tc" | "tr" | "cc" | "bl" | "bc" | "br";

export default function VideoWatermark() {
  const ff = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState("");
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [text, setText] = useState("© Toolkit");
  const [pos, setPos] = useState<Pos>("br");
  const [opacity, setOpacity] = useState(0.6);
  const [size, setSize] = useState(5);
  const [color, setColor] = useState("#ffffff");
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);
  const baseRef = useRef("output");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    baseRef.current = file.name.replace(/\.[^.]+$/, "");
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => setDims({ w: v.videoWidth, h: v.videoHeight });
    v.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function buildOverlayPng(): Promise<Blob> {
    const { w, h } = dims!;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const fontSize = (size / 100) * Math.min(w, h);
    ctx.font = `600 ${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    const pad = fontSize * 0.6;
    const m = ctx.measureText(text);
    ctx.textBaseline = "middle";
    const x = pos[1] === "l" ? pad : pos[1] === "r" ? w - pad - m.width : (w - m.width) / 2;
    const y = pos[0] === "t" ? pad + fontSize / 2 : pos[0] === "b" ? h - pad - fontSize / 2 : h / 2;
    ctx.textAlign = "left";
    ctx.fillText(text, x, y);
    return canvasToBlob(canvas, "image/png");
  }

  async function process() {
    if (!file || !dims) return;
    setResult(null);
    try {
      const engine = await ff.ensure();
      const png = await buildOverlayPng();
      const inName = "in" + (file.name.match(/\.[^.]+$/)?.[0] ?? ".mp4");
      await engine.writeFile(inName, await fetchFile(file));
      await engine.writeFile("wm.png", await fetchFile(png));
      await engine.exec([
        "-i", inName, "-i", "wm.png",
        "-filter_complex", "[0][1]overlay=0:0",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
        "-c:a", "copy",
        "out.mp4",
      ]);
      const data = (await engine.readFile("out.mp4")) as Uint8Array;
      setResult({ url: URL.createObjectURL(new Blob([data as BlobPart])), blob: new Blob([data as BlobPart]) });
    } catch {
      /* surfaced via ff.error */
    }
  }

  if (!file) return <Dropzone onFile={setFile} accept="video/*" hint="MP4, WebM or MOV" label="Drop a video to watermark" />;

  const grid: Pos[] = ["tl", "tc", "tr", "cc", "cc", "cc", "bl", "bc", "br"];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium">{file.name}</span>
          <button onClick={() => { setFile(null); setResult(null); }} className="text-fg-faint hover:text-fg"><X className="h-4 w-4" /></button>
        </div>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src={src} controls className="w-full rounded-xl border border-border" />
        <div className="text-xs text-fg-muted">{formatBytes(file.size)}{dims && ` · ${dims.w}×${dims.h}`}</div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-1.5 text-sm font-medium">Watermark text</div>
          <Input value={text} onChange={(e) => setText(e.target.value)} className="h-11" />
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <div>
            <div className="mb-1.5 text-sm font-medium">Position</div>
            <div className="grid w-24 grid-cols-3 gap-1">
              {["tl", "tc", "tr", "cl", "cc", "cr", "bl", "bc", "br"].map((g, i) => (
                <button
                  key={i}
                  onClick={() => setPos(grid[i])}
                  className={cn("aspect-square rounded border", pos === grid[i] ? "border-accent bg-accent" : "border-border hover:bg-panel-raised")}
                  aria-label={g}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Color</span>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent" />
          </div>
        </div>

        <Slider label="Size" value={size} min={2} max={15} onChange={setSize} suffix="%" />
        <Slider label="Opacity" value={Math.round(opacity * 100)} min={10} max={100} onChange={(v) => setOpacity(v / 100)} suffix="%" />

        <Button onClick={process} size="lg" className="w-full" disabled={ff.busy || ff.loading || !dims}>
          {ff.loading ? <><Cpu className="h-4 w-4 animate-pulse" /> Loading engine…</> : ff.busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing… {Math.round(ff.progress * 100)}%</> : <><Play className="h-4 w-4" /> Add watermark</>}
        </Button>

        {(ff.busy || ff.loading) && (
          <div className="h-2 overflow-hidden rounded-full bg-panel-raised">
            <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: ff.loading ? "100%" : `${ff.progress * 100}%` }} />
          </div>
        )}
        {ff.error && <p className="text-sm text-danger">{ff.error}</p>}

        {result && (
          <div className="panel space-y-3 p-4">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={result.url} controls className="w-full rounded-lg" />
            <Button onClick={() => download(result.blob, `${baseRef.current}-watermarked.mp4`)} className="w-full">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange, suffix }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-accent">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[hsl(var(--accent))]" />
    </div>
  );
}
