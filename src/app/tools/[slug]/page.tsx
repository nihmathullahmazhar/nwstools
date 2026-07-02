import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hammer, ArrowLeft } from "lucide-react";
import { getTool } from "@/lib/tools/registry";
import { ToolShell } from "@/components/tool-shell";

export async function generateMetadata(
  props: PageProps<"/tools/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const tool = getTool(slug);
  if (!tool) return {};
  return { title: tool.name, description: tool.tagline };
}

// Built tools live in their own static folders (e.g. /tools/word-counter),
// which take precedence over this dynamic route. Anything reaching here is
// either a known-but-unbuilt tool ("coming soon") or an unknown slug (404).
export default async function ToolFallback(props: PageProps<"/tools/[slug]">) {
  const { slug } = await props.params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <ToolShell slug={slug}>
      <div className="panel flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Hammer className="h-7 w-7" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">This tool is on the way</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-fg-muted">
            {tool.name} is in the build queue. In the meantime, plenty of other
            tools are ready to use.
          </p>
        </div>
        <Link
          href="/tools"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition hover:bg-panel-raised"
        >
          <ArrowLeft className="h-4 w-4" /> Browse ready tools
        </Link>
      </div>
    </ToolShell>
  );
}
