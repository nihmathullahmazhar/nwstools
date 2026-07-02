"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Input, Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { Download } from "lucide-react";

type EC = "L" | "M" | "Q" | "H";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://");
  const [size, setSize] = useState(320);
  const [ec, setEc] = useState<EC>("M");
  const [fg, setFg] = useState("#0f0f17");
  const [bg, setBg] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const value = text.trim() || " ";
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(
      canvas,
      value,
      {
        width: size,
        errorCorrectionLevel: ec,
        margin: 2,
        color: { dark: fg, light: bg },
      },
      (err) => setReady(!err),
    );
  }, [text, size, ec, fg, bg]);

  async function downloadPng() {
    const url = canvasRef.current?.toDataURL("image/png");
    if (url) download(url, "qr-code.png");
  }
  async function downloadSvg() {
    const svg = await QRCode.toString(text.trim() || " ", {
      type: "svg",
      errorCorrectionLevel: ec,
      margin: 2,
      color: { dark: fg, light: bg },
    });
    download(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
      <div className="space-y-5">
        <div>
          <div className="mb-1.5 text-sm font-medium">Content</div>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="URL, text, wifi, anything…"
            className="h-11"
            autoFocus
          />
        </div>

        <div>
          <div className="mb-1.5 text-sm font-medium">Error correction</div>
          <Segmented
            value={ec}
            onChange={setEc}
            options={[
              { value: "L", label: "L" },
              { value: "M", label: "M" },
              { value: "Q", label: "Q" },
              { value: "H", label: "H" },
            ]}
          />
          <p className="mt-1.5 text-xs text-fg-faint">
            Higher levels stay scannable even if partly covered (e.g. a logo).
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <ColorField label="Foreground" value={fg} onChange={setFg} />
          <ColorField label="Background" value={bg} onChange={setBg} />
          <div>
            <div className="mb-1.5 text-sm font-medium">Size · {size}px</div>
            <input
              type="range"
              min={128}
              max={640}
              step={32}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-40 accent-[hsl(var(--accent))]"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={downloadPng} disabled={!ready}>
            <Download className="h-4 w-4" /> PNG
          </Button>
          <Button variant="secondary" onClick={downloadSvg} disabled={!ready}>
            <Download className="h-4 w-4" /> SVG
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-center">
        <div className="panel p-4">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent"
        />
        <code className="text-sm text-fg-muted">{value}</code>
      </div>
    </div>
  );
}
