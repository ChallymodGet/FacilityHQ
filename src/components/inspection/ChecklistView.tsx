"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { useCallback, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, TextInput, Textarea } from "@/components/ui/Field";
import { ChecklistSection } from "./ChecklistSection";
import { InspectionSummaryPanel } from "./InspectionSummaryPanel";
import { InspectionNotFound, LoadingCard } from "./States";
import { CHECKLIST_SECTIONS, FACILITY_NAMES, TOTAL_ITEMS } from "@/lib/checklist";
import { overallScore, ratedCount, sectionScores } from "@/lib/scoring";
import { useInspections } from "@/lib/store";
import type { Rating } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  id: string;
}

export function ChecklistView({ id }: Props) {
  const router = useRouter();
  const { hydrated, getInspection, setRating, setItemComment, updateInspection } = useInspections();
  const inspection = getInspection(id);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const onRate = useCallback(
    (itemId: string, rating: Rating | null) => setRating(id, itemId, rating),
    [id, setRating],
  );
  const onComment = useCallback(
    (itemId: string, comment: string) => setItemComment(id, itemId, comment),
    [id, setItemComment],
  );

  if (!hydrated) return <LoadingCard />;
  if (!inspection) return <InspectionNotFound id={id} />;

  const done = ratedCount(inspection);
  const sections = sectionScores(inspection);

  function saveDraft() {
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <Card className="p-4 sm:p-5">
        <PageHeader
          title="Facility Housekeeping Checklist"
          subtitle={
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-p-xs sm:text-p-sm">
              <li>
                <span className="text-caption">Facility: </span>
                <span className="font-medium text-heading">{FACILITY_NAMES[inspection.facility]}</span>
              </li>
              <li>
                <span className="text-caption">ID: </span>
                <span className="font-medium text-heading">{inspection.id}</span>
              </li>
              <li>
                <span className="text-caption">Inspector: </span>
                <span className="font-medium text-heading">{inspection.evaluator}</span>
              </li>
              <li>
                <span className="text-caption">Date: </span>
                <span className="font-medium text-heading">{inspection.inspectionDate}</span>
              </li>
              <li>
                <span className="text-caption">Location: </span>
                <span className="font-medium text-heading">{inspection.location}</span>
              </li>
            </ul>
          }
        />
        {/* Section tabs */}
        <nav aria-label="Checklist sections" className="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-thin">
          <ul className="flex gap-2 w-max">
            {sections.map((s, i) => {
              const complete = s.rated === s.total;
              return (
                <li key={s.section.key}>
                  <a
                    href={`#section-${s.section.key}`}
                    className={cn(
                      "inline-flex h-[30px] items-center gap-1.5 rounded-xs border px-3 text-p-xs font-medium whitespace-nowrap transition-colors",
                      complete
                        ? "border-success-300 bg-success-200 text-success-800"
                        : i === 0 && done === 0
                          ? "border-primary-500 bg-primary-100 text-primary-600"
                          : "border-line bg-white text-body hover:border-neutral-600",
                    )}
                  >
                    {complete ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                    {s.section.shortName}
                    <span className="text-caption">
                      {s.rated}/{s.total}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Card>

      {/* Mobile compact summary */}
      <div className="xl:hidden sticky top-16 sm:top-20 z-10 -mx-4 sm:-mx-6 border-y border-line bg-white/95 backdrop-blur px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3 text-p-xs">
          <span className="text-caption">
            <span className="font-semibold text-heading">{done}</span> of {TOTAL_ITEMS} rated
          </span>
          <span className="text-caption">
            Score:{" "}
            <span className="font-semibold text-heading">{done ? `${overallScore(inspection)}%` : "—"}</span>
          </span>
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-neutral-400">
          <div
            className="h-full rounded-full bg-primary-500 transition-[width]"
            style={{ width: `${(done / TOTAL_ITEMS) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,800fr)_280px]">
        <div className="flex flex-col gap-6">
          {CHECKLIST_SECTIONS.map((section) => (
            <ChecklistSection
              key={section.key}
              section={section}
              inspection={inspection}
              onRate={onRate}
              onComment={onComment}
            />
          ))}

          {/* Completion details */}
          <Card className="p-4 sm:p-5">
            <h2 className="text-p font-semibold text-heading">Completion Details</h2>
            <div className="mt-4 flex flex-col gap-4">
              <Field label="General Comment" htmlFor="generalComment">
                <Textarea
                  id="generalComment"
                  value={inspection.generalComment}
                  onChange={(e) => updateInspection(id, { generalComment: e.target.value })}
                  placeholder="Provide an overall summary of the inspection findings…"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Evaluator Signature" htmlFor="signature">
                  <TextInput
                    id="signature"
                    value={inspection.signature}
                    onChange={(e) => updateInspection(id, { signature: e.target.value })}
                    placeholder="Type your full name"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Date Completed" htmlFor="dateCompleted">
                  <TextInput
                    id="dateCompleted"
                    type="date"
                    value={inspection.dateCompleted}
                    onChange={(e) => updateInspection(id, { dateCompleted: e.target.value })}
                    placeholder="MM/DD/YYYY"
                  />
                </Field>
              </div>
            </div>
          </Card>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" onClick={saveDraft} className="min-w-[157px]">
                Save Draft
              </Button>
              {savedAt ? <span className="text-p-xs text-success-800">Draft saved {savedAt}</span> : null}
            </div>
            <Button
              size="lg"
              className="min-w-[298px]"
              trailingIcon={<ArrowRight className="size-5" />}
              onClick={() => router.push(`/inspections/${id}/results`)}
            >
              Review Results
            </Button>
          </div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <InspectionSummaryPanel inspection={inspection} />
          </div>
        </aside>
      </div>

      {/* Mobile sticky actions */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white p-3 pb-[max(env(safe-area-inset-bottom),12px)] no-print">
        <div className="mx-auto flex max-w-[1104px] items-center gap-3">
          <Button variant="outline" size="md" onClick={saveDraft} className="flex-1">
            {savedAt ? "Saved" : "Save Draft"}
          </Button>
          <Button
            size="md"
            className="flex-[2]"
            trailingIcon={<ArrowRight className="size-4" />}
            onClick={() => router.push(`/inspections/${id}/results`)}
          >
            Review Results
          </Button>
        </div>
      </div>
    </div>
  );
}
