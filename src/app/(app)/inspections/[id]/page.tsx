import type { Metadata } from "next";
import { InspectionDetailsView } from "@/components/inspection/InspectionDetailsView";

export const metadata: Metadata = { title: "Inspection Details — FacilityHQ" };

export default async function InspectionDetailsPage({ params }: PageProps<"/inspections/[id]">) {
  const { id } = await params;
  return <InspectionDetailsView id={id} />;
}
