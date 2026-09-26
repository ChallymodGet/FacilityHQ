import { Building2, ShieldCheck, Truck, Warehouse } from "lucide-react";
import type { ChecklistSectionDef, FacilityKey } from "@/lib/types";
import { cn } from "@/lib/cn";

const ICONS: Record<FacilityKey, typeof Building2> = {
  admin: Building2,
  truck: Truck,
  security: ShieldCheck,
  warehouse: Warehouse,
};

interface Props {
  section: ChecklistSectionDef;
  selected: boolean;
  onSelect: (key: FacilityKey) => void;
}

export function FacilityCard({ section, selected, onSelect }: Props) {
  const Icon = ICONS[section.key];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(section.key)}
      className={cn(
        "flex w-full flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors min-h-[94px]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
        selected
          ? "border-primary-500 bg-primary-100 ring-1 ring-primary-500"
          : "border-line bg-neutral-300 hover:border-neutral-600 hover:bg-neutral-200",
      )}
    >
      <Icon className={cn("size-5", selected ? "text-primary-600" : "text-heading")} strokeWidth={1.75} />
      <span className="text-p-sm font-semibold text-heading leading-5">{section.name}</span>
      <span className="text-p-xs text-caption leading-4">{section.description}</span>
    </button>
  );
}
