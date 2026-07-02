"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download, formatBytes } from "@/lib/utils";
import { loadImage, drawToCanvas, canvasToBlob, extFor } from "@/lib/image";
import { Download, X, ShieldCheck, Loader2 } from "lucide-react";

export default function MetadataRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [clean, setClean] = useState<{ url: string; blob: Blob } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(f: File) {
    setBusy(true);
    setFile(f);
    try {
      const img = await loadImage(f);
      const canvas = drawToCanvas(img, img.naturalWidth, img.naturalHeight);
      // re-encoding through canvas discards all EXIF/metadata
      const type = f.type === "image/png" ? "image/png" : "image/jpeg";
      const blob = await canvasToBlob(canvas, type, type === "image/jpeg" ? 0.95 : undefined);
      setClean({ url: URL.createObjectURL(blob), blob });
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    if (clean) URL.revokeObjectURL(clean.url);
    setClean(null);
  }

  if (!file)
    return (
      <Dropzone
        onFile={onFile}
        accept="image/jpeg,image/png,image/webp"
        hint="JPG, PNG or WebP"
        label="Drop a photo to strip its metadata"
      />
    );

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="panel flex items-center gap-3 px-4 py-3">
        <span className="truncate text-sm font-medium">{file.name}</span>
        <button onClick={reset} className="ml-auto text-fg-faint hover:text-fg">
          <X className="h-4 w-4" />
        </button>
      </div>

      {busy ? (
        <div className="panel grid place-items-center py-16 text-fg-muted">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        clean && (
          <>
            <div className="panel grid place-items-center overflow-hidden p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={clean.url} alt="cleaned" className="max-h-72 w-auto rounded-lg" />
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
              All EXIF, GPS location and camera metadata removed.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Original" value={formatBytes(file.size)} />
              <Stat label="Cleaned" value={formatBytes(clean.blob.size)} />
            </div>

            <Button
              onClick={() => download(clean.blob, `${file.name.replace(/\.[^.]+$/, "")}-clean.${extFor(clean.blob.type)}`)}
              size="lg"
              className="w-full"
            >
              <Download className="h-4 w-4" /> Download clean image
            </Button>
          </>
        )
      )}
    </div>
  );
}
