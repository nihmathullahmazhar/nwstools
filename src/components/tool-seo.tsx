import type { Tool, Category } from "@/lib/tools/registry";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** Generated, accurate SEO copy + FAQ + JSON-LD for a tool page. */
export function ToolSeo({ tool, category }: { tool: Tool; category: Category }) {
  const name = tool.name;
  const lower = tool.tagline.replace(/\.$/, "").toLowerCase();

  const faqs: { q: string; a: string }[] = [
    {
      q: `Is ${name} free to use?`,
      a: `Yes. ${name} is completely free, with no account, sign-up or limits.`,
    },
    {
      q: `Are my files or data uploaded anywhere?`,
      a: `No. ${name} runs entirely in your browser. Your files, text and numbers are processed on your own device and are never uploaded to a server.`,
    },
    {
      q: `Does ${name} work offline?`,
      a: `Once the page has loaded, most tools keep working with no internet connection. ${SITE_NAME} is a Progressive Web App you can even install.`,
    },
    {
      q: `Do I need to install any software?`,
      a: `No installation is required — ${name} works instantly in any modern browser on desktop or mobile.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: `${name} — ${SITE_NAME}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (web browser)",
        description: tool.tagline,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/category/${category.slug}` },
          { "@type": "ListItem", position: 3, name: name, item: `${SITE_URL}/tools/${tool.slug}` },
        ],
      },
    ],
  };

  return (
    <section className="mt-16 border-t border-border pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-xl font-semibold tracking-tight">About {name}</h2>
      <p className="mt-3 max-w-2xl text-fg-muted">
        {name} is a free, private {category.name.toLowerCase()} tool that lets you {lower}.
        Like every tool on {SITE_NAME}, it runs entirely in your browser — nothing is
        uploaded, there are no accounts, and there&apos;s no tracking. Just open it and go.
      </p>

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-fg-faint">
        Frequently asked questions
      </h3>
      <dl className="mt-4 max-w-2xl space-y-5">
        {faqs.map((f) => (
          <div key={f.q}>
            <dt className="font-medium text-fg">{f.q}</dt>
            <dd className="mt-1 text-sm text-fg-muted">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
