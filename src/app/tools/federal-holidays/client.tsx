"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

function nthWeekday(year: number, month: number, weekday: number, n: number) {
  // month 0-based, weekday 0=Sun
  const first = new Date(year, month, 1);
  let day = 1 + ((weekday - first.getDay() + 7) % 7) + (n - 1) * 7;
  return new Date(year, month, day);
}
function lastWeekday(year: number, month: number, weekday: number) {
  const last = new Date(year, month + 1, 0);
  const day = last.getDate() - ((last.getDay() - weekday + 7) % 7);
  return new Date(year, month, day);
}
function observed(d: Date) {
  const day = d.getDay();
  if (day === 0) return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  if (day === 6) return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  return d;
}

function holidays(year: number) {
  const list: { name: string; date: Date }[] = [
    { name: "New Year's Day", date: new Date(year, 0, 1) },
    { name: "Birthday of Martin Luther King, Jr.", date: nthWeekday(year, 0, 1, 3) },
    { name: "Washington's Birthday", date: nthWeekday(year, 1, 1, 3) },
    { name: "Memorial Day", date: lastWeekday(year, 4, 1) },
    { name: "Juneteenth National Independence Day", date: new Date(year, 5, 19) },
    { name: "Independence Day", date: new Date(year, 6, 4) },
    { name: "Labor Day", date: nthWeekday(year, 8, 1, 1) },
    { name: "Columbus Day", date: nthWeekday(year, 9, 1, 2) },
    { name: "Veterans Day", date: new Date(year, 10, 11) },
    { name: "Thanksgiving Day", date: nthWeekday(year, 10, 4, 4) },
    { name: "Christmas Day", date: new Date(year, 11, 25) },
  ];
  return list.map((h) => ({ ...h, obs: observed(h.date) }));
}

export default function FederalHolidays() {
  const [year, setYear] = useState(new Date().getFullYear());
  const list = useMemo(() => holidays(year), [year]);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-center gap-3">
        <Button variant="secondary" size="icon" onClick={() => setYear((y) => y - 1)}>−</Button>
        <span className="w-20 text-center text-2xl font-semibold tabular-nums">{year}</span>
        <Button variant="secondary" size="icon" onClick={() => setYear((y) => y + 1)}>+</Button>
      </div>

      <div className="panel divide-y divide-border">
        {list.map((h) => {
          const shifted = h.obs.getTime() !== h.date.getTime();
          return (
            <div key={h.name} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm font-medium">{h.name}</span>
              <div className="text-right">
                <div className="text-sm tabular-nums">{fmt(h.date)}</div>
                {shifted && (
                  <div className="text-xs text-fg-faint">observed {fmt(h.obs)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-fg-faint">
        The 11 US federal holidays. When one falls on a weekend, the observed date shifts.
      </p>
    </div>
  );
}
