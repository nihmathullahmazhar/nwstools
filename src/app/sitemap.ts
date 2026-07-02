import type { MetadataRoute } from "next";
import { CATEGORIES, READY_TOOLS } from "@/lib/tools/registry";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/tools", "/services", "/about", "/privacy", "/terms", "/contact", "/docs"];
  const readySlugs = [...new Set(READY_TOOLS.map((t) => t.slug))];

  return [
    ...staticPages.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...readySlugs.map((slug) => ({
      url: `${SITE_URL}/tools/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
