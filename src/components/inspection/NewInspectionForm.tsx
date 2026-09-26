"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Select, TextInput } from "@/components/ui/Field";
import { FacilityCard } from "./FacilityCard";
import {
  CHECKLIST_SECTIONS,
  DEPARTMENTS,
  EVALUATORS,
  LOCATIONS,
  RATINGS,
  TOTAL_ITEMS,
} from "@/lib/checklist";
import { useInspections } from "@/lib/store";
import type { FacilityKey } from "@/lib/types";

interface Errors {
  facility?: string;
  location?: string;
  department?: string;
  inspectionDate?: string;
  evaluator?: string;
}

export function NewInspectionForm() {
  const router = useRouter();
  const { createInspection } = useInspections();

  const [facility, setFacility] = useState<FacilityKey | null>(null);
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!facility) next.facility = "Select a facility to inspect.";
    if (!location) next.location = "Select a location.";
    if (!department) next.department = "Select a department.";
    if (!inspectionDate) next.inspectionDate = "Choose the inspection date.";
    if (!evaluator) next.evaluator = "Select the evaluator.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate() || !facility) return;
    setSubmitting(true);
    const created = createInspection({
      facility,
      location,
      department,
      evaluator,
      inspectionDate,
    });
    router.push(`/inspections/${created.id}/checklist`);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Card className="overflow-hidden">
        {/* Header with location selector */}
        <div className="flex flex-col gap-4 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-p font-semibold text-heading">Facility Information</h2>
            <p className="mt-0.5 text-p-xs text-caption">Provide details for the inspection record</p>
          </div>
          <div className="w-full sm:w-[250px]">
            <Select
              aria-label="Location"
              placeholder="Select Location"
              options={LOCATIONS}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-invalid={!!errors.location}
              className={errors.location ? "border-error-700" : undefined}
            />
            {errors.location ? (
              <p className="mt-1 text-p-xs text-error-700">{errors.location}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6 p-4">
          {/* Facility cards */}
          <fieldset>
            <legend className="mb-2 text-p-sm font-medium text-heading">
              Facility<span className="text-error-700"> *</span>
            </legend>
            <div
              role="radiogroup"
              aria-label="Facility"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {CHECKLIST_SECTIONS.map((s) => (
                <FacilityCard
                  key={s.key}
                  section={s}
                  selected={facility === s.key}
                  onSelect={setFacility}
                />
              ))}
            </div>
            {errors.facility ? (
              <p className="mt-2 text-p-xs text-error-700">{errors.facility}</p>
            ) : null}
          </fieldset>

          {/* Details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Department" required htmlFor="department">
              <Select
                id="department"
                placeholder="Select Department"
                options={DEPARTMENTS}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                aria-invalid={!!errors.department}
                className={errors.department ? "border-error-700" : undefined}
              />
              {errors.department ? (
                <p className="text-p-xs text-error-700">{errors.department}</p>
              ) : null}
            </Field>
            <Field label="Inspection Date" required htmlFor="inspectionDate">
              <TextInput
                id="inspectionDate"
                type="date"
                placeholder="MM/DD/YYYY"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                aria-invalid={!!errors.inspectionDate}
                className={errors.inspectionDate ? "border-error-700" : undefined}
                required
              />
              {errors.inspectionDate ? (
                <p className="text-p-xs text-error-700">{errors.inspectionDate}</p>
              ) : null}
            </Field>
            <Field label="Evaluator" required htmlFor="evaluator">
              <Select
                id="evaluator"
                placeholder="Select Inspector"
                options={EVALUATORS}
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
                aria-invalid={!!errors.evaluator}
                className={errors.evaluator ? "border-error-700" : undefined}
              />
              {errors.evaluator ? (
                <p className="text-p-xs text-error-700">{errors.evaluator}</p>
              ) : null}
            </Field>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-col gap-4 border-t border-line bg-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-p-xs text-caption leading-4 max-w-[540px]">
            <span className="font-semibold text-heading">{TOTAL_ITEMS} checklist items</span> across{" "}
            {CHECKLIST_SECTIONS.length} facility sections | Rated: {RATINGS.join(", ")}
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            leadingIcon={<Plus className="size-5" strokeWidth={2} />}
            className="w-full sm:w-auto sm:min-w-[222px]"
          >
            Begin Inspection
          </Button>
        </div>
      </Card>
    </form>
  );
}
