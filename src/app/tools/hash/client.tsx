"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { md5 } from "@/lib/md5";

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

async function sha(algo: string, text: string) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Hash() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!text) {
        setHashes({});
        return;
      }
      const out: Record<string, string> = { MD5: md5(text) };
      for (const a of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]) {
        out[a] = await sha(a, text);
      }
      if (!cancelled) setHashes(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1.5 text-sm font-medium">Text</div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text to hash…"
          className="min-h-[130px] text-sm"
          autoFocus
        />
      </div>

      <div className="space-y-3">
        {ALGOS.map((a) => (
          <div key={a} className="panel p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">{a}</span>
              <CopyButton value={hashes[a] ?? ""} size="sm" />
            </div>
            <code className="block break-all font-mono text-sm text-fg-muted">
              {hashes[a] || <span className="text-fg-faint">—</span>}
            </code>
          </div>
        ))}
      </div>

      <p className="text-xs text-fg-faint">
        SHA hashes use the Web Crypto API; MD5 runs in pure JavaScript. Nothing
        is sent anywhere.
      </p>
    </div>
  );
}
