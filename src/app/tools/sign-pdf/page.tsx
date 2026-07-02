import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("sign-pdf");

export default function Page() {
  return (
    <ToolShell slug="sign-pdf">
      <Client />
    </ToolShell>
  );
}
