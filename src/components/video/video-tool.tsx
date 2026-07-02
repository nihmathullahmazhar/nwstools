"use client";

import { useEffect, useRef, useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { useFFmpeg } from "@/lib/ffmpeg";
import { download, formatBytes } from "@/lib/utils";
import { Download, Loader2, X, Play, Cpu } from "lucide-react";

export function VideoTool({
  action,
  outName,
  downloadName,
  buildArgs,
  resultKind = "video",
  sourceKind = "video",
  accept = "video/*",
  hint = "MP4, WebM or MOV",
  dropLabel = "Drop a video file",
  children,
  disabled,
}: {
  action: string;
  outName: string;
  downloadName: (base: string) => string;
  buildArgs: (inName: string, outName: string) => string[];
  resultKind?: "video" | "audio" | "image";
  sourceKind?: "video" | "image";
  accept?: string;
  hint?: string;
  dropLabel?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}) {
  const ff = useFFmpeg();
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState<string>("");
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);
  const baseRef = useRef("output");

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    baseRef.current = file.name.replace(/\.[^.]+$/, "");
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function process() {
    if (!file) return;
    setResult(null);
    try {
      const blob = await ff.run(file, buildArgs, outName);
      setResult({ url: URL.createObjectURL(blob), blob });
    } catch {
      /* error surfaced via ff.error */
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setSrcUrl("");
  }

  if (!file) return <Dropzone onFile={setFile} accept={accept} hint={hint} label={dropLabel} />;

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm font-medium">{file.name}</span>
            <button onClick={reset} className="text-fg-faint hover:text-fg" aria-label="Remove">
              <X className="h-4 w-4" />
            </button>
          </div>
          {sourceKind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={srcUrl} alt="source" className="w-full rounded-xl border border-border" />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={srcUrl} controls className="w-full rounded-xl border border-border" />
          )}
          <div className="text-xs text-fg-muted">{formatBytes(file.size)}</div>
        </div>

        <div className="space-y-5">
          {children}

          <Button onClick={process} size="lg" className="w-full" disabled={disabled || ff.busy || ff.loading}>
            {ff.loading ? (
              <>
                <Cpu className="h-4 w-4 animate-pulse" /> Loading engine…
              </>
            ) : ff.busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing… {Math.round(ff.progress * 100)}%
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> {action}
              </>
            )}
          </Button>

          {(ff.busy || ff.loading) && (
            <div className="h-2 overflow-hidden rounded-full bg-panel-raised">
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: ff.loading ? "100%" : `${ff.progress * 100}%` }}
              />
            </div>
          )}

          {ff.error && <p className="text-sm text-danger">{ff.error}</p>}

          {result && (
            <div className="panel space-y-3 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
                Result · {formatBytes(result.blob.size)}
              </div>
              {resultKind === "video" && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={result.url} controls className="w-full rounded-lg" />
              )}
              {resultKind === "audio" && <audio src={result.url} controls className="w-full" />}
              {resultKind === "image" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="result" className="w-full rounded-lg" />
              )}
              <Button onClick={() => download(result.blob, downloadName(baseRef.current))} className="w-full">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-fg-faint">
        Video runs through FFmpeg compiled to WebAssembly, in your browser. The engine
        (~25&nbsp;MB) downloads once on first use, then processing stays on your device.
      </p>
    </div>
  );
}
