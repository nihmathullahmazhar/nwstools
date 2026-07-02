"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { CheckCircle2, AlertCircle } from "lucide-react";

// Valid IRS campus prefixes (first two digits of an EIN).
const VALID_PREFIXES = new Set([
  "01","02","03","04","05","06","10","11","12","13","14","15","16","20","21","22","23","24","25","26","27",
  "30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","50","51",
  "52","53","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","71","72","73","74",
  "75","76","77","80","81","82","83","84","85","86","87","88","90","91","92","93","94","95","98","99",
]);

export default function EinFormatter() {
  const [raw, setRaw] = useState("");

  const { digits, formatted, valid, message } = useMemo(() => {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
    if (digits.length === 0) return { digits, formatted, valid: null as boolean | null, message: "" };
    if (digits.length < 9)
      return { digits, formatted, valid: null, message: `${digits.length}/9 digits entered` };
    const prefix = digits.slice(0, 2);
    const ok = VALID_PREFIXES.has(prefix);
    return {
      digits,
      formatted,
      valid: ok,
      message: ok ? "Valid EIN format with a recognized IRS prefix." : `Prefix “${prefix}” is not a valid IRS campus code.`,
    };
  }, [raw]);

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div>
        <div className="mb-1.5 text-sm font-medium">Enter EIN (9 digits)</div>
        <Input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="12-3456789"
          className="h-14 text-center font-mono text-2xl tracking-widest"
          autoFocus
        />
      </div>

      {formatted && (
        <div className="panel flex items-center justify-between p-5">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">Formatted</div>
            <div className="mt-1 font-mono text-3xl font-semibold tracking-tight">{formatted}</div>
          </div>
          <CopyButton value={formatted} />
        </div>
      )}

      {valid !== null && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            valid ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {valid ? <CheckCircle2 className="h-4.5 w-4.5" /> : <AlertCircle className="h-4.5 w-4.5" />}
          {message}
        </div>
      )}
      {valid === null && message && <p className="text-center text-sm text-fg-muted">{message}</p>}

      <p className="text-xs text-fg-faint">
        An EIN (Employer Identification Number) is written as <code>XX-XXXXXXX</code>. This checks
        the format and campus prefix only — not whether the number is actually assigned.
      </p>
    </div>
  );
}
