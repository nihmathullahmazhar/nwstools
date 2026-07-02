"use client";

import { useMemo, useState } from "react";
import { Input, Stat } from "@/components/ui/field";

function money(n: number) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("25000");
  const [rate, setRate] = useState("7.5");
  const [years, setYears] = useState("5");

  const r = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const annual = parseFloat(rate) || 0;
    const n = (parseFloat(years) || 0) * 12;
    const i = annual / 100 / 12;
    if (P <= 0 || n <= 0) return null;
    const monthly =
      i === 0 ? P / n : (P * i * (1 + i) ** n) / ((1 + i) ** n - 1);
    const total = monthly * n;
    const interest = total - P;
    return { monthly, total, interest, principal: P, n };
  }, [principal, rate, years]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <Field label="Loan amount" value={principal} onChange={setPrincipal} prefix="$" />
        <Field label="Annual interest rate" value={rate} onChange={setRate} suffix="%" />
        <Field label="Term" value={years} onChange={setYears} suffix="years" />
      </div>

      {r && (
        <div className="space-y-4">
          <div className="panel bg-accent-soft p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
              Monthly payment
            </div>
            <div className="mt-1 text-4xl font-semibold tracking-tight text-accent">
              {r.monthly.toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div className="mt-1 text-sm text-fg-muted">
              over {r.n} payments
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Total interest" value={money(r.interest)} />
            <Stat label="Total repaid" value={money(r.total)} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-fg-muted">
              <span>Principal {money(r.principal)}</span>
              <span>Interest {money(r.interest)}</span>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-panel-raised">
              <div
                className="bg-accent"
                style={{ width: `${(r.principal / r.total) * 100}%` }}
              />
              <div
                className="bg-warning"
                style={{ width: `${(r.interest / r.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 ${prefix ? "pl-7" : ""} ${suffix ? "pr-16" : ""}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-fg-faint">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
