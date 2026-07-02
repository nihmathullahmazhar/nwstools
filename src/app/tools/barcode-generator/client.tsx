"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { Input, Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { Download, AlertCircle } from "lucide-react";

const FORMATS = [
  { value: "CODE128", label: "Code 128" },
  { value: "EAN13", label: "EAN-13" },
  { value: "UPC", label: "UPC-A" },
  { value: "CODE39", label: "Code 39" },
  { value: "ITF14", label: "ITF-14" },
];

const PLACEHOLDER: Record<string, string> = {
  CODE128: "TOOLKIT-2026",
  EAN13: "5901234123457",
  UPC: "036000291452",
  CODE39: "TOOLKIT",
  ITF14: "10012345678902",
};

export default function BarcodeGenerator() {
  const [format, setFormat] = useState("CODE128");
  const [value, setValue] = useState("TOOLKIT-2026");
  const [showText, setShowText] = useState(true);
  const [error, setError] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, value || " ", {
        format,
        displayValue: showText,
        lineColor: "#0f0f17",
        background: "#ffffff",
        width: 2,
        height: 90,
        margin: 12,
        fontOptions: "600",
      });
      setError("");
    } catch {
      setError(`“${value}” isn’t valid for ${format}.`);
    }
  }, [format, value, showText]);

  function downloadPng() {
    const svg = svgRef.current;
    if (!svg || error) return;
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => b && download(b, `barcode-${value}.png`), "image/png");
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
  }

  function downloadSvg() {
    const svg = svgRef.current;
    if (!svg || error) return;
    download(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }), `barcode-${value}.svg`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
      <div className="space-y-5">
        <div>
          <div className="mb-1.5 text-sm font-medium">Barcode type</div>
          <div className="overflow-x-auto pb-1">
            <Segmented value={format} onChange={setFormat} options={FORMATS} />
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Value</div>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={PLACEHOLDER[format]}
            className="h-11 font-mono"
            autoFocus
          />
          <p className="mt-1.5 text-xs text-fg-faint">
            {format === "EAN13" && "12–13 digits (checksum auto-added)."}
            {format === "UPC" && "11–12 digits."}
            {format === "ITF14" && "13–14 digits."}
            {format === "CODE39" && "Letters, digits and - . $ / + %."}
            {format === "CODE128" && "Any ASCII text."}
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
          <input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--accent))]" />
          Show text under barcode
        </label>

        {error && (
          <p className="flex items-center gap-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}

        <div className="flex gap-2">
          <Button onClick={downloadPng} disabled={!!error}>
            <Download className="h-4 w-4" /> PNG
          </Button>
          <Button variant="secondary" onClick={downloadSvg} disabled={!!error}>
            <Download className="h-4 w-4" /> SVG
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-center">
        <div className="panel bg-white p-4">
          <svg ref={svgRef} />
        </div>
      </div>
    </div>
  );
}
