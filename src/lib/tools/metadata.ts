import type { Metadata } from "next";
import { getTool } from "./registry";

/** Rich, keyword-focused page metadata for a tool page. */
export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  if (!tool) return {};
  const cat = tool.category.name.toLowerCase();
  const title = `Free ${tool.name}`;
  const description = `${tool.tagline} A free, private ${cat} tool that runs entirely in your browser — no sign-up, no uploads, no tracking.`;
  const og = `/og?title=${encodeURIComponent(tool.name)}&subtitle=${encodeURIComponent(tool.tagline)}`;

  const keywords = [
    tool.name.toLowerCase(),
    `${tool.name.toLowerCase()} online`,
    `free ${tool.name.toLowerCase()}`,
    `${tool.name.toLowerCase()} in browser`,
    cat,
    "free online tool",
    "private",
    "no sign-up",
    ...(tool.keywords ?? []),
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: {
      type: "website",
      title,
      description: tool.tagline,
      url: `/tools/${slug}`,
      images: [{ url: og, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: tool.tagline,
      images: [og],
    },
  };
}
