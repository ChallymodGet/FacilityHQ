import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-h4 sm:text-h3 font-semibold text-heading tracking-tight">{title}</h1>
        {subtitle ? <div className="mt-1 text-p-sm text-caption">{subtitle}</div> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}
