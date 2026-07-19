"use client";
import { OverviewCards } from "@/components/ui/OverviewCards";
import type { Project } from "@/lib/types/database";

interface DashboardViewProps {
  projects: Project[];
}

export default function DashboardView({ projects }: DashboardViewProps) {
  return (
    <section id="section-student-dashboard" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">แดชบอร์ดโครงการ อวท.</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">ภาพรวมกิจกรรมและงบประมาณทั้งหมด (โหมดอ่านอย่างเดียว)</p>
      </div>
      <OverviewCards projects={projects} />
    </section>
  );
}