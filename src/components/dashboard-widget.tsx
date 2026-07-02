"use client";

import { useEffect, useState } from "react";

export function DashboardWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Placeholder matches server + first client render (avoids hydration mismatch).
  if (!now) {
    return <div className="panel h-[132px] w-full animate-pulse sm:w-80" />;
  }

  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMin = -now.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const oh = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, "0");
  const om = String(Math.abs(offsetMin) % 60).padStart(2, "0");

  return (
    <div className="panel w-full p-5 sm:w-80">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-fg-faint">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        Workspace online
      </div>
      <div className="mt-3 text-sm text-fg-muted">{greeting}</div>
      <div className="font-display text-3xl font-semibold tabular-nums tracking-tight">
        {time}
      </div>
      <div className="mt-1 text-xs text-fg-faint">
        {date} · {tz.replace(/_/g, " ")} (UTC{sign}
        {oh}:{om})
      </div>
    </div>
  );
}
