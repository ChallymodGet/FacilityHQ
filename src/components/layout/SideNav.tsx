"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutGrid, LogOut, User, FilePlus2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SunbethLogo } from "./SunbethLogo";
import { CURRENT_USER } from "@/lib/user";
import { initials } from "@/lib/format";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutGrid;
  /** treat nested routes as active */
  match?: (path: string) => boolean;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: LayoutGrid, match: (p) => p === "/" }],
  },
  {
    heading: "Inspection",
    items: [
      {
        label: "New Inspection",
        href: "/inspections/new",
        icon: FilePlus2,
        match: (p) =>
          p === "/inspections/new" ||
          /^\/inspections\/[^/]+\/(checklist|results)$/.test(p),
      },
      {
        label: "Inspection Records",
        href: "/inspections",
        icon: FileText,
        match: (p) =>
          p === "/inspections" ||
          (/^\/inspections\/[^/]+$/.test(p) && p !== "/inspections/new"),
      },
    ],
  },
  {
    heading: "Settings",
    items: [{ label: "Profile", href: "/profile", icon: User, match: (p) => p.startsWith("/profile") }],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SideNav({ open, onClose }: Props) {
  const pathname = usePathname();

  const nav = (
    <nav className="flex h-full flex-col" aria-label="Main">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <Link href="/" onClick={onClose} className="rounded-sm focus-visible:outline-2 focus-visible:outline-primary-500">
          <SunbethLogo />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden inline-flex size-9 items-center justify-center rounded-sm text-heading hover:bg-neutral-300"
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {GROUPS.map((group) => (
          <div key={group.heading} className="mt-3">
            <div className="flex items-center gap-3 px-5 pb-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
                {group.heading}
              </span>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active = item.match ? item.match(pathname) : pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex h-11 items-center gap-3 px-5 text-p-sm font-medium transition-colors",
                        active
                          ? "bg-primary-500 text-white"
                          : "text-heading hover:bg-neutral-300",
                      )}
                    >
                      {active ? (
                        <span
                          className="absolute inset-y-0 left-0 w-1 bg-primary-700"
                          aria-hidden
                        />
                      ) : null}
                      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-information-300 text-p-xs font-semibold text-information-800">
            {initials(CURRENT_USER.name)}
          </span>
          <div className="min-w-0">
            <div className="truncate text-p-sm font-medium text-heading">{CURRENT_USER.name}</div>
            <span className="mt-0.5 inline-block rounded-xs bg-primary-500 px-1.5 py-px text-[10px] font-medium leading-4 text-white">
              {CURRENT_USER.title}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 flex items-center gap-2 text-p-sm font-medium text-primary-500 hover:text-primary-600"
        >
          <LogOut className="size-4" strokeWidth={1.75} />
          Log out
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-[280px] border-r border-line bg-surface">
        {nav}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-opacity",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-surface shadow-xl transition-transform duration-200",
            open ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          {nav}
        </aside>
      </div>
    </>
  );
}
