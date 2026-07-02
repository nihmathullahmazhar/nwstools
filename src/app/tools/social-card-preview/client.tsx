"use client";

import { useState } from "react";
import { Input, Textarea, Segmented } from "@/components/ui/field";

type Platform = "x" | "facebook" | "linkedin" | "discord";

export default function SocialCardPreview() {
  const [title, setTitle] = useState("Toolkit — private in-browser tools");
  const [desc, setDesc] = useState("A fast, private collection of everyday tools that run entirely in your browser.");
  const [url, setUrl] = useState("https://toolkit.example.com");
  const [image, setImage] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");

  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url || "example.com";
    }
  })();

  const img = image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="" className="h-full w-full object-cover" />
  ) : (
    <div className="grid h-full place-items-center text-sm text-fg-faint">og:image preview</div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="space-y-4">
        <F label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></F>
        <F label="Description">
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="min-h-[80px]" />
        </F>
        <F label="URL"><Input value={url} onChange={(e) => setUrl(e.target.value)} /></F>
        <F label="Image URL"><Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…/og.png" /></F>
        <p className="text-xs text-fg-faint">
          Cross-origin fetching is blocked in the browser, so enter your OG values manually to preview.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex gap-2 overflow-x-auto">
          <Segmented
            value={platform}
            onChange={setPlatform}
            options={[
              { value: "x", label: "X" },
              { value: "facebook", label: "Facebook" },
              { value: "linkedin", label: "LinkedIn" },
              { value: "discord", label: "Discord" },
            ]}
          />
        </div>

        <div className="mx-auto max-w-lg">
          {platform === "x" && (
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="aspect-[1.91/1] bg-panel-raised">{img}</div>
              <div className="border-t border-border bg-panel p-3">
                <div className="text-sm text-fg-faint">{host}</div>
                <div className="text-[15px] text-fg">{title}</div>
                <div className="line-clamp-1 text-sm text-fg-muted">{desc}</div>
              </div>
            </div>
          )}

          {platform === "facebook" && (
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="aspect-[1.91/1] bg-panel-raised">{img}</div>
              <div className="border-t border-border bg-panel-raised p-3">
                <div className="text-xs uppercase tracking-wide text-fg-faint">{host}</div>
                <div className="mt-1 font-semibold text-fg">{title}</div>
                <div className="line-clamp-1 text-sm text-fg-muted">{desc}</div>
              </div>
            </div>
          )}

          {platform === "linkedin" && (
            <div className="overflow-hidden rounded-lg border border-border bg-panel shadow-sm">
              <div className="aspect-[1.91/1] bg-panel-raised">{img}</div>
              <div className="p-3">
                <div className="font-semibold text-fg">{title}</div>
                <div className="mt-0.5 text-xs text-fg-faint">{host}</div>
              </div>
            </div>
          )}

          {platform === "discord" && (
            <div className="rounded border-l-4 border-accent bg-panel-raised p-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="text-xs text-fg-faint">{host}</div>
                  <div className="mt-0.5 font-semibold text-accent">{title}</div>
                  <div className="mt-1 text-sm text-fg-muted">{desc}</div>
                </div>
                {image && (
                  <div className="h-20 w-20 overflow-hidden rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      {children}
    </div>
  );
}
