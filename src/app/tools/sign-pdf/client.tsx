"use client";

import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { download, cn } from "@/lib/utils";
import { canvasToBlob } from "@/lib/image";
import { openPdf, renderPage } from "@/lib/pdfjs";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { ChevronLeft, ChevronRight, Download, Loader2, X, Eraser } from "lucide-react";

export default function SignPdf() {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("document");
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [preview, setPreview] = useState<string>("");
  const [sig, setSig] = useState<{ url: string; aspect: number } | null>(null);
  const [placed, setPlaced] = useState({ xPct: 60, yPct: 80, wPct: 30 });
  const [busy, setBusy] = useState(false);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  async function onFile(file: File) {
    const buf = await file.arrayBuffer();
    setBytes(buf);
    setName(file.name.replace(/\.pdf$/i, ""));
    const doc = await openPdf(buf.slice(0));
    setPdf(doc);
    setPageNum(1);
  }

  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;
    (async () => {
      const canvas = await renderPage(pdf, pageNum, 1.5);
      if (!cancelled) setPreview(canvas.toDataURL("image/png"));
    })();
    return () => { cancelled = true; };
  }, [pdf, pageNum]);

  function onPointerDown(e: React.PointerEvent) {
    const stage = stageRef.current!.getBoundingClientRect();
    const sigLeft = (placed.xPct / 100) * stage.width;
    const sigTop = (placed.yPct / 100) * stage.height;
    dragRef.current = { dx: e.clientX - stage.left - sigLeft, dy: e.clientY - stage.top - sigTop };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const stage = stageRef.current!.getBoundingClientRect();
    const x = e.clientX - stage.left - dragRef.current.dx;
    const y = e.clientY - stage.top - dragRef.current.dy;
    setPlaced((p) => ({
      ...p,
      xPct: Math.max(0, Math.min(100 - p.wPct, (x / stage.width) * 100)),
      yPct: Math.max(0, Math.min(98, (y / stage.height) * 100)),
    }));
  }

  async function apply() {
    if (!bytes || !sig) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(bytes.slice(0), { ignoreEncryption: true });
      const page = doc.getPages()[pageNum - 1];
      const { width: pw, height: ph } = page.getSize();
      const pngBytes = await (await fetch(sig.url)).arrayBuffer();
      const png = await doc.embedPng(pngBytes);
      const w = (placed.wPct / 100) * pw;
      const h = w / sig.aspect;
      const x = (placed.xPct / 100) * pw;
      const y = ph - (placed.yPct / 100) * ph - h;
      page.drawImage(png, { x, y, width: w, height: h });
      const outBytes = await doc.save();
      download(new Blob([outBytes as BlobPart], { type: "application/pdf" }), `${name}-signed.pdf`);
    } finally {
      setBusy(false);
    }
  }

  if (!bytes) return <Dropzone onFile={onFile} accept="application/pdf" hint="PDF file" label="Drop a PDF to sign" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium">{name}.pdf</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPageNum((n) => Math.max(1, n - 1))} disabled={pageNum <= 1} className="text-fg-muted disabled:opacity-40"><ChevronLeft className="h-5 w-5" /></button>
            <span className="text-sm tabular-nums">{pageNum} / {pdf?.numPages ?? 1}</span>
            <button onClick={() => setPageNum((n) => Math.min(pdf?.numPages ?? 1, n + 1))} disabled={pageNum >= (pdf?.numPages ?? 1)} className="text-fg-muted disabled:opacity-40"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>

        <div ref={stageRef} className="relative select-none overflow-hidden rounded-xl border border-border">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="page" className="w-full" draggable={false} />
          ) : (
            <div className="grid h-96 place-items-center text-fg-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
          )}
          {sig && (
            <img
              src={sig.url}
              alt="signature"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={() => (dragRef.current = null)}
              draggable={false}
              className="absolute cursor-move rounded ring-2 ring-accent/50"
              style={{ left: `${placed.xPct}%`, top: `${placed.yPct}%`, width: `${placed.wPct}%` }}
            />
          )}
        </div>
        {sig && <p className="text-xs text-fg-faint">Drag the signature to position it on the page.</p>}
      </div>

      <div className="space-y-5">
        <SignaturePad onChange={setSig} />
        {sig && (
          <div>
            <div className="mb-1.5 flex justify-between text-sm font-medium">
              <span>Signature size</span>
              <span className="text-accent">{placed.wPct}%</span>
            </div>
            <input type="range" min={10} max={60} value={placed.wPct} onChange={(e) => setPlaced((p) => ({ ...p, wPct: Number(e.target.value) }))} className="w-full accent-[hsl(var(--accent))]" />
          </div>
        )}
        <Button onClick={apply} size="lg" className="w-full" disabled={!sig || busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Apply & download
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setBytes(null); setPdf(null); setSig(null); }}>
          <X className="h-4 w-4" /> Start over
        </Button>
      </div>
    </div>
  );
}

function SignaturePad({ onChange }: { onChange: (s: { url: string; aspect: number } | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  useEffect(() => {
    const c = canvasRef.current!;
    c.width = 400;
    c.height = 160;
    const ctx = c.getContext("2d")!;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f0f17";
  }, []);

  function pos(e: React.PointerEvent) {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 400, y: ((e.clientY - r.top) / r.height) * 160 };
  }
  function down(e: React.PointerEvent) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    canvasRef.current!.setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    dirty.current = true;
  }
  async function up() {
    drawing.current = false;
    if (dirty.current) {
      const blob = await canvasToBlob(canvasRef.current!, "image/png");
      onChange({ url: URL.createObjectURL(blob), aspect: 400 / 160 });
    }
  }
  function clear() {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    dirty.current = false;
    onChange(null);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm font-medium">
        <span>Draw your signature</span>
        <button onClick={clear} className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-fg">
          <Eraser className="h-3.5 w-3.5" /> Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        className="h-40 w-full touch-none rounded-xl border border-border bg-white"
      />
    </div>
  );
}
