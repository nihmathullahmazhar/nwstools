import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("pdf-header-footer");

export default function Page() {
  return (
    <ToolShell slug="pdf-header-footer">
      <Client />
    </ToolShell>
  );
}
