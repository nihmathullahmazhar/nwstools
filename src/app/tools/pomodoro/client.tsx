"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "focus" | "short" | "long";
const DUR: Record<Phase, number> = { focus: 25, short: 5, long: 15 };
const LABEL: Record<Phase, string> = {
  focus: "Focus",
  short: "Short break",
  long: "Long break",
};

function beep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    o.start();
    o.stop(ctx.currentTime + 0.6);
  } catch {}
}

export default function Pomodoro() {
  const [phase, setPhase] = useState<Phase>("focus");
  const [secs, setSecs] = useState(DUR.focus * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setSecs((s) => s - 1), 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  useEffect(() => {
    if (secs > 0) return;
    beep();
    setRunning(false);
    if (phase === "focus") {
      const nextCompleted = completed + 1;
      setCompleted(nextCompleted);
      const next: Phase = nextCompleted % 4 === 0 ? "long" : "short";
      setPhase(next);
      setSecs(DUR[next] * 60);
    } else {
      setPhase("focus");
      setSecs(DUR.focus * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secs]);

  function switchTo(p: Phase) {
    setPhase(p);
    setSecs(DUR[p] * 60);
    setRunning(false);
  }
  function reset() {
    setSecs(DUR[phase] * 60);
    setRunning(false);
  }
  function skip() {
    setSecs(0);
  }

  const total = DUR[phase] * 60;
  const progress = 1 - secs / total;
  const mm = String(Math.floor(Math.max(secs, 0) / 60)).padStart(2, "0");
  const ss = String(Math.max(secs, 0) % 60).padStart(2, "0");
  const R = 130;
  const circ = 2 * Math.PI * R;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8">
      <div className="flex gap-2">
        {(["focus", "short", "long"] as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => switchTo(p)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              phase === p
                ? "bg-accent text-accent-fg"
                : "text-fg-muted hover:bg-panel-raised",
            )}
          >
            {LABEL[p]}
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
            stroke="hsl(var(--accent))"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-semibold tabular-nums tracking-tight">
            {mm}:{ss}
          </span>
          <span className="mt-1 text-sm text-fg-muted">{LABEL[phase]}</span>
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
          onClick={() => setRunning((r) => !r)}
          className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-fg shadow-lg shadow-accent/30 transition hover:brightness-110"
          aria-label={running ? "Pause" : "Start"}
        >
          {running ? <Pause className="h-7 w-7" /> : <Play className="ml-0.5 h-7 w-7" />}
        </button>
        <button
          onClick={skip}
          className="grid h-12 w-12 place-items-center rounded-full border border-border text-fg-muted hover:text-fg"
          aria-label="Skip"
        >
          <SkipForward className="h-5 w-5" />
        </button>
      </div>

      <p className="text-sm text-fg-muted">
        {completed} focus session{completed === 1 ? "" : "s"} completed
      </p>
    </div>
  );
}
