import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { CATEGORIES, TOTAL_TOOL_COUNT, READY_TOOLS } from "@/lib/tools/registry";
import { BRAND_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "NWS Tools is a fast, private collection of everyday tools that run entirely in your browser, built by nihmathullah.com.",
};

export default function AboutPage() {
  const ready = new Set(READY_TOOLS.map((t) => t.slug)).size;
  return (
    <PageShell
      title="About NWS Tools"
      intro="Every little tool you need, running entirely in your browser."
    >
      <p>
        NWS Tools is a growing collection of {TOTAL_TOOL_COUNT}+ small, focused tools —
        converters, calculators, editors and generators — that do one thing well.
        {" "}
        {ready} are ready today, with more added regularly.
      </p>

      <h2>Private by default</h2>
      <p>
        Almost everything here happens on your device. Your files, text and numbers are
        processed locally and are never uploaded to a server. There are no accounts, no
        sign-ups and no tracking. Read the details on our{" "}
        <Link href="/privacy">privacy page</Link>.
      </p>

      <h2>Fast and frictionless</h2>
      <p>
        No installs, no waiting, no clutter. Open a tool and start using it. Press{" "}
        <kbd>⌘K</kbd> (or <kbd>Ctrl K</kbd>) anywhere to search every tool instantly.
      </p>

      <h2>Categories</h2>
      <ul>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link href={`/category/${c.slug}`}>{c.name}</Link> — {c.description}
          </li>
        ))}
      </ul>

      <h2>Made by nihmathullah.com</h2>
      <p>
        These tools are built and maintained by{" "}
        <a href={BRAND_URL} target="_blank" rel="noopener noreferrer">nihmathullah.com</a> — a
        studio that designs and builds premium websites, web apps and custom CRMs. The free
        tools here are a taste of the craft brought to client work. If you need software built
        properly, <a href={BRAND_URL} target="_blank" rel="noopener noreferrer">let&apos;s talk</a>.
      </p>

      <p>
        <Link href="/tools">Browse all tools →</Link>
      </p>
    </PageShell>
  );
}
