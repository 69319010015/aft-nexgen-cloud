"use client";

// ============================================
// AFT NexGen Cloud — ตารางกิจกรรมโครงการ
// แสดงข้อมูลกิจกรรมภาษาไทยล้วน พร้อมสถานะอนุมัติ
// แก้ไขในแถวได้ และอัปโหลดเอกสาร
// ============================================

import { useState, useCallback } from "react";
import { formatThaiBaht } from "@/lib/utils/calculations";
import { FileUploader } from "./FileUploader";
import type { Project } from "@/lib/types/database";

interface DataTableProps {
  projects: Project[];
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  isTeacher: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  "อนุมัติ": "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  "รอยืนยัน": "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  "ไม่อนุมัติ": "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

type EditingForm = {
  event_name_th: string;
  education_level: string;
  semester: string;
  budget_received: string;
  budget_spent: string;
  responsible_person: string;
  status: "อนุมัติ" | "รอยืนยัน" | "ไม่อนุมัติ";
};

export function DataTable({ projects, onUpdateProject, isTeacher }: DataTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditingForm>({
    event_name_th: "",
    education_level: "",
    semester: "",
    budget_received: "",
    budget_spent: "",
    responsible_person: "",
    status: "รอยืนยัน",
  });

  const startEditing = useCallback((project: Project) => {
    setEditingId(project.id);
    setEditForm({
      event_name_th: project.event_name_th,
      education_level: project.education_level,
      semester: project.semester,
      budget_received: project.budget_received.toString(),
      budget_spent: project.budget_spent.toString(),
      responsible_person: project.responsible_person,
      status: project.status,
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  const saveEditing = useCallback((id: string) => {
    onUpdateProject(id, {
      event_name_th: editForm.event_name_th,
      education_level: editForm.education_level,
      semester: editForm.semester,
      budget_received: Math.round(parseFloat(editForm.budget_received)) || 0,
      budget_spent: Math.round(parseFloat(editForm.budget_spent)) || 0,
      responsible_person: editForm.responsible_person,
      status: editForm.status,
    });
    setEditingId(null);
  }, [editForm, onUpdateProject]);

  if (projects.length === 0) {
    return (
      <div className="card card-gradient flex flex-col items-center justify-center py-12">
        <svg className="mb-3 h-12 w-12 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-lg font-medium text-[var(--color-text-secondary)]">ไม่พบข้อมูลกิจกรรม</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">ลองเปลี่ยนคำค้นหาหรือเพิ่มข้อมูลใหม่</p>
      </div>
    );
  }

  return (
    <div className="table-container card-gradient">
      <table className="min-w-full divide-y" style={{ borderColor: "var(--color-border)" }}>
        <thead>
          <tr className="bg-[var(--color-bg-secondary)]">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">ชื่อกิจกรรม</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">ระดับ/ภาคเรียน</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">สถานะ</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">งบที่ได้รับ</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">งบที่ใช้ไป</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">ผู้รับผิดชอบ</th>
            {isTeacher && (
              <>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">อัปโหลดเอกสาร</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">จัดการ</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
          {projects.map((project) => (
            <tr key={project.id} className="transition-colors duration-150 hover:bg-[var(--color-bg-secondary)]">
              {editingId === project.id ? (
                /* ─── กำลังแก้ไข ─── */
                <>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={editForm.event_name_th}
                      onChange={(e) => setEditForm(f => ({ ...f, event_name_th: e.target.value }))}
                      className="input-field py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <select
                        value={editForm.education_level}
                        onChange={(e) => setEditForm(f => ({ ...f, education_level: e.target.value }))}
                        className="input-field py-1 text-sm w-20"
                      >
                        <option>ปวช. 1</option>
                        <option>ปวช. 2</option>
                        <option>ปวช. 3</option>
                        <option>ปวส. 1</option>
                        <option>ปวส. 2</option>
                      </select>
                      <input
                        type="text"
                        value={editForm.semester}
                        onChange={(e) => setEditForm(f => ({ ...f, semester: e.target.value }))}
                        className="input-field py-1 text-sm w-20"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value as "อนุมัติ" | "รอยืนยัน" | "ไม่อนุมัติ" }))}
                      className="input-field py-1 text-sm"
                    >
                      <option value="อนุมัติ">อนุมัติ</option>
                      <option value="รอยืนยัน">รอยืนยัน</option>
                      <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={editForm.budget_received}
                      onChange={(e) => setEditForm(f => ({ ...f, budget_received: e.target.value }))}
                      className="input-field py-1 text-sm w-24"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={editForm.budget_spent}
                      onChange={(e) => setEditForm(f => ({ ...f, budget_spent: e.target.value }))}
                      className="input-field py-1 text-sm w-24"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={editForm.responsible_person}
                      onChange={(e) => setEditForm(f => ({ ...f, responsible_person: e.target.value }))}
                      className="input-field py-1 text-sm"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-[var(--color-text-secondary)]">—</span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => saveEditing(project.id)}
                        className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
                      >
                        บันทึก
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="rounded-md border px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                /* ─── แสดงผลปกติ ─── */
                <>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                    {project.event_name_th}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                    {project.education_level} / {project.semester}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                    {formatThaiBaht(Number(project.budget_received))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-[var(--color-danger)]">
                    {formatThaiBaht(Number(project.budget_spent))}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text-primary)]">
                    {project.responsible_person}
                  </td>
                  {isTeacher && (
                    <>
                      <td className="whitespace-nowrap px-4 py-3">
                        <FileUploader projectId={project.id} projectName={project.event_name_th} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(project)}
                            className="rounded-md border px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
                          >
                            แก้ไข
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* จำนวนแถว */}
      <div className="card-glass border-t px-4 py-3" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-xs text-[var(--color-text-muted)]">แสดง {projects.length} รายการ</p>
      </div>
    </div>
  );
}