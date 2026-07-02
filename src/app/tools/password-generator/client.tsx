"use client";

import { useCallback, useEffect, useState } from "react";
import { Check } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const SETS = {
  lower: "abcdefghijkmnopqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  digits: "23456789",
  symbols: "!@#$%^&*-_=+?",
  ambiguousLower: "l",
  ambiguousUpper: "IO",
  ambiguousDigits: "01",
};

function secureShuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score, label: labels[score] };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(18);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    let pool = "";
    const required: string[] = [];
    if (lower) {
      pool += SETS.lower + (noAmbiguous ? "" : SETS.ambiguousLower);
      required.push(SETS.lower[0]);
    }
    if (upper) {
      pool += SETS.upper + (noAmbiguous ? "" : SETS.ambiguousUpper);
      required.push(SETS.upper[0]);
    }
    if (digits) {
      pool += SETS.digits + (noAmbiguous ? "" : SETS.ambiguousDigits);
      required.push(SETS.digits[0]);
    }
    if (symbols) {
      pool += SETS.symbols;
      required.push(SETS.symbols[0]);
    }
    if (!pool) {
      setPassword("");
      return;
    }
    const rand = crypto.getRandomValues(new Uint32Array(length));
    const chars = Array.from({ length }, (_, i) => pool[rand[i] % pool.length]);
    // ensure at least one of each selected set
    for (let i = 0; i < required.length && i < length; i++) chars[i] = required[i];
    setPassword(secureShuffle(chars).join(""));
  }, [length, lower, upper, digits, symbols, noAmbiguous]);

  useEffect(() => {
    generate();
  }, [generate]);

  const st = strength(password);
  const barColors = ["bg-danger", "bg-danger", "bg-warning", "bg-warning", "bg-success", "bg-success"];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="panel p-5">
        <div className="flex items-center gap-3">
          <code className="flex-1 break-all font-mono text-lg text-fg">
            {password || <span className="text-fg-faint">Select at least one option</span>}
          </code>
          <button
            onClick={generate}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-fg-muted hover:bg-panel-raised hover:text-fg"
            aria-label="Regenerate"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
          <CopyButton value={password} label="" />
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-fg-muted">Strength</span>
            <span className="font-medium text-fg">{password ? st.label : "—"}</span>
          </div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  password && i < st.score ? barColors[st.score] : "bg-panel-raised",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm font-medium">
          <span>Length</span>
          <span className="text-accent">{length}</span>
        </div>
        <input
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-[hsl(var(--accent))]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Check checked={lower} onChange={setLower}>Lowercase</Check>
        <Check checked={upper} onChange={setUpper}>Uppercase</Check>
        <Check checked={digits} onChange={setDigits}>Numbers</Check>
        <Check checked={symbols} onChange={setSymbols}>Symbols</Check>
        <Check checked={noAmbiguous} onChange={setNoAmbiguous}>No look-alikes</Check>
      </div>

      <Button onClick={generate} className="w-full" size="lg">
        <RefreshCw className="h-4 w-4" /> Generate new password
      </Button>
    </div>
  );
}
