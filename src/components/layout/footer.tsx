import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, TOTAL_TOOL_COUNT } from "@/lib/tools/registry";
import { BRAND_URL, BRAND_CTA } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg">
                <span className="text-[15px] font-black">N</span>
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                NWS <span className="text-fg-muted">Tools</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-fg-muted">
              {TOTAL_TOOL_COUNT}+ fast, private tools that run entirely in your
              browser. No sign-up, no uploads, no tracking.
            </p>
            <a
              href={BRAND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-soft px-3.5 py-2 text-sm font-medium text-accent transition hover:border-accent/60"
            >
              {BRAND_CTA} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {chunk(CATEGORIES, Math.ceil(CATEGORIES.length / 3)).map((group, i) => (
              <div key={i} className="space-y-2.5">
                {group.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="block text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            <a href={BRAND_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-fg-muted hover:text-fg">
              nihmathullah.com
            </a>{" "}
            · everything runs locally
          </p>
          <div className="flex gap-5">
            <Link href="/tools" className="hover:text-fg">All tools</Link>
            <Link href="/about" className="hover:text-fg">About</Link>
            <Link href="/privacy" className="hover:text-fg">Privacy</Link>
            <a href={BRAND_URL} target="_blank" rel="noopener noreferrer" className="hover:text-fg">nihmathullah.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
