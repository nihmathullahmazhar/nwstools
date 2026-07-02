"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { download, formatBytes } from "@/lib/utils";
import { Download, Loader2, X, Sparkles } from "lucide-react";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [origUrl, setOrigUrl] = useState("");
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  async function onFile(f: File) {
    setFile(f);
    setOrigUrl(URL.createObjectURL(f));
    setResult(null);
    setError("");
    await run(f);
  }

  async function run(f: File) {
    setBusy(true);
    setProgress(0);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(f, {
        progress: (key: string, current: number, total: number) => {
          setStage(key.startsWith("fetch") ? "Downloading AI model…" : "Removing background…");
          if (total) setProgress(current / total);
        },
      });
      setResult({ url: URL.createObjectURL(blob), blob });
    } catch {
      setError("Couldn't process this image. Try a different photo.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setOrigUrl("");
    setError("");
  }

  if (!file)
    return (
      <div className="space-y-3">
        <Dropzone onFile={onFile} accept="image/*" hint="JPG, PNG or WebP" label="Drop a photo to remove its background" />
        <p className="text-center text-xs text-fg-faint">
          Uses an on-device AI model (~40&nbsp;MB, downloaded once). Your image never leaves your browser.
        </p>
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <figure className="panel overflow-hidden">
          <div className="grid place-items-center bg-panel-raised p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={origUrl} alt="original" className="max-h-72 w-auto rounded" />
          </div>
          <figcaption className="border-t border-border px-4 py-2 text-sm text-fg-muted">Original</figcaption>
        </figure>

        <figure className="panel overflow-hidden">
          <div
            className="grid min-h-[12rem] place-items-center p-3"
            style={{
              backgroundImage:
                "repeating-conic-gradient(hsl(var(--border)) 0% 25%, transparent 0% 50%)",
              backgroundSize: "20px 20px",
            }}
          >
            {result ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result.url} alt="cutout" className="max-h-72 w-auto rounded" />
            ) : busy ? (
              <div className="flex flex-col items-center gap-2 text-sm text-fg-muted">
                <Loader2 className="h-6 w-6 animate-spin" />
                {stage} {progress > 0 && `${Math.round(progress * 100)}%`}
              </div>
            ) : null}
          </div>
          <figcaption className="border-t border-border px-4 py-2 text-sm text-fg-muted">
            Transparent PNG {result && `· ${formatBytes(result.blob.size)}`}
          </figcaption>
        </figure>
      </div>

      {busy && progress > 0 && (
        <div className="h-2 overflow-hidden rounded-full bg-panel-raised">
          <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2">
        <Button onClick={() => result && download(result.blob, `${file.name.replace(/\.[^.]+$/, "")}-nobg.png`)} size="lg" disabled={!result}>
          <Download className="h-4 w-4" /> Download PNG
        </Button>
        {!result && !busy && (
          <Button variant="secondary" size="lg" onClick={() => run(file)}>
            <Sparkles className="h-4 w-4" /> Retry
          </Button>
        )}
        <Button variant="secondary" size="lg" onClick={reset}>
          <X className="h-4 w-4" /> New image
        </Button>
      </div>
    </div>
  );
}
