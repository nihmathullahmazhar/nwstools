import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("merge-video");

export default function Page() {
  return (
    <ToolShell slug="merge-video">
      <Client />
    </ToolShell>
  );
}
