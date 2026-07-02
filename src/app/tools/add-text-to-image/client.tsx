"use client";

import { useEffect, useRef, useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { loadImage } from "@/lib/image";
import { Download, Loader2, X } from "lucide-react";

type TextLayer = {
  content: string;
  xPct: number;
  yPct: number;
  size: number; // % of image height
  color: string;
  weight: number;
  opacity: number;
};

export default function AddTextToImage() {
  const [orig, setOrig] = useState<HTMLImageElement | null>(null);
  const [origUrl, setOrigUrl] = useState("");
  const [cutoutUrl, setCutoutUrl] = useState("");
  const [name, setName] = useState("image");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [layer, setLayer] = useState<TextLayer>({
    content: "BEHIND",
    xPct: 50,
    yPct: 55,
    size: 22,
    color: "#ffffff",
    weight: 800,
    opacity: 1,
  });
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);
  const [stageH, setStageH] = useState(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setStageH(entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [orig]);

  async function onFile(f: File) {
    setError("");
    setName(f.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(f);
    setOrigUrl(url);
    setOrig(await loadImage(f));
    setBusy(true);
    setProgress(0);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(f, {
        progress: (key: string, cur: number, total: number) => {
          setStage(key.startsWith("fetch") ? "Downloading AI model…" : "Isolating subject…");
          if (total) setProgress(cur / total);
        },
      });
      setCutoutUrl(URL.createObjectURL(blob));
    } catch {
      setError("Couldn't isolate the subject in this photo.");
    } finally {
      setBusy(false);
    }
  }

  function onMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const r = stageRef.current!.getBoundingClientRect();
    setLayer((l) => ({
      ...l,
      xPct: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
      yPct: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
    }));
  }

  async function exportPng() {
    if (!orig) return;
    const W = orig.naturalWidth;
    const H = orig.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(orig, 0, 0);
    // text layer
    const fontPx = (layer.size / 100) * H;
    ctx.font = `${layer.weight} ${fontPx}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = layer.color;
    ctx.globalAlpha = layer.opacity;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(layer.content, (layer.xPct / 100) * W, (layer.yPct / 100) * H);
    ctx.globalAlpha = 1;
    // subject cutout on top
    if (cutoutUrl) {
      const cut = await loadImage(await (await fetch(cutoutUrl)).blob());
      ctx.drawImage(cut, 0, 0, W, H);
    }
    canvas.toBlob((b) => b && download(b, `${name}-text-behind.png`), "image/png");
  }

  if (!orig)
    return (
      <div className="space-y-3">
        <Dropzone onFile={onFile} accept="image/*" hint="A photo with a clear subject" label="Drop a photo to put text behind the subject" />
        <p className="text-center text-xs text-fg-faint">Uses an on-device AI model (~40&nbsp;MB, downloaded once).</p>
      </div>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-2">
        <div
          ref={stageRef}
          className="relative select-none overflow-hidden rounded-xl border border-border"
          onPointerMove={onMove}
          onPointerUp={() => (dragRef.current = false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={origUrl} alt="" className="w-full" draggable={false} />
          <div
            onPointerDown={(e) => { dragRef.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
            className="absolute cursor-move whitespace-nowrap"
            style={{
              left: `${layer.xPct}%`,
              top: `${layer.yPct}%`,
              transform: "translate(-50%, -50%)",
              fontSize: `${(layer.size / 100) * stageH}px`,
              fontWeight: layer.weight,
              color: layer.color,
              opacity: layer.opacity,
            }}
          >
            {layer.content}
          </div>
          {cutoutUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cutoutUrl} alt="" className="pointer-events-none absolute inset-0 w-full" draggable={false} />
          )}
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-black/40 text-sm text-white">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                {stage} {progress > 0 && `${Math.round(progress * 100)}%`}
              </div>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <p className="text-xs text-fg-faint">Drag the text to reposition it behind the subject.</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1.5 text-sm font-medium">Text</div>
          <Input value={layer.content} onChange={(e) => setLayer((l) => ({ ...l, content: e.target.value }))} />
        </div>
        <Slider label="Size" value={layer.size} min={5} max={50} onChange={(v) => setLayer((l) => ({ ...l, size: v }))} suffix="%" />
        <Slider label="Weight" value={layer.weight} min={100} max={900} step={100} onChange={(v) => setLayer((l) => ({ ...l, weight: v }))} />
        <Slider label="Opacity" value={Math.round(layer.opacity * 100)} min={20} max={100} onChange={(v) => setLayer((l) => ({ ...l, opacity: v / 100 }))} suffix="%" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Color</span>
          <input type="color" value={layer.color} onChange={(e) => setLayer((l) => ({ ...l, color: e.target.value }))} className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent" />
        </div>

        <Button onClick={exportPng} size="lg" className="w-full" disabled={busy}>
          <Download className="h-4 w-4" /> Export PNG
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setOrig(null); setCutoutUrl(""); }}>
          <X className="h-4 w-4" /> New image
        </Button>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, suffix }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-accent">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[hsl(var(--accent))]" />
    </div>
  );
}
