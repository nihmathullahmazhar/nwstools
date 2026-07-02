"use client";

import { useMemo, useState } from "react";
import { Input, Check, Stat } from "@/components/ui/field";

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default function DateDifference() {
  const [start, setStart] = useState(todayISO());
  const [end, setEnd] = useState(todayISO(30));
  const [includeEnd, setIncludeEnd] = useState(false);

  const result = useMemo(() => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(+s) || isNaN(+e)) return null;
    const [from, to] = s <= e ? [s, e] : [e, s];
    let ms = to.getTime() - from.getTime();
    if (includeEnd) ms += 86400000;
    const totalDays = Math.round(ms / 86400000);

    // calendar breakdown
    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();
    if (days < 0) {
      months--;
      days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      totalDays,
      weeks: Math.floor(totalDays / 7),
      remWeekDays: totalDays % 7,
      hours: totalDays * 24,
      years,
      months,
      days,
    };
  }, [start, end, includeEnd]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Start date</div>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="h-11" />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">End date</div>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="h-11" />
        </div>
      </div>

      <Check checked={includeEnd} onChange={setIncludeEnd}>
        Include the end day in the count
      </Check>

      {result && (
        <>
          <div className="panel p-5 text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
              Duration
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight">
              {result.years > 0 && <>{result.years}y </>}
              {result.months > 0 && <>{result.months}m </>}
              {result.days}d
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Total days" value={result.totalDays.toLocaleString()} />
            <Stat
              label="Weeks"
              value={result.weeks.toLocaleString()}
              hint={`+${result.remWeekDays}d`}
            />
            <Stat label="Hours" value={result.hours.toLocaleString()} />
            <Stat label="Months" value={(result.years * 12 + result.months).toLocaleString()} />
          </div>
        </>
      )}
    </div>
  );
}
