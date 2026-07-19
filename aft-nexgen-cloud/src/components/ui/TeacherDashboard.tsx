"use client";

// ============================================
// AFT NexGen Cloud — Teacher Dashboard
// Student registration approval, inline editing,
// and academic year bulk deletion
// ============================================

import { useState, useMemo, useCallback } from "react";

// ─── Types ────────────────────────────────────
export type PendingStudent = {
  id: string;
  studentId: string;
  fullName: string;
  department: string;
  level: string;
  semester: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

const DEPARTMENTS = [
  "ช่างยนต์ / Automotive Technology",
  "ช่างกลโรงงาน / Machine Tool Technology",
  "ช่างเชื่อมโลหะ / Welding and Metal Fabrication",
  "ไฟฟ้ากำลัง / Electrical Power Technology",
  "อิเล็กทรอนิกส์ / Electronics Technology",
  "โยธาและก่อสร้าง / Civil and Building Construction",
  "สถาปัตยกรรม / Architectural Technology",
  "เทคนิคอุตสาหกรรม / Industrial Technology",
  "การจัดการโลจิสติกส์ / Logistics Management",
  "เทคโนโลยีคอมพิวเตอร์ / Computer Technology",
  "เทคโนโลยีสารสนเทศ / Information Technology",
];

const LEVELS = ["ปวช. 1", "ปวช. 2", "ปวช. 3", "ปวส. 1", "ปวส. 2"];

// ─── Mock Pending Students ────────────────────
const MOCK_PENDING: PendingStudent[] = [
  { id: "1", studentId: "69319010001", fullName: "นายสมชาย ใจดี", department: "ช่างยนต์ / Automotive Technology", level: "ปวช. 1", semester: "1/2569", status: "PENDING" },
  { id: "2", studentId: "69319010002", fullName: "นางสาววรินทร ม่วงคำ", department: "ไฟฟ้ากำลัง / Electrical Power Technology", level: "ปวส. 1", semester: "1/2569", status: "PENDING" },
  { id: "3", studentId: "69319010003", fullName: "นายชัยวัฒน์ ทรัพย์ทวี", department: "เทคโนโลยีคอมพิวเตอร์ / Computer Technology", level: "ปวช. 2", semester: "2/2568", status: "PENDING" },
  { id: "4", studentId: "69319010004", fullName: "นางสาวกนกวรรณ สมศรี", department: "อิเล็กทรอนิกส์ / Electronics Technology", level: "ปวส. 2", semester: "1/2569", status: "PENDING" },
  { id: "5", studentId: "69319010005", fullName: "นายอดิศร แก้วใส", department: "ช่างเชื่อมโลหะ / Welding and Metal Fabrication", level: "ปวช. 3", semester: "2/2568", status: "PENDING" },
  { id: "6", studentId: "69319010006", fullName: "นางสาวรัตนา สุขใจ", department: "การจัดการโลจิสติกส์ / Logistics Management", level: "ปวช. 1", semester: "1/2569", status: "PENDING" },
  { id: "7", studentId: "69319010007", fullName: "นายธีรพล มั่นคง", department: "โยธาและก่อสร้าง / Civil and Building Construction", level: "ปวส. 1", semester: "1/2569", status: "PENDING" },
];

// ─── Extract academic year from semester ──────
const getAcademicYear = (semester: string) => semester.split("/")[1] || "";

// ─── Teacher Dashboard Component ──────────────
export function TeacherDashboard() {
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>(MOCK_PENDING);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PendingStudent>>({});
  const [filterQuery, setFilterQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmYearInput, setConfirmYearInput] = useState("");
  const [clearError, setClearError] = useState("");

  // ─── Filter by query ─────────────────────────
  const filteredStudents = useMemo(() => {
    if (!filterQuery.trim()) return pendingStudents;
    const q = filterQuery.toLowerCase().trim();
    return pendingStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.level.toLowerCase().includes(q)
    );
  }, [pendingStudents, filterQuery]);

  // ─── Approve student ─────────────────────────
  const handleApprove = useCallback((id: string) => {
    setPendingStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "APPROVED" as const } : s))
    );
  }, []);

  const handleReject = useCallback((id: string) => {
    setPendingStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "REJECTED" as const } : s))
    );
  }, []);

  // ─── Inline Edit ─────────────────────────────
  const startEditing = useCallback((student: PendingStudent) => {
    setEditingId(student.id);
    setEditForm({
      fullName: student.fullName,
      department: student.department,
      level: student.level,
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditForm({});
  }, []);

  const saveEditing = useCallback((id: string) => {
    setPendingStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              fullName: editForm.fullName || s.fullName,
              department: editForm.department || s.department,
              level: editForm.level || s.level,
            }
          : s
      )
    );
    setEditingId(null);
    setEditForm({});
  }, [editForm]);

  // ─── Delete single student ───────────────────
  const handleDelete = useCallback((id: string) => {
    setPendingStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ─── Bulk Clear by Academic Year ─────────────
  const studentsInYear = useMemo(() => {
    if (!yearFilter.trim()) return [];
    return pendingStudents.filter(
      (s) => getAcademicYear(s.semester) === yearFilter.trim()
    );
  }, [pendingStudents, yearFilter]);

  const handleClearAll = useCallback(() => {
    if (confirmYearInput !== yearFilter) {
      setClearError("ปีการศึกษาไม่ตรงกัน / Year does not match");
      return;
    }
    setPendingStudents((prev) =>
      prev.filter((s) => getAcademicYear(s.semester) !== yearFilter)
    );
    setShowClearConfirm(false);
    setConfirmYearInput("");
    setYearFilter("");
    setClearError("");
  }, [confirmYearInput, yearFilter]);

  return (
    <div className="space-y-6">
      {/* ─── Header ────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          แดชบอร์ดอาจารย์ / Teacher Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          จัดการการลงทะเบียนนักศึกษา / Manage Student Registrations
        </p>
      </div>

      {/* ─── Action Tab ────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border p-4" style={{ borderColor: "var(--color-border)" }}>
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          🧑‍🏫 แผงควบคุมการสมัคร
        </span>
        <button className="btn-primary px-4 py-2 text-sm">
          ยืนยันการสมัครนักเรียน อวท.
        </button>
      </div>

      {/* ─── Search ────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          รายชื่อผู้รออนุมัติ / Pending Approvals
        </h2>
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="ค้นหานักศึกษา / Search Student..."
          className="input-field w-full sm:w-72"
        />
      </div>

      {/* ─── Pending Students Table ────────────── */}
      <div className="overflow-hidden rounded-lg border card-gradient" style={{ borderColor: "var(--color-border)" }}>
        <table className="min-w-full divide-y" style={{ borderColor: "var(--color-border)" }}>
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">รหัสมจ.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">ชื่อ-นามสกุล</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">สาขา/แผนก</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">ระดับ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">ภาคเรียน</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">สถานะ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
                  ไม่มีข้อมูลนักศึกษา / No student records
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="transition-colors duration-150 hover:bg-[var(--color-bg-secondary)]">
                  {editingId === student.id ? (
                    /* ─── EDITING ROW ─────────── */
                    <>
                      <td className="px-4 py-2 text-sm text-[var(--color-text-secondary)]">{student.studentId}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editForm.fullName || ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                          className="input-field py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editForm.department || ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
                          className="input-field py-1 text-sm"
                        >
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editForm.level || ""}
                          onChange={(e) => setEditForm((f) => ({ ...f, level: e.target.value }))}
                          className="input-field py-1 text-sm"
                        >
                          {LEVELS.map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 text-sm text-[var(--color-text-secondary)]">{student.semester}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/20 dark:text-accent-300">
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => saveEditing(student.id)}
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
                    /* ─── READ-ONLY ROW ──────── */
                    <>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text-secondary)]">{student.studentId}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">{student.fullName}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text-secondary)]">{student.department}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text-secondary)]">{student.level}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--color-text-secondary)]">{student.semester}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          student.status === "APPROVED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : student.status === "REJECTED"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-accent-100 text-accent-700 dark:bg-accent-900/20 dark:text-accent-300"
                        }`}>
                          {student.status === "APPROVED" ? "อนุมัติแล้ว" : student.status === "REJECTED" ? "ถูกปฏิเสธ" : "รออนุมัติ"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex gap-1">
                          {student.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApprove(student.id)}
                                className="rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-green-600"
                              >
                                อนุมัติ
                              </button>
                              <button
                                onClick={() => handleReject(student.id)}
                                className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-red-600"
                              >
                                ปฏิเสธ
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => startEditing(student)}
                            className="rounded-md border px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)]"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Row count */}
        <div className="card-glass border-t px-4 py-3" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {filteredStudents.length} รายการ / records
          </p>
        </div>
      </div>

      {/* ─── Bulk Delete by Academic Year ──────── */}
      <div className="rounded-lg border p-5" style={{ borderColor: "var(--color-border)" }}>
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          🗑️ ลบข้อมูลตามปีการศึกษา / Delete by Academic Year
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          ระบุปีการศึกษา (เช่น 2569) เพื่อกรองและลบข้อมูลนักศึกษาเฉพาะปีนั้น
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              ปีการศึกษา / Academic Year
            </label>
            <input
              type="text"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="เช่น 2569"
              className="input-field"
            />
          </div>
          <div className="flex items-center gap-2">
            {yearFilter && (
              <span className="text-xs text-[var(--color-text-secondary)]">
                พบ {studentsInYear.length} รายการ
              </span>
            )}
            <button
              onClick={() => {
                if (!yearFilter || studentsInYear.length === 0) return;
                setShowClearConfirm(true);
                setConfirmYearInput("");
                setClearError("");
              }}
              disabled={!yearFilter || studentsInYear.length === 0}
              className="btn-primary rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              ลบทั้งหมด / Clear All
            </button>
          </div>
        </div>
      </div>

      {/* ─── Confirmation Modal ────────────────── */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card-gradient w-full max-w-md rounded-xl border p-6 shadow-2xl" style={{ borderColor: "var(--color-border)" }}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  ยืนยันการลบข้อมูล / Confirm Deletion
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  คุณกำลังจะลบข้อมูลนักศึกษาปีการศึกษา {yearFilter} จำนวน {studentsInYear.length} รายการ
                </p>
              </div>
            </div>

            <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
              กรุณาพิมพ์ <strong className="text-red-600">{yearFilter}</strong> เพื่อยืนยันการลบข้อมูล
            </p>

            {clearError && (
              <p className="mb-2 text-xs text-red-600">{clearError}</p>
            )}

            <input
              type="text"
              value={confirmYearInput}
              onChange={(e) => setConfirmYearInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder={`พิมพ์ ${yearFilter} เพื่อยืนยัน`}
              className="input-field mb-4"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowClearConfirm(false); setClearError(""); }}
                className="btn-outline flex-1 py-2 text-sm"
              >
                ยกเลิก / Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={confirmYearInput !== yearFilter}
                className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                ยืนยันการลบ / Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}