"use client";

import { useState, useEffect } from "react";
import ActivityListView from "@/views/activities/ActivityListView";
import { TeacherDashboard } from "@/components/ui/TeacherDashboard";
import type { Project } from "@/lib/types/database";
import { ClientLayout } from "@/components/layout/ClientLayout";

const DEMO_PROJECTS: Project[] = [
  { id: "1", event_name_th: "แข่งขันทักษะวิชาชีพ", event_name_en: "", education_level: "ปวช. 2", semester: "1/2569", budget_received: 150000, budget_spent: 87500, responsible_person: "นายสมชาย ใจดี", responsible_id: "65309010001", pdf_template_path: "templates/skills-competition.pdf", created_at: "2026-05-15T00:00:00Z", updated_at: "2026-05-15T00:00:00Z", status: "อนุมัติ" },
  { id: "2", event_name_th: "โครงการอบรมคุณธรรม", event_name_en: "", education_level: "ปวส. 1", semester: "2/2568", budget_received: 85000, budget_spent: 85000, responsible_person: "นางสาววรินทร ม่วงคำ", responsible_id: "65309010002", pdf_template_path: null, created_at: "2026-04-20T00:00:00Z", updated_at: "2026-04-20T00:00:00Z", status: "รอยืนยัน" },
  { id: "3", event_name_th: "ทัศนศึกษาดูงานสถานประกอบการ", event_name_en: "", education_level: "ปวช. 3", semester: "1/2569", budget_received: 320000, budget_spent: 298000, responsible_person: "นายชัยวัฒน์ ทรัพย์ทวี", responsible_id: "65309010003", pdf_template_path: "templates/field-trip.pdf", created_at: "2026-06-01T00:00:00Z", updated_at: "2026-06-01T00:00:00Z", status: "อนุมัติ" },
  { id: "4", event_name_th: "โครงการส่งเสริมการเรียนรู้ภาษาอังกฤษ", event_name_en: "", education_level: "ปวช. 1", semester: "1/2569", budget_received: 45000, budget_spent: 22000, responsible_person: "นางสาวกนกวรรณ สมศรี", responsible_id: "65309010004", pdf_template_path: "templates/english-promotion.pdf", created_at: "2026-05-28T00:00:00Z", updated_at: "2026-05-28T00:00:00Z", status: "ไม่อนุมัติ" },
  { id: "5", event_name_th: "แข่งขันกีฬาสีภายใน", event_name_en: "", education_level: "ปวส. 2", semester: "2/2568", budget_received: 200000, budget_spent: 195500, responsible_person: "นายอดิศร แก้วใส", responsible_id: "65309010005", pdf_template_path: "templates/sports-day.pdf", created_at: "2026-03-10T00:00:00Z", updated_at: "2026-03-10T00:00:00Z", status: "รอยืนยัน" },
];

export default function DashboardPage() {
  const [projects] = useState<Project[]>(DEMO_PROJECTS);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setUserType(localStorage.getItem("aft-user-type"));
  }, []);

  const isTeacher = userType === "teacher";

  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
        {isTeacher && (
          <section id="section-teacher" className="scroll-mt-4 pt-8">
            <TeacherDashboard />
          </section>
        )}
        <ActivityListView projects={projects} />
      </div>
    </ClientLayout>
  );
}
