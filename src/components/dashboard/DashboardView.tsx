"use client";

import Link from "next/link";
import { CalendarDays, FileText, Plus, TrendingUp, TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "./StatCard";
import { InspectionTrendChart } from "./InspectionTrendChart";
import { RiskDonut } from "./RiskDonut";
import { RequiringAttention } from "./RequiringAttention";
import { InspectionsTable } from "@/components/inspection/InspectionsTable";
import { useInspections } from "@/lib/store";
import {
  averageScore,
  countByStatus,
  itemRiskDistribution,
  submitted,
  totalFlaggedItems,
  trendLast7Days,
} from "@/lib/analytics";
import { formatLongDate, todayISO } from "@/lib/format";
import { overallStatus } from "@/lib/scoring";

export function DashboardView() {
  const { inspections } = useInspections();
  const today = todayISO();

  const stats = useMemo(() => {
    const list = submitted(inspections);
    const byStatus = countByStatus(list);
    return {
      list,
      total: list.length,
      todayCount: list.filter((i) => i.inspectionDate === today).length,
      avg: averageScore(list),
      compliantCount: byStatus.Compliant,
      nonCompliantCount: byStatus["Non-Compliant"],
      failedChecks: totalFlaggedItems(list),
      risk: itemRiskDistribution(list),
      trend: trendLast7Days(list, today),
      recent: list.slice(0, 5),
      attention: list.filter((i) => overallStatus(i) !== "Compliant").slice(0, 3),
    };
  }, [inspections, today]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        subtitle="Facility Housekeeping Inspection Overview"
        action={
          <ButtonLink
            href="/inspections/new"
            size="lg"
            leadingIcon={<Plus className="size-5" strokeWidth={2} />}
            className="w-full sm:w-auto sm:min-w-[248px]"
          >
            Start New Inspection
          </ButtonLink>
        }
      />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-label="Key metrics">
        <StatCard
          title="Total Inspections"
          value={stats.total}
          caption="All time records"
          tone="primary"
          icon={<FileText className="size-4" strokeWidth={1.75} />}
        />
        <StatCard
          title="Inspections Today"
          value={stats.todayCount}
          caption={formatLongDate(today)}
          tone="information"
          icon={<CalendarDays className="size-4" strokeWidth={1.75} />}
        />
        <StatCard
          title="Avg Compliance Score"
          value={stats.total ? `${stats.avg}` : "—"}
          caption={`${stats.compliantCount} compliant facilities`}
          tone="success"
          icon={<TrendingUp className="size-4" strokeWidth={1.75} />}
        />
        <StatCard
          title="Failed Checks"
          value={stats.failedChecks}
          caption={`${stats.nonCompliantCount} non-compliant records`}
          tone="error"
          icon={<TriangleAlert className="size-4" strokeWidth={1.75} />}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,694fr)_minmax(0,386fr)]">
        <Card>
          <CardHeader
            title="Inspection Trend"
            subtitle="Daily inspections & avg compliance score — last 7 days"
          />
          <div className="px-2 pb-2 pt-3 sm:px-3">
            <InspectionTrendChart data={stats.trend} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Risk Distribution" subtitle="Active open gaps by severity" />
          <div className="flex justify-center px-4 py-6">
            <RiskDonut counts={stats.risk} />
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,754fr)_minmax(0,326fr)]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Recent Inspections"
            subtitle="Last 5 records"
            divider={false}
            action={
              <Link
                href="/inspections"
                className="text-p-xs font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600"
              >
                View All
              </Link>
            }
          />
          <InspectionsTable inspections={stats.recent} compact />
        </Card>
        <Card className="self-start">
          <CardHeader
            title={<span className="text-p-sm">Requiring Attention</span>}
            subtitle="Facilities below compliance threshold"
          />
          <RequiringAttention inspections={stats.attention} />
        </Card>
      </section>
    </div>
  );
}
