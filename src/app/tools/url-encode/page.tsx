import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("url-encode");

export default function Page() {
  return (
    <ToolShell slug="url-encode">
      <Client />
    </ToolShell>
  );
}
