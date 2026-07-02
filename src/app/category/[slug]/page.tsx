import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, getCategory } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/category/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) return {};
  const title = `Free ${category.name} Tools`;
  const og = `/og?title=${encodeURIComponent(`${category.name} tools`)}&subtitle=${encodeURIComponent(category.description)}`;
  return {
    title,
    description: `${category.description} ${category.tools.length} free ${category.name.toLowerCase()} tools that run in your browser — no sign-up, no uploads.`,
    keywords: [
      `${category.name.toLowerCase()} tools`,
      `free ${category.name.toLowerCase()} tools`,
      "online tools",
      "private",
      ...category.tools.slice(0, 8).map((t) => t.name.toLowerCase()),
    ],
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title, description: category.description, url: `/category/${slug}`, images: [og] },
    twitter: { card: "summary_large_image", title, description: category.description, images: [og] },
  };
}

export default async function CategoryPage(
  props: PageProps<"/category/[slug]">,
) {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) notFound();

  const Icon = category.icon;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav className="flex items-center gap-1 text-sm text-fg-muted">
        <Link href="/" className="hover:text-fg">Home</Link>
        <ChevronRight className="h-4 w-4 text-fg-faint" />
        <Link href="/tools" className="hover:text-fg">Tools</Link>
        <ChevronRight className="h-4 w-4 text-fg-faint" />
        <span className="text-fg">{category.name}</span>
      </nav>

      <header className="mt-6 flex items-start gap-4">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
          style={{
            backgroundColor: `hsl(${category.accent} / 0.12)`,
            color: `hsl(${category.accent})`,
          }}
        >
          <Icon className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {category.name}
          </h1>
          <p className="mt-1 max-w-xl text-fg-muted">{category.description}</p>
          <p className="mt-2 text-sm text-fg-faint">{category.tools.length} tools</p>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.tools.map((t) => (
          <ToolCard key={t.slug} tool={t} category={category} />
        ))}
      </div>

      <div className="mt-16">
        <h2 className="mb-4 text-sm font-medium text-fg-muted">Other categories</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-full border border-border px-3.5 py-1.5 text-sm text-fg-muted transition hover:border-border-strong hover:text-fg"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
