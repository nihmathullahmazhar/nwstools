"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dropzone({
  onFile,
  onFiles,
  accept = "image/*",
  hint = "PNG, JPG or WebP",
  multiple = false,
  label = "Drop an image, click to browse, or paste",
}: {
  onFile?: (file: File) => void;
  onFiles?: (files: File[]) => void;
  accept?: string;
  hint?: string;
  multiple?: boolean;
  label?: string;
}) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (files: FileList | null) => {
      if (!files || !files.length) return;
      if (onFiles) onFiles(Array.from(files));
      if (onFile) onFile(files[0]);
    },
    [onFile, onFiles],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      onPaste={(e) => handle(e.clipboardData.files)}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition",
        over
          ? "border-accent bg-accent-soft"
          : "border-border hover:border-border-strong hover:bg-panel-raised",
      )}
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent">
        <UploadCloud className="h-7 w-7" />
      </span>
      <div>
        <p className="font-medium text-fg">{label}</p>
        <p className="mt-1 text-sm text-fg-muted">{hint} · never leaves your device</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}
