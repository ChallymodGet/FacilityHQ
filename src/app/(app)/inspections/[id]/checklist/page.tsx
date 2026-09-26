import type { Metadata } from "next";
import { ChecklistView } from "@/components/inspection/ChecklistView";

export const metadata: Metadata = { title: "Facility Housekeeping Checklist — FacilityHQ" };

export default async function ChecklistPage({ params }: PageProps<"/inspections/[id]/checklist">) {
  const { id } = await params;
  return <ChecklistView id={id} />;
}
