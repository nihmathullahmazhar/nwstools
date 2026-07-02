import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Badge, Category, Tool } from "@/lib/tools/registry";
import { ToolName } from "@/components/tool-name";
import { cn } from "@/lib/utils";

const BADGE_STYLE: Record<Badge, string> = {
  popular: "bg-accent-soft text-accent",
  new: "bg-success/12 text-success",
  essential: "bg-warning/12 text-warning",
};

function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        BADGE_STYLE[badge],
      )}
    >
      {badge}
    </span>
  );
}

export function ToolCard({
  tool,
  category,
}: {
  tool: Tool;
  category: Category;
}) {
  const Icon = category.icon;
  const body = (
    <>
      <div className="flex items-start justify-between">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{
            backgroundColor: `hsl(${category.accent} / 0.12)`,
            color: `hsl(${category.accent})`,
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        {tool.badge ? (
          <BadgeChip badge={tool.badge} />
        ) : tool.ready ? (
          <ArrowUpRight className="h-4 w-4 text-fg-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        ) : (
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-fg-faint">
            soon
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-fg">
          <ToolName name={tool.name} />
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{tool.tagline}</p>
      </div>
    </>
  );

  const className = cn(
    "group panel flex flex-col p-5 transition-all",
    tool.ready
      ? "hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg hover:shadow-black/5"
      : "opacity-70",
  );

  if (!tool.ready) {
    return <div className={className}>{body}</div>;
  }

  return (
    <Link href={`/tools/${tool.slug}`} className={className}>
      {body}
    </Link>
  );
}
