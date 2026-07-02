import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("metadata-remover");

export default function Page() {
  return (
    <ToolShell slug="metadata-remover">
      <Client />
    </ToolShell>
  );
}
