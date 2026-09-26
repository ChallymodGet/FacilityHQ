"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: ReactNode }) {
  // The drawer closes itself when a nav link is clicked (see SideNav onClose).
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-full">
      <SideNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-[280px] flex min-h-screen flex-col">
        <TopBar onMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-[1104px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
