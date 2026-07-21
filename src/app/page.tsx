"use client";

// ============================================
// AFT NexGen Cloud — Single Page Application
// ============================================
// Simplified main page: only Home (news + departments)
// and CollegeMap. All table views moved to full-page routes.
// ============================================

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import type { FailedStudent } from "@/components/sidebar/SidebarMenu";
import { MOCK_FAILED, REASONS, LEVELS, DEPARTMENTS } from "@/components/sidebar/SidebarMenu";
import type { Project } from "@/lib/types/database";

const HomeView = dynamic(() => import("@/views/home/HomeView"), { ssr: false });

const DEMO_PROJECTS: Project[] = [
  { id: "1", event_name_th: "แข่งขันทักษะวิชาชีพ", event_name_en: "", education_level: "ปวช. 2", semester: "1/2569", budget_received: 150000, budget_spent: 87500, responsible_person: "นายสมชาย ใจดี", responsible_id: "65309010001", pdf_template_path: "templates/skills-competition.pdf", created_at: "2026-05-15T00:00:00Z", updated_at: "2026-05-15T00:00:00Z", status: "อนุมัติ" },
  { id: "2", event_name_th: "โครงการอบรมคุณธรรม", event_name_en: "", education_level: "ปวส. 1", semester: "2/2568", budget_received: 85000, budget_spent: 85000, responsible_person: "นางสาววรินทร ม่วงคำ", responsible_id: "65309010002", pdf_template_path: null, created_at: "2026-04-20T00:00:00Z", updated_at: "2026-04-20T00:00:00Z", status: "รอยืนยัน" },
  { id: "3", event_name_th: "ทัศนศึกษาดูงานสถานประกอบการ", event_name_en: "", education_level: "ปวช. 3", semester: "1/2569", budget_received: 320000, budget_spent: 298000, responsible_person: "นายชัยวัฒน์ ทรัพย์ทวี", responsible_id: "65309010003", pdf_template_path: "templates/field-trip.pdf", created_at: "2026-06-01T00:00:00Z", updated_at: "2026-06-01T00:00:00Z", status: "อนุมัติ" },
  { id: "4", event_name_th: "โครงการส่งเสริมการเรียนรู้ภาษาอังกฤษ", event_name_en: "", education_level: "ปวช. 1", semester: "1/2569", budget_received: 45000, budget_spent: 22000, responsible_person: "นางสาวกนกวรรณ สมศรี", responsible_id: "65309010004", pdf_template_path: "templates/english-promotion.pdf", created_at: "2026-05-28T00:00:00Z", updated_at: "2026-05-28T00:00:00Z", status: "ไม่อนุมัติ" },
  { id: "5", event_name_th: "แข่งขันกีฬาสีภายใน", event_name_en: "", education_level: "ปวส. 2", semester: "2/2568", budget_received: 200000, budget_spent: 195500, responsible_person: "นายอดิศร แก้วใส", responsible_id: "65309010005", pdf_template_path: "templates/sports-day.pdf", created_at: "2026-03-10T00:00:00Z", updated_at: "2026-03-10T00:00:00Z", status: "รอยืนยัน" },
];

