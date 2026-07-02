import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CATEGORIES, TOTAL_TOOL_COUNT, getTool } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";
import { PromoSection } from "@/components/promo/promo-section";
import { HomeSearch } from "@/components/home-search";
import { DashboardWidget } from "@/components/dashboard-widget";

const FEATURED = [
  "background-remover",
  "qr-code-generator",
  "json-formatter",
  "merge-split-pdf",
  "password-generator",
  "word-counter",
  "code-formatter",
  "video-converter",
];

export default function Home() {
  const featured = FEATURED.map((s) => getTool(s)).filter(
    (t): t is NonNullable<typeof t> => Boolean(t),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Dashboard header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome to <span className="text-accent">NWS Tools</span>
          </h1>
          <p className="mt-2.5 text-fg-muted">
            An elegant, private toolkit — {TOTAL_TOOL_COUNT}+ formatters, editors,
            calculators and converters that run entirely in your browser. No sign-up,
            nothing uploaded, works offline.
          </p>
          <div className="mt-5">
            <HomeSearch />
          </div>
        </div>
        <DashboardWidget />
      </div>

      {/* Popular */}
      <section className="mt-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-accent" /> Popular right now
          </h2>
          <Link href="/tools" className="text-sm text-fg-muted transition hover:text-fg">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t) => (
            <ToolCard key={t.slug} tool={t} category={t.category} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mt-16 scroll-mt-20">
        <h2 className="text-lg font-semibold tracking-tight">Browse by category</h2>
        <p className="mt-1 text-sm text-fg-muted">
          {CATEGORIES.length} categories, {TOTAL_TOOL_COUNT}+ tools.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="group panel flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg hover:shadow-black/5"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{
                    backgroundColor: `hsl(${c.accent} / 0.12)`,
                    color: `hsl(${c.accent})`,
                  }}
                >
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold tracking-tight">{c.name}</h3>
                    <span className="text-xs text-fg-faint">{c.tools.length}</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-fg-muted">
                    {c.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-fg-faint transition group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            );
          })}
        </div>
      </section>

      <PromoSection />
    </div>
  );
}
