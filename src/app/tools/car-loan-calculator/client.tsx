"use client";

import { useMemo, useState } from "react";
import { Input, Stat } from "@/components/ui/field";

const money = (n: number, max = 0) =>
  isFinite(n) ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: max }) : "—";

export default function CarLoanCalculator() {
  const [price, setPrice] = useState("32000");
  const [down, setDown] = useState("4000");
  const [trade, setTrade] = useState("0");
  const [tax, setTax] = useState("7");
  const [rate, setRate] = useState("6.9");
  const [years, setYears] = useState("5");

  const r = useMemo(() => {
    const p = parseFloat(price) || 0;
    const salesTax = p * ((parseFloat(tax) || 0) / 100);
    const principal = p + salesTax - (parseFloat(down) || 0) - (parseFloat(trade) || 0);
    const i = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    if (principal <= 0 || n <= 0) return null;
    const monthly = i === 0 ? principal / n : (principal * i * (1 + i) ** n) / ((1 + i) ** n - 1);
    return { monthly, principal, salesTax, totalInterest: monthly * n - principal, total: monthly * n };
  }, [price, down, trade, tax, rate, years]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-4">
        <F label="Vehicle price" value={price} onChange={setPrice} prefix="$" span />
        <F label="Down payment" value={down} onChange={setDown} prefix="$" />
        <F label="Trade-in value" value={trade} onChange={setTrade} prefix="$" />
        <F label="Sales tax" value={tax} onChange={setTax} suffix="%" />
        <F label="Interest rate" value={rate} onChange={setRate} suffix="%" />
        <F label="Term (years)" value={years} onChange={setYears} />
      </div>

      {r && (
        <div className="space-y-4">
          <div className="panel bg-accent-soft p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">Monthly payment</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight text-accent">{money(r.monthly, 2)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Amount financed" value={money(r.principal)} />
            <Stat label="Sales tax" value={money(r.salesTax)} />
            <Stat label="Total interest" value={money(r.totalInterest)} />
            <Stat label="Total cost" value={money(r.total)} />
          </div>
        </div>
      )}
    </div>
  );
}

function F({ label, value, onChange, prefix, suffix, span }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint">{prefix}</span>}
        <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={`h-10 ${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-fg-faint">{suffix}</span>}
      </div>
    </div>
  );
}
