import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("morse-code");

export default function Page() {
  return (
    <ToolShell slug="morse-code">
      <Client />
    </ToolShell>
  );
}
