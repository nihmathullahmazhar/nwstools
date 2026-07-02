"use client";

import { useMemo, useState } from "react";
import { Input, Stat } from "@/components/ui/field";

export default function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  const [at, setAt] = useState(new Date().toISOString().slice(0, 10));

  const r = useMemo(() => {
    const b = new Date(dob);
    const now = new Date(at);
    if (isNaN(+b) || isNaN(+now) || b > now) return null;

    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();
    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    const totalDays = Math.floor((+now - +b) / 86400000);
    const next = new Date(b);
    next.setFullYear(now.getFullYear());
    if (next < now) next.setFullYear(now.getFullYear() + 1);
    const toNext = Math.ceil((+next - +now) / 86400000);

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks: Math.floor(totalDays / 7),
      totalMonths: years * 12 + months,
      totalHours: totalDays * 24,
      toNext,
    };
  }, [dob, at]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Date of birth</div>
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-11" />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Age at date</div>
          <Input type="date" value={at} onChange={(e) => setAt(e.target.value)} className="h-11" />
        </div>
      </div>

      {r && (
        <>
          <div className="panel p-6 text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">Age</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight">
              {r.years} <span className="text-fg-muted">yrs</span> {r.months}{" "}
              <span className="text-fg-muted">mo</span> {r.days}{" "}
              <span className="text-fg-muted">d</span>
            </div>
            <div className="mt-2 text-sm text-accent">
              🎂 {r.toNext} day{r.toNext === 1 ? "" : "s"} until next birthday
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Months" value={r.totalMonths.toLocaleString()} />
            <Stat label="Weeks" value={r.totalWeeks.toLocaleString()} />
            <Stat label="Days" value={r.totalDays.toLocaleString()} />
            <Stat label="Hours" value={r.totalHours.toLocaleString()} />
          </div>
        </>
      )}
    </div>
  );
}
