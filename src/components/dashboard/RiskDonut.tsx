"use client";

import { useId, useState } from "react";
import type { ComplianceStatus } from "@/lib/types";
import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/cn";

interface Props {
  counts: Record<ComplianceStatus, number>;
}

const SEGMENTS: { key: ComplianceStatus; color: string; dot: string; text: string }[] = [
  { key: "Compliant", color: "var(--secondary-400)", dot: "bg-secondary-400", text: "text-secondary-500" },
  { key: "Partial", color: "var(--warning-700)", dot: "bg-warning-700", text: "text-warning-700" },
  { key: "Non-Compliant", color: "var(--error-700)", dot: "bg-error-700", text: "text-error-700" },
];

const SIZE = 185;
const STROKE = 28;
const STROKE_ACTIVE = 36;

/** Pure-SVG donut: sweeps in on first view, highlights a segment on hover/focus/tap. */
export function RiskDonut({ counts }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [active, setActive] = useState<ComplianceStatus | null>(null);
  const maskId = `donut-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const total = SEGMENTS.reduce((n, s) => n + counts[s.key], 0);
  const center = SIZE / 2;
  const r = (SIZE - STROKE_ACTIVE) / 2;
  const c = 2 * Math.PI * r;

  const arcs = SEGMENTS.reduce<{ key: ComplianceStatus; color: string; len: number; offset: number }[]>(
    (acc, s) => {
      const len = total ? (counts[s.key] / total) * c : 0;
      const prev = acc[acc.length - 1];
      acc.push({ key: s.key, color: s.color, len, offset: prev ? prev.offset + prev.len : 0 });
      return acc;
    },
    [],
  );

  const activeCount = active ? counts[active] : total;
  const activePct = active && total ? Math.round((counts[active] / total) * 100) : null;
  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: SIZE, height: SIZE }} onMouseLeave={() => setActive(null)}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`Risk distribution: ${SEGMENTS.map((s) => `${s.key} ${counts[s.key]}`).join(", ")}`}
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="#fff"
                strokeWidth={STROKE_ACTIVE + 2}
                strokeDasharray={c}
                transform={`rotate(-90 ${center} ${center})`}
                className="transition-[stroke-dashoffset] duration-[1100ms] ease-out motion-reduce:transition-none"
                style={{ strokeDashoffset: inView ? 0 : c }}
              />
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}>
            <circle cx={center} cy={center} r={r} fill="none" stroke="var(--neutral-400)" strokeWidth={STROKE} />
            {arcs.map((a) =>
              a.len > 0 ? (
                <circle
                  key={a.key}
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={active === a.key ? STROKE_ACTIVE : STROKE}
                  strokeDasharray={`${a.len} ${c - a.len}`}
                  strokeDashoffset={-a.offset}
                  transform={`rotate(-90 ${center} ${center})`}
                  className="cursor-pointer transition-[stroke-width,opacity] duration-200"
                  opacity={active && active !== a.key ? 0.35 : 1}
                  onMouseEnter={() => setActive(a.key)}
                  onClick={() => setActive(a.key)}
                />
              ) : null,
            )}
          </g>
        </svg>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-500",
            inView ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          <span className="text-h5 font-extrabold leading-8 text-heading">{activeCount}</span>
          <span className="text-p-xs text-caption">{active ?? "Total gaps"}</span>
          {activePct != null ? (
            <span className="text-p-xs font-semibold text-heading">{activePct}%</span>
          ) : null}
        </div>
      </div>
      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-p-xs">
        {SEGMENTS.map((s) => (
          <li key={s.key}>
            <button
              type="button"
              aria-pressed={active === s.key}
              onMouseEnter={() => setActive(s.key)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.key)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(s.key)}
              className={cn(
                "flex items-center gap-2 px-2 py-1 transition-opacity hover:bg-surface-secondary",
                active && active !== s.key && "opacity-50",
              )}
            >
              <span className={`size-2 ${s.dot}`} aria-hidden />
              <span className="text-body">{s.key}</span>
              <span className={`font-medium ${s.text}`}>{counts[s.key]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
