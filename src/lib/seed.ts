import { CHECKLIST_SECTIONS, RATINGS } from "./checklist";
import type { FacilityKey, Inspection, ItemResponse, Rating } from "./types";

/** Small deterministic PRNG so seeded data is identical on server and client. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build a full set of responses whose weighted average lands near `target`.
 * quality: 0..1 — higher means more Excellent/Good picks.
 */
function buildResponses(seed: number, quality: number): Record<string, ItemResponse> {
  const rand = mulberry32(seed);
  const responses: Record<string, ItemResponse> = {};
  for (const section of CHECKLIST_SECTIONS) {
    for (const item of section.items) {
      const roll = rand();
      const rest = 1 - quality;
      let rating: Rating;
      if (roll < quality) rating = "Excellent";
      else if (roll < quality + rest * 0.3) rating = "Good";
      else if (roll < quality + rest * 0.55) rating = "Fair";
      else if (roll < quality + rest * 0.75) rating = "Poor";
      else if (roll < quality + rest * 0.9) rating = "Deficient";
      else rating = "Inconsistent";
      responses[item.id] = { rating };
    }
  }
  return responses;
}

interface SeedSpec {
  id: string;
  facility: FacilityKey;
  evaluator: string;
  date: string;
  quality: number;
  location?: string;
  generalComment?: string;
}

const SPECS: SeedSpec[] = [
  { id: "INS-2025-0052", facility: "admin", evaluator: "J. Adeyemi", date: "2025-09-13", quality: 0.85 },
  { id: "INS-2025-0051", facility: "warehouse", evaluator: "M. Okafor", date: "2025-09-13", quality: 0.4 },
  { id: "INS-2025-0050", facility: "truck", evaluator: "F. Bello", date: "2025-09-12", quality: 0.0 },
  { id: "INS-2025-0049", facility: "security", evaluator: "J. Adeyemi", date: "2025-09-12", quality: 0.75 },
  { id: "INS-2025-0048", facility: "admin", evaluator: "H. Akinola", date: "2025-09-11", quality: 0.6, generalComment: "Outstanding housekeeping." },
  { id: "INS-2025-0047", facility: "warehouse", evaluator: "F. Bello", date: "2025-09-11", quality: 0.25 },
  { id: "INS-2025-0046", facility: "security", evaluator: "M. Okafor", date: "2025-09-10", quality: 0.7 },
  { id: "INS-2025-0045", facility: "admin", evaluator: "J. Adeyemi", date: "2025-09-09", quality: 0.9 },
  { id: "INS-2025-0044", facility: "truck", evaluator: "H. Akinola", date: "2025-09-08", quality: 0.1 },
  { id: "INS-2025-0043", facility: "warehouse", evaluator: "J. Adeyemi", date: "2025-09-07", quality: 0.55 },
];

export function seedInspections(): Inspection[] {
  return SPECS.map((spec, i) => ({
    id: spec.id,
    facility: spec.facility,
    location: spec.location ?? "Olufoam Warehouse",
    department: "HSE",
    evaluator: spec.evaluator,
    inspectionDate: spec.date,
    status: "submitted",
    responses: buildResponses(1000 + i, spec.quality),
    generalComment: spec.generalComment ?? "",
    signature: spec.evaluator,
    dateCompleted: spec.date,
    createdAt: `${spec.date}T08:00:00.000Z`,
    submittedAt: `${spec.date}T10:30:00.000Z`,
  }));
}

export { RATINGS };
