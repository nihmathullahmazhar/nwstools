"use client";

import { useMemo, useState } from "react";
import { Input, Stat } from "@/components/ui/field";

const money = (n: number) =>
  isFinite(n) ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : "—";

export default function CreditCardPayoff() {
  const [balance, setBalance] = useState("5000");
  const [apr, setApr] = useState("22");
  const [payment, setPayment] = useState("200");

  const r = useMemo(() => {
    const B = parseFloat(balance) || 0;
    const i = (parseFloat(apr) || 0) / 100 / 12;
    const P = parseFloat(payment) || 0;
    if (B <= 0) return null;
    const minInterest = B * i;
    if (P <= minInterest) return { never: true, minInterest } as const;
    const n = Math.ceil(-Math.log(1 - (B * i) / P) / Math.log(1 + i));
    const totalPaid = // simulate for accuracy
      (() => {
        let bal = B;
        let paid = 0;
        let m = 0;
        while (bal > 0 && m < 1000) {
          const interest = bal * i;
          const principal = Math.min(bal, P - interest);
          bal = bal - principal;
          paid += principal + interest;
          m++;
        }
        return { paid, months: m };
      })();
    const date = new Date();
    date.setMonth(date.getMonth() + totalPaid.months);
    return {
      never: false as const,
      months: totalPaid.months,
      interest: totalPaid.paid - B,
      total: totalPaid.paid,
      date: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  }, [balance, apr, payment]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <F label="Balance" value={balance} onChange={setBalance} prefix="$" />
        <F label="APR" value={apr} onChange={setApr} suffix="%" />
        <F label="Monthly payment" value={payment} onChange={setPayment} prefix="$" />
      </div>

      {r?.never ? (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          Your payment doesn&apos;t cover the monthly interest ({money(r.minInterest)}), so the
          balance would never be paid off. Increase the payment.
        </div>
      ) : r ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="panel bg-accent-soft p-5 sm:col-span-1">
              <div className="text-xs font-medium uppercase tracking-wide text-fg-faint">Debt-free in</div>
              <div className="mt-1 text-3xl font-semibold tracking-tight text-accent">
                {Math.floor(r.months / 12)}y {r.months % 12}m
              </div>
              <div className="mt-1 text-sm text-fg-muted">by {r.date}</div>
            </div>
            <Stat label="Total interest" value={money(r.interest)} />
            <Stat label="Total paid" value={money(r.total)} />
          </div>
        </>
      ) : null}
    </div>
  );
}

function F({ label, value, onChange, prefix, suffix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint">{prefix}</span>}
        <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} className={`h-11 ${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-fg-faint">{suffix}</span>}
      </div>
    </div>
  );
}
