"use client";

import { useState } from "react";
import { Input, Stat } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

type Row = { name: string; score: string; weight: string };

function letter(pct: number) {
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 60) return "D";
  return "F";
}

export default function GradeCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { name: "Homework", score: "92", weight: "20" },
    { name: "Midterm", score: "85", weight: "30" },
    { name: "Project", score: "88", weight: "20" },
  ]);
  const [finalWeight, setFinalWeight] = useState("30");
  const [desired, setDesired] = useState("90");

  let earned = 0;
  let totalWeight = 0;
  for (const r of rows) {
    const s = parseFloat(r.score);
    const w = parseFloat(r.weight);
    if (!isNaN(s) && !isNaN(w)) {
      earned += (s / 100) * w;
      totalWeight += w;
    }
  }
  const current = totalWeight > 0 ? (earned / totalWeight) * 100 : 0;

  const fw = parseFloat(finalWeight) || 0;
  const want = parseFloat(desired) || 0;
  // (want - earned) / finalWeight, where earned uses fraction weight
  const neededFinal = fw > 0 ? ((want - earned) / fw) * 100 : NaN;

  const update = (i: number, patch: Partial<Row>) =>
    setRows((p) => p.map((r, ri) => (ri === i ? { ...r, ...patch } : r)));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_90px_90px_auto] gap-2 px-1 text-xs font-medium text-fg-faint">
          <span>Item</span>
          <span>Score %</span>
          <span>Weight %</span>
          <span />
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_90px_90px_auto] items-center gap-2">
            <Input value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
            <Input type="number" value={r.score} onChange={(e) => update(i, { score: e.target.value })} />
            <Input type="number" value={r.weight} onChange={(e) => update(i, { weight: e.target.value })} />
            <button onClick={() => setRows((p) => p.filter((_, x) => x !== i))} className="text-fg-faint hover:text-danger">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button variant="secondary" size="sm" onClick={() => setRows((p) => [...p, { name: "", score: "", weight: "" }])}>
        <Plus className="h-4 w-4" /> Add item
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Current grade" value={`${current.toFixed(1)}%`} hint={letter(current)} />
        <Stat label="Weight so far" value={`${totalWeight}%`} />
      </div>

      <div className="panel space-y-4 p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
          What do I need on the final?
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1.5 text-sm font-medium">Final weight %</div>
            <Input type="number" value={finalWeight} onChange={(e) => setFinalWeight(e.target.value)} />
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium">Desired overall %</div>
            <Input type="number" value={desired} onChange={(e) => setDesired(e.target.value)} />
          </div>
        </div>
        {fw > 0 && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              neededFinal > 100 ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
            }`}
          >
            {neededFinal > 100
              ? `You'd need ${neededFinal.toFixed(1)}% — not reachable with this final weight.`
              : neededFinal < 0
                ? `You've already secured it — even a 0% final keeps you above ${want}%.`
                : `You need ${neededFinal.toFixed(1)}% on the final to reach ${want}% overall.`}
          </div>
        )}
      </div>
    </div>
  );
}
