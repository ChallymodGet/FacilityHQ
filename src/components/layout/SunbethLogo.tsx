import { cn } from "@/lib/cn";

/**
 * Sunbeth Global Concepts wordmark.
 * Placeholder drawn to match the Figma logo; replace with `/public/logo.svg`
 * once the official asset is exported from Figma.
 */
export function SunbethLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)} aria-label="Sunbeth Global Concepts">
      <svg width="36" height="32" viewBox="0 0 36 32" fill="none" aria-hidden>
        <path
          d="M4 26C6 14 14 6 30 4c-2 12-10 20-26 22Z"
          fill="var(--secondary-400)"
        />
        <path
          d="M12 26c3-7 9-12 18-14-3 7-9 12-18 14Z"
          fill="var(--primary-500)"
        />
        <path
          d="M2 30c7-8 16-14 30-18"
          stroke="var(--primary-700)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="leading-none">
        <div className="text-[18px] font-bold text-primary-500 tracking-tight">Sunbeth</div>
        <div className="text-[9px] font-semibold text-secondary-500 tracking-wide">
          Global Concepts
        </div>
      </div>
    </div>
  );
}
