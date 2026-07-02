"use client";

import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";
import { Check, Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { decodeAudio, audioBufferToWav, processBuffer, formatDuration } from "@/lib/audio";
import { Download, Loader2, X, Volume2 } from "lucide-react";

export default function AudioVolume() {
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [name, setName] = useState("audio");
  const [gain, setGain] = useState(150);
  const [normalize, setNormalize] = useState(false);
  const [peak, setPeak] = useState(1);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function onFile(file: File) {
    setBusy(true);
    try {
      const buf = await decodeAudio(file);
      setBuffer(buf);
      setName(file.name.replace(/\.[^.]+$/, ""));
      // compute peak
      let p = 0;
      for (let c = 0; c < buf.numberOfChannels; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < d.length; i++) p = Math.max(p, Math.abs(d[i]));
      }
      setPeak(p || 1);
    } catch {
      setName("");
    } finally {
      setBusy(false);
    }
  }

  const effectiveGain = normalize ? 1 / peak : gain / 100;

  async function render() {
    if (!buffer) return;
    setBusy(true);
    try {
      const out = await processBuffer(buffer, { gain: effectiveGain });
      const blob = audioBufferToWav(out);
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(blob);
      setPreview(url);
      download(blob, `${name}-volume.wav`);
    } finally {
      setBusy(false);
    }
  }

  if (!buffer)
    return busy ? (
      <div className="panel grid place-items-center py-16 text-fg-muted">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ) : (
      <Dropzone onFile={onFile} accept="audio/*" hint="MP3, WAV, M4A or OGG" label="Drop an audio file" />
    );

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="panel flex items-center gap-3 px-4 py-3">
        <Volume2 className="h-5 w-5 text-accent" />
        <span className="flex-1 truncate text-sm font-medium">{name}</span>
        <button onClick={() => setBuffer(null)} className="text-fg-faint hover:text-fg">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Duration" value={formatDuration(buffer.duration)} />
        <Stat label="Peak level" value={`${Math.round(peak * 100)}%`} />
      </div>

      <Check checked={normalize} onChange={setNormalize}>
        Auto-normalize to 100% peak
      </Check>

      {!normalize && (
        <div>
          <div className="mb-1.5 flex justify-between text-sm font-medium">
            <span>Volume</span>
            <span className="text-accent">{gain}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={400}
            value={gain}
            onChange={(e) => setGain(Number(e.target.value))}
            className="w-full accent-[hsl(var(--accent))]"
          />
        </div>
      )}

      <Button onClick={render} size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Apply & download WAV
      </Button>

      {preview && <audio src={preview} controls className="w-full" />}
    </div>
  );
}
