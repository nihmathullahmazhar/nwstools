"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CONTACT_FORM_URL } from "@/lib/site";

export function ContactForm() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="panel relative overflow-hidden p-1">
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-fg-muted">
          <span className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading form…
          </span>
        </div>
      )}
      <iframe
        src={CONTACT_FORM_URL}
        title="Contact form"
        onLoad={() => setLoaded(true)}
        className="h-[820px] w-full rounded-xl bg-white"
      >
        Loading…
      </iframe>
    </div>
  );
}
