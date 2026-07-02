"use client";

import { useState } from "react";
import { Input, Stat } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const PRESETS = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tip, setTip] = useState(18);
  const [people, setPeople] = useState(2);
  const [round, setRound] = useState(false);

  const b = parseFloat(bill) || 0;
  const tipAmount = (b * tip) / 100;
  let total = b + tipAmount;
  let perPerson = total / Math.max(people, 1);
  if (round) {
    perPerson = Math.ceil(perPerson);
    total = perPerson * Math.max(people, 1);
  }
  const money = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-5">
        <div>
          <div className="mb-1.5 text-sm font-medium">Bill amount</div>
          <Input
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            className="h-12 text-lg"
            autoFocus
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm font-medium">
            <span>Tip</span>
            <span className="text-accent">{tip}%</span>
          </div>
          <div className="mb-2 flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setTip(p)}
                className={cn(
                  "flex-1 rounded-lg border py-2 text-sm font-medium transition",
                  tip === p
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border text-fg-muted hover:border-border-strong",
                )}
              >
                {p}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={40}
            value={tip}
            onChange={(e) => setTip(Number(e.target.value))}
            className="w-full accent-[hsl(var(--accent))]"
          />
        </div>

        <div>
          <div className="mb-1.5 text-sm font-medium">Split between</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              className="grid h-10 w-10 place-items-center rounded-lg border border-border text-lg hover:bg-panel-raised"
            >
              −
            </button>
            <span className="w-12 text-center text-lg font-semibold tabular-nums">
              {people}
            </span>
            <button
              onClick={() => setPeople((p) => p + 1)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-border text-lg hover:bg-panel-raised"
            >
              +
            </button>
            <span className="text-sm text-fg-muted">
              {people === 1 ? "person" : "people"}
            </span>
          </div>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
          <input
            type="checkbox"
            checked={round}
            onChange={(e) => setRound(e.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--accent))]"
          />
          Round up per person
        </label>
      </div>

      <div className="space-y-3">
        <div className="panel bg-accent-soft p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
            Each person pays
          </div>
          <div className="mt-1 text-4xl font-semibold tracking-tight text-accent">
            {money(perPerson)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Tip" value={money(tipAmount)} />
          <Stat label="Total" value={money(total)} />
        </div>
      </div>
    </div>
  );
}
