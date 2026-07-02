"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

const STATES: [string, string, string][] = [
  ["Alabama", "AL", "Montgomery"], ["Alaska", "AK", "Juneau"], ["Arizona", "AZ", "Phoenix"],
  ["Arkansas", "AR", "Little Rock"], ["California", "CA", "Sacramento"], ["Colorado", "CO", "Denver"],
  ["Connecticut", "CT", "Hartford"], ["Delaware", "DE", "Dover"], ["Florida", "FL", "Tallahassee"],
  ["Georgia", "GA", "Atlanta"], ["Hawaii", "HI", "Honolulu"], ["Idaho", "ID", "Boise"],
  ["Illinois", "IL", "Springfield"], ["Indiana", "IN", "Indianapolis"], ["Iowa", "IA", "Des Moines"],
  ["Kansas", "KS", "Topeka"], ["Kentucky", "KY", "Frankfort"], ["Louisiana", "LA", "Baton Rouge"],
  ["Maine", "ME", "Augusta"], ["Maryland", "MD", "Annapolis"], ["Massachusetts", "MA", "Boston"],
  ["Michigan", "MI", "Lansing"], ["Minnesota", "MN", "Saint Paul"], ["Mississippi", "MS", "Jackson"],
  ["Missouri", "MO", "Jefferson City"], ["Montana", "MT", "Helena"], ["Nebraska", "NE", "Lincoln"],
  ["Nevada", "NV", "Carson City"], ["New Hampshire", "NH", "Concord"], ["New Jersey", "NJ", "Trenton"],
  ["New Mexico", "NM", "Santa Fe"], ["New York", "NY", "Albany"], ["North Carolina", "NC", "Raleigh"],
  ["North Dakota", "ND", "Bismarck"], ["Ohio", "OH", "Columbus"], ["Oklahoma", "OK", "Oklahoma City"],
  ["Oregon", "OR", "Salem"], ["Pennsylvania", "PA", "Harrisburg"], ["Rhode Island", "RI", "Providence"],
  ["South Carolina", "SC", "Columbia"], ["South Dakota", "SD", "Pierre"], ["Tennessee", "TN", "Nashville"],
  ["Texas", "TX", "Austin"], ["Utah", "UT", "Salt Lake City"], ["Vermont", "VT", "Montpelier"],
  ["Virginia", "VA", "Richmond"], ["Washington", "WA", "Olympia"], ["West Virginia", "WV", "Charleston"],
  ["Wisconsin", "WI", "Madison"], ["Wyoming", "WY", "Cheyenne"],
];

export default function UsStateAbbreviations() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return STATES;
    return STATES.filter(
      ([name, abbr, cap]) =>
        name.toLowerCase().includes(s) ||
        abbr.toLowerCase().includes(s) ||
        cap.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <div className="space-y-4">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search state, code or capital…"
        className="h-11"
        autoFocus
      />
      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-panel-raised text-left text-xs uppercase tracking-wide text-fg-faint">
            <tr>
              <th className="px-4 py-2.5 font-medium">State</th>
              <th className="px-4 py-2.5 font-medium">Code</th>
              <th className="px-4 py-2.5 font-medium">Capital</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(([name, abbr, cap]) => (
              <tr key={abbr} className="hover:bg-panel-raised">
                <td className="px-4 py-2.5 font-medium">{name}</td>
                <td className="px-4 py-2.5 font-mono text-accent">{abbr}</td>
                <td className="px-4 py-2.5 text-fg-muted">{cap}</td>
                <td className="px-4 py-2.5 text-right">
                  <CopyButton value={abbr} size="sm" label="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="py-10 text-center text-sm text-fg-muted">No matches.</div>
        )}
      </div>
    </div>
  );
}
