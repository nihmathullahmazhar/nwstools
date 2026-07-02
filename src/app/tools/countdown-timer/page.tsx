import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("countdown-timer");

export default function Page() {
  return (
    <ToolShell slug="countdown-timer">
      <Client />
    </ToolShell>
  );
}
