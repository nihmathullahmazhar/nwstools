"use client";

import { useState } from "react";
import { Input, Stat } from "@/components/ui/field";

const money = (n: number) =>
  isFinite(n) ? n.toLocaleString(undefined, { style: "currency", currency: "USD" }) : "—";

export default function BillSplitter() {
  const [bill, setBill] = useState("120");
  const [people, setPeople] = useState(4);
  const [tip, setTip] = useState("15");
  const [tax, setTax] = useState("0");

  const b = parseFloat(bill) || 0;
  const tipAmt = (b * (parseFloat(tip) || 0)) / 100;
  const taxAmt = (b * (parseFloat(tax) || 0)) / 100;
  const total = b + tipAmt + taxAmt;
  const per = total / Math.max(1, people);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <F label="Bill amount" value={bill} onChange={setBill} prefix="$" />
        <div className="grid grid-cols-2 gap-4">
          <F label="Tip %" value={tip} onChange={setTip} suffix="%" />
          <F label="Tax %" value={tax} onChange={setTax} suffix="%" />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Split between</div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPeople((p) => Math.max(1, p - 1))} className="grid h-10 w-10 place-items-center rounded-lg border border-border text-lg hover:bg-panel-raised">−</button>
            <span className="w-10 text-center text-lg font-semibold tabular-nums">{people}</span>
            <button onClick={() => setPeople((p) => p + 1)} className="grid h-10 w-10 place-items-center rounded-lg border border-border text-lg hover:bg-panel-raised">+</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="panel bg-accent-soft p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">Each person pays</div>
          <div className="mt-1 text-4xl font-semibold tracking-tight text-accent">{money(per)}</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Tip" value={money(tipAmt)} />
          <Stat label="Tax" value={money(taxAmt)} />
          <Stat label="Total" value={money(total)} />
        </div>
      </div>
    </div>
  );
}

function F({ label, value, onChange, prefix, suffix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint">{prefix}</span>}
        <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={`h-11 ${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-fg-faint">{suffix}</span>}
      </div>
    </div>
  );
}
