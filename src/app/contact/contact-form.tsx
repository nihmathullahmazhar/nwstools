"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";

// Placeholder — swap for the real inbox before launch.
const CONTACT_EMAIL = "hello@toolkit.app";

export function ContactForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = `${message}\n\n— ${name || "Anonymous"}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject || "Hello from Toolkit",
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="space-y-6">
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="panel inline-flex items-center gap-3 px-4 py-3 text-sm font-medium transition hover:border-border-strong"
      >
        <Mail className="h-4.5 w-4.5 text-accent" />
        {CONTACT_EMAIL}
      </a>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 text-sm font-medium">Your name</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium">Subject</div>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Tool request, bug report…" />
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium">Message</div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Tell us what tool you'd love to see, or what went wrong…"
            className="min-h-[160px]"
          />
        </div>
        <Button type="submit" size="lg" disabled={!message.trim()}>
          <Send className="h-4 w-4" /> Send message
        </Button>
        <p className="text-xs text-fg-faint">
          This opens your email app with the message ready to send — nothing is submitted
          to a server.
        </p>
      </form>
    </div>
  );
}
