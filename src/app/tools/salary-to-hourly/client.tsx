"use client";

import { useMemo, useState } from "react";
import { Input, Stat } from "@/components/ui/field";

function money(n: number, max = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: max });
}

export default function SalaryToHourly() {
  const [annual, setAnnual] = useState("60000");
  const [hoursWeek, setHoursWeek] = useState("40");
  const [weeksYear, setWeeksYear] = useState("52");

  const r = useMemo(() => {
    const a = parseFloat(annual) || 0;
    const hw = parseFloat(hoursWeek) || 0;
    const wy = parseFloat(weeksYear) || 0;
    const totalHours = hw * wy;
    if (totalHours <= 0) return null;
    return {
      hourly: a / totalHours,
      daily: a / wy / 5,
      weekly: a / wy,
      monthly: a / 12,
      totalHours,
    };
  }, [annual, hoursWeek, weeksYear]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <F label="Annual salary" value={annual} onChange={setAnnual} prefix="$" />
        <F label="Hours per week" value={hoursWeek} onChange={setHoursWeek} />
        <F label="Weeks per year" value={weeksYear} onChange={setWeeksYear} />
      </div>

      {r && (
        <div className="space-y-4">
          <div className="panel bg-accent-soft p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
              Hourly rate
            </div>
            <div className="mt-1 text-4xl font-semibold tracking-tight text-accent">
              {money(r.hourly)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Per day" value={money(r.daily, 0)} />
            <Stat label="Per week" value={money(r.weekly, 0)} />
            <Stat label="Per month" value={money(r.monthly, 0)} />
            <Stat label="Hours / year" value={r.totalHours.toLocaleString()} />
          </div>
        </div>
      )}
    </div>
  );
}

function F({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint">{prefix}</span>}
        <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={`h-11 ${prefix ? "pl-7" : ""}`} />
      </div>
    </div>
  );
}
