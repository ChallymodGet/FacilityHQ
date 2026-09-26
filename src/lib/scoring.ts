import { CHECKLIST_SECTIONS, RATINGS, TOTAL_ITEMS } from "./checklist";
import type {
  ChecklistSectionDef,
  ComplianceStatus,
  Inspection,
  Rating,
} from "./types";

/**
 * Score contributed by each rating (as a percentage of a fully compliant item).
 * ASSUMPTION — the Figma file shows the rating scale but not the weights.
 * Adjust these values once confirmed with HSE.
 */
export const RATING_SCORE: Record<Rating, number> = {
  Excellent: 100,
  Good: 80,
  Fair: 65,
  Poor: 40,
  Deficient: 25,
  Inconsistent: 50,
};

/** Ratings from "Fair" downwards are treated as issues / flagged. */
export const FLAGGED_RATINGS: Rating[] = ["Fair", "Poor", "Deficient", "Inconsistent"];

export function isFlagged(rating: Rating | null | undefined): boolean {
  return !!rating && FLAGGED_RATINGS.includes(rating);
}

/**
 * Status thresholds (from sample data in the design: 82–91% Compliant,
 * 67–74% Partial, 56% Non-Compliant).
 */
export function statusForScore(score: number): ComplianceStatus {
  if (score >= 80) return "Compliant";
  if (score >= 60) return "Partial";
  return "Non-Compliant";
}

export interface SectionScore {
  section: ChecklistSectionDef;
  rated: number;
  total: number;
  /** Average score across rated items, 0 when nothing rated */
  score: number;
}

export function sectionScores(inspection: Inspection): SectionScore[] {
  return CHECKLIST_SECTIONS.map((section) => {
    let rated = 0;
    let sum = 0;
    for (const item of section.items) {
      const r = inspection.responses[item.id]?.rating;
      if (r) {
        rated += 1;
        sum += RATING_SCORE[r];
      }
    }
    return {
      section,
      rated,
      total: section.items.length,
      score: rated ? Math.round(sum / rated) : 0,
    };
  });
}

export function ratedCount(inspection: Inspection): number {
  return Object.values(inspection.responses).filter((r) => r.rating).length;
}

export function overallScore(inspection: Inspection): number {
  const rated = ratedCount(inspection);
  if (!rated) return 0;
  const sum = Object.values(inspection.responses).reduce(
    (acc, r) => acc + (r.rating ? RATING_SCORE[r.rating] : 0),
    0,
  );
  return Math.round(sum / rated);
}

export function overallStatus(inspection: Inspection): ComplianceStatus {
  return statusForScore(overallScore(inspection));
}

export function ratingDistribution(
  inspection: Inspection,
): { rating: Rating; count: number; pct: number }[] {
  const rated = ratedCount(inspection);
  return RATINGS.map((rating) => {
    const count = Object.values(inspection.responses).filter(
      (r) => r.rating === rating,
    ).length;
    return { rating, count, pct: rated ? Math.round((count / rated) * 100) : 0 };
  });
}

export function issuesFlagged(inspection: Inspection): number {
  return Object.values(inspection.responses).filter((r) => isFlagged(r.rating))
    .length;
}

export function isComplete(inspection: Inspection): boolean {
  return ratedCount(inspection) === TOTAL_ITEMS;
}
