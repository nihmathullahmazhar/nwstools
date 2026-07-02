import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-panel-raised text-fg-muted">
        <WifiOff className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">You&apos;re offline</h1>
      <p className="mt-2 text-fg-muted">
        This page hasn&apos;t been opened yet, so it isn&apos;t cached. Any tool you&apos;ve
        already visited still works completely offline.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg transition hover:brightness-110"
      >
        Go to homepage
      </Link>
    </div>
  );
}
