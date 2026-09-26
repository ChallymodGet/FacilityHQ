import type { Metadata } from "next";
import { InspectionRecordsView } from "@/components/inspection/InspectionRecordsView";

export const metadata: Metadata = { title: "Inspection Records — FacilityHQ" };

export default function InspectionRecordsPage() {
  return <InspectionRecordsView />;
}
