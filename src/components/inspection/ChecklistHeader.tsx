"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { FACILITY_NAMES, TOTAL_ITEMS } from "@/lib/checklist";
import type { SectionScore } from "@/lib/scoring";
import type { FacilityKey, Inspection } from "@/lib/types";
import { cn } from "@/lib/cn";

interface Props {
  inspection: Inspection;
  sections: SectionScore[];
  done: number;
  score: number | null;
}

const sectionId = (key: FacilityKey) => `section-${key}`;

/**
 * Sticky header for the checklist. Publishes its height as CSS variables so
 * sections (scroll-margin) and the summary sidebar (sticky top) sit below it.
 */
export function ChecklistHeader({ inspection, sections, done, score }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [stuck, setStuck] = useState(false);
  const [activeKey, setActiveKey] = useState<FacilityKey>(sections[0].section.key);
  const keys = sections.map((s) => s.section.key).join(",");

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const sectionKeys = keys.split(",") as FacilityKey[];
    let frame = 0;
    // The header is shorter once stuck; jumps land while stuck, so prefer that height.
    let stuckHeight = 0;

    const update = () => {
      frame = 0;
      const rect = header.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(header).top) || 0;
      const isStuck = rect.top <= stickyTop + 0.5 && window.scrollY > 0;
      if (isStuck) stuckHeight = rect.height;
      root.style.setProperty("--checklist-header-h", `${rect.height}px`);
      root.style.setProperty("--checklist-scroll-offset", `${stickyTop + (stuckHeight || rect.height) + 16}px`);
      setStuck(isStuck);

      const line = rect.bottom + Math.min(160, (window.innerHeight - rect.bottom) / 3);
      let current = sectionKeys[0];
      for (const key of sectionKeys) {
        const el = document.getElementById(sectionId(key));
        if (el && el.getBoundingClientRect().top <= line) current = key;
      }
      setActiveKey(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const resize = new ResizeObserver(schedule);
    resize.observe(header);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.style.removeProperty("--checklist-header-h");
      root.style.removeProperty("--checklist-scroll-offset");
    };
  }, [keys]);

  // Keep the active tab visible in the horizontally scrolling tab row.
  useEffect(() => {
    const nav = navRef.current;
    const tab = nav?.querySelector<HTMLElement>(`[data-key="${activeKey}"]`);
    if (!nav || !tab) return;
    const left = tab.offsetLeft - nav.offsetLeft - 16;
    if (left < nav.scrollLeft || left + tab.offsetWidth + 32 > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left, behavior: "smooth" });
    }
  }, [activeKey]);

  function jumpTo(e: MouseEvent<HTMLAnchorElement>, key: FacilityKey) {
    const el = document.getElementById(sectionId(key));
    if (!el) return;
    e.preventDefault();
    setActiveKey(key);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const meta = [
    ["Facility", FACILITY_NAMES[inspection.facility]],
    ["ID", inspection.id],
    ["Inspector", inspection.evaluator],
    ["Date", inspection.inspectionDate],
    ["Location", inspection.location],
  ];

  return (
    <div
      ref={headerRef}
      className={cn(
        "sticky top-16 sm:top-20 z-10 border border-line bg-surface transition-shadow",
        stuck && "shadow-[0_8px_16px_-8px_rgba(16,24,40,0.18)]",
      )}
    >
      <div className={cn("px-4 sm:px-5 transition-[padding]", stuck ? "pt-3" : "pt-4 sm:pt-5")}>
        <h1
          className={cn(
            "font-semibold tracking-tight text-heading transition-[font-size,line-height]",
            stuck ? "text-p-lg sm:text-h5" : "text-h4 sm:text-h3",
          )}
        >
          Facility Housekeeping Checklist
        </h1>
        <ul
          className={cn(
            "mt-1 flex gap-x-5 gap-y-1 text-p-xs sm:text-p-sm",
            stuck
              ? "flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-thin sm:flex-wrap sm:overflow-visible"
              : "flex-wrap",
          )}
        >
          {meta.map(([label, value]) => (
            <li key={label} className="shrink-0">
              <span className="text-caption">{label}: </span>
              <span className="font-medium text-heading">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      <nav
        ref={navRef}
        aria-label="Checklist sections"
        className={cn("overflow-x-auto scrollbar-thin px-4 sm:px-5", stuck ? "py-3" : "pb-4 pt-4 sm:pb-5")}
      >
        <ul className="flex w-max gap-2">
          {sections.map((s) => {
            const complete = s.rated === s.total;
            const isActive = s.section.key === activeKey;
            return (
              <li key={s.section.key}>
                <a
                  href={`#${sectionId(s.section.key)}`}
                  data-key={s.section.key}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => jumpTo(e, s.section.key)}
                  className={cn(
                    "inline-flex h-[30px] items-center gap-1.5 border px-3 text-p-xs font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "border-primary-500 bg-primary-100 text-primary-600"
                      : complete
                        ? "border-success-300 bg-success-200 text-success-800"
                        : "border-line bg-surface text-body hover:border-neutral-600",
                  )}
                >
                  {complete ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                  {s.section.shortName}
                  <span className={isActive ? "text-primary-600" : "text-caption"}>
                    {s.rated}/{s.total}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Compact progress for screens without the summary sidebar */}
      <div className="xl:hidden border-t border-line px-4 sm:px-5 py-2.5">
        <div className="flex items-center justify-between gap-3 text-p-xs">
          <span className="text-caption">
            <span className="font-semibold text-heading">{done}</span> of {TOTAL_ITEMS} rated
          </span>
          <span className="text-caption">
            Score: <span className="font-semibold text-heading">{score == null ? "—" : `${score}%`}</span>
          </span>
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden bg-neutral-400">
          <div
            className="h-full bg-primary-500 transition-[width]"
            style={{ width: `${(done / TOTAL_ITEMS) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
