"use client";
import { DataTable } from "@/components/ui/DataTable";
import { FilterInput } from "@/components/ui/FilterInput";
import type { Project } from "@/lib/types/database";
import { useState } from "react";

interface ActivityListViewProps {
  projects: Project[];
}

export default function ActivityListView({ projects }: ActivityListViewProps) {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredProjects = projects.filter(p => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase().trim();
    return p.event_name_th.toLowerCase().includes(q) || p.responsible_person.toLowerCase().includes(q);
  });

  return (
    <section id="section-activities" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">รายการกิจกรรม</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">รายละเอียดของกิจกรรม อวท. ทั้งหมดในระบบ</p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">กิจกรรมทั้งหมด</h3>
          <FilterInput value={filterQuery} onChange={setFilterQuery} placeholder="ค้นหา ชื่อกิจกรรม หรือ ผู้รับผิดชอบ" />
        </div>
        <DataTable projects={filteredProjects} isTeacher={false} onUpdateProject={() => {}} />
      </div>
    </section>
  );
}