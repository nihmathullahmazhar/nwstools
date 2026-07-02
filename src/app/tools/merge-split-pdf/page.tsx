import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("merge-split-pdf");

export default function Page() {
  return (
    <ToolShell slug="merge-split-pdf">
      <Client />
    </ToolShell>
  );
}
