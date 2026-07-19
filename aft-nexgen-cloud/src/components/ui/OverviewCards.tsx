"use client";

// ============================================
// AFT NexGen Cloud — Overview Cards
// Top panel: 5 Key Metric Cards
// 1. Total Students / นักเรียน-นักศึกษาทั้งหมด
// 2. AFT Committee / คณะกรรมการ อวท.
// 3. Total Events / กิจกรรมทั้งหมด
// 4. Total Budget / งบประมาณที่ได้รับ
// 5. Remaining Budget / งบประมาณคงเหลือ
// ============================================

import { calculateDashboardStats, formatThaiBaht, formatNumber } from "@/lib/utils/calculations";
import type { Project } from "@/lib/types/database";

interface OverviewCardsProps {
  projects: Project[];
}

export function OverviewCards({ projects }: OverviewCardsProps) {
  const stats = calculateDashboardStats(projects);

  const cards = [
    {
      label_th: "นักเรียน-นักศึกษาทั้งหมด",
      value: formatNumber(1840),
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      accent: false,
    },
    {
      label_th: "คณะกรรมการ อวท.",
      value: formatNumber(32),
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      accent: false,
    },
    {
      label_th: "กิจกรรมทั้งหมด",
      value: formatNumber(stats.total_events),
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      accent: false,
    },
    {
      label_th: "งบประมาณที่ได้รับ",
      value: formatThaiBaht(stats.total_budget_allocated),
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: false,
    },
    {
      label_th: "งบประมาณคงเหลือ",
      value: formatThaiBaht(stats.remaining_budget),
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      accent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label_th}
          className={`card flex items-start gap-3 transition-all duration-200 hover:shadow-md ${
            card.accent ? "card-gradient-accent" : "card-gradient"
          }`}
        >
          <div
            className={`flex-shrink-0 rounded-lg p-2.5 ${
              card.accent
                ? "bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400"
                : "bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200"
            }`}
          >
            {card.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
              {card.label_th}
            </p>
            <p
              className={`mt-0.5 text-lg font-bold ${
                card.accent ? "text-accent-600 dark:text-accent-400" : "text-[var(--color-text-primary)]"
              }`}
            >
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}