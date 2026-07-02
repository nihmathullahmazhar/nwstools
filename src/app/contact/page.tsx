import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a tool, report a bug, or start a project with nihmathullah.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      intro="Missing a tool? Found a bug? Want us to build something? Drop a message below — it goes straight to our inbox."
    >
      <ContactForm />
    </PageShell>
  );
}
