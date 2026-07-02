import type { Metadata } from "next";
import { ToolsExplorer } from "@/components/tools-explorer";
import { TOTAL_TOOL_COUNT } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "All tools",
  description: `Browse and search all ${TOTAL_TOOL_COUNT}+ private, in-browser tools.`,
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        All tools
      </h1>
      <p className="mt-1 text-fg-muted">
        {TOTAL_TOOL_COUNT}+ tools that run entirely on your device.
      </p>
      <div className="mt-6">
        <ToolsExplorer />
      </div>
    </div>
  );
}
