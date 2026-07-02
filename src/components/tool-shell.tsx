import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { getTool } from "@/lib/tools/registry";
import { PromoCard } from "@/components/promo/promo-card";
import { ToolSeo } from "@/components/tool-seo";
import { ToolName } from "@/components/tool-name";
import { cn } from "@/lib/utils";

export function ToolShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const tool = getTool(slug);
  if (!tool) return <>{children}</>;
  const { category } = tool;
  const Icon = category.icon;
  const siblings = category.tools;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <nav className="flex items-center gap-1 text-sm text-fg-muted">
        <Link href="/" className="hover:text-fg">Home</Link>
        <ChevronRight className="h-4 w-4 text-fg-faint" />
        <Link href={`/category/${category.slug}`} className="hover:text-fg">
          {category.name}
        </Link>
        <ChevronRight className="h-4 w-4 text-fg-faint" />
        <span className="text-fg">{tool.name}</span>
      </nav>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
            style={{
              backgroundColor: `hsl(${category.accent} / 0.12)`,
              color: `hsl(${category.accent})`,
            }}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              <ToolName name={tool.name} />
            </h1>
            <p className="mt-1 max-w-xl text-fg-muted">{tool.tagline}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-panel-raised px-3 py-1.5 text-xs font-medium text-fg-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          Runs on your device
        </span>
      </header>

      <section className="mt-8">{children}</section>

      <div className="mt-12">
        <PromoCard />
      </div>

      {siblings.length > 1 && (
        <section className="mt-16">
          <h2 className="mb-4 text-sm font-medium text-fg-muted">
            {category.name} tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((t) => {
              const active = t.slug === slug;
              if (active)
                return (
                  <span
                    key={t.slug}
                    aria-current="page"
                    className="rounded-full border border-accent bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-fg"
                  >
                    {t.name}
                  </span>
                );
              return t.ready ? (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="rounded-full border border-border px-3.5 py-1.5 text-sm text-fg-muted transition hover:border-border-strong hover:text-fg"
                >
                  {t.name}
                </Link>
              ) : (
                <span
                  key={t.slug}
                  className={cn(
                    "rounded-full border border-border px-3.5 py-1.5 text-sm text-fg-faint",
                  )}
                >
                  {t.name}
                </span>
              );
            })}
          </div>
        </section>
      )}

      <ToolSeo tool={tool} category={category} />
    </div>
  );
}
