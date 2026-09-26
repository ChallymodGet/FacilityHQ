"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Field";
import { InspectionsTable } from "./InspectionsTable";
import { LoadingCard } from "./States";
import { CHECKLIST_SECTIONS, FACILITY_NAMES } from "@/lib/checklist";
import { overallStatus } from "@/lib/scoring";
import { useInspections } from "@/lib/store";
import type { ComplianceStatus, FacilityKey } from "@/lib/types";

const STATUS_OPTIONS = ["All Status", "Compliant", "Partial", "Non-Compliant", "Draft"] as const;
const DATE_OPTIONS = ["Newest first", "Oldest first"] as const;
const FACILITY_OPTIONS = ["All Facilities", ...CHECKLIST_SECTIONS.map((s) => s.name)];

export function InspectionRecordsView() {
  const { inspections, hydrated } = useInspections();
  const [query, setQuery] = useState("");
  const [facility, setFacility] = useState<string>(FACILITY_OPTIONS[0]);
  const [status, setStatus] = useState<string>(STATUS_OPTIONS[0]);
  const [order, setOrder] = useState<string>(DATE_OPTIONS[0]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const facilityKey = (Object.keys(FACILITY_NAMES) as FacilityKey[]).find(
      (k) => FACILITY_NAMES[k] === facility,
    );
    const list = inspections.filter((i) => {
      if (facilityKey && i.facility !== facilityKey) return false;
      if (status !== "All Status") {
        if (status === "Draft") {
          if (i.status !== "draft") return false;
        } else if (i.status !== "submitted" || overallStatus(i) !== (status as ComplianceStatus)) {
          return false;
        }
      }
      if (q) {
        const hay = `${i.id} ${FACILITY_NAMES[i.facility]} ${i.evaluator} ${i.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      const cmp = a.inspectionDate < b.inspectionDate ? -1 : a.inspectionDate > b.inspectionDate ? 1 : 0;
      const tie = a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0;
      const v = cmp || tie;
      return order === "Newest first" ? -v : v;
    });
    return list;
  }, [inspections, query, facility, status, order]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inspection Records"
        subtitle={hydrated ? `${rows.length} record${rows.length === 1 ? "" : "s"} found` : "Loading records…"}
        action={
          <ButtonLink
            href="/inspections/new"
            leadingIcon={<Plus className="size-4" strokeWidth={2} />}
            className="w-full sm:w-auto sm:min-w-[234px]"
          >
            Start New Inspection
          </ButtonLink>
        }
      />

      <Card className="p-2 sm:p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex h-12 flex-1 items-center rounded-sm border border-line bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200">
            <Search className="absolute left-4 size-4 text-heading" strokeWidth={1.75} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by inspection ID, facility, evaluator or location…"
              className="h-full w-full bg-transparent pl-12 pr-4 text-p-sm text-heading placeholder:text-placeholder focus:outline-none"
              aria-label="Search records"
            />
          </label>
          <span className="hidden lg:block h-8 w-px bg-line" aria-hidden />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
            <Select
              aria-label="Filter by facility"
              options={FACILITY_OPTIONS}
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="lg:w-[205px] h-12 lg:h-10"
            />
            <Select
              aria-label="Filter by status"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="lg:w-[140px] h-12 lg:h-10"
            />
            <Select
              aria-label="Sort by date"
              options={DATE_OPTIONS}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="lg:w-[140px] h-12 lg:h-10"
            />
          </div>
        </div>
      </Card>

      {hydrated ? (
        <Card className="overflow-hidden">
          <InspectionsTable inspections={rows} emptyMessage="No records match your filters." />
        </Card>
      ) : (
        <LoadingCard />
      )}
    </div>
  );
}
