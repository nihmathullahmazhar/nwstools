"use client";

import { useMemo, useState } from "react";
import { Input, Segmented, Stat } from "@/components/ui/field";

function money(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const FREQ = [
  { value: "12", label: "Monthly" },
  { value: "4", label: "Quarterly" },
  { value: "1", label: "Yearly" },
];

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState("10000");
  const [monthly, setMonthly] = useState("250");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("20");
  const [freq, setFreq] = useState("12");

  const data = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const y = parseFloat(years) || 0;
    const n = parseInt(freq);
    const perYear: { year: number; balance: number; contributed: number }[] = [];
    let balance = P;
    let contributed = P;
    const contribPerPeriod = (PMT * 12) / n;
    for (let year = 1; year <= y; year++) {
      for (let k = 0; k < n; k++) {
        balance = balance * (1 + r / n) + contribPerPeriod;
        contributed += contribPerPeriod;
      }
      perYear.push({ year, balance, contributed });
    }
    const final = perYear[perYear.length - 1]?.balance ?? P;
    const totalContrib = perYear[perYear.length - 1]?.contributed ?? P;
    return {
      final,
      totalContrib,
      interest: final - totalContrib,
      perYear,
      max: final || 1,
    };
  }, [principal, monthly, rate, years, freq]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4">
        <F label="Initial amount" value={principal} onChange={setPrincipal} prefix="$" />
        <F label="Monthly contribution" value={monthly} onChange={setMonthly} prefix="$" />
        <F label="Annual return" value={rate} onChange={setRate} suffix="%" />
        <F label="Years" value={years} onChange={setYears} />
        <div>
          <div className="mb-1.5 text-sm font-medium">Compounding</div>
          <Segmented value={freq} onChange={setFreq} options={FREQ} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="panel bg-accent-soft p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
            Future value
          </div>
          <div className="mt-1 text-4xl font-semibold tracking-tight text-accent">
            {money(data.final)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Contributed" value={money(data.totalContrib)} />
          <Stat label="Interest earned" value={money(data.interest)} />
        </div>

        <div className="panel p-4">
          <div className="mb-3 text-xs font-medium uppercase tracking-wide text-fg-faint">
            Growth
          </div>
          <div className="flex h-32 items-end gap-1">
            {data.perYear.map((d) => (
              <div
                key={d.year}
                className="group relative flex-1 rounded-t bg-accent/25"
                style={{ height: `${(d.balance / data.max) * 100}%` }}
                title={`Year ${d.year}: ${money(d.balance)}`}
              >
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t bg-accent"
                  style={{ height: `${(d.contributed / d.balance) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-fg-faint">
            <span>Year 1</span>
            <span>Year {data.perYear.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function F({
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
          className={`h-11 ${prefix ? "pl-7" : ""} ${suffix ? "pr-10" : ""}`}
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
