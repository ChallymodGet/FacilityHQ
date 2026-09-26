import { cn } from "@/lib/cn";

interface Props {
  /** 0–100 */
  value: number;
  className?: string;
  barClassName?: string;
  trackClassName?: string;
  height?: "xs" | "sm" | "md";
  label?: string;
}

const H = { xs: "h-1", sm: "h-1.5", md: "h-2" };

export function ProgressBar({
  value,
  className,
  barClassName = "bg-primary-500",
  trackClassName = "bg-neutral-400",
  height = "sm",
  label,
}: Props) {
  const v = Math.max(0, Math.min(100, value));
  // Default to full width unless the caller supplies an explicit width utility.
  const hasWidth = /(^|\s)(sm:|md:|lg:|xl:)?w-/.test(className ?? "");
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        !hasWidth && "w-full",
        "overflow-hidden rounded-full",
        H[height],
        trackClassName,
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-300", barClassName)}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
