import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("robots-txt-generator");

export default function Page() {
  return (
    <ToolShell slug="robots-txt-generator">
      <Client />
    </ToolShell>
  );
}
