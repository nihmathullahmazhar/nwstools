"use client";

import { useState } from "react";
import { PDFDocument, PDFTextField, PDFCheckBox, PDFDropdown, PDFRadioGroup } from "pdf-lib";
import { Dropzone } from "@/components/ui/dropzone";
import { Input, Check } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { FileText, Download, Loader2, X } from "lucide-react";

type Field =
  | { kind: "text"; name: string; value: string }
  | { kind: "check"; name: string; value: boolean }
  | { kind: "choice"; name: string; value: string; options: string[] };

export default function FillPdfForms() {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [name, setName] = useState("form");
  const [fields, setFields] = useState<Field[]>([]);
  const [flatten, setFlatten] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File) {
    setError("");
    const buf = await file.arrayBuffer();
    setBytes(buf);
    setName(file.name.replace(/\.pdf$/i, ""));
    try {
      const doc = await PDFDocument.load(buf.slice(0), { ignoreEncryption: true });
      const form = doc.getForm();
      const parsed: Field[] = [];
      for (const f of form.getFields()) {
        const n = f.getName();
        if (f instanceof PDFTextField) parsed.push({ kind: "text", name: n, value: f.getText() ?? "" });
        else if (f instanceof PDFCheckBox) parsed.push({ kind: "check", name: n, value: f.isChecked() });
        else if (f instanceof PDFDropdown) parsed.push({ kind: "choice", name: n, value: f.getSelected()[0] ?? "", options: f.getOptions() });
        else if (f instanceof PDFRadioGroup) parsed.push({ kind: "choice", name: n, value: f.getSelected() ?? "", options: f.getOptions() });
      }
      setFields(parsed);
      if (!parsed.length) setError("This PDF has no fillable form fields.");
    } catch {
      setError("Couldn't read this PDF.");
    }
  }

  function update(i: number, value: string | boolean) {
    setFields((p) => p.map((f, fi) => (fi === i ? ({ ...f, value } as Field) : f)));
  }

  async function save() {
    if (!bytes) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(bytes.slice(0), { ignoreEncryption: true });
      const form = doc.getForm();
      for (const f of fields) {
        try {
          if (f.kind === "text") form.getTextField(f.name).setText(f.value);
          else if (f.kind === "check") f.value ? form.getCheckBox(f.name).check() : form.getCheckBox(f.name).uncheck();
          else if (f.value) {
            try { form.getDropdown(f.name).select(f.value); }
            catch { form.getRadioGroup(f.name).select(f.value); }
          }
        } catch { /* skip incompatible field */ }
      }
      if (flatten) form.flatten();
      const out = await doc.save();
      download(new Blob([out as BlobPart], { type: "application/pdf" }), `${name}-filled.pdf`);
    } finally {
      setBusy(false);
    }
  }

  if (!bytes) return <Dropzone onFile={onFile} accept="application/pdf" hint="Fillable PDF form" label="Drop a PDF form to fill" />;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="panel flex items-center gap-3 px-4 py-3">
        <FileText className="h-5 w-5 text-danger" />
        <span className="flex-1 truncate text-sm font-medium">{name}.pdf</span>
        <button onClick={() => { setBytes(null); setFields([]); }} className="text-fg-faint hover:text-fg"><X className="h-4 w-4" /></button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      {fields.map((f, i) => (
        <div key={f.name}>
          <div className="mb-1.5 text-sm font-medium">{f.name}</div>
          {f.kind === "text" && <Input value={f.value} onChange={(e) => update(i, e.target.value)} />}
          {f.kind === "check" && <Check checked={f.value} onChange={(v) => update(i, v)}>Checked</Check>}
          {f.kind === "choice" && (
            <select value={f.value} onChange={(e) => update(i, e.target.value)} className="h-10 w-full rounded-lg border border-border bg-panel px-3 text-sm outline-none focus:border-accent">
              <option value="">—</option>
              {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
        </div>
      ))}

      {fields.length > 0 && (
        <>
          <Check checked={flatten} onChange={setFlatten}>Flatten (make fields non-editable)</Check>
          <Button onClick={save} size="lg" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Fill & download
          </Button>
        </>
      )}
    </div>
  );
}
