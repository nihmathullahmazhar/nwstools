import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import Client from "./client";

export const metadata = toolMetadata("habit-tracker");

export default function Page() {
  return (
    <ToolShell slug="habit-tracker">
      <Client />
    </ToolShell>
  );
}
