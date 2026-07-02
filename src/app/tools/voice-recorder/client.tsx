"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { formatDuration } from "@/lib/audio";
import { Mic, Square, Download, Trash2, Circle } from "lucide-react";

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clip, setClip] = useState<{ url: string; blob: Blob } | null>(null);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState("");

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        setClip((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url: URL.createObjectURL(blob), blob };
        });
      };
      rec.start();
      recRef.current = rec;

      // level meter
      const AC = window.AudioContext;
      const actx = new AC();
      const source = actx.createMediaStreamSource(stream);
      const analyser = actx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += (v - 128) ** 2;
        setLevel(Math.min(1, Math.sqrt(sum / data.length) / 40));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      setClip(null);
      setElapsed(0);
      setRecording(true);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      setError("Microphone access was denied or is unavailable.");
    }
  }

  function stop() {
    recRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    setLevel(0);
  }

  useEffect(() => () => stop(), []);

  return (
    <div className="mx-auto max-w-lg space-y-8 text-center">
      <div className="panel flex flex-col items-center gap-6 p-10">
        <div className="relative grid h-32 w-32 place-items-center">
          <div
            className="absolute rounded-full bg-danger/20 transition-all"
            style={{
              width: `${64 + level * 80}px`,
              height: `${64 + level * 80}px`,
              opacity: recording ? 1 : 0,
            }}
          />
          <div
            className={`grid h-24 w-24 place-items-center rounded-full ${
              recording ? "bg-danger text-white" : "bg-accent text-accent-fg"
            }`}
          >
            <Mic className="h-10 w-10" />
          </div>
        </div>

        <div className="text-4xl font-semibold tabular-nums tracking-tight">
          {formatDuration(elapsed)}
        </div>

        {recording ? (
          <Button variant="danger" size="lg" onClick={stop}>
            <Square className="h-4 w-4" /> Stop recording
          </Button>
        ) : (
          <Button size="lg" onClick={start}>
            <Circle className="h-4 w-4 fill-current" /> Start recording
          </Button>
        )}
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      {clip && (
        <div className="panel space-y-4 p-5">
          <audio src={clip.url} controls className="w-full" />
          <div className="flex justify-center gap-2">
            <Button onClick={() => download(clip.blob, `recording-${Date.now()}.webm`)}>
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button variant="secondary" onClick={() => setClip(null)}>
              <Trash2 className="h-4 w-4" /> Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
