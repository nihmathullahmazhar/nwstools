"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "1 min", s: 60 },
  { label: "5 min", s: 300 },
  { label: "10 min", s: 600 },
  { label: "25 min", s: 1500 },
];

function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.25, 0.5].forEach((delay) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      const t = ctx.currentTime + delay;
      g.gain.setValueAtTime(0.001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.start(t);
      o.stop(t + 0.2);
    });
  } catch {}
}

export default function CountdownTimer() {
  const [total, setTotal] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          setDone(true);
          beep();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  function setPreset(s: number) {
    setTotal(s);
    setRemaining(s);
    setRunning(false);
    setDone(false);
  }
  function reset() {
    setRemaining(total);
    setRunning(false);
    setDone(false);
  }
  function adjust(field: "m" | "s", delta: number) {
    setRemaining((r) => {
      const m = Math.floor(r / 60);
      const sec = r % 60;
      let nm = m,
        ns = sec;
      if (field === "m") nm = Math.max(0, Math.min(99, m + delta));
      else ns = Math.max(0, Math.min(59, sec + delta));
      const next = nm * 60 + ns;
      setTotal(next);
      return next;
    });
    setDone(false);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = total > 0 ? remaining / total : 0;
  const R = 130;
  const circ = 2 * Math.PI * R;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8">
      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.s}
            onClick={() => setPreset(p.s)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              total === p.s
                ? "bg-accent text-accent-fg"
                : "text-fg-muted hover:bg-panel-raised",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative grid place-items-center">
        <svg width="300" height="300" className="-rotate-90">
          <circle cx="150" cy="150" r={R} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
          <circle
            cx="150"
            cy="150"
            r={R}
            fill="none"
            stroke={done ? "hsl(var(--success))" : "hsl(var(--accent))"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          {!running && !done ? (
            <div className="flex items-center gap-1 text-6xl font-semibold tabular-nums">
              <Spinner value={mm} onUp={() => adjust("m", 1)} onDown={() => adjust("m", -1)} />
              <span>:</span>
              <Spinner value={ss} onUp={() => adjust("s", 5)} onDown={() => adjust("s", -5)} />
            </div>
          ) : (
            <span className={cn("text-6xl font-semibold tabular-nums", done && "text-success")}>
              {mm}:{ss}
            </span>
          )}
          <span className="mt-1 text-sm text-fg-muted">
            {done ? "Time's up!" : running ? "Running" : "Set your timer"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="grid h-12 w-12 place-items-center rounded-full border border-border text-fg-muted hover:text-fg"
          aria-label="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={() => remaining > 0 && setRunning((r) => !r)}
          disabled={remaining === 0}
          className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-fg shadow-lg shadow-accent/30 transition hover:brightness-110 disabled:opacity-40"
          aria-label={running ? "Pause" : "Start"}
        >
          {running ? <Pause className="h-7 w-7" /> : <Play className="ml-0.5 h-7 w-7" />}
        </button>
      </div>
    </div>
  );
}

function Spinner({
  value,
  onUp,
  onDown,
}: {
  value: string;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <span className="group relative select-none">
      <button
        onClick={onUp}
        className="absolute inset-x-0 -top-6 text-lg text-fg-faint opacity-0 transition group-hover:opacity-100"
        aria-label="Increase"
      >
        ▲
      </button>
      {value}
      <button
        onClick={onDown}
        className="absolute inset-x-0 -bottom-6 text-lg text-fg-faint opacity-0 transition group-hover:opacity-100"
        aria-label="Decrease"
      >
        ▼
      </button>
    </span>
  );
}
