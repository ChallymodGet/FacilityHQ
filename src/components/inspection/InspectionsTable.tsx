import Link from "next/link";
import { FACILITY_NAMES } from "@/lib/checklist";
import { formatLongDate } from "@/lib/format";
import { overallScore, overallStatus } from "@/lib/scoring";
import type { Inspection } from "@/lib/types";
import { StatusBadge, scoreColor } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

interface Props {
  inspections: Inspection[];
  emptyMessage?: string;
  /** compact = dashboard "Recent Inspections" widget */
  compact?: boolean;
}

export function InspectionsTable({ inspections, emptyMessage = "No inspections yet.", compact }: Props) {
  if (!inspections.length) {
    return <p className="px-4 py-10 text-center text-p-sm text-caption">{emptyMessage}</p>;
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px] text-left text-p-sm">
          <thead>
            <tr className="bg-neutral-300 text-heading">
              <th className="px-4 py-4 font-semibold">Inspection ID</th>
              <th className="px-4 py-4 font-semibold">Facility</th>
              <th className="px-4 py-4 font-semibold">Evaluator</th>
              <th className="px-4 py-4 font-semibold">Date</th>
              <th className="px-4 py-4 font-semibold">Score</th>
              <th className="px-4 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((i) => {
              const score = overallScore(i);
              const status = overallStatus(i);
              return (
                <tr
                  key={i.id}
                  className={cn(
                    "border-t border-line hover:bg-neutral-200 transition-colors",
                    compact ? "h-[80px]" : "h-14",
                  )}
                >
                  <td className="px-4 py-3 font-semibold text-heading whitespace-nowrap">
                    <Link
                      href={`/inspections/${i.id}${i.status === "draft" ? "/checklist" : ""}`}
                      className="hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-primary-500 rounded-xs"
                    >
                      {i.id}
                    </Link>
                  </td>
                  <td className={cn("px-4 py-3 text-body", compact && "max-w-[130px]")}>
                    {FACILITY_NAMES[i.facility]}
                  </td>
                  <td className="px-4 py-3 text-body whitespace-nowrap">{i.evaluator}</td>
                  <td className="px-4 py-3 text-body whitespace-nowrap">{formatLongDate(i.inspectionDate)}</td>
                  <td className={cn("px-4 py-3 font-medium whitespace-nowrap", scoreColor(status))}>
                    {i.status === "draft" ? "—" : `${score}%`}
                  </td>
                  <td className="px-4 py-3">
                    {i.status === "draft" ? (
                      <span className="inline-flex h-6 items-center rounded-xs border border-line bg-neutral-200 px-2 text-p-xs font-medium text-caption">
                        Draft
                      </span>
                    ) : (
                      <StatusBadge status={status} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden divide-y divide-line">
        {inspections.map((i) => {
          const score = overallScore(i);
          const status = overallStatus(i);
          return (
            <li key={i.id}>
              <Link
                href={`/inspections/${i.id}${i.status === "draft" ? "/checklist" : ""}`}
                className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-neutral-200 active:bg-neutral-300"
              >
                <div className="min-w-0">
                  <div className="text-p-sm font-semibold text-heading">{i.id}</div>
                  <div className="mt-0.5 text-p-sm text-body">{FACILITY_NAMES[i.facility]}</div>
                  <div className="mt-1 text-p-xs text-caption">
                    {i.evaluator} · {formatLongDate(i.inspectionDate)}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className={cn("text-p-sm font-semibold", scoreColor(status))}>
                    {i.status === "draft" ? "—" : `${score}%`}
                  </span>
                  {i.status === "draft" ? (
                    <span className="inline-flex h-6 items-center rounded-xs border border-line bg-neutral-200 px-2 text-p-xs font-medium text-caption">
                      Draft
                    </span>
                  ) : (
                    <StatusBadge status={status} />
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
