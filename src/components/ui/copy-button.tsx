"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText, cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  className,
  size = "md",
}: {
  value: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (!value) return;
    const ok = await copyText(value);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  }

  return (
    <button
      onClick={onCopy}
      disabled={!value}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel-raised font-medium text-fg-muted transition hover:border-border-strong hover:text-fg disabled:opacity-50",
        size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
        className,
      )}
    >
      {copied ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}
