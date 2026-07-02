"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Segmented, Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { decodeAudio, audioBufferToWav, processBuffer, formatDuration } from "@/lib/audio";
import { Download, Loader2, X, Music, ArrowUp, ArrowDown } from "lucide-react";

export default function AudioTrimMerge() {
  const [mode, setMode] = useState<"trim" | "merge">("trim");

  return (
    <div className="space-y-5">
      <Segmented
        value={mode}
        onChange={(m) => setMode(m)}
        options={[
          { value: "trim", label: "Trim" },
          { value: "merge", label: "Merge" },
        ]}
      />
      {mode === "trim" ? <Trim /> : <Merge />}
    </div>
  );
}

function Trim() {
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [name, setName] = useState("audio");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File) {
    setBusy(true);
    try {
      const buf = await decodeAudio(file);
      setBuffer(buf);
      setName(file.name.replace(/\.[^.]+$/, ""));
      setStart(0);
      setEnd(buf.duration);
    } finally {
      setBusy(false);
    }
  }

  async function render() {
    if (!buffer || end <= start) return;
    setBusy(true);
    try {
      const out = await processBuffer(buffer, { start, end });
      download(audioBufferToWav(out), `${name}-trimmed.wav`);
    } finally {
      setBusy(false);
    }
  }

  if (!buffer)
    return <Dropzone onFile={onFile} accept="audio/*" hint="MP3, WAV, M4A or OGG" label="Drop an audio file to trim" />;

  const dur = buffer.duration;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <FileRow name={name} onRemove={() => setBuffer(null)} />

      <div className="relative h-14 rounded-lg bg-panel-raised">
        <div
          className="absolute inset-y-0 rounded-lg bg-accent/25"
          style={{ left: `${(start / dur) * 100}%`, right: `${100 - (end / dur) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <RangeField label="Start" value={start} max={end} onChange={setStart} />
        <RangeField label="End" value={end} max={dur} min={start} onChange={setEnd} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Selection" value={formatDuration(end - start)} />
        <Stat label="Original" value={formatDuration(dur)} />
      </div>

      <Button onClick={render} size="lg" className="w-full" disabled={busy || end <= start}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Trim & download WAV
      </Button>
    </div>
  );
}

function Merge() {
  const [files, setFiles] = useState<{ file: File; buffer: AudioBuffer }[]>([]);
  const [busy, setBusy] = useState(false);

  async function add(newFiles: File[]) {
    setBusy(true);
    try {
      const decoded = await Promise.all(
        newFiles
          .filter((f) => f.type.startsWith("audio/"))
          .map(async (file) => ({ file, buffer: await decodeAudio(file) })),
      );
      setFiles((p) => [...p, ...decoded]);
    } finally {
      setBusy(false);
    }
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

  async function merge() {
    if (files.length < 2) return;
    setBusy(true);
    try {
      const sr = files[0].buffer.sampleRate;
      const channels = Math.max(...files.map((f) => f.buffer.numberOfChannels));
      const totalFrames = files.reduce((s, f) => s + f.buffer.length, 0);
      const ctx = new OfflineAudioContext(channels, totalFrames, sr);
      const out = ctx.createBuffer(channels, totalFrames, sr);
      let offset = 0;
      for (const { buffer } of files) {
        for (let c = 0; c < channels; c++) {
          const srcCh = buffer.getChannelData(Math.min(c, buffer.numberOfChannels - 1));
          out.getChannelData(c).set(srcCh, offset);
        }
        offset += buffer.length;
      }
      download(audioBufferToWav(out), "merged.wav");
    } finally {
      setBusy(false);
    }
  }

  const totalDur = files.reduce((s, f) => s + f.buffer.duration, 0);

  return (
    <div className="space-y-5">
      <Dropzone onFiles={add} accept="audio/*" multiple hint="MP3, WAV, M4A or OGG" label="Add audio clips to join" />

      {files.length > 0 && (
        <div className="panel divide-y divide-border">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Music className="h-5 w-5 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{f.file.name}</div>
                <div className="text-xs text-fg-muted">{formatDuration(f.buffer.duration)}</div>
              </div>
              <button onClick={() => move(i, -1)} className="text-fg-faint hover:text-fg"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => move(i, 1)} className="text-fg-faint hover:text-fg"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => setFiles((p) => p.filter((_, x) => x !== i))} className="text-fg-faint hover:text-danger"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}

      {files.length >= 2 && (
        <Button onClick={merge} size="lg" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Merge {files.length} clips ({formatDuration(totalDur)})
        </Button>
      )}
    </div>
  );
}

function FileRow({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <div className="panel flex items-center gap-3 px-4 py-3">
      <Music className="h-5 w-5 text-accent" />
      <span className="flex-1 truncate text-sm font-medium">{name}</span>
      <button onClick={onRemove} className="text-fg-faint hover:text-fg">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function RangeField({
  label,
  value,
  max,
  min = 0,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  min?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-accent tabular-nums">{formatDuration(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[hsl(var(--accent))]"
      />
    </div>
  );
}
