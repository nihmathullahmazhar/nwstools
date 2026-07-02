"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Dropzone } from "@/components/ui/dropzone";
import { Input, Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download, formatBytes } from "@/lib/utils";
import { FileText, X, ArrowUp, ArrowDown, Download, Loader2 } from "lucide-react";

type Item = { file: File; pages: number };

async function pageCount(file: File) {
  const doc = await PDFDocument.load(await file.arrayBuffer(), {
    ignoreEncryption: true,
  });
  return doc.getPageCount();
}

function parseRanges(input: string, max: number): number[] {
  const out: number[] = [];
  for (const part of input.split(",")) {
    const t = part.trim();
    if (!t) continue;
    const m = t.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const [a, b] = [Number(m[1]), Number(m[2])];
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++)
        if (i >= 1 && i <= max) out.push(i - 1);
    } else if (/^\d+$/.test(t)) {
      const n = Number(t);
      if (n >= 1 && n <= max) out.push(n - 1);
    }
  }
  return out;
}

export default function MergeSplitPdf() {
  const [mode, setMode] = useState<"merge" | "split">("merge");
  const [items, setItems] = useState<Item[]>([]);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);

  async function addFiles(files: File[]) {
    const pdfs = files.filter((f) => f.type === "application/pdf");
    const withCounts = await Promise.all(
      pdfs.map(async (file) => ({ file, pages: await pageCount(file).catch(() => 0) })),
    );
    setItems((prev) => (mode === "split" ? withCounts.slice(0, 1) : [...prev, ...withCounts]));
  }

  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function merge() {
    setBusy(true);
    try {
      const out = await PDFDocument.create();
      for (const it of items) {
        const src = await PDFDocument.load(await it.file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "merged.pdf");
    } finally {
      setBusy(false);
    }
  }

  async function split() {
    if (!items[0]) return;
    setBusy(true);
    try {
      const src = await PDFDocument.load(await items[0].file.arrayBuffer(), { ignoreEncryption: true });
      const indices = parseRanges(range, src.getPageCount());
      if (!indices.length) return;
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "extracted.pdf");
    } finally {
      setBusy(false);
    }
  }

  const totalPages = items.reduce((s, i) => s + i.pages, 0);

  return (
    <div className="space-y-5">
      <Segmented
        value={mode}
        onChange={(m) => {
          setMode(m);
          setItems([]);
        }}
        options={[
          { value: "merge", label: "Merge" },
          { value: "split", label: "Split / Extract" },
        ]}
      />

      <Dropzone
        onFiles={addFiles}
        accept="application/pdf"
        multiple={mode === "merge"}
        hint="PDF files"
        label={mode === "merge" ? "Add PDFs to combine" : "Drop a PDF to split"}
      />

      {items.length > 0 && (
        <div className="panel divide-y divide-border">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <FileText className="h-5 w-5 shrink-0 text-danger" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{it.file.name}</div>
                <div className="text-xs text-fg-muted">
                  {it.pages} pages · {formatBytes(it.file.size)}
                </div>
              </div>
              {mode === "merge" && (
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} className="text-fg-faint hover:text-fg" aria-label="Up">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button onClick={() => move(i, 1)} className="text-fg-faint hover:text-fg" aria-label="Down">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              )}
              <button
                onClick={() => setItems((p) => p.filter((_, x) => x !== i))}
                className="text-fg-faint hover:text-danger"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {mode === "split" && items[0] && (
        <div>
          <div className="mb-1.5 text-sm font-medium">
            Pages to extract (of {items[0].pages})
          </div>
          <Input
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="e.g. 1-3, 5, 8-10"
            className="h-11 font-mono"
          />
        </div>
      )}

      {items.length > 0 && (
        <Button
          onClick={mode === "merge" ? merge : split}
          size="lg"
          disabled={busy || (mode === "merge" && items.length < 1)}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {mode === "merge"
            ? `Merge ${items.length} PDF${items.length === 1 ? "" : "s"} (${totalPages} pages)`
            : "Extract pages"}
        </Button>
      )}
    </div>
  );
}
