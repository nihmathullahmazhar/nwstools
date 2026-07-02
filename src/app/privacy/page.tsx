import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How NWS Tools handles your data: everything runs in your browser, nothing is uploaded, and there is no tracking.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy"
      intro="The short version: your files and text never leave your device."
    >
      <h2>What we don't do</h2>
      <ul>
        <li>We don&apos;t upload your files, images, PDFs, audio or text to any server.</li>
        <li>We don&apos;t use accounts, logins or cookies for tracking.</li>
        <li>We don&apos;t run analytics, ads or third-party trackers.</li>
        <li>We don&apos;t sell or share any personal data — because we don&apos;t collect any.</li>
      </ul>

      <h2>How the tools work</h2>
      <p>
        Every tool runs as code inside your browser tab. When you resize an image,
        format JSON, or trim a video, the work happens on your own device using your
        computer&apos;s processor. The result is generated locally and offered to you as a
        download. Nothing is transmitted in the process.
      </p>

      <h2>The few things that use the network</h2>
      <p>
        A small number of tools download <em>code or models</em> — never your content —
        from a public CDN the first time you use them:
      </p>
      <ul>
        <li>
          <strong>Video tools</strong> download the FFmpeg engine (~25&nbsp;MB) once, then
          process video locally.
        </li>
        <li>
          <strong>Background Remover</strong> and <strong>Text Behind Image</strong>{" "}
          download an AI model (~40&nbsp;MB) once, then run it locally.
        </li>
        <li>
          <strong>PDF tools</strong> load a small PDF rendering component from a CDN.
        </li>
        <li>
          <strong>Currency Converter</strong> is the one tool that needs a live
          connection: it fetches current exchange rates from a public rates API. Only a
          currency code (e.g. <code>USD</code>) is sent — nothing personal.
        </li>
      </ul>
      <p>
        In every case, the images, documents and text you work with stay on your device.
      </p>

      <h2>Local storage on your device</h2>
      <p>
        Some tools (like the notepad, to-do list and habit tracker) and your light/dark
        theme preference are saved in your browser&apos;s local storage. This data lives
        only on your device and is never sent anywhere. Clearing your browser data
        removes it.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, it will be updated on this page. Questions? Reach us via
        the <a href="/contact">contact page</a>.
      </p>
    </PageShell>
  );
}
