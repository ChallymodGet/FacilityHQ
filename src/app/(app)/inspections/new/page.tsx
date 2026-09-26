import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { NewInspectionForm } from "@/components/inspection/NewInspectionForm";

export const metadata: Metadata = { title: "New Inspection — FacilityHQ" };

export default function NewInspectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New Inspection" subtitle="Start a new facility housekeeping inspection" />
      <NewInspectionForm />
    </div>
  );
}
