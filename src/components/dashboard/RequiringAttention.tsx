import Link from "next/link";
import { FACILITY_NAMES } from "@/lib/checklist";
import { formatLongDate } from "@/lib/format";
import { issuesFlagged, overallScore, overallStatus } from "@/lib/scoring";
import type { Inspection } from "@/lib/types";
import { StatusBadge, scoreColor } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

interface Props {
  inspections: Inspection[];
}

export function RequiringAttention({ inspections }: Props) {
  if (!inspections.length) {
    return (
      <p className="px-4 py-8 text-center text-p-sm text-caption">
        All facilities are above the compliance threshold.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-3 p-3">
      {inspections.map((i) => {
        const status = overallStatus(i);
        const score = overallScore(i);
        return (
          <li key={i.id}>
            <Link
              href={`/inspections/${i.id}`}
              className={cn(
                "block rounded-sm border p-3 transition-colors",
                status === "Non-Compliant"
                  ? "border-error-300 bg-error-200/60 hover:bg-error-200"
                  : "border-warning-400 bg-warning-200 hover:bg-warning-300/70",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-p-xs font-semibold text-heading leading-4">
                  {FACILITY_NAMES[i.facility]}
                </span>
                <span className={cn("text-p-xs font-semibold", scoreColor(status))}>{score}%</span>
              </div>
              <div className="mt-1.5 text-[11px] text-caption">
                Last: {formatLongDate(i.inspectionDate)} · {i.evaluator}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className={cn("text-p-xs font-semibold", scoreColor(status))}>
                  {issuesFlagged(i)} issues flagged
                </span>
                <StatusBadge status={status} />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
