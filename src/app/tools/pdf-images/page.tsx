import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("pdf-images");

export default function Page() {
  return (
    <ToolShell slug="pdf-images">
      <Client />
    </ToolShell>
  );
}
