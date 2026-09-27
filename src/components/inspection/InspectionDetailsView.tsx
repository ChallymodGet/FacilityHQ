"use client";

import { useRouter } from "next/navigation";
import { Check, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge, barColor, scoreColor } from "@/components/ui/StatusBadge";
import { MetaStrip } from "./MetaStrip";
import { InspectionNotFound, LoadingCard } from "./States";
import { FACILITY_NAMES } from "@/lib/checklist";
import { isComplete, overallScore, overallStatus, sectionScores, statusForScore } from "@/lib/scoring";
import { useInspections } from "@/lib/store";
import { cn } from "@/lib/cn";

interface Props {
  id: string;
}

export function InspectionDetailsView({ id }: Props) {
  const router = useRouter();
  const { hydrated, getInspection, submitInspection } = useInspections();
  const inspection = getInspection(id);

  if (!hydrated) return <LoadingCard />;
  if (!inspection) return <InspectionNotFound id={id} />;

  const score = overallScore(inspection);
  const status = overallStatus(inspection);
  const breakdown = sectionScores(inspection);
  const submitted = inspection.status === "submitted";
  const canSubmit = !submitted && isComplete(inspection);

  function onSubmit() {
    submitInspection(id);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inspection Details"
        subtitle={inspection.id}
        action={
          <div className="flex w-full gap-3 sm:w-auto no-print">
            <Button
              variant="outline"
              leadingIcon={<Download className="size-4" />}
              onClick={() => window.print()}
              className="flex-1 sm:flex-none sm:min-w-[104px]"
            >
              Save PDF
            </Button>
            <Button
              onClick={submitted ? undefined : canSubmit ? onSubmit : () => router.push(`/inspections/${id}/checklist`)}
              disabled={submitted}
              className="flex-1 sm:flex-none sm:min-w-[162px]"
            >
              {submitted ? "Inspection Submitted" : canSubmit ? "Submit Inspection" : "Continue Checklist"}
            </Button>
          </div>
        }
      />

      <Card className="p-4 sm:p-5">
        <MetaStrip
          items={[
            { label: "Facility", value: FACILITY_NAMES[inspection.facility] },
            { label: "Evaluator", value: inspection.evaluator },
            { label: "Inspection Date", value: inspection.inspectionDate },
            { label: "Location", value: inspection.location },
          ]}
          trailing={
            <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1.5">
              <span className={cn("text-h4 font-bold leading-10", scoreColor(status))}>{score}%</span>
              <StatusBadge status={status} />
            </div>
          }
        />
      </Card>

      <Card className="p-4 sm:p-5">
        <h2 className="text-p-lg font-semibold text-heading">Inspection Breakdown</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {breakdown.map((b) => {
            const s = statusForScore(b.score);
            return (
              <li key={b.section.key}>
                <div className="flex items-center justify-between gap-3 text-p-xs">
                  <span className="font-medium text-heading">{b.section.name}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-caption">{b.total} items</span>
                    <span className={cn("text-p-sm font-semibold", scoreColor(s))}>{b.score}%</span>
                  </span>
                </div>
                <ProgressBar
                  value={b.score}
                  height="sm"
                  className="mt-1.5"
                  barClassName={barColor(s)}
                  label={`${b.section.shortName} score`}
                />
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="p-4 sm:p-5">
        <h2 className="text-p-lg font-semibold text-heading">General Comment</h2>
        <div className="mt-3 rounded-sm bg-neutral-300 px-3 py-3 text-p-xs sm:text-p-sm text-body">
          {inspection.generalComment.trim() || "No general comment recorded."}
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <h2 className="text-p-lg font-semibold text-heading">Evaluator Signature</h2>
        <div className="mt-3 flex flex-col gap-3 rounded-sm bg-neutral-300 p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-p-xs sm:text-p-sm text-body">
            {inspection.signature.trim() || inspection.evaluator}
          </span>
          {submitted ? (
            <span className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-primary-500 px-4 text-p-sm font-medium text-white">
              <Check className="size-4" strokeWidth={2.5} />
              Inspection Submitted
            </span>
          ) : (
            <span className="inline-flex h-10 items-center justify-center rounded-sm border border-line bg-surface px-4 text-p-sm font-medium text-caption">
              Draft — not yet submitted
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
