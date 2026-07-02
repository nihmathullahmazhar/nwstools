import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("sitemap-generator");

export default function Page() {
  return (
    <ToolShell slug="sitemap-generator">
      <Client />
    </ToolShell>
  );
}
