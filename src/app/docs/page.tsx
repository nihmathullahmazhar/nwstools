import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "How it works",
  description: "A quick guide to using NWS Tools.",
};

export default function DocsPage() {
  return (
    <PageShell title="How it works" intro="Everything you need in under a minute.">
      <h2>Find a tool</h2>
      <p>
        Press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> anywhere to open the search palette and
        jump to any tool by name or keyword. Or{" "}
        <Link href="/tools">browse all tools</Link> and filter by category.
      </p>

      <h2>Use it</h2>
      <p>
        Most tools work instantly — start typing, upload a file, or adjust the options and
        the result updates live. File-based tools (images, PDFs, audio, video) accept
        drag-and-drop, a click to browse, or a paste.
      </p>

      <h2>It stays on your device</h2>
      <p>
        Your files and text are processed right in your browser and never uploaded. You
        can even use most tools offline once the page has loaded. See{" "}
        <Link href="/privacy">privacy</Link> for the details.
      </p>

      <h2>A few tips</h2>
      <ul>
        <li>Toggle light/dark with the switch in the top bar.</li>
        <li>Heavier tools (video, background removal) download a one-time engine or model, then run locally.</li>
        <li>Everything is free, with no account required.</li>
      </ul>

      <p>
        Something missing? <Link href="/contact">Request a tool</Link>.
      </p>
    </PageShell>
  );
}
