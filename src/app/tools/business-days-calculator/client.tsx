"use client";

import { useMemo, useState } from "react";
import { Input, Check, Stat } from "@/components/ui/field";

export default function BusinessDaysCalculator() {
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [end, setEnd] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [sat, setSat] = useState(false);
  const [sun, setSun] = useState(false);

  const r = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(+s) || isNaN(+e) || e < s) return null;
    let business = 0;
    let weekend = 0;
    const d = new Date(s);
    let total = 0;
    while (d <= e) {
      const day = d.getDay();
      const isWeekend = (day === 0 && !sun) || (day === 6 && !sat);
      if (isWeekend) weekend++;
      else business++;
      total++;
      d.setDate(d.getDate() + 1);
    }
    return { business, weekend, total };
  }, [start, end, sat, sun]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">From</div>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-11" />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">To</div>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="h-11" />
        </div>
      </div>
      <div className="flex gap-5">
        <Check checked={sat} onChange={setSat}>Count Saturdays</Check>
        <Check checked={sun} onChange={setSun}>Count Sundays</Check>
      </div>

      {r && (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Business days" value={r.business.toLocaleString()} />
          <Stat label="Weekend days" value={r.weekend.toLocaleString()} />
          <Stat label="Total days" value={r.total.toLocaleString()} />
        </div>
      )}
    </div>
  );
}
