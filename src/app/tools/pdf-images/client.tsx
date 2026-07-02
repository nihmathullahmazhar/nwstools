"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Dropzone } from "@/components/ui/dropzone";
import { Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { canvasToBlob, drawToCanvas, loadImage } from "@/lib/image";
import { X, Download, Loader2, ArrowUp, ArrowDown } from "lucide-react";

type PageSize = "fit" | "a4" | "letter";
const SIZES: Record<Exclude<PageSize, "fit">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export default function PdfImages() {
  const [files, setFiles] = useState<{ file: File; url: string }[]>([]);
  const [size, setSize] = useState<PageSize>("fit");
  const [busy, setBusy] = useState(false);

  function add(newFiles: File[]) {
    const imgs = newFiles
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setFiles((p) => [...p, ...imgs]);
  }
  function move(i: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function build() {
    setBusy(true);
    try {
      const doc = await PDFDocument.create();
      for (const { file } of files) {
        const img = await loadImage(file);
        // normalize everything to JPEG for consistent embedding
        const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
        const embed = await doc.embedJpg(await blob.arrayBuffer());
        let pw: number, ph: number;
        if (size === "fit") {
          pw = embed.width;
          ph = embed.height;
        } else {
          [pw, ph] = SIZES[size];
        }
        const page = doc.addPage([pw, ph]);
        const scale = Math.min(pw / embed.width, ph / embed.height);
        const w = embed.width * scale;
        const h = embed.height * scale;
        page.drawImage(embed, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
      }
      const bytes = await doc.save();
      download(new Blob([bytes as BlobPart], { type: "application/pdf" }), "images.pdf");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Dropzone onFiles={add} multiple hint="JPG, PNG or WebP" label="Add images (one per page)" />

      {files.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Page size</span>
            <Segmented
              value={size}
              onChange={setSize}
              options={[
                { value: "fit", label: "Fit to image" },
                { value: "a4", label: "A4" },
                { value: "letter", label: "Letter" },
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {files.map((f, i) => (
              <div key={i} className="group panel relative overflow-hidden p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt="" className="aspect-square w-full rounded object-cover" />
                <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => move(i, -1)} className="rounded bg-black/60 p-1 text-white" aria-label="Left">
                    <ArrowUp className="h-3 w-3 -rotate-90" />
                  </button>
                  <button onClick={() => move(i, 1)} className="rounded bg-black/60 p-1 text-white" aria-label="Right">
                    <ArrowDown className="h-3 w-3 -rotate-90" />
                  </button>
                </div>
                <button
                  onClick={() => setFiles((p) => p.filter((_, x) => x !== i))}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>

          <Button onClick={build} size="lg" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Create PDF ({files.length} page{files.length === 1 ? "" : "s"})
          </Button>
        </>
      )}
    </div>
  );
}
