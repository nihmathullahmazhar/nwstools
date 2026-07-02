import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("business-name-generator");

export default function Page() {
  return (
    <ToolShell slug="business-name-generator">
      <Client />
    </ToolShell>
  );
}
