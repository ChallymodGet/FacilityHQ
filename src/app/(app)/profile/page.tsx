import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { CURRENT_USER } from "@/lib/user";
import { initials } from "@/lib/format";

export const metadata: Metadata = { title: "Profile — FacilityHQ" };

/**
 * Profile is linked from the side nav but has no screen in the Figma MVP canvas yet.
 * This is a minimal placeholder until that screen is designed.
 */
export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile" subtitle="Account settings" />
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-information-300 text-p-lg font-semibold text-information-800">
            {initials(CURRENT_USER.name)}
          </span>
          <div>
            <div className="text-p-lg font-semibold text-heading">{CURRENT_USER.name}</div>
            <div className="text-p-sm text-caption">{CURRENT_USER.title}</div>
          </div>
        </div>
        <p className="mt-6 text-p-sm text-caption">
          Profile settings will be available once the screen is designed.
        </p>
      </Card>
    </div>
  );
}
