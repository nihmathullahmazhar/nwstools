import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("add-text-to-image");

export default function Page() {
  return (
    <ToolShell slug="add-text-to-image">
      <Client />
    </ToolShell>
  );
}
