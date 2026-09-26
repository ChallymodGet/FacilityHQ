export type FacilityKey = "admin" | "truck" | "security" | "warehouse";

export type Rating =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Poor"
  | "Deficient"
  | "Inconsistent";

export type ComplianceStatus = "Compliant" | "Partial" | "Non-Compliant";

export type InspectionStatus = "draft" | "submitted";

export interface ChecklistItemDef {
  id: string;
  label: string;
}

export interface ChecklistSectionDef {
  key: FacilityKey;
  name: string;
  shortName: string;
  description: string;
  items: ChecklistItemDef[];
}

export interface ItemResponse {
  rating: Rating | null;
  comment?: string;
}

export interface Inspection {
  id: string;
  /** Primary facility chosen on the New Inspection screen */
  facility: FacilityKey;
  location: string;
  department: string;
  evaluator: string;
  /** ISO date (yyyy-mm-dd) */
  inspectionDate: string;
  status: InspectionStatus;
  responses: Record<string, ItemResponse>;
  generalComment: string;
  signature: string;
  /** ISO date (yyyy-mm-dd) */
  dateCompleted: string;
  createdAt: string;
  submittedAt?: string;
}
