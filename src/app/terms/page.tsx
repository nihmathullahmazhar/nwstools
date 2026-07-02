import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms of use for NWS Tools.",
};

export default function TermsPage() {
  return (
    <PageShell title="Terms of Use" intro="Plain and simple.">
      <h2>Use it freely</h2>
      <p>
        NWS Tools is provided for you to use, at no cost, for personal and commercial work.
        You&apos;re responsible for the content you process and for making sure your use
        complies with any laws that apply to you.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided &ldquo;as is&rdquo;, without warranties of any kind. While
        we work hard to keep everything accurate and reliable, we can&apos;t guarantee a
        tool is error-free or fit for a particular purpose. Always double-check important
        output — especially anything financial, legal or safety-related.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, NWS Tools and its authors are not liable for
        any loss or damage arising from your use of the tools, including lost data or
        incorrect results.
      </p>

      <h2>Your content is yours</h2>
      <p>
        Because everything runs in your browser, we never receive or store the files and
        text you work with. What you create is entirely yours.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated from time to time. Continued use of NWS Tools means you
        accept the current version.
      </p>
    </PageShell>
  );
}
