import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("social-card-preview");

export default function Page() {
  return (
    <ToolShell slug="social-card-preview">
      <Client />
    </ToolShell>
  );
}
