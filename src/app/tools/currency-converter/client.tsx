"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/field";
import { ArrowRightLeft, Loader2 } from "lucide-react";

const CURRENCIES: Record<string, string> = {
  USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
  AUD: "Australian Dollar", CAD: "Canadian Dollar", CHF: "Swiss Franc",
  CNY: "Chinese Yuan", INR: "Indian Rupee", LKR: "Sri Lankan Rupee",
  SGD: "Singapore Dollar", AED: "UAE Dirham", NZD: "NZ Dollar",
  ZAR: "S. African Rand", BRL: "Brazilian Real", MXN: "Mexican Peso",
  SEK: "Swedish Krona", NOK: "Norwegian Krone", KRW: "S. Korean Won",
  HKD: "Hong Kong Dollar", TRY: "Turkish Lira", THB: "Thai Baht",
};

export default function CurrencyConverter() {
  const [base, setBase] = useState("USD");
  const [target, setTarget] = useState("EUR");
  const [amount, setAmount] = useState("100");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updated, setUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`https://open.er-api.com/v6/latest/${base}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.result !== "success") throw new Error();
        setRates(data.rates);
        setUpdated(data.time_last_update_utc?.replace(/ \d{2}:.*$/, "") ?? "");
      })
      .catch(() => !cancelled && setError("Couldn't fetch live rates. Check your connection."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [base]);

  const converted = useMemo(() => {
    const a = parseFloat(amount);
    if (!rates || isNaN(a) || !rates[target]) return null;
    return a * rates[target];
  }, [amount, rates, target]);

  const rate = rates?.[target];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="panel p-4">
          <select value={base} onChange={(e) => setBase(e.target.value)} className="mb-2 w-full bg-transparent text-sm font-medium outline-none">
            {Object.entries(CURRENCIES).map(([c, n]) => <option key={c} value={c}>{c} · {n}</option>)}
          </select>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-11 border-0 bg-transparent px-0 text-2xl font-semibold focus:ring-0" />
        </div>

        <button
          onClick={() => { setBase(target); setTarget(base); }}
          className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-border bg-panel-raised text-fg-muted transition hover:text-fg"
          aria-label="Swap"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>

        <div className="panel p-4">
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="mb-2 w-full bg-transparent text-sm font-medium outline-none">
            {Object.entries(CURRENCIES).map(([c, n]) => <option key={c} value={c}>{c} · {n}</option>)}
          </select>
          <div className="flex h-11 items-center text-2xl font-semibold text-accent">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : converted !== null ? converted.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-center text-sm text-danger">{error}</p>
      ) : rate ? (
        <p className="text-center text-sm text-fg-muted">
          1 {base} = {rate.toLocaleString(undefined, { maximumFractionDigits: 4 })} {target}
          {updated && <span className="text-fg-faint"> · rates as of {updated}</span>}
        </p>
      ) : null}
      <p className="text-center text-xs text-fg-faint">
        Live mid-market rates from open.er-api.com. This is the one tool here that needs a connection.
      </p>
    </div>
  );
}
