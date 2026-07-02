"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Dropzone } from "@/components/ui/dropzone";
import { Segmented, Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download, formatBytes } from "@/lib/utils";
import { canvasToBlob } from "@/lib/image";
import { openPdf, renderPage } from "@/lib/pdfjs";
import { FileText, Download, Loader2, X } from "lucide-react";

const PRESETS: Record<string, { scale: number; quality: number; label: string }> = {
  high: { scale: 2, quality: 0.82, label: "High quality" },
  medium: { scale: 1.5, quality: 0.62, label: "Balanced" },
  low: { scale: 1.1, quality: 0.5, label: "Smallest" },
};

export default function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState("medium");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ blob: Blob } | null>(null);
  const [error, setError] = useState("");

  async function compress() {
    if (!file) return;
    setBusy(true);
    setError("");
    setOut(null);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await openPdf(buf.slice(0));
      const { scale, quality } = PRESETS[level];
      const doc = await PDFDocument.create();
      for (let i = 1; i <= pdf.numPages; i++) {
        const canvas = await renderPage(pdf, i, scale);
        const wPt = canvas.width / scale;
        const hPt = canvas.height / scale;
        const jpeg = await canvasToBlob(canvas, "image/jpeg", quality);
        const img = await doc.embedJpg(await jpeg.arrayBuffer());
        const page = doc.addPage([wPt, hPt]);
        page.drawImage(img, { x: 0, y: 0, width: wPt, height: hPt });
      }
      const bytes = await doc.save();
      setOut({ blob: new Blob([bytes as BlobPart], { type: "application/pdf" }) });
    } catch {
      setError("Couldn't process this PDF.");
    } finally {
      setBusy(false);
    }
  }

  if (!file)
    return <Dropzone onFile={setFile} accept="application/pdf" hint="PDF file" label="Drop a PDF to compress" />;

  const saved = out ? 1 - out.blob.size / file.size : 0;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="panel flex items-center gap-3 px-4 py-3">
        <FileText className="h-5 w-5 text-danger" />
        <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
        <span className="text-xs text-fg-muted">{formatBytes(file.size)}</span>
        <button onClick={() => { setFile(null); setOut(null); }} className="text-fg-faint hover:text-fg">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <div className="mb-1.5 text-sm font-medium">Compression</div>
        <Segmented
          value={level}
          onChange={setLevel}
          options={[
            { value: "high", label: "Light" },
            { value: "medium", label: "Balanced" },
            { value: "low", label: "Max" },
          ]}
        />
        <p className="mt-2 text-xs text-fg-faint">
          Rasterizes pages and re-encodes as JPEG — best for image-heavy or scanned PDFs.
        </p>
      </div>

      <Button onClick={compress} size="lg" className="w-full" disabled={busy}>
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Compressing…</> : <><Download className="h-4 w-4" /> Compress</>}
      </Button>

      {error && <p className="text-sm text-danger">{error}</p>}

      {out && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Before" value={formatBytes(file.size)} />
            <Stat label="After" value={formatBytes(out.blob.size)} />
            <Stat label="Saved" value={`${Math.max(0, Math.round(saved * 100))}%`} />
          </div>
          <Button
            onClick={() => download(out.blob, `${file.name.replace(/\.pdf$/i, "")}-compressed.pdf`)}
            variant="secondary"
            className="w-full"
          >
            <Download className="h-4 w-4" /> Download compressed PDF
          </Button>
          {saved <= 0 && (
            <p className="text-xs text-fg-faint">
              This PDF was already well-optimized — compression didn&apos;t reduce it further.
            </p>
          )}
        </>
      )}
    </div>
  );
}
