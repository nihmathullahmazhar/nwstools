"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Dropzone } from "@/components/ui/dropzone";
import { Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { FileText, Download, Loader2, X } from "lucide-react";

const SIZES: Record<string, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  legal: [612, 1008],
};

export default function ResizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState("a4");
  const [orient, setOrient] = useState<"portrait" | "landscape">("portrait");
  const [busy, setBusy] = useState(false);

  async function apply() {
    if (!file) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      let [tw, th] = SIZES[size];
      if (orient === "landscape") [tw, th] = [th, tw];
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const s = Math.min(tw / width, th / height);
        page.scaleContent(s, s);
        page.translateContent((tw - width * s) / 2, (th - height * s) / 2);
        page.setSize(tw, th);
      }
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), `${file.name.replace(/\.pdf$/i, "")}-${size}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  if (!file)
    return <Dropzone onFile={setFile} accept="application/pdf" hint="PDF file" label="Drop a PDF to resize" />;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="panel flex items-center gap-3 px-4 py-3">
        <FileText className="h-5 w-5 text-danger" />
        <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
        <button onClick={() => setFile(null)} className="text-fg-faint hover:text-fg"><X className="h-4 w-4" /></button>
      </div>

      <div>
        <div className="mb-1.5 text-sm font-medium">Page size</div>
        <Segmented
          value={size}
          onChange={setSize}
          options={[
            { value: "a4", label: "A4" },
            { value: "letter", label: "Letter" },
            { value: "legal", label: "Legal" },
          ]}
        />
      </div>
      <div>
        <div className="mb-1.5 text-sm font-medium">Orientation</div>
        <Segmented
          value={orient}
          onChange={setOrient}
          options={[
            { value: "portrait", label: "Portrait" },
            { value: "landscape", label: "Landscape" },
          ]}
        />
      </div>

      <Button onClick={apply} size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Resize & download
      </Button>
      <p className="text-xs text-fg-faint">Content is scaled to fit and centered on the new page size.</p>
    </div>
  );
}
