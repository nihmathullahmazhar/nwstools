"use client";

import { useMemo, useState } from "react";
import { Input, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/utils";
import { Plus, X } from "lucide-react";

type Group = { agent: string; allow: string; disallow: string };

export default function RobotsTxtGenerator() {
  const [preset, setPreset] = useState<"custom" | "allow" | "block">("allow");
  const [groups, setGroups] = useState<Group[]>([
    { agent: "*", allow: "", disallow: "" },
  ]);
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");

  function applyPreset(p: "allow" | "block") {
    setPreset(p);
    setGroups([{ agent: "*", allow: "", disallow: p === "block" ? "/" : "" }]);
  }

  const output = useMemo(() => {
    const lines: string[] = [];
    groups.forEach((g, i) => {
      if (i > 0) lines.push("");
      lines.push(`User-agent: ${g.agent || "*"}`);
      g.disallow
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((p) => lines.push(`Disallow: ${p}`));
      g.allow
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((p) => lines.push(`Allow: ${p}`));
      if (!g.disallow.trim() && !g.allow.trim()) lines.push("Disallow:");
      if (crawlDelay.trim()) lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
    });
    if (sitemap.trim()) {
      lines.push("");
      lines.push(`Sitemap: ${sitemap.trim()}`);
    }
    return lines.join("\n");
  }, [groups, sitemap, crawlDelay]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 text-sm font-medium">Preset</div>
          <Segmented
            value={preset}
            onChange={(v) => (v === "custom" ? setPreset("custom") : applyPreset(v))}
            options={[
              { value: "allow", label: "Allow all" },
              { value: "block", label: "Block all" },
              { value: "custom", label: "Custom" },
            ]}
          />
        </div>

        {groups.map((g, i) => (
          <div key={i} className="panel space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-faint">
                Rule group {i + 1}
              </span>
              {groups.length > 1 && (
                <button
                  onClick={() => setGroups((p) => p.filter((_, x) => x !== i))}
                  className="text-fg-faint hover:text-danger"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div>
              <div className="mb-1 text-xs text-fg-muted">User-agent</div>
              <Input
                value={g.agent}
                onChange={(e) => {
                  setPreset("custom");
                  setGroups((p) => p.map((x, xi) => (xi === i ? { ...x, agent: e.target.value } : x)));
                }}
                placeholder="* or Googlebot"
                className="h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PathBox
                label="Disallow"
                value={g.disallow}
                onChange={(v) => {
                  setPreset("custom");
                  setGroups((p) => p.map((x, xi) => (xi === i ? { ...x, disallow: v } : x)));
                }}
              />
              <PathBox
                label="Allow"
                value={g.allow}
                onChange={(v) => {
                  setPreset("custom");
                  setGroups((p) => p.map((x, xi) => (xi === i ? { ...x, allow: v } : x)));
                }}
              />
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPreset("custom");
            setGroups((p) => [...p, { agent: "", allow: "", disallow: "" }]);
          }}
        >
          <Plus className="h-4 w-4" /> Add rule group
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1.5 text-sm font-medium">Sitemap URL</div>
            <Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="h-9" />
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium">Crawl-delay (s)</div>
            <Input value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="optional" className="h-9" />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-faint">robots.txt</span>
          <div className="flex gap-2">
            <CopyButton value={output} size="sm" />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => download(new Blob([output], { type: "text/plain" }), "robots.txt")}
            >
              Download
            </Button>
          </div>
        </div>
        <pre className="panel min-h-[300px] overflow-x-auto p-4 font-mono text-sm leading-relaxed text-fg">
          {output}
        </pre>
      </div>
    </div>
  );
}

function PathBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-xs text-fg-muted">{label} (one path per line)</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/admin"
        className="min-h-[70px] w-full resize-y rounded-lg border border-border bg-panel p-2 font-mono text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
