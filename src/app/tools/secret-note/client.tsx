"use client";

import { useEffect, useState } from "react";
import { Textarea, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { encryptText, decryptText } from "@/lib/crypto";
import { Lock, Unlock, Save, Loader2, ShieldCheck } from "lucide-react";

type Stored = { enc: boolean; data: string };

export default function SecretNote() {
  const [stored, setStored, loaded] = useLocalStorage<Stored>("secret-note", { enc: false, data: "" });
  const [text, setText] = useState("");
  const [pass, setPass] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [init, setInit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loaded || init) return;
    if (!stored.enc) {
      setText(stored.data);
      setUnlocked(true);
    }
    setInit(true);
  }, [loaded, init, stored]);

  async function unlock() {
    setBusy(true);
    setError("");
    try {
      const plain = await decryptText(stored.data, pass);
      setText(plain);
      setUnlocked(true);
    } catch {
      setError("Wrong passphrase.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setError("");
    try {
      if (pass) {
        const enc = await encryptText(text, pass);
        setStored({ enc: true, data: enc });
      } else {
        setStored({ enc: false, data: text });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setBusy(false);
    }
  }

  if (!init)
    return <div className="mx-auto h-72 max-w-xl animate-pulse rounded-2xl bg-panel-raised" />;

  if (!unlocked)
    return (
      <div className="mx-auto max-w-sm space-y-4 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-panel-raised text-fg-muted">
          <Lock className="h-7 w-7" />
        </span>
        <h2 className="text-lg font-semibold">This note is locked</h2>
        <p className="text-sm text-fg-muted">Enter your passphrase to unlock it.</p>
        <Input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && unlock()}
          placeholder="Passphrase"
          className="h-11 text-center"
          autoFocus
        />
        <Button onClick={unlock} size="lg" className="w-full" disabled={busy || !pass}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
          Unlock
        </Button>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something private…"
        className="min-h-[300px] text-[15px]"
        autoFocus
      />
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <div className="mb-1.5 text-sm font-medium">Passphrase (optional)</div>
          <Input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Leave blank to save unlocked"
            className="h-10"
          />
        </div>
        <Button onClick={save} size="lg" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : pass ? <Lock className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {pass ? "Encrypt & save" : "Save"}
        </Button>
      </div>
      {saved && (
        <p className="flex items-center gap-1.5 text-sm text-success">
          <ShieldCheck className="h-4 w-4" /> Saved{pass ? " — encrypted on this device" : " on this device"}
        </p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      <p className="text-xs text-fg-faint">
        With a passphrase, your note is encrypted (AES-256) before it&apos;s stored — and can only
        be read back with that passphrase. It never leaves this device either way.
      </p>
    </div>
  );
}
