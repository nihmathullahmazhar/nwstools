import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-accent">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-fg-muted">
        That page doesn&apos;t exist — but there are plenty of tools that do.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/tools"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg transition hover:brightness-110"
        >
          Browse all tools <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium transition hover:bg-panel-raised"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
