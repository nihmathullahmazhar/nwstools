import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("compress-pdf");

export default function Page() {
  return (
    <ToolShell slug="compress-pdf">
      <Client />
    </ToolShell>
  );
}
