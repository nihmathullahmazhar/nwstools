import { ArrowUpRight, Sparkles } from "lucide-react";
import { BRAND_URL, BRAND_CTA } from "@/lib/site";

/** Compact CTA card promoting the studio — shown on tool pages. */
export function PromoCard() {
  return (
    <a
      href={BRAND_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-accent/30 bg-accent-soft p-5 transition hover:border-accent/60"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl"
        style={{ background: "hsl(var(--accent))" }}
      />
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg">
        <Sparkles className="h-5 w-5" />
      </span>
      <div className="relative min-w-0 flex-1">
        <div className="text-sm font-semibold text-fg">
          Built by nihmathullah.com — need a tool like this for your business?
        </div>
        <div className="text-sm text-fg-muted">
          We design premium websites, web apps and CRMs. Have a project in mind?
        </div>
      </div>
      <span className="relative hidden shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-fg transition group-hover:brightness-110 sm:inline-flex">
        {BRAND_CTA}
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </a>
  );
}
