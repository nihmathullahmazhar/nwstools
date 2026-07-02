"use client";

import { useState } from "react";
import { Textarea, Input, Segmented } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Lock, Unlock, Loader2 } from "lucide-react";

const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}
function fromB64(s: string) {
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}

async function deriveKey(pass: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 150000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export default function TextEncrypt() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [text, setText] = useState("");
  const [pass, setPass] = useState("");
  const [out, setOut] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setError("");
    setOut("");
    if (!text || !pass) {
      setError("Enter both text and a passphrase.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "encrypt") {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(pass, salt);
        const ct = new Uint8Array(
          await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text)),
        );
        const packed = new Uint8Array(salt.length + iv.length + ct.length);
        packed.set(salt);
        packed.set(iv, salt.length);
        packed.set(ct, salt.length + iv.length);
        setOut(toB64(packed));
      } else {
        const packed = fromB64(text.trim());
        const salt = packed.slice(0, 16);
        const iv = packed.slice(16, 28);
        const ct = packed.slice(28);
        const key = await deriveKey(pass, salt);
        const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct as BufferSource);
        setOut(dec.decode(pt));
      }
    } catch {
      setError(mode === "decrypt" ? "Wrong passphrase or corrupted data." : "Encryption failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Segmented
        value={mode}
        onChange={(m) => {
          setMode(m);
          setOut("");
          setError("");
        }}
        options={[
          { value: "encrypt", label: "Encrypt" },
          { value: "decrypt", label: "Decrypt" },
        ]}
      />

      <div>
        <div className="mb-1.5 text-sm font-medium">
          {mode === "encrypt" ? "Message" : "Encrypted text"}
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mode === "encrypt" ? "Secret message…" : "Paste the encrypted string…"}
          className="min-h-[140px] font-mono text-sm"
          autoFocus
        />
      </div>

      <div>
        <div className="mb-1.5 text-sm font-medium">Passphrase</div>
        <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="h-11" />
      </div>

      <Button onClick={run} size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "encrypt" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
        {mode === "encrypt" ? "Encrypt" : "Decrypt"}
      </Button>

      {error && <p className="text-sm text-danger">{error}</p>}

      {out && (
        <div className="panel p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-faint">Result</span>
            <CopyButton value={out} size="sm" />
          </div>
          <p className="break-all font-mono text-sm text-fg">{out}</p>
        </div>
      )}

      <p className="text-xs text-fg-faint">
        AES-256-GCM with PBKDF2 (150k iterations). Runs entirely in your browser — the
        passphrase and text never leave your device.
      </p>
    </div>
  );
}
