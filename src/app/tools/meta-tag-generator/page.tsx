import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("meta-tag-generator");

export default function Page() {
  return (
    <ToolShell slug="meta-tag-generator">
      <Client />
    </ToolShell>
  );
}
