"use client";

import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { CURRENT_USER } from "@/lib/user";

interface Props {
  onMenu: () => void;
}

export function TopBar({ onMenu }: Props) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <header className="sticky top-0 z-20 h-16 sm:h-20 border-b border-line bg-surface no-print">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenu}
          className="lg:hidden inline-flex size-10 shrink-0 items-center justify-center rounded-sm text-heading hover:bg-neutral-300"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <label className="relative flex h-11 sm:h-12 w-full max-w-[335px] items-center rounded-sm border border-line bg-surface focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200">
          <Search className="absolute left-4 size-5 text-heading" strokeWidth={1.75} aria-hidden />
          <input
            type="search"
            placeholder="Search Facilities..."
            className="h-full w-full bg-transparent pl-12 pr-4 text-p-sm text-heading placeholder:text-placeholder focus:outline-none"
            aria-label="Search facilities"
          />
        </label>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="relative inline-flex size-10 items-center justify-center rounded-sm text-heading hover:bg-neutral-300"
            aria-label={`${CURRENT_USER.notifications} notifications`}
          >
            <Bell className="size-5" strokeWidth={1.75} />
            {CURRENT_USER.notifications > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-semibold leading-none text-white">
                {CURRENT_USER.notifications}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex size-10 items-center justify-center rounded-sm text-heading hover:bg-neutral-300"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={dark}
            title={dark ? "Light theme" : "Dark theme"}
          >
            {dark ? (
              <Sun className="size-5" strokeWidth={1.75} />
            ) : (
              <Moon className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
