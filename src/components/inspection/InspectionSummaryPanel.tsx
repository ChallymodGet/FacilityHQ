"use client";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TOTAL_ITEMS } from "@/lib/checklist";
import { overallScore, overallStatus, ratedCount, sectionScores } from "@/lib/scoring";
import type { Inspection } from "@/lib/types";
import { scoreColor } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

interface Props {
  inspection: Inspection;
}

export function InspectionSummaryPanel({ inspection }: Props) {
  const done = ratedCount(inspection);
  const left = TOTAL_ITEMS - done;
  const score = overallScore(inspection);
  const sections = sectionScores(inspection);

  return (
    <Card>
      <div className="border-b border-line px-4 py-3">
        <h2 className="text-p font-semibold text-heading">Inspection Summary</h2>
      </div>
      <div className="p-4">
        <div className="text-center">
          <div
            className={cn(
              "text-h3 font-semibold leading-[42px]",
              done ? scoreColor(overallStatus(inspection)) : "text-heading",
            )}
          >
            {done ? `${score}%` : "—"}
          </div>
          <div className="mt-1 text-p-sm text-caption">Compliance Score</div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["Total", TOTAL_ITEMS],
            ["Done", done],
            ["Left", left],
          ].map(([label, value]) => (
            <div key={label} className="rounded-sm bg-neutral-300 px-2 py-2 text-center">
              <dd className="text-p-sm font-semibold text-heading">{value}</dd>
              <dt className="text-p-xs text-caption">{label}</dt>
            </div>
          ))}
        </dl>

        <ul className="mt-4 flex flex-col gap-3">
          {sections.map((s) => (
            <li key={s.section.key}>
              <a
                href={`#section-${s.section.key}`}
                className="flex items-center justify-between gap-2 text-p-xs hover:text-primary-600"
              >
                <span className="truncate text-body">{s.section.shortName}</span>
                <span className="shrink-0 font-medium text-heading">
                  {s.rated}/{s.total}
                </span>
              </a>
              <ProgressBar
                value={(s.rated / s.total) * 100}
                height="xs"
                className="mt-1.5"
                barClassName={s.rated === s.total ? "bg-success-700" : "bg-primary-500"}
                label={`${s.section.shortName} progress`}
              />
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
