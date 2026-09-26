import type { ComplianceStatus } from "@/lib/types";
import { cn } from "@/lib/cn";

const STROKE: Record<ComplianceStatus, string> = {
  Compliant: "var(--success-700)",
  Partial: "var(--warning-600)",
  "Non-Compliant": "var(--error-500)",
};

const TEXT: Record<ComplianceStatus, string> = {
  Compliant: "text-success-800",
  Partial: "text-warning-700",
  "Non-Compliant": "text-error-700",
};

interface Props {
  score: number;
  status: ComplianceStatus;
  size?: number;
}

export function ComplianceGauge({ score, status, size = 88 }: Props) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (Math.max(0, Math.min(100, score)) / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--error-300)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={STROKE[status]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className={cn("absolute text-h5 font-bold", TEXT[status])}>{score}%</span>
    </div>
  );
}
