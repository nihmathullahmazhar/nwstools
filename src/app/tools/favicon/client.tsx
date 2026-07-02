"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import { download } from "@/lib/utils";
import { loadImage, canvasToBlob } from "@/lib/image";
import { Download, Loader2 } from "lucide-react";

const SIZES = [16, 32, 48, 180, 512];

function drawFavicon(
  size: number,
  opts: { mode: "text" | "image"; text: string; bg: string; fg: string; rounding: number; img: HTMLImageElement | null },
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  const r = (opts.rounding / 100) * (size / 2);

  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(size, 0, size, size, r);
  ctx.arcTo(size, size, 0, size, r);
  ctx.arcTo(0, size, 0, 0, r);
  ctx.arcTo(0, 0, size, 0, r);
  ctx.closePath();
  ctx.clip();

  if (opts.mode === "image" && opts.img) {
    const s = Math.min(opts.img.width, opts.img.height);
    ctx.drawImage(opts.img, (opts.img.width - s) / 2, (opts.img.height - s) / 2, s, s, 0, 0, size, size);
  } else {
    ctx.fillStyle = opts.bg;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = opts.fg;
    ctx.font = `600 ${size * 0.6}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(opts.text.slice(0, 2) || "T", size / 2, size * 0.54);
  }
  return c;
}

async function buildIco(canvases: HTMLCanvasElement[]): Promise<Blob> {
  const pngs = await Promise.all(
    canvases.map((c) => canvasToBlob(c, "image/png").then((b) => b.arrayBuffer())),
  );
  const count = pngs.length;
  const header = new ArrayBuffer(6 + count * 16);
  const dv = new DataView(header);
  dv.setUint16(0, 0, true);
  dv.setUint16(2, 1, true);
  dv.setUint16(4, count, true);
  let offset = 6 + count * 16;
  const bodies: ArrayBuffer[] = [];
  canvases.forEach((c, i) => {
    const base = 6 + i * 16;
    dv.setUint8(base, c.width >= 256 ? 0 : c.width);
    dv.setUint8(base + 1, c.height >= 256 ? 0 : c.height);
    dv.setUint8(base + 2, 0);
    dv.setUint8(base + 3, 0);
    dv.setUint16(base + 4, 1, true);
    dv.setUint16(base + 6, 32, true);
    dv.setUint32(base + 8, pngs[i].byteLength, true);
    dv.setUint32(base + 12, offset, true);
    offset += pngs[i].byteLength;
    bodies.push(pngs[i]);
  });
  return new Blob([header, ...bodies], { type: "image/x-icon" });
}

export default function Favicon() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("T");
  const [bg, setBg] = useState("#6d5efc");
  const [fg, setFg] = useState("#ffffff");
  const [rounding, setRounding] = useState(30);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const opts = { mode, text, bg, fg, rounding, img };

  useEffect(() => {
    const c = drawFavicon(512, opts);
    const p = previewRef.current;
    if (p) {
      p.width = 512;
      p.height = 512;
      p.getContext("2d")!.drawImage(c, 0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, text, bg, fg, rounding, img]);

  async function onImage(file: File) {
    setImg(await loadImage(file));
    setMode("image");
  }

  async function downloadIco() {
    setBusy(true);
    try {
      const ico = await buildIco([16, 32, 48].map((s) => drawFavicon(s, opts)));
      download(ico, "favicon.ico");
    } finally {
      setBusy(false);
    }
  }
  async function downloadPng(size: number) {
    download(await canvasToBlob(drawFavicon(size, opts), "image/png"), `favicon-${size}.png`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "text", label: "Text / Emoji" },
            { value: "image", label: "Image" },
          ]}
        />

        {mode === "text" ? (
          <>
            <div>
              <div className="mb-1.5 text-sm font-medium">Text or emoji</div>
              <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={2} className="h-11" />
            </div>
            <div className="flex gap-6">
              <ColorField label="Background" value={bg} onChange={setBg} />
              <ColorField label="Text" value={fg} onChange={setFg} />
            </div>
          </>
        ) : img ? (
          <Button variant="secondary" size="sm" onClick={() => setImg(null)}>Choose another image</Button>
        ) : (
          <Dropzone onFile={onImage} hint="Square image works best" label="Upload a logo" />
        )}

        <div>
          <div className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Corner rounding</span>
            <span className="text-accent">{rounding}%</span>
          </div>
          <input type="range" min={0} max={100} value={rounding} onChange={(e) => setRounding(Number(e.target.value))} className="w-full accent-[hsl(var(--accent))]" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadIco} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            favicon.ico
          </Button>
          {[32, 180, 512].map((s) => (
            <Button key={s} variant="secondary" onClick={() => downloadPng(s)}>
              {s}px PNG
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <canvas ref={previewRef} className="w-full max-w-[200px] rounded-2xl" />
        <div className="flex items-end gap-3">
          {SIZES.slice(0, 4).map((s) => (
            <PreviewChip key={s} size={s} opts={opts} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewChip({ size, opts }: { size: number; opts: Parameters<typeof drawFavicon>[1] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = drawFavicon(Math.min(size, 64), opts);
    const el = ref.current;
    if (el) {
      el.width = c.width;
      el.height = c.height;
      el.getContext("2d")!.drawImage(c, 0, 0);
    }
  });
  return (
    <div className="text-center">
      <canvas ref={ref} style={{ width: Math.min(size, 48), height: Math.min(size, 48) }} className="rounded" />
      <div className="mt-1 text-[10px] text-fg-faint">{size}</div>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent" />
        <code className="text-sm text-fg-muted">{value}</code>
      </div>
    </div>
  );
}
