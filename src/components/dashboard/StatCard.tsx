import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type Tone = "primary" | "information" | "success" | "error";

const TONE: Record<Tone, string> = {
  primary: "bg-primary-100 border-primary-300 text-primary-600",
  information: "bg-information-200 border-information-300 text-information-700",
  success: "bg-success-200 border-success-300 text-success-800",
  error: "bg-error-200 border-error-300 text-error-700",
};

interface Props {
  title: string;
  value: ReactNode;
  caption: string;
  icon: ReactNode;
  tone: Tone;
}

export function StatCard({ title, value, caption, icon, tone }: Props) {
  return (
    <Card className="flex h-full flex-col justify-between p-3 sm:p-4 min-h-[120px] sm:min-h-[144px]">
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span className="text-p-xs sm:text-p-sm font-medium text-heading leading-4 sm:leading-5">{title}</span>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-sm border",
            TONE[tone],
          )}
          aria-hidden
        >
          {icon}
        </span>
      </div>
      <div>
        <div className="text-h4 sm:text-h3 font-light text-caption leading-none">{value}</div>
        <div className="mt-2 text-p-xs text-caption">{caption}</div>
      </div>
    </Card>
  );
}
