"use client";

import { useMemo, useState } from "react";
import { Input, Stat } from "@/components/ui/field";

function money(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState("400000");
  const [down, setDown] = useState("80000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const [taxYr, setTaxYr] = useState("4800");
  const [insYr, setInsYr] = useState("1500");
  const [hoa, setHoa] = useState("0");

  const r = useMemo(() => {
    const P = (parseFloat(price) || 0) - (parseFloat(down) || 0);
    const i = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    if (P <= 0 || n <= 0) return null;
    const pi = i === 0 ? P / n : (P * i * (1 + i) ** n) / ((1 + i) ** n - 1);
    const tax = (parseFloat(taxYr) || 0) / 12;
    const ins = (parseFloat(insYr) || 0) / 12;
    const h = parseFloat(hoa) || 0;
    const total = pi + tax + ins + h;
    return { pi, tax, ins, hoa: h, total, loan: P, totalInterest: pi * n - P };
  }, [price, down, rate, years, taxYr, insYr, hoa]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="grid grid-cols-2 gap-4">
        <F label="Home price" value={price} onChange={setPrice} prefix="$" span />
        <F label="Down payment" value={down} onChange={setDown} prefix="$" />
        <F label="Interest rate" value={rate} onChange={setRate} suffix="%" />
        <F label="Term (yrs)" value={years} onChange={setYears} />
        <F label="Property tax /yr" value={taxYr} onChange={setTaxYr} prefix="$" />
        <F label="Insurance /yr" value={insYr} onChange={setInsYr} prefix="$" />
        <F label="HOA /mo" value={hoa} onChange={setHoa} prefix="$" />
      </div>

      {r && (
        <div className="space-y-4">
          <div className="panel bg-accent-soft p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
              Monthly payment
            </div>
            <div className="mt-1 text-4xl font-semibold tracking-tight text-accent">
              {r.total.toLocaleString(undefined, { style: "currency", currency: "USD" })}
            </div>
          </div>
          <div className="panel divide-y divide-border">
            <Row label="Principal & interest" value={money(r.pi)} />
            <Row label="Property tax" value={money(r.tax)} />
            <Row label="Home insurance" value={money(r.ins)} />
            {r.hoa > 0 && <Row label="HOA" value={money(r.hoa)} />}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Loan amount" value={money(r.loan)} />
            <Stat label="Total interest" value={money(r.totalInterest)} />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <span className="text-fg-muted">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function F({
  label,
  value,
  onChange,
  prefix,
  suffix,
  span,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint">{prefix}</span>}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-10 ${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-fg-faint">{suffix}</span>}
      </div>
    </div>
  );
}
