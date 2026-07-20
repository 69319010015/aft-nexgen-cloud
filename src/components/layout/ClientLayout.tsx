"use client";

// ============================================
// Client Layout — wraps pages with Sidebar
// Uses TabProvider for state sharing
// ============================================

import { useCallback, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TabProvider, useTabContext } from "@/components/providers/TabProvider";

interface ClientLayoutProps {
  children: React.ReactNode;
}

function BreadcrumbsBar() {
  const { breadcrumbs } = useTabContext();
  if (breadcrumbs.length === 0) return null;
  return (
    <div className="mb-4 flex items-center gap-1.5 px-4 pt-2 text-xs text-[var(--color-text-secondary)]" style={{ fontFamily: "var(--font-family-body)" }}>
      {breadcrumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {crumb.icon && <span>{crumb.icon}</span>}
          <span className={i === breadcrumbs.length - 1 ? "font-semibold text-[var(--color-text-primary)]" : ""}>
            {crumb.label}
          </span>
          {i < breadcrumbs.length - 1 && (
            <svg className="h-3 w-3 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <TabProvider>
      <div className="flex min-h-screen">
        {/* Top-edge yellow glow shadow */}
        <div className="pointer-events-none fixed top-0 left-0 right-0 z-10 h-[3px] bg-accent-400/40 shadow-[0_4px_20px_rgba(234,179,8,0.25)]" />

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          onOpen={handleOpenSidebar}
        />

        {/* Main content — ml-64 on desktop when sidebar is open so fixed sidebar doesn't overlap */}
        <main className={`flex-1 min-w-0 w-full max-w-full overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}`}>
          <BreadcrumbsBar />
          {children}
        </main>
      </div>
    </TabProvider>
  );
}