export default function HomePage() {
  const [projects] = useState<Project[]>(DEMO_PROJECTS);
  const [filterQueryFailed, setFilterQueryFailed] = useState("");
  const [failedStudents, setFailedStudents] = useState<FailedStudent[]>(MOCK_FAILED);
  const [userType, setUserType] = useState<string | null>(null);
  const [editingFailedId, setEditingFailedId] = useState<string | null>(null);
  const [editFailedForm, setEditFailedForm] = useState({ level: "", semester: "", reason: "", department: "", room: "" });
  const [showAddFailed, setShowAddFailed] = useState(false);
  const [addFailedForm, setAddFailedForm] = useState({ nameTh: "", level: "ปวช. 1", semester: "1/2569", reason: "ไม่เข้าแถว", department: "ช่างยนต์ / Automotive Technology", room: "1" });
  const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmYearInput, setConfirmYearInput] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const isTeacher = userType === "teacher";
  const isLoggedIn = isTeacher || userType === "student";

  useEffect(() => {
    if (typeof window !== "undefined") setUserType(localStorage.getItem("aft-user-type"));
  }, []);

  const startEditFailed = useCallback((student: FailedStudent) => {
    setEditingFailedId(student.id);
    setEditFailedForm({ level: student.level, semester: student.semester, reason: student.reason, department: student.department, room: student.room });
  }, []);

  const cancelEditFailed = useCallback(() => setEditingFailedId(null), []);
  const saveEditFailed = useCallback((id: string) => {
    setFailedStudents(prev => prev.map(s => s.id === id ? { ...s, ...editFailedForm } : s));
    setEditingFailedId(null);
  }, [editFailedForm]);

  const handleAddFailed = useCallback(() => {
    const newStudent: FailedStudent = {
      id: (failedStudents.length + 1).toString(),
      nameEn: addFailedForm.nameTh,
      nameTh: addFailedForm.nameTh,
      level: addFailedForm.level,
      semester: addFailedForm.semester,
      reason: addFailedForm.reason,
      department: addFailedForm.department,
      room: addFailedForm.room,
    };
    setFailedStudents(prev => [newStudent, ...prev]);
    setShowAddFailed(false);
    setAddFailedForm({ nameTh: "", level: "ปวช. 1", semester: "1/2569", reason: "ไม่เข้าแถว", department: "ช่างยนต์ / Automotive Technology", room: "1" });
  }, [addFailedForm, failedStudents.length]);

  const studentsInYearSemester = useMemo(() => {
    if (!yearFilter.trim() && !semesterFilter) return [];
    return failedStudents.filter(s => {
      const [semNum, yearNum] = s.semester.split("/");
      return (!yearFilter.trim() || yearNum === yearFilter.trim()) && (!semesterFilter || semNum === semesterFilter);
    });
  }, [failedStudents, yearFilter, semesterFilter]);

  const handleBulkDelete = useCallback(() => {
    if (confirmYearInput !== yearFilter) { setDeleteError("ปีการศึกษาไม่ตรงกัน"); return; }
    setFailedStudents(prev => prev.filter(s => { const [semNum, yearNum] = s.semester.split("/"); return !((!yearFilter.trim() || yearNum === yearFilter.trim()) && (!semesterFilter || semNum === semesterFilter)); }));
    setShowDeleteConfirm(false); setConfirmYearInput(""); setDeleteError("");
  }, [confirmYearInput, yearFilter, semesterFilter]);

  const filteredFailedStudents = useMemo(() => {
    if (!filterQueryFailed.trim()) return failedStudents;
    const q = filterQueryFailed.toLowerCase().trim();
    return failedStudents.filter(s => s.nameTh.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q) || s.level.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.semester.toLowerCase().includes(q));
  }, [failedStudents, filterQueryFailed]);

  const SectionTitle = ({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h2>
      </div>
      {subtitle && <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">{subtitle}</p>}
    </div>
  );

  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-8 space-y-12">
        <HomeView projects={projects} />

        {/* 🎓 Failed Students (Login only) */}
        {isLoggedIn && (
          <section id="section-failed" className="scroll-mt-4 border-t border-yellow-500/30 pt-8">
            <SectionTitle icon="⚠️" title="รายงานนักศึกษาไม่ผ่านกิจกรรม" subtitle="รายชื่อนักศึกษาที่ไม่ผ่านกิจกรรมและเข้าแถว" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div />
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAddFailed(true)} className="btn-primary px-3 py-1.5 text-xs whitespace-nowrap">+ เพิ่มรายชื่อผู้ติดกิจกรรม</button>
                <input type="text" value={filterQueryFailed} onChange={e => setFilterQueryFailed(e.target.value)} placeholder="ค้นหา ชื่อนักศึกษา หรือ สาขา" className="input-field py-1.5 text-sm w-48" />
              </div>
            </div>
            <div className="rounded-lg border border-yellow-400/30 bg-yellow-50 px-5 py-4 dark:bg-yellow-900/10 mb-4">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">รายงานนักศึกษาไม่ผ่านกิจกรรม จะลบข้อมูลเมื่อครบ 3/4 ปี</p>
              <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">*หมายเหตุ: หากติด EDR ยังให้นับว่าติดกิจกรรม โดยจะคงข้อมูลไว้ที่ห้องกิจกรรมเท่านั้นแม้หน้าเว็บนี้จะไม่แสดงชื่อแล้ว</p>
            </div>
          </section>
        )}


        <div className="h-16" />
      </div>
    </ClientLayout>
  );
}