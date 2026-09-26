import type { ChecklistSectionDef, FacilityKey, Rating } from "./types";

/**
 * Facility Housekeeping Checklist — 28 items across 4 sections,
 * as laid out in the Figma "Facility Housekeeping Checklist" screen.
 */
export const CHECKLIST_SECTIONS: ChecklistSectionDef[] = [
  {
    key: "admin",
    name: "Admin Building & Perimeter",
    shortName: "Admin Building",
    description: "Offices, washrooms, walkways",
    items: [
      { id: "admin-01", label: "Floors mopped and free from dirt/stains" },
      { id: "admin-02", label: "Desks, chairs and common areas dust-free" },
      { id: "admin-03", label: "Windows and glass doors cleaned" },
      {
        id: "admin-04",
        label: "Toilets sanitized and stocked with supplies (soap, tissue, etc.)",
      },
      {
        id: "admin-05",
        label: "Sinks and mirrors free of water stains and debris",
      },
      { id: "admin-06", label: "Waste bins emptied regularly" },
      { id: "admin-07", label: "Walkways and surroundings free from litter" },
      { id: "admin-08", label: "Proper waste segregation and disposal" },
      { id: "admin-09", label: "Adequate drainage with no stagnant water" },
    ],
  },
  {
    key: "truck",
    name: "Truck Park & Container Offices",
    shortName: "Truck Park",
    description: "Parking zones, drainage, waiting areas",
    items: [
      { id: "truck-01", label: "No visible litter or debris" },
      { id: "truck-02", label: "No oil spills or leakage" },
      { id: "truck-03", label: "Drainage system clear" },
      {
        id: "truck-04",
        label: "Parking slots well maintained and free of obstructions",
      },
      {
        id: "truck-05",
        label: "Adequate waste disposal bins available and used",
      },
      {
        id: "truck-06",
        label: "General cleanliness of waiting areas (if applicable)",
      },
    ],
  },
  {
    key: "security",
    name: "Security Office (Up & Down)",
    shortName: "Security Office (Up & Down)",
    description: "Toilets, handwashing, floor safety",
    items: [
      { id: "security-01", label: "Toilets flushed and free of stains" },
      {
        id: "security-02",
        label: "Soap, tissue and handwashing facilities available",
      },
      { id: "security-03", label: "No foul odors" },
      { id: "security-04", label: "Floors dry and slip-free" },
      { id: "security-05", label: "Waste bins emptied regularly" },
    ],
  },
  {
    key: "warehouse",
    name: "Inside Warehouse & Perimeter",
    shortName: "Inside Warehouse",
    description: "Floors, aisles, exits, surfaces",
    items: [
      { id: "warehouse-01", label: "Floors swept and free of dust/debris" },
      { id: "warehouse-02", label: "Proper waste segregation and disposal" },
      {
        id: "warehouse-03",
        label: "No unnecessary clutter in aisles and storage areas",
      },
      { id: "warehouse-04", label: "Emergency exits and pathways clear" },
      { id: "warehouse-05", label: "Spills cleaned up promptly" },
      {
        id: "warehouse-06",
        label: "Cleaning of high-touch surfaces (door handles, switches)",
      },
      {
        id: "warehouse-07",
        label: "Proper ventilation and air circulation maintained",
      },
      { id: "warehouse-08", label: "Litter-free surroundings" },
    ],
  },
];

export const TOTAL_ITEMS = CHECKLIST_SECTIONS.reduce(
  (n, s) => n + s.items.length,
  0,
);

export const RATINGS: Rating[] = [
  "Excellent",
  "Good",
  "Fair",
  "Poor",
  "Deficient",
  "Inconsistent",
];

export function getSection(key: FacilityKey): ChecklistSectionDef {
  const section = CHECKLIST_SECTIONS.find((s) => s.key === key);
  if (!section) throw new Error(`Unknown facility section: ${key}`);
  return section;
}

export const FACILITY_NAMES: Record<FacilityKey, string> = {
  admin: "Admin Building & Perimeter",
  truck: "Truck Park & Container Offices",
  security: "Security Office (Up & Down)",
  warehouse: "Inside Warehouse & Perimeter",
};

export const LOCATIONS = [
  "Olufoam Warehouse",
  "Head Office",
  "Ikorodu Depot",
  "Agbara Plant",
];

export const DEPARTMENTS = ["HSE", "Facilities", "Operations", "Admin"];

export const EVALUATORS = ["J. Adeyemi", "M. Okafor", "F. Bello", "H. Akinola"];
