import type { ComplianceStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const STYLE: Record<ComplianceStatus, { wrap: string; dot: string }> = {
  Compliant: {
    wrap: "bg-success-200 text-success-800 border-success-300",
    dot: "bg-success-700",
  },
  Partial: {
    wrap: "bg-warning-200 text-warning-800 border-warning-400",
    dot: "bg-warning-600",
  },
  "Non-Compliant": {
    wrap: "bg-error-200 text-error-800 border-error-300",
    dot: "bg-error-700",
  },
};

interface Props {
  status: ComplianceStatus;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className, size = "sm" }: Props) {
  const s = STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border font-medium whitespace-nowrap",
        size === "sm" ? "h-6 px-2 text-p-xs" : "h-7 px-2.5 text-p-sm",
        s.wrap,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {status}
    </span>
  );
}

export function scoreColor(status: ComplianceStatus): string {
  switch (status) {
    case "Compliant":
      return "text-success-700";
    case "Partial":
      return "text-warning-700";
    default:
      return "text-error-700";
  }
}

export function barColor(status: ComplianceStatus): string {
  switch (status) {
    case "Compliant":
      return "bg-success-700";
    case "Partial":
      return "bg-warning-600";
    default:
      return "bg-error-700";
  }
}
