"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

function b64urlDecode(part: string) {
  let t = part.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  return decodeURIComponent(escape(atob(t)));
}

function pretty(obj: unknown) {
  return JSON.stringify(obj, null, 2);
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    const t = token.trim();
    if (!t) return null;
    const parts = t.split(".");
    if (parts.length < 2) return { error: "A JWT has three dot-separated parts." };
    try {
      const header = JSON.parse(b64urlDecode(parts[0]));
      const payload = JSON.parse(b64urlDecode(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      const exp = typeof payload.exp === "number" ? payload.exp : null;
      const claims: { label: string; value: string }[] = [];
      const addTime = (label: string, v: unknown) => {
        if (typeof v === "number")
          claims.push({ label, value: new Date(v * 1000).toLocaleString() });
      };
      addTime("Issued", payload.iat);
      addTime("Not before", payload.nbf);
      addTime("Expires", payload.exp);
      return {
        header,
        payload,
        signature: parts[2] ?? "",
        expired: exp !== null ? now > exp : null,
        claims,
      };
    } catch {
      return { error: "Could not decode — is this a valid JWT?" };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1.5 text-sm font-medium">JWT</div>
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste a JWT (eyJhbGciOi…)"
          className="min-h-[110px] font-mono text-sm break-all"
          spellCheck={false}
          autoFocus
        />
      </div>

      {decoded && "error" in decoded && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {decoded.error}
        </p>
      )}

      {decoded && !("error" in decoded) && (
        <>
          {decoded.expired !== null && (
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                decoded.expired
                  ? "bg-danger/10 text-danger"
                  : "bg-success/10 text-success",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {decoded.expired ? "Expired" : "Active"}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Block title="Header" value={pretty(decoded.header)} />
            <Block title="Payload" value={pretty(decoded.payload)} />
          </div>

          {decoded.claims.length > 0 && (
            <div className="panel p-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-faint">
                Timestamps
              </div>
              <dl className="grid gap-2 sm:grid-cols-3">
                {decoded.claims.map((c) => (
                  <div key={c.label}>
                    <dt className="text-xs text-fg-muted">{c.label}</dt>
                    <dd className="text-sm text-fg">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <p className="text-xs text-fg-faint">
            The signature is shown but not verified — decoding never checks
            authenticity.
          </p>
        </>
      )}
    </div>
  );
}

function Block({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <CopyButton value={value} size="sm" />
      </div>
      <Textarea
        value={value}
        readOnly
        className="min-h-[220px] bg-panel-raised font-mono text-sm"
        spellCheck={false}
      />
    </div>
  );
}
