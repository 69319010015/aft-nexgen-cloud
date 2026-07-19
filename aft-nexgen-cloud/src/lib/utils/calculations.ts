// ============================================
// AFT NexGen Cloud — Budget Calculations
// Strict Rule: No decimal points allowed anywhere.
// ============================================

import type { Project, DashboardStats } from "@/lib/types/database";

/**
 * Calculate dashboard statistics from an array of projects.
 * Uses raw arithmetic — no AI tokens used here.
 */
export function calculateDashboardStats(projects: Project[]): DashboardStats {
  const total_events = projects.length;
  const total_budget_allocated = projects.reduce(
    (sum, p) => sum + Number(p.budget_received),
    0
  );
  const total_budget_spent = projects.reduce(
    (sum, p) => sum + Number(p.budget_spent),
    0
  );
  const remaining_budget = total_budget_allocated - total_budget_spent;

  return {
    total_events,
    total_budget_allocated,
    total_budget_spent,
    remaining_budget,
  };
}

/**
 * Format a number as Thai Baht string — NO decimal points.
 */
export function formatThaiBaht(amount: number): string {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
}

/**
 * Format a number with comma separators — NO decimal points.
 */
export function formatNumber(amount: number): string {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
}