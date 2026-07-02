import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("pdf-to-text");

export default function Page() {
  return (
    <ToolShell slug="pdf-to-text">
      <Client />
    </ToolShell>
  );
}
