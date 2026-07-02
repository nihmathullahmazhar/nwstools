"use client";

import { useMemo, useState } from "react";
import { Textarea, Input, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";

const FREQS = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

export default function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/pricing");
  const [freq, setFreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const [includeLastmod, setIncludeLastmod] = useState<"yes" | "no">("yes");

  const { xml, count } = useMemo(() => {
    const list = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\//.test(u));
    const today = new Date().toISOString().slice(0, 10);
    const body = list
      .map((u) => {
        const lines = [`  <url>`, `    <loc>${u.replace(/&/g, "&amp;")}</loc>`];
        if (includeLastmod === "yes") lines.push(`    <lastmod>${today}</lastmod>`);
        lines.push(`    <changefreq>${freq}</changefreq>`);
        lines.push(`    <priority>${priority}</priority>`);
        lines.push(`  </url>`);
        return lines.join("\n");
      })
      .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
    return { xml, count: list.length };
  }, [urls, freq, priority, includeLastmod]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 text-sm font-medium">URLs (one per line)</div>
          <Textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            className="min-h-[280px] font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1.5 text-sm font-medium">Change frequency</div>
            <select
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-panel px-3 text-sm outline-none focus:border-accent"
            >
              {FREQS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium">Priority</div>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Include lastmod</div>
          <Segmented
            value={includeLastmod}
            onChange={setIncludeLastmod}
            options={[
              { value: "yes", label: "Yes (today)" },
              { value: "no", label: "No" },
            ]}
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-faint">
            sitemap.xml · {count} URLs
          </span>
          <div className="flex gap-2">
            <CopyButton value={xml} size="sm" />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => download(new Blob([xml], { type: "application/xml" }), "sitemap.xml")}
            >
              Download
            </Button>
          </div>
        </div>
        <pre className="panel min-h-[380px] overflow-auto p-4 font-mono text-xs leading-relaxed text-fg-muted">
          {xml}
        </pre>
      </div>
    </div>
  );
}
