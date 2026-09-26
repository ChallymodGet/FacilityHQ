"use client";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { ChecklistSectionDef, Inspection, Rating } from "@/lib/types";
import { ChecklistItemRow } from "./ChecklistItemRow";

interface Props {
  section: ChecklistSectionDef;
  inspection: Inspection;
  onRate: (itemId: string, rating: Rating | null) => void;
  onComment: (itemId: string, comment: string) => void;
}

export function ChecklistSection({ section, inspection, onRate, onComment }: Props) {
  const rated = section.items.filter((i) => inspection.responses[i.id]?.rating).length;
  const pct = (rated / section.items.length) * 100;

  return (
    <Card id={`section-${section.key}`} className="scroll-mt-40 overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        <div className="min-w-0 flex-1">
          <h2 className="text-p font-semibold text-heading leading-5">{section.name}</h2>
          <p className="mt-0.5 text-p-xs text-caption">
            {rated} of {section.items.length} items rated
          </p>
        </div>
        <ProgressBar
          value={pct}
          height="xs"
          className="w-16 sm:w-[120px] shrink-0"
          barClassName={pct === 100 ? "bg-success-700" : "bg-primary-500"}
          label={`${section.shortName} progress`}
        />
      </div>
      <ul>
        {section.items.map((item, idx) => (
          <ChecklistItemRow
            key={item.id}
            index={idx}
            item={item}
            response={inspection.responses[item.id]}
            onRate={onRate}
            onComment={onComment}
          />
        ))}
      </ul>
    </Card>
  );
}
