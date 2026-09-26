import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface MetaItem {
  label: string;
  value: ReactNode;
}

interface Props {
  items: MetaItem[];
  className?: string;
  trailing?: ReactNode;
}

export function MetaStrip({ items, className, trailing }: Props) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">
        {items.map((it) => (
          <div key={it.label} className="min-w-0">
            <dt className="text-p-xs text-caption">{it.label}</dt>
            <dd className="mt-0.5 text-p-sm font-medium text-heading">{it.value}</dd>
          </div>
        ))}
      </dl>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
