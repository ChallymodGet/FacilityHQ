import type { Rating } from "@/lib/types";
import { cn } from "@/lib/cn";

/** Colour used for each rating in charts / distribution bars. */
export const RATING_TONE: Record<
  Rating,
  { text: string; bar: string; selected: string }
> = {
  Excellent: {
    text: "text-success-800",
    bar: "bg-success-700",
    selected: "bg-success-700 border-success-700 text-white",
  },
  Good: {
    text: "text-information-700",
    bar: "bg-information-700",
    selected: "bg-information-700 border-information-700 text-white",
  },
  Fair: {
    text: "text-warning-700",
    bar: "bg-warning-600",
    selected: "bg-warning-600 border-warning-600 text-white",
  },
  Poor: {
    text: "text-primary-600",
    bar: "bg-primary-500",
    selected: "bg-primary-500 border-primary-500 text-white",
  },
  Deficient: {
    text: "text-error-800",
    bar: "bg-error-700",
    selected: "bg-error-700 border-error-700 text-white",
  },
  Inconsistent: {
    text: "text-neutral-800",
    bar: "bg-neutral-700",
    selected: "bg-neutral-800 border-neutral-800 text-white",
  },
};

interface Props {
  rating: Rating;
  selected: boolean;
  onSelect: (rating: Rating) => void;
  name: string;
}

export function RatingChip({ rating, selected, onSelect, name }: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${name}: ${rating}`}
      onClick={() => onSelect(rating)}
      className={cn(
        "h-9 sm:h-8 shrink-0 rounded-xs border px-2 sm:px-2.5 text-p-xs font-medium transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500",
        selected
          ? RATING_TONE[rating].selected
          : "border-line bg-surface text-body hover:border-neutral-600 hover:bg-neutral-200",
      )}
    >
      {rating}
    </button>
  );
}
