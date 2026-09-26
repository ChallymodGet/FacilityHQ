import type { Metadata } from "next";
import { ResultsSummaryView } from "@/components/inspection/ResultsSummaryView";

export const metadata: Metadata = { title: "Results Summary — FacilityHQ" };

export default async function ResultsPage({ params }: PageProps<"/inspections/[id]/results">) {
  const { id } = await params;
  return <ResultsSummaryView id={id} />;
}
