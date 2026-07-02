"use client";

import { useState } from "react";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

const SCALE: Record<string, number> = {
  "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, "D-": 0.7, F: 0,
};
const GRADES = Object.keys(SCALE);

type Row = { name: string; grade: string; credits: string };

export default function GpaCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { name: "Course 1", grade: "A", credits: "3" },
    { name: "Course 2", grade: "B+", credits: "4" },
    { name: "Course 3", grade: "A-", credits: "3" },
  ]);

  let points = 0;
  let credits = 0;
  for (const r of rows) {
    const c = parseFloat(r.credits) || 0;
    if (r.grade in SCALE) {
      points += SCALE[r.grade] * c;
      credits += c;
    }
  }
  const gpa = credits > 0 ? points / credits : 0;

  const update = (i: number, patch: Partial<Row>) =>
    setRows((p) => p.map((r, ri) => (ri === i ? { ...r, ...patch } : r)));

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_100px_90px_auto] gap-2 px-1 text-xs font-medium text-fg-faint">
          <span>Course</span>
          <span>Grade</span>
          <span>Credits</span>
          <span />
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_90px_auto] items-center gap-2">
            <Input value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
            <select
              value={r.grade}
              onChange={(e) => update(i, { grade: e.target.value })}
              className="h-10 rounded-lg border border-border bg-panel px-2 text-sm outline-none focus:border-accent"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <Input type="number" value={r.credits} onChange={(e) => update(i, { credits: e.target.value })} />
            <button
              onClick={() => setRows((p) => p.filter((_, x) => x !== i))}
              className="text-fg-faint hover:text-danger"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button variant="secondary" size="sm" onClick={() => setRows((p) => [...p, { name: `Course ${p.length + 1}`, grade: "A", credits: "3" }])}>
        <Plus className="h-4 w-4" /> Add course
      </Button>

      <div className="panel flex items-center justify-between p-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">Cumulative GPA</div>
          <div className="text-sm text-fg-muted">{credits} credits</div>
        </div>
        <div className="text-5xl font-semibold tracking-tight text-accent">{gpa.toFixed(2)}</div>
      </div>
    </div>
  );
}
