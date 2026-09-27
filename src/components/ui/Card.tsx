import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-surface border border-line rounded-md", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  /** draw the bottom divider (default true) */
  divider?: boolean;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
  divider = true,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-4 py-3",
        divider && "border-b border-line",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="text-p font-semibold text-heading leading-5">{title}</h3>
        {subtitle ? (
          <p className="text-p-xs text-caption mt-1 leading-4">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
