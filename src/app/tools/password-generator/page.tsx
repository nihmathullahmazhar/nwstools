import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("password-generator");

export default function Page() {
  return (
    <ToolShell slug="password-generator">
      <Client />
    </ToolShell>
  );
}
