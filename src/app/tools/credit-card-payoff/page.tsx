import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("credit-card-payoff");

export default function Page() {
  return (
    <ToolShell slug="credit-card-payoff">
      <Client />
    </ToolShell>
  );
}
