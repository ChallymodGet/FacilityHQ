import { FLAGGED_RATINGS, overallScore, overallStatus, issuesFlagged } from "./scoring";
import { parseISODate, toISODate } from "./format";
import type { ComplianceStatus, Inspection, Rating } from "./types";

export function submitted(inspections: Inspection[]): Inspection[] {
  return inspections
    .filter((i) => i.status === "submitted")
    .sort((a, b) => (a.inspectionDate < b.inspectionDate ? 1 : a.inspectionDate > b.inspectionDate ? -1 : 0));
}

export function averageScore(list: Inspection[]): number {
  if (!list.length) return 0;
  return Math.round(list.reduce((s, i) => s + overallScore(i), 0) / list.length);
}

export function countByStatus(list: Inspection[]): Record<ComplianceStatus, number> {
  const out: Record<ComplianceStatus, number> = { Compliant: 0, Partial: 0, "Non-Compliant": 0 };
  for (const i of list) out[overallStatus(i)] += 1;
  return out;
}

/** Item-level "gaps by severity": how each rated item sits on the compliance scale. */
export function itemRiskDistribution(list: Inspection[]): Record<ComplianceStatus, number> {
  const out: Record<ComplianceStatus, number> = { Compliant: 0, Partial: 0, "Non-Compliant": 0 };
  const partial: Rating[] = ["Fair", "Inconsistent"];
  for (const i of list) {
    for (const r of Object.values(i.responses)) {
      if (!r.rating) continue;
      if (!FLAGGED_RATINGS.includes(r.rating)) out.Compliant += 1;
      else if (partial.includes(r.rating)) out.Partial += 1;
      else out["Non-Compliant"] += 1;
    }
  }
  return out;
}

export function totalFlaggedItems(list: Inspection[]): number {
  return list.reduce((n, i) => n + issuesFlagged(i), 0);
}

export interface TrendPoint {
  date: string;
  inspections: number;
  avgScore: number | null;
}

/** Last 7 days ending on the most recent inspection date (or today if later). */
export function trendLast7Days(list: Inspection[], today: string): TrendPoint[] {
  const latest = list.reduce((m, i) => (i.inspectionDate > m ? i.inspectionDate : m), "");
  const anchor = parseISODate(latest && latest > today ? latest : latest || today);
  const points: TrendPoint[] = [];
  for (let d = 6; d >= 0; d -= 1) {
    const day = new Date(anchor);
    day.setDate(anchor.getDate() - d);
    const iso = toISODate(day);
    const dayList = list.filter((i) => i.inspectionDate === iso);
    points.push({
      date: iso,
      inspections: dayList.length,
      avgScore: dayList.length ? averageScore(dayList) : null,
    });
  }
  return points;
}
