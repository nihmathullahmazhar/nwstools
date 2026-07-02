import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("watermark-pdf");

export default function Page() {
  return (
    <ToolShell slug="watermark-pdf">
      <Client />
    </ToolShell>
  );
}
