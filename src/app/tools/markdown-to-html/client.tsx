"use client";

import { useMemo, useState } from "react";
import { Textarea, Segmented } from "@/components/ui/field";
import { CopyButton } from "@/components/ui/copy-button";

const SAMPLE = `# Markdown to HTML

A **fast**, _private_ converter with \`inline code\`.

## Features
- Headings, lists, links
- **Bold**, _italic_, ~~strike~~
- [Links](https://example.com) and images

> Blockquotes work too.

\`\`\`
code blocks stay as-is
\`\`\`

1. First
2. Second
`;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string) {
  return esc(s)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function toHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let inCode = false;
  let code: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCode) {
        out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      i++;
      continue;
    }
    if (inCode) {
      code.push(line);
      i++;
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*([-*+])\s+/.test(line)) {
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inline(line.replace(/^\s*[-*+]\s+/, ""))}</li>`);
      i++;
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`);
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      closeList();
      out.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`);
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      closeList();
      out.push("<hr />");
      i++;
      continue;
    }
    if (line.trim() === "") {
      closeList();
      i++;
      continue;
    }

    closeList();
    out.push(`<p>${inline(line)}</p>`);
    i++;
  }
  closeList();
  if (inCode) out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);
  return out.join("\n");
}

export default function MarkdownToHtml() {
  const [md, setMd] = useState(SAMPLE);
  const [view, setView] = useState<"preview" | "html">("preview");
  const html = useMemo(() => toHtml(md), [md]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: "preview", label: "Preview" },
            { value: "html", label: "HTML" },
          ]}
        />
        {view === "html" && <CopyButton value={html} size="sm" />}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 text-sm font-medium">Markdown</div>
          <Textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="min-h-[440px] font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">{view === "preview" ? "Preview" : "HTML source"}</div>
          {view === "preview" ? (
            <div
              className="panel prose-toolkit min-h-[440px] overflow-auto p-5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <Textarea value={html} readOnly className="min-h-[440px] bg-panel-raised font-mono text-xs" />
          )}
        </div>
      </div>
    </div>
  );
}
