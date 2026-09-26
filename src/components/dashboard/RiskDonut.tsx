import type { ComplianceStatus } from "@/lib/types";

interface Props {
  counts: Record<ComplianceStatus, number>;
}

const SEGMENTS: { key: ComplianceStatus; color: string; dot: string; text: string }[] = [
  { key: "Compliant", color: "var(--secondary-400)", dot: "bg-secondary-400", text: "text-secondary-500" },
  { key: "Partial", color: "var(--warning-700)", dot: "bg-warning-700", text: "text-warning-700" },
  { key: "Non-Compliant", color: "var(--error-700)", dot: "bg-error-700", text: "text-error-700" },
];

/** Pure-SVG donut so it renders identically on server and client. */
export function RiskDonut({ counts }: Props) {
  const total = SEGMENTS.reduce((n, s) => n + counts[s.key], 0);
  const size = 173;
  const stroke = 30;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const arcs = SEGMENTS.reduce<
    { key: ComplianceStatus; color: string; dash: string; offset: number }[]
  >((acc, s, idx) => {
    const frac = total ? counts[s.key] / total : 0;
    const len = frac * c;
    const prev = idx ? acc[idx - 1] : undefined;
    const offset = prev ? prev.offset + Number(prev.dash.split(" ")[0]) : 0;
    acc.push({ key: s.key, color: s.color, dash: `${len} ${c - len}`, offset });
    return acc;
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Risk distribution: ${SEGMENTS.map((s) => `${s.key} ${counts[s.key]}`).join(", ")}`}
        className="shrink-0"
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--neutral-400)" strokeWidth={stroke} />
        {arcs.map((a) => (
          <circle
            key={a.key}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={stroke}
            strokeDasharray={a.dash}
            strokeDashoffset={-a.offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-p-xs">
        {SEGMENTS.map((s) => (
          <li key={s.key} className="flex items-center gap-2">
            <span className={`size-2 rounded-xs ${s.dot}`} aria-hidden />
            <span className="text-body">{s.key}</span>
            <span className={`font-medium ${s.text}`}>{counts[s.key]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
