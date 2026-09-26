"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/lib/analytics";
import { formatShortDate } from "@/lib/format";

interface Props {
  data: TrendPoint[];
}

const AXIS = { fontSize: 11, fill: "var(--text-default-caption)" };

export function InspectionTrendChart({ data }: Props) {
  const rows = data.map((p) => ({ ...p, label: formatShortDate(p.date) }));
  const maxInspections = Math.max(6, ...rows.map((r) => r.inspections));

  return (
    <div className="h-[260px] sm:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 16, right: 8, bottom: 8, left: -8 }}>
          <CartesianGrid vertical={false} stroke="var(--border-default)" />
          <XAxis
            dataKey="label"
            tick={AXIS}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            yAxisId="left"
            domain={[0, maxInspections]}
            ticks={[0, 2, 4, 6].filter((t) => t <= maxInspections)}
            tick={AXIS}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={AXIS}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: "var(--neutral-500)", strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border-default)",
              fontSize: 12,
              fontFamily: "inherit",
            }}
            formatter={(value, name) => {
              if (name === "avgScore") return [value == null ? "—" : `${value}%`, "Avg compliance"];
              return [value ?? 0, "Inspections"];
            }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgScore"
            stroke="var(--information-700)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: "#fff", stroke: "var(--information-700)", strokeWidth: 1.5 }}
            activeDot={{ r: 4 }}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="inspections"
            stroke="var(--primary-500)"
            strokeWidth={1.5}
            dot={{ r: 3, fill: "#fff", stroke: "var(--primary-500)", strokeWidth: 1.5 }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
