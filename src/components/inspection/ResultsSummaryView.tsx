"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge, barColor, scoreColor } from "@/components/ui/StatusBadge";
import { RATING_TONE } from "@/components/ui/RatingChip";
import { ComplianceGauge } from "./ComplianceGauge";
import { MetaStrip } from "./MetaStrip";
import { InspectionNotFound, LoadingCard } from "./States";
import { FACILITY_NAMES, TOTAL_ITEMS } from "@/lib/checklist";
import {
  isComplete,
  overallScore,
  overallStatus,
  ratedCount,
  ratingDistribution,
  sectionScores,
  statusForScore,
} from "@/lib/scoring";
import { useInspections } from "@/lib/store";
import { cn } from "@/lib/cn";

interface Props {
  id: string;
}

export function ResultsSummaryView({ id }: Props) {
  const router = useRouter();
  const { hydrated, getInspection, submitInspection } = useInspections();
  const inspection = getInspection(id);

  if (!hydrated) return <LoadingCard />;
  if (!inspection) return <InspectionNotFound id={id} />;

  const done = ratedCount(inspection);
  const score = overallScore(inspection);
  const status = overallStatus(inspection);
  const distribution = ratingDistribution(inspection);
  const categories = sectionScores(inspection);
  const complete = isComplete(inspection);
  const alreadySubmitted = inspection.status === "submitted";

  function onSubmit() {
    submitInspection(id);
    router.push(`/inspections/${id}`);
  }

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <PageHeader title="Results Summary" subtitle="Review inspection outcome before final submission" />

      <Card className="p-4">
        <MetaStrip
          items={[
            { label: "Inspection ID", value: inspection.id },
            { label: "Facility", value: FACILITY_NAMES[inspection.facility] },
            { label: "Evaluator", value: inspection.evaluator },
            { label: "Inspection Date", value: inspection.inspectionDate },
            { label: "Department", value: inspection.department },
            { label: "Location", value: inspection.location },
          ]}
        />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,204fr)_minmax(0,564fr)]">
        <Card className="flex flex-col items-center p-5 text-center">
          <h2 className="text-p-lg font-semibold text-heading">Overall Compliance</h2>
          <div className="mt-4">
            <ComplianceGauge score={score} status={status} size={140} />
          </div>
          <StatusBadge status={status} size="md" className="mt-4" />
          <p className="mt-3 text-p-xs text-caption">
            {done} of {TOTAL_ITEMS} items rated
          </p>
        </Card>

        <Card className="p-4 sm:p-5">
          <h2 className="text-p-lg font-semibold text-heading">Rating Distribution</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {distribution.map((d) => (
              <li key={d.rating} className="grid grid-cols-[88px_minmax(0,1fr)_64px] items-center gap-3 text-p-xs">
                <span className={cn("text-right font-medium", RATING_TONE[d.rating].text)}>{d.rating}</span>
                <ProgressBar
                  value={d.pct}
                  height="md"
                  barClassName={RATING_TONE[d.rating].bar}
                  label={`${d.rating} share`}
                />
                <span className="text-caption">
                  <span className="font-semibold text-heading">{d.count}</span> ({d.pct}%)
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <h2 className="text-p-sm font-semibold text-heading">Category Performance</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {categories.map((c) => {
            const catStatus = statusForScore(c.score);
            return (
              <div key={c.section.key} className="rounded-sm border border-line bg-neutral-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-p-xs font-semibold text-heading">{c.section.name}</span>
                  <span className={cn("text-p-lg font-bold leading-6", scoreColor(catStatus))}>
                    {c.score}%
                  </span>
                </div>
                <ProgressBar
                  value={c.score}
                  height="sm"
                  className="mt-3"
                  barClassName={barColor(catStatus)}
                  label={`${c.section.shortName} score`}
                />
                <p className="mt-2 text-p-xs text-caption">
                  {c.rated} of {c.total} items rated
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {!complete && !alreadySubmitted ? (
        <p className="text-p-xs text-warning-800">
          {TOTAL_ITEMS - done} item{TOTAL_ITEMS - done === 1 ? "" : "s"} still need a rating before this inspection
          can be submitted.
        </p>
      ) : null}

      {/* Desktop actions */}
      <div className="hidden lg:flex items-center justify-between gap-4 pt-10 no-print">
        <Button
          variant="outline-primary"
          size="lg"
          leadingIcon={<ArrowLeft className="size-5" />}
          onClick={() => router.push(`/inspections/${id}/checklist`)}
          className="min-w-[154px]"
        >
          Back To Form
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            leadingIcon={<Download className="size-5" />}
            onClick={() => window.print()}
            className="min-w-[128px]"
          >
            Save PDF
          </Button>
          <Button size="lg" className="min-w-[180px]" onClick={onSubmit} disabled={!complete || alreadySubmitted}>
            {alreadySubmitted ? "Inspection Submitted" : "Submit Inspection"}
          </Button>
        </div>
      </div>

      {/* Mobile sticky actions */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface p-3 pb-[max(env(safe-area-inset-bottom),12px)] no-print">
        <div className="mx-auto flex max-w-[1104px] items-center gap-2">
          <Button
            variant="outline-primary"
            size="md"
            aria-label="Back to form"
            onClick={() => router.push(`/inspections/${id}/checklist`)}
            className="px-3"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="md"
            aria-label="Save PDF"
            onClick={() => window.print()}
            className="px-3"
          >
            <Download className="size-4" />
          </Button>
          <Button size="md" className="flex-1" onClick={onSubmit} disabled={!complete || alreadySubmitted}>
            {alreadySubmitted ? "Submitted" : "Submit Inspection"}
          </Button>
        </div>
      </div>
    </div>
  );
}
