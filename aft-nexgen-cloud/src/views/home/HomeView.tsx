"use client";

import { FacebookFeed } from "@/components/ui/FacebookFeed";
import { OverviewCards } from "@/components/ui/OverviewCards";
import CollegeMapView from "@/views/map/CollegeMapView";
import { useRouter } from "next/navigation";
import { useTabContext } from "@/components/providers/TabProvider";
import type { Project } from "@/lib/types/database";

interface HomeViewProps {
  projects: Project[];
}

// Department routing matrix: [icon, name, route, breadcrumb label]
const DEPARTMENT_ROUTES: [string, string, string, string][] = [
  ["📑", "ผลสรุปส่งโครงการ", "/project-summary", "ผลสรุปส่งโครงการ"],
  ["📝", "สรุปเล่มโครงการ", "/book-summary", "สรุปเล่มโครงการ"],
  ["📅", "แผนปฏิบัติกิจกรรมประจำปีงบประมาณ", "/annual-plan", "แผนปฏิบัติกิจกรรม"],
  ["🏫", "ชมรมวิชาชีพ", "/club", "ชมรมวิชาชีพ"],
  ["📖", "ระเบียบและแนวทางการปฏิบัติ อวท.", "/regulations", "ระเบียบและแนวทาง"],
  ["📁", "แบบฟอร์ม อวท.", "/aft-forms", "แบบฟอร์ม อวท."],
  ["🗂️", "คลังไฟล์รวม", "/files-management", "คลังไฟล์รวม"],
];

export default function HomeView({ projects }: HomeViewProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useTabContext();

  const handleDepartmentClick = (route: string, breadcrumbLabel: string) => {
    setBreadcrumbs([
      { label: "หน้าแรก", icon: "🏠" },
      { label: breadcrumbLabel },
    ]);
    router.push(route);
  };

  return (
    <section id="section-home" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📱</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">ข่าวสารล่าสุด</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">Facebook Feed — อวท. วิทยาลัยเทคนิคอุดรธานี</p>
      </div>
      <FacebookFeed />

      {/* 📊 แดชบอร์ดโครงการ อวท. — Overview Cards on Facebook feed */}
      <section id="section-student-dashboard" className="scroll-mt-4 mt-6 border-t border-yellow-500/30 pt-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">แดชบอร์ดโครงการ อวท.</h2>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">ภาพรวมกิจกรรมและงบประมาณทั้งหมด (โหมดอ่านอย่างเดียว)</p>
        </div>
        <OverviewCards projects={projects} />
      </section>

      {/* Department Shortcut Menu — 8 departments */}
      <div className="mt-8">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎛️</span>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">เมนู</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENT_ROUTES.map(([icon, label, route, crumb], i) => (
            <button
              key={i}
              onClick={() => handleDepartmentClick(route, crumb)}
              className="group flex items-center gap-4 rounded-2xl px-5 py-4 text-left text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: "#2B88F7",
                boxShadow: "0 4px 14px rgba(43, 136, 247, 0.25)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4195FF")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2B88F7")}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/15">
                <span className="text-lg">{icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* College Map */}
      <div className="mt-8">
        <CollegeMapView />
      </div>
    </section>
  );
}