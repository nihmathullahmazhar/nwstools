"use client";

import { useState } from "react";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { Plus, X, Flame } from "lucide-react";

type Habit = { id: string; name: string; days: Record<string, boolean> };

function lastDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d;
  });
}
const key = (d: Date) => d.toISOString().slice(0, 10);

function streak(days: Record<string, boolean>) {
  let s = 0;
  const d = new Date();
  while (days[key(d)]) {
    s++;
    d.setDate(d.getDate() - 1);
  }
  return s;
}

export default function HabitTracker() {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", []);
  const [name, setName] = useState("");
  const week = lastDays(14);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setHabits((p) => [...p, { id: crypto.randomUUID(), name: name.trim(), days: {} }]);
    setName("");
  }
  function toggle(id: string, d: Date) {
    const k = key(d);
    setHabits((p) => p.map((h) => (h.id === id ? { ...h, days: { ...h.days, [k]: !h.days[k] } } : h)));
  }

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="flex max-w-md gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New habit (e.g. Read, Exercise)…" className="h-11" autoFocus />
        <Button type="submit" size="lg" disabled={!name.trim()}><Plus className="h-4 w-4" /> Add</Button>
      </form>

      {habits.length > 0 && (
        <div className="panel overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-fg-faint">
                <th className="px-4 py-2 text-left font-medium">Habit</th>
                {week.map((d) => (
                  <th key={key(d)} className="px-1 py-2 text-center font-medium">
                    {d.toLocaleDateString("en-US", { weekday: "narrow" })}
                    <div className="text-[10px] text-fg-faint">{d.getDate()}</div>
                  </th>
                ))}
                <th className="px-3 py-2 text-center font-medium">🔥</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {habits.map((h) => (
                <tr key={h.id}>
                  <td className="px-4 py-2 text-sm font-medium">{h.name}</td>
                  {week.map((d) => {
                    const on = h.days[key(d)];
                    return (
                      <td key={key(d)} className="px-1 py-2 text-center">
                        <button
                          onClick={() => toggle(h.id, d)}
                          className={cn(
                            "h-6 w-6 rounded-md border transition",
                            on ? "border-accent bg-accent" : "border-border hover:border-accent/60",
                          )}
                          aria-label={key(d)}
                        />
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      <Flame className="h-3.5 w-3.5" />
                      {streak(h.days)}
                    </span>
                  </td>
                  <td className="px-2">
                    <button onClick={() => setHabits((p) => p.filter((x) => x.id !== h.id))} className="text-fg-faint hover:text-danger">
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-fg-faint">Tap a day to mark it done. Streak counts consecutive days up to today. Saved on this device.</p>
    </div>
  );
}
