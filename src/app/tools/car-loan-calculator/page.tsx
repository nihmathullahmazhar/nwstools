import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("car-loan-calculator");

export default function Page() {
  return (
    <ToolShell slug="car-loan-calculator">
      <Client />
    </ToolShell>
  );
}
