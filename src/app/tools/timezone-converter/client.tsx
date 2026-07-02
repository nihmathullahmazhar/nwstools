"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/field";
import { X, Plus, Clock } from "lucide-react";

const ZONES = [
  "UTC", "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Africa/Cairo", "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata", "Asia/Colombo",
  "Asia/Bangkok", "Asia/Singapore", "Asia/Shanghai", "Asia/Tokyo", "Australia/Sydney",
  "Pacific/Auckland",
];

function label(tz: string) {
  return tz.split("/").pop()!.replace(/_/g, " ");
}

function offset(tz: string, date: Date) {
  const s = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  return s ?? "";
}

export default function TimezoneConverter() {
  // Time-of-day and local zone are browser-specific, so start from deterministic
  // values (matching SSR) and fill in the real ones after mount to avoid a
  // hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [baseZone, setBaseZone] = useState("UTC");
  const [time, setTime] = useState("12:00");
  const [date, setDate] = useState("2000-01-01");
  const [zones, setZones] = useState<string[]>([
    "America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Tokyo",
  ]);
  const localTz = mounted ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";

  useEffect(() => {
    const now = new Date();
    setBaseZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    setDate(now.toISOString().slice(0, 10));
    setMounted(true);
  }, []);

  // Interpret the entered date+time as wall-clock time in baseZone and
  // resolve it to an absolute instant (robust across DST).
  const instant = useMemo(() => {
    const [y, mo, d] = date.split("-").map(Number);
    const [h, mi] = time.split(":").map(Number);
    // Number.isFinite rejects both NaN and undefined (e.g. an empty time field).
    if (![y, mo, d, h, mi].every(Number.isFinite)) return new Date();
    const guess = Date.UTC(y, mo - 1, d, h, mi);
    // What wall time does `guess` show in baseZone? Compute the offset.
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: baseZone,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false,
    }).formatToParts(new Date(guess));
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const asZoneUtc = Date.UTC(
      get("year"), get("month") - 1, get("day"),
      get("hour") % 24, get("minute"), get("second"),
    );
    const offsetMs = asZoneUtc - guess;
    return new Date(guess - offsetMs);
  }, [date, time, baseZone]);

  const fmt = (tz: string) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(instant);

  const remaining = ZONES.filter((z) => !zones.includes(z) && z !== baseZone);

  if (!mounted) {
    return <div className="mx-auto h-96 max-w-2xl animate-pulse rounded-2xl bg-panel-raised" />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="panel space-y-4 p-5">
        <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">
          Base time
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <select
            value={baseZone}
            onChange={(e) => setBaseZone(e.target.value)}
            className="h-11 rounded-lg border border-border bg-panel px-3 text-sm outline-none focus:border-accent"
          >
            {[localTz, ...ZONES.filter((z) => z !== localTz)].map((z) => (
              <option key={z} value={z}>{label(z)} · {offset(z, instant)}</option>
            ))}
          </select>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11" />
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-11" />
        </div>
      </div>

      <div className="space-y-3">
        {zones.map((z) => (
          <div key={z} className="panel flex items-center gap-4 p-4">
            <Clock className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <div className="font-medium">{label(z)}</div>
              <div className="text-xs text-fg-faint">{offset(z, instant)}</div>
            </div>
            <div className="text-lg font-semibold tabular-nums">{fmt(z)}</div>
            <button onClick={() => setZones((p) => p.filter((x) => x !== z))} className="text-fg-faint hover:text-danger">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {remaining.length > 0 && (
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-fg-faint" />
          <select
            value=""
            onChange={(e) => e.target.value && setZones((p) => [...p, e.target.value])}
            className="h-10 rounded-lg border border-border bg-panel px-3 text-sm outline-none focus:border-accent"
          >
            <option value="">Add a time zone…</option>
            {remaining.map((z) => (
              <option key={z} value={z}>{label(z)}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
