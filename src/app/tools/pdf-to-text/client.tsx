"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Textarea, Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { download } from "@/lib/utils";
import { extractText } from "@/lib/pdfjs";
import { FileText, Download, Loader2, X } from "lucide-react";

export default function PdfToText() {
  const [name, setName] = useState("");
  const [pages, setPages] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File) {
    setBusy(true);
    setError("");
    setName(file.name.replace(/\.pdf$/i, ""));
    try {
      const text = await extractText(await file.arrayBuffer());
      setPages(text);
    } catch {
      setError("Couldn't read this PDF. Scanned/image-only PDFs have no selectable text.");
    } finally {
      setBusy(false);
    }
  }

  if (busy)
    return (
      <div className="panel grid place-items-center gap-3 py-16 text-fg-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
        Extracting text…
      </div>
    );

  if (!pages)
    return (
      <div className="space-y-3">
        <Dropzone onFile={onFile} accept="application/pdf" hint="PDF file" label="Drop a PDF to extract its text" />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );

  const full = pages.map((p, i) => `--- Page ${i + 1} ---\n${p}`).join("\n\n");
  const words = full.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-5 w-5 text-danger" /> {name}.pdf
        </div>
        <div className="flex gap-2">
          <CopyButton value={full} size="sm" />
          <Button variant="secondary" size="sm" onClick={() => download(new Blob([full], { type: "text/plain" }), `${name}.txt`)}>
            <Download className="h-4 w-4" /> .txt
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setPages(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
        <Stat label="Pages" value={pages.length} />
        <Stat label="Words" value={words.toLocaleString()} />
      </div>

      <Textarea value={full} readOnly className="min-h-[420px] font-mono text-sm" />
    </div>
  );
}
