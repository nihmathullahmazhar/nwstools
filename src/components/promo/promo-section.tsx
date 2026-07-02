import { ArrowUpRight, Check } from "lucide-react";
import { BRAND_URL, BRAND_CTA } from "@/lib/site";

const POINTS = [
  "Marketing sites & landing pages",
  "Web apps & dashboards",
  "Custom CRMs & internal tools",
  "AI-powered products",
];

/** Full-width promo section for the homepage. */
export function PromoSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-panel p-8 sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(600px 260px at 85% 0%, hsl(var(--accent) / 0.16), transparent 70%)",
          }}
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
              Built by nihmathullah.com
            </div>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              These tools are free.{" "}
              <span className="text-accent">Your next product doesn&apos;t have to be a compromise.</span>
            </h2>
            <p className="mt-4 max-w-lg text-fg-muted">
              nihmathullah.com designs and builds premium software — the same craft behind these
              tools, applied to your website, app or CRM. Fast, private, and beautifully
              engineered.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={BRAND_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg shadow-sm shadow-accent/25 transition hover:brightness-110"
              >
                {BRAND_CTA} <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={BRAND_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium transition hover:bg-panel-raised"
              >
                See our work
              </a>
            </div>
          </div>

          <ul className="grid gap-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl border border-border bg-panel-raised px-4 py-3 text-sm font-medium">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
