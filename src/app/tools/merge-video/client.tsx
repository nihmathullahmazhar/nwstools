"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { useFFmpeg, fetchFile } from "@/lib/ffmpeg";
import { download, formatBytes } from "@/lib/utils";
import { Download, Loader2, X, Play, Cpu, Film, ArrowUp, ArrowDown } from "lucide-react";

const W = 1280;
const H = 720;

export default function MergeVideo() {
  const ff = useFFmpeg();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);

  function add(newFiles: File[]) {
    setFiles((p) => [...p, ...newFiles.filter((f) => f.type.startsWith("video/"))]);
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

  function filterArgs(names: string[], withAudio: boolean): string[] {
    const n = names.length;
    const inputs = names.flatMap((nm) => ["-i", nm]);
    let fc = "";
    for (let i = 0; i < n; i++) {
      fc += `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30[v${i}];`;
      if (withAudio) fc += `[${i}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo[a${i}];`;
    }
    for (let i = 0; i < n; i++) fc += withAudio ? `[v${i}][a${i}]` : `[v${i}]`;
    fc += `concat=n=${n}:v=1:a=${withAudio ? 1 : 0}${withAudio ? "[v][a]" : "[v]"}`;
    const maps = withAudio ? ["-map", "[v]", "-map", "[a]"] : ["-map", "[v]"];
    return [
      ...inputs,
      "-filter_complex", fc,
      ...maps,
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
      ...(withAudio ? ["-c:a", "aac"] : []),
      "out.mp4",
    ];
  }

  async function process() {
    if (files.length < 2) return;
    setResult(null);
    try {
      const engine = await ff.ensure();
      const names = await Promise.all(
        files.map(async (f, i) => {
          const nm = `in${i}${f.name.match(/\.[^.]+$/)?.[0] ?? ".mp4"}`;
          await engine.writeFile(nm, await fetchFile(f));
          return nm;
        }),
      );
      try {
        await engine.exec(filterArgs(names, true));
      } catch {
        // a clip likely lacked audio — retry video-only
        await engine.exec(filterArgs(names, false));
      }
      const data = (await engine.readFile("out.mp4")) as Uint8Array;
      const blob = new Blob([data as BlobPart]);
      setResult({ url: URL.createObjectURL(blob), blob });
    } catch {
      /* surfaced via ff.error */
    }
  }

  return (
    <div className="space-y-5">
      <Dropzone onFiles={add} accept="video/*" multiple hint="MP4, WebM or MOV" label="Add videos to join (in order)" />

      {files.length > 0 && (
        <div className="panel divide-y divide-border">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Film className="h-5 w-5 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{f.name}</div>
                <div className="text-xs text-fg-muted">{formatBytes(f.size)}</div>
              </div>
              <button onClick={() => move(i, -1)} className="text-fg-faint hover:text-fg"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => move(i, 1)} className="text-fg-faint hover:text-fg"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => setFiles((p) => p.filter((_, x) => x !== i))} className="text-fg-faint hover:text-danger"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}

      {files.length >= 2 && (
        <>
          <Button onClick={process} size="lg" disabled={ff.busy || ff.loading}>
            {ff.loading ? <><Cpu className="h-4 w-4 animate-pulse" /> Loading engine…</> : ff.busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Merging… {Math.round(ff.progress * 100)}%</> : <><Play className="h-4 w-4" /> Merge {files.length} videos</>}
          </Button>
          {(ff.busy || ff.loading) && (
            <div className="h-2 overflow-hidden rounded-full bg-panel-raised">
              <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: ff.loading ? "100%" : `${ff.progress * 100}%` }} />
            </div>
          )}
          <p className="text-xs text-fg-faint">Clips are normalized to 1280×720, 30&nbsp;fps before joining.</p>
        </>
      )}
      {ff.error && <p className="text-sm text-danger">{ff.error}</p>}

      {result && (
        <div className="panel space-y-3 p-4">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video src={result.url} controls className="w-full rounded-lg" />
          <div className="text-xs text-fg-muted">{formatBytes(result.blob.size)}</div>
          <Button onClick={() => download(result.blob, "merged.mp4")} className="w-full">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      )}
    </div>
  );
}
