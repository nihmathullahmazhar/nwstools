import { ToolShell } from "@/components/tool-shell";
import { toolMetadata } from "@/lib/tools/metadata";
import { CaseConverter } from "./case-converter";

export const metadata = toolMetadata("case-converter");

export default function Page() {
  return (
    <ToolShell slug="case-converter">
      <CaseConverter />
    </ToolShell>
  );
}
