"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Dropzone } from "@/components/ui/dropzone";
import { Input, Segmented, Check } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { FileText, Download, Loader2, X } from "lucide-react";

export default function PdfHeaderFooter() {
  const [file, setFile] = useState<File | null>(null);
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [numbers, setNumbers] = useState(true);
  const [numFormat, setNumFormat] = useState("Page {n} of {total}");
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [busy, setBusy] = useState(false);

  async function apply() {
    if (!file) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;
      const gray = rgb(0.3, 0.3, 0.3);
      const fs = 10;
      pages.forEach((page, i) => {
        const { width } = page.getSize();
        const put = (text: string, y: number, forceAlign?: "left" | "center" | "right") => {
          if (!text) return;
          const a = forceAlign ?? align;
          const tw = font.widthOfTextAtSize(text, fs);
          const x = a === "left" ? 40 : a === "right" ? width - 40 - tw : (width - tw) / 2;
          page.drawText(text, { x, y, size: fs, font, color: gray });
        };
        put(header, page.getSize().height - 30);
        put(footer, 24);
        if (numbers) {
          const label = numFormat.replace("{n}", String(i + 1)).replace("{total}", String(total));
          put(label, 24, footer && align === "center" ? "right" : align);
        }
      });
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), `${file.name.replace(/\.pdf$/i, "")}-numbered.pdf`);
    } finally {
      setBusy(false);
    }
  }

  if (!file)
    return <Dropzone onFile={setFile} accept="application/pdf" hint="PDF file" label="Drop a PDF to add headers, footers or page numbers" />;

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
          <div className="mb-1.5 text-sm font-medium">Header text</div>
          <Input value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Optional" className="h-11" />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Footer text</div>
          <Input value={footer} onChange={(e) => setFooter(e.target.value)} placeholder="Optional" className="h-11" />
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-sm font-medium">Alignment</div>
        <Segmented
          value={align}
          onChange={setAlign}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
        />
      </div>

      <div className="space-y-3">
        <Check checked={numbers} onChange={setNumbers}>Add page numbers</Check>
        {numbers && (
          <Input
            value={numFormat}
            onChange={(e) => setNumFormat(e.target.value)}
            className="h-10 max-w-xs font-mono text-sm"
          />
        )}
        {numbers && <p className="text-xs text-fg-faint">Use {"{n}"} for the current page and {"{total}"} for the total.</p>}
      </div>

      <Button onClick={apply} size="lg" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Apply & download
      </Button>
    </div>
  );
}
