import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a tool, report a bug, or say hello.",
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      intro="Missing a tool? Found a bug? We'd love to hear from you."
    >
      <ContactForm />
    </PageShell>
  );
}
