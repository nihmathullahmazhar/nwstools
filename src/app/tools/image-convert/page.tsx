import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("image-convert");

export default function Page() {
  return (
    <ToolShell slug="image-convert">
      <Client />
    </ToolShell>
  );
}
