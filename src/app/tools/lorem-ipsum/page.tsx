import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("lorem-ipsum");

export default function Page() {
  return (
    <ToolShell slug="lorem-ipsum">
      <Client />
    </ToolShell>
  );
}
