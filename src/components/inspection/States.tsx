import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function LoadingCard() {
  return (
    <Card className="p-6" aria-busy="true" aria-live="polite">
      <div className="h-6 w-56 animate-pulse rounded-sm bg-neutral-400" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-sm bg-neutral-300" />
      <div className="mt-6 h-40 animate-pulse rounded-sm bg-neutral-300" />
    </Card>
  );
}

export function InspectionNotFound({ id }: { id: string }) {
  return (
    <Card className="p-8 text-center">
      <h2 className="text-h6 font-semibold text-heading">Inspection not found</h2>
      <p className="mt-2 text-p-sm text-caption">
        No inspection with ID <span className="font-medium text-heading">{id}</span> exists on this device.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/inspections" variant="outline">
          View Records
        </ButtonLink>
        <ButtonLink href="/inspections/new">Start New Inspection</ButtonLink>
      </div>
    </Card>
  );
}
