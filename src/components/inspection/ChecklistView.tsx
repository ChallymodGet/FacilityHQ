"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, TextInput, Textarea } from "@/components/ui/Field";
import { ChecklistHeader } from "./ChecklistHeader";
import { ChecklistSection } from "./ChecklistSection";
import { InspectionSummaryPanel } from "./InspectionSummaryPanel";
import { InspectionNotFound, LoadingCard } from "./States";
import { CHECKLIST_SECTIONS } from "@/lib/checklist";
import { overallScore, ratedCount, sectionScores } from "@/lib/scoring";
import { useInspections } from "@/lib/store";
import type { Rating } from "@/lib/types";

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
      <ChecklistHeader
        inspection={inspection}
        sections={sections}
        done={done}
        score={done ? overallScore(inspection) : null}
      />

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
          <div className="sticky" style={{ top: "calc(80px + var(--checklist-header-h, 0px) + 24px)" }}>
            <InspectionSummaryPanel inspection={inspection} />
          </div>
        </aside>
      </div>

      {/* Mobile sticky actions */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface p-3 pb-[max(env(safe-area-inset-bottom),12px)] no-print">
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
