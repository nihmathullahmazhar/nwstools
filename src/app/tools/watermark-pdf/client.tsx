"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { Dropzone } from "@/components/ui/dropzone";
import { Input, Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { FileText, Download, Loader2, X } from "lucide-react";

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export default function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [color, setColor] = useState("#ff0000");
  const [opacity, setOpacity] = useState(0.2);
  const [size, setSize] = useState(60);
  const [layout, setLayout] = useState<"diagonal" | "tile">("diagonal");
  const [busy, setBusy] = useState(false);

  async function apply() {
    if (!file) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const col = hexToRgb(color);
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        if (layout === "diagonal") {
          const tw = font.widthOfTextAtSize(text, size);
          page.drawText(text, {
            x: width / 2 - (tw / 2) * Math.cos(Math.PI / 4),
            y: height / 2 - (tw / 2) * Math.sin(Math.PI / 4),
            size,
            font,
            color: col,
            opacity,
            rotate: degrees(45),
          });
        } else {
          const step = size * 4;
          for (let y = 0; y < height + step; y += step)
            for (let x = -step; x < width; x += step)
              page.drawText(text, {
                x,
                y,
                size: size * 0.5,
                font,
                color: col,
                opacity,
                rotate: degrees(30),
              });
        }
      }
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), `${file.name.replace(/\.pdf$/i, "")}-watermarked.pdf`);
    } finally {
      setBusy(false);
    }
  }

  if (!file)
    return <Dropzone onFile={setFile} accept="application/pdf" hint="PDF file" label="Drop a PDF to watermark" />;

  return (
    <div className="space-y-5">
      <div className="panel flex items-center gap-3 px-4 py-3">
        <FileText className="h-5 w-5 text-danger" />
        <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
        <button onClick={() => setFile(null)} className="text-fg-faint hover:text-fg">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Watermark text</div>
          <Input value={text} onChange={(e) => setText(e.target.value)} className="h-11" />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Layout</div>
          <Segmented
            value={layout}
            onChange={setLayout}
            options={[
              { value: "diagonal", label: "Diagonal" },
              { value: "tile", label: "Tiled" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Color</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent" />
        </div>
        <Slider label="Opacity" value={Math.round(opacity * 100)} min={5} max={80} onChange={(v) => setOpacity(v / 100)} suffix="%" />
        <Slider label="Size" value={size} min={20} max={120} onChange={setSize} />
      </div>

      <Button onClick={apply} size="lg" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Add watermark & download
      </Button>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex gap-2 text-sm font-medium">
        <span>{label}</span>
        <span className="text-accent">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-40 accent-[hsl(var(--accent))]" />
    </div>
  );
}
