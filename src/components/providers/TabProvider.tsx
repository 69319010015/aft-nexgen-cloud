"use client";

// ============================================
// Tab Context + Breadcrumb — allows Sidebar to
// control active tab & breadcrumb path
// ============================================

import { createContext, useContext, useState, type ReactNode } from "react";
import type { NavTab } from "@/components/layout/Sidebar";

export interface BreadcrumbItem {
  label: string;
  icon?: string;
}

interface TabContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (crumbs: BreadcrumbItem[]) => void;
}

const TabContext = createContext<TabContextType>({
  activeTab: "dashboard",
  setActiveTab: () => {},
  breadcrumbs: [],
  setBreadcrumbs: () => {},
});

export function TabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, breadcrumbs, setBreadcrumbs }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext() {
  return useContext(TabContext);
}
