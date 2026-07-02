"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1; // too quiet

  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
  const b = buf.slice(r1, r2);
  const n = b.length;

  const c = new Array(n).fill(0);
  for (let i = 0; i < n; i++) for (let j = 0; j < n - i; j++) c[i] += b[j] * b[j + i];

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < n; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }
  let T0 = maxpos;
  // parabolic interpolation
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const bb = (x3 - x1) / 2;
  if (a) T0 = T0 - bb / (2 * a);
  return sampleRate / T0;
}

export default function Tuner() {
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState("—");
  const [octave, setOctave] = useState<number | null>(null);
  const [cents, setCents] = useState(0);
  const [freq, setFreq] = useState(0);
  const [error, setError] = useState("");
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      setRunning(true);

      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        const f = autoCorrelate(buf, ctx.sampleRate);
        if (f > 0) {
          const midi = 69 + 12 * Math.log2(f / 440);
          const nearest = Math.round(midi);
          setNote(NOTES[(nearest % 12 + 12) % 12]);
          setOctave(Math.floor(nearest / 12) - 1);
          setCents(Math.round((midi - nearest) * 100));
          setFreq(f);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setError("Microphone access was denied or is unavailable.");
    }
  }

  function stop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    ctxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setRunning(false);
    setNote("—");
    setOctave(null);
    setCents(0);
    setFreq(0);
  }

  const inTune = Math.abs(cents) <= 5 && freq > 0;

  return (
    <div className="mx-auto max-w-md space-y-8 text-center">
      <div className="panel p-8">
        <div className={cn("text-7xl font-semibold tracking-tight transition-colors", inTune ? "text-success" : "text-fg")}>
          {note}
          {octave !== null && <span className="text-3xl text-fg-muted">{octave}</span>}
        </div>
        <div className="mt-1 text-sm text-fg-muted">{freq > 0 ? `${freq.toFixed(1)} Hz` : "play a note"}</div>

        {/* cents meter */}
        <div className="relative mx-auto mt-6 h-12 w-full max-w-xs">
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border-strong" />
          <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
          {freq > 0 && (
            <div
              className={cn("absolute top-1/2 h-6 w-1 -translate-y-1/2 rounded-full transition-all", inTune ? "bg-success" : "bg-accent")}
              style={{ left: `${50 + Math.max(-50, Math.min(50, cents)) }%` }}
            />
          )}
          <div className="absolute -bottom-5 left-0 text-xs text-fg-faint">♭ -50</div>
          <div className="absolute -bottom-5 right-0 text-xs text-fg-faint">+50 ♯</div>
        </div>
        <div className="mt-8 text-sm font-medium">
          {freq > 0 ? (inTune ? <span className="text-success">In tune</span> : <span className="text-fg-muted">{cents > 0 ? "sharp" : "flat"} by {Math.abs(cents)}¢</span>) : ""}
        </div>
      </div>

      {running ? (
        <Button variant="danger" size="lg" onClick={stop}><Square className="h-4 w-4" /> Stop</Button>
      ) : (
        <Button size="lg" onClick={start}><Mic className="h-4 w-4" /> Start tuning</Button>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
