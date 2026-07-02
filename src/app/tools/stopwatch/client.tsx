"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

function fmt(ms: number) {
  const cs = Math.floor((ms % 1000) / 10);
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  const p = (n: number) => String(n).padStart(2, "0");
  return { main: `${h > 0 ? p(h) + ":" : ""}${p(m)}:${p(s)}`, cs: p(cs) };
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsed;
    const tick = () => {
      setElapsed(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }
  function lap() {
    if (running) setLaps((l) => [elapsed, ...l]);
  }

  const t = fmt(elapsed);
  const lapDiffs = laps.map((l, i) => l - (laps[i + 1] ?? 0));
  const fastest = Math.min(...lapDiffs);
  const slowest = Math.max(...lapDiffs);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-8">
      <div className="flex items-baseline font-semibold tabular-nums tracking-tight">
        <span className="text-7xl">{t.main}</span>
        <span className="ml-1 text-3xl text-fg-muted">.{t.cs}</span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={running ? lap : reset}
          aria-label={running ? "Lap" : "Reset"}
        >
          {running ? <Flag className="h-5 w-5" /> : <RotateCcw className="h-5 w-5" />}
        </Button>
        <button
          onClick={() => setRunning((r) => !r)}
          className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-fg shadow-lg shadow-accent/30 transition hover:brightness-110"
          aria-label={running ? "Pause" : "Start"}
        >
          {running ? <Pause className="h-7 w-7" /> : <Play className="ml-0.5 h-7 w-7" />}
        </button>
      </div>

      {laps.length > 0 && (
        <div className="panel w-full divide-y divide-border">
          {laps.map((l, i) => {
            const diff = lapDiffs[i];
            const d = fmt(diff);
            const isFast = diff === fastest && laps.length > 1;
            const isSlow = diff === slowest && laps.length > 1;
            return (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-fg-muted">Lap {laps.length - i}</span>
                <span
                  className={
                    isFast ? "text-success" : isSlow ? "text-danger" : "text-fg"
                  }
                >
                  {d.main}.{d.cs}
                </span>
                <span className="tabular-nums text-fg-faint">
                  {fmt(l).main}.{fmt(l).cs}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
