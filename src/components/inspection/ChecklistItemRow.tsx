"use client";

import { RATINGS } from "@/lib/checklist";
import { isFlagged } from "@/lib/scoring";
import type { ChecklistItemDef, ItemResponse, Rating } from "@/lib/types";
import { RatingChip } from "@/components/ui/RatingChip";
import { Textarea } from "@/components/ui/Field";

interface Props {
  index: number;
  item: ChecklistItemDef;
  response: ItemResponse | undefined;
  onRate: (itemId: string, rating: Rating | null) => void;
  onComment: (itemId: string, comment: string) => void;
}

export function ChecklistItemRow({ index, item, response, onRate, onComment }: Props) {
  const rating = response?.rating ?? null;
  const flagged = isFlagged(rating);
  const number = String(index + 1).padStart(2, "0");

  return (
    <li className="border-t border-line px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex min-w-0 items-start gap-2 lg:w-[320px] lg:shrink-0">
          <span className="w-5 shrink-0 text-p-xs font-semibold text-caption leading-4 pt-px">{number}</span>
          <span className="text-p-xs sm:text-p-sm text-heading leading-4 sm:leading-5">{item.label}</span>
        </div>
        <div
          role="radiogroup"
          aria-label={`Rating for ${item.label}`}
          className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap lg:justify-end"
        >
          {RATINGS.map((r) => (
            <RatingChip
              key={r}
              rating={r}
              name={item.label}
              selected={rating === r}
              onSelect={(next) => onRate(item.id, next === rating ? null : next)}
            />
          ))}
        </div>
      </div>

      {flagged ? (
        <div className="mt-3 rounded-sm border border-warning-400 bg-warning-200 p-3 lg:ml-7">
          <label htmlFor={`comment-${item.id}`} className="text-p-xs font-medium text-heading">
            Comment <span className="font-normal text-caption">(what was observed / action needed)</span>
          </label>
          <Textarea
            id={`comment-${item.id}`}
            value={response?.comment ?? ""}
            onChange={(e) => onComment(item.id, e.target.value)}
            placeholder="Describe the issue found…"
            className="mt-2 min-h-20 bg-white"
          />
        </div>
      ) : null}
    </li>
  );
}
