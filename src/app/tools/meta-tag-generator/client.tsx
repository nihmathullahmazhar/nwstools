"use client";

import { useMemo, useState } from "react";
import { Input, Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { Globe } from "lucide-react";

type Fields = {
  title: string;
  description: string;
  url: string;
  siteName: string;
  image: string;
  twitter: string;
  card: "summary" | "summary_large_image";
  ogType: string;
  themeColor: string;
};

const DEFAULTS: Fields = {
  title: "Toolkit — private in-browser tools",
  description: "A fast, private collection of everyday tools that run entirely in your browser.",
  url: "https://toolkit.example.com",
  siteName: "Toolkit",
  image: "",
  twitter: "@toolkit",
  card: "summary_large_image",
  ogType: "website",
  themeColor: "#6d5efc",
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function MetaTagGenerator() {
  const [f, setF] = useState<Fields>(DEFAULTS);
  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((p) => ({ ...p, [k]: v }));

  const code = useMemo(() => {
    const lines: (string | null)[] = [
      `<title>${esc(f.title)}</title>`,
      `<meta name="description" content="${esc(f.description)}" />`,
      f.url ? `<link rel="canonical" href="${esc(f.url)}" />` : null,
      f.themeColor ? `<meta name="theme-color" content="${esc(f.themeColor)}" />` : null,
      ``,
      `<!-- Open Graph -->`,
      `<meta property="og:type" content="${esc(f.ogType)}" />`,
      `<meta property="og:title" content="${esc(f.title)}" />`,
      `<meta property="og:description" content="${esc(f.description)}" />`,
      f.url ? `<meta property="og:url" content="${esc(f.url)}" />` : null,
      f.siteName ? `<meta property="og:site_name" content="${esc(f.siteName)}" />` : null,
      f.image ? `<meta property="og:image" content="${esc(f.image)}" />` : null,
      ``,
      `<!-- Twitter -->`,
      `<meta name="twitter:card" content="${f.card}" />`,
      `<meta name="twitter:title" content="${esc(f.title)}" />`,
      `<meta name="twitter:description" content="${esc(f.description)}" />`,
      f.image ? `<meta name="twitter:image" content="${esc(f.image)}" />` : null,
      f.twitter ? `<meta name="twitter:site" content="${esc(f.twitter)}" />` : null,
    ];
    return lines.filter((l): l is string => l !== null).join("\n");
  }, [f]);

  const host = (() => {
    try {
      return new URL(f.url).hostname.replace(/^www\./, "");
    } catch {
      return f.url;
    }
  })();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <Field label="Page title">
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} />
          <Meter value={f.title.length} good={[30, 60]} unit="chars" />
        </Field>
        <Field label="Description">
          <Textarea
            value={f.description}
            onChange={(e) => set("description", e.target.value)}
            className="min-h-[80px]"
          />
          <Meter value={f.description.length} good={[70, 160]} unit="chars" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Canonical URL">
            <Input value={f.url} onChange={(e) => set("url", e.target.value)} />
          </Field>
          <Field label="Site name">
            <Input value={f.siteName} onChange={(e) => set("siteName", e.target.value)} />
          </Field>
          <Field label="Image URL">
            <Input value={f.image} onChange={(e) => set("image", e.target.value)} />
          </Field>
          <Field label="Twitter handle">
            <Input value={f.twitter} onChange={(e) => set("twitter", e.target.value)} />
          </Field>
        </div>
        <Field label="Twitter card">
          <Segmented
            value={f.card}
            onChange={(v) => set("card", v)}
            options={[
              { value: "summary_large_image", label: "Large image" },
              { value: "summary", label: "Summary" },
            ]}
          />
        </Field>
      </div>

      <div className="space-y-5">
        {/* Google preview */}
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-faint">
            Google result
          </div>
          <div className="panel p-4">
            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-panel-raised">
                <Globe className="h-3.5 w-3.5" />
              </span>
              <div>
                <div className="text-fg">{f.siteName || host}</div>
                <div className="text-xs text-fg-faint">{f.url || "example.com"}</div>
              </div>
            </div>
            <div className="mt-2 text-lg text-[#1a0dab] dark:text-[#8ab4f8]">
              {f.title || "Page title"}
            </div>
            <div className="mt-1 line-clamp-2 text-sm text-fg-muted">
              {f.description || "Meta description preview."}
            </div>
          </div>
        </div>

        {/* Social card preview */}
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-faint">
            Social card
          </div>
          <div className="panel overflow-hidden">
            {f.card === "summary_large_image" && (
              <div className="aspect-[1.91/1] w-full bg-panel-raised">
                {f.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-sm text-fg-faint">
                    og:image
                  </div>
                )}
              </div>
            )}
            <div className="p-3">
              <div className="text-xs uppercase text-fg-faint">{host}</div>
              <div className="mt-0.5 font-semibold text-fg">{f.title}</div>
              <div className="line-clamp-2 text-sm text-fg-muted">{f.description}</div>
            </div>
          </div>
        </div>

        {/* Code */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-fg-faint">
              Head tags
            </span>
            <div className="flex gap-2">
              <CopyButton value={code} size="sm" />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => download(new Blob([code], { type: "text/html" }), "meta-tags.html")}
              >
                Download
              </Button>
            </div>
          </div>
          <pre className="panel overflow-x-auto p-4 font-mono text-xs leading-relaxed text-fg-muted">
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      {children}
    </div>
  );
}

function Meter({ value, good, unit }: { value: number; good: [number, number]; unit: string }) {
  const ok = value >= good[0] && value <= good[1];
  const over = value > good[1];
  return (
    <div className="mt-1 flex items-center gap-2 text-xs">
      <span className={ok ? "text-success" : over ? "text-danger" : "text-fg-faint"}>
        {value} {unit}
      </span>
      <span className="text-fg-faint">· ideal {good[0]}–{good[1]}</span>
    </div>
  );
}
