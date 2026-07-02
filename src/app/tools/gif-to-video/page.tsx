import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("gif-to-video");

export default function Page() {
  return (
    <ToolShell slug="gif-to-video">
      <Client />
    </ToolShell>
  );
}
