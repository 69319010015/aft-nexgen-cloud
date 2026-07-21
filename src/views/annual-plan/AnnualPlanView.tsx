"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { FilterInput } from "@/components/ui/FilterInput";
import { createClient } from "@/lib/supabase/client";

// ─── Types ─────────────────────────────────────
type Role = "viewer" | "teacher";

interface ActivityPlan {
  id: string;
  title: string;
  fiscalYear: string;
  club: string;
  description: string;
  quarter: string;
  status: "ดำเนินการแล้ว" | "กำลังดำเนินการ" | "รอดำเนินการ";
  fileType: "xlsx" | "xls" | "pdf" | "docx" | "doc" | "link" | null;
  fileUrl: string | null;
  originalFilename: string;
  fileSize: number;
  uploadedAt: string | null;
  // Parsed Excel data
  excelColumns: string[];
  excelData: Record<string, string>[];
}

// ─── Mock Data with Excel JSON ─────────────────
const MOCK_PLANS: ActivityPlan[] = [
  {
    id: "1",
    title: "แผนปฏิบัติงานไตรมาส 1/2569 — ชมรมหุ่นยนต์",
    fiscalYear: "2569",
    club: "ชมรมหุ่นยนต์",
    description: "แผนการดำเนินงานประจำไตรมาส 1 ปีการศึกษา 2569",
    quarter: "1",
    status: "ดำเนินการแล้ว",
    fileType: "xlsx",
    fileUrl: "#",
    originalFilename: "แผนปฏิบัติงาน_Q1_2569.xlsx",
    fileSize: 24576,
    uploadedAt: "15/05/2569",
    excelColumns: ["ลำดับ", "กิจกรรม", "วันที่เริ่ม", "วันที่สิ้นสุด", "ผู้รับผิดชอบ", "งบประมาณ", "สถานะ"],
    excelData: [
      { "ลำดับ": "1", "กิจกรรม": "อบรมพื้นฐานหุ่นยนต์", "วันที่เริ่ม": "01/06/2569", "วันที่สิ้นสุด": "05/06/2569", "ผู้รับผิดชอบ": "นายสมชาย", "งบประมาณ": "15,000", "สถานะ": "เสร็จ" },
      { "ลำดับ": "2", "กิจกรรม": "แข่งขันหุ่นยนต์ภายใน", "วันที่เริ่ม": "15/06/2569", "วันที่สิ้นสุด": "16/06/2569", "ผู้รับผิดชอบ": "น.ส.วรินทร", "งบประมาณ": "25,000", "สถานะ": "เสร็จ" },
      { "ลำดับ": "3", "กิจกรรม": "สาธิตหุ่นยนต์ในงานวิชาการ", "วันที่เริ่ม": "20/06/2569", "วันที่สิ้นสุด": "20/06/2569", "ผู้รับผิดชอบ": "นายชัยวัฒน์", "งบประมาณ": "8,000", "สถานะ": "เสร็จ" },
      { "ลำดับ": "4", "กิจกรรม": "ประชุมทีมหุ่นยนต์", "วันที่เริ่ม": "01/06/2569", "วันที่สิ้นสุด": "30/06/2569", "ผู้รับผิดชอบ": "ที่ปรึกษา", "งบประมาณ": "0", "สถานะ": "เสร็จ" },
    ],
  },
  {
    id: "2",
    title: "แผนกิจกรรมชมรมดนตรีไทย ภาคเรียนที่ 1",
    fiscalYear: "2569",
    club: "ชมรมดนตรีไทย",
    description: "ตารางซ้อมและแสดงดนตรีไทย ประจำภาคเรียนที่ 1/2569",
    quarter: "1",
    status: "ดำเนินการแล้ว",
    fileType: "xlsx",
    fileUrl: "#",
    originalFilename: "ดนตรีไทย_Q1_2569.xlsx",
    fileSize: 18432,
    uploadedAt: "01/06/2569",
    excelColumns: ["ลำดับ", "รายการ", "วัน/เวลา", "สถานที่", "ผู้รับผิดชอบ", "หมายเหตุ"],
    excelData: [
      { "ลำดับ": "1", "รายการ": "ซ้อมวงรวม", "วัน/เวลา": "จันทร์ 15:00-17:00", "สถานที่": "ห้องดนตรีไทย", "ผู้รับผิดชอบ": "ครูกิจ", "หมายเหตุ": "ทุกสัปดาห์" },
      { "ลำดับ": "2", "รายการ": "ซ้องเครื่องสาย", "วัน/เวลา": "พุธ 15:00-17:00", "สถานที่": "ห้องดนตรีไทย", "ผู้รับผิดชอบ": "ครูสมหมาย", "หมายเหตุ": "ทุกสัปดาห์" },
      { "ลำดับ": "3", "รายการ": "แสดงในงานไหว้ครู", "วัน/เวลา": "15/06/2569 08:00", "สถานที่": "หอประชุม", "ผู้รับผิดชอบ": "ชมรมดนตรีไทย", "หมายเหตุ": "จัดชุดใหญ่" },
    ],
  },
  {
    id: "3",
    title: "แผนฝึกซ้อมกีฬาสี 2569",
    fiscalYear: "2569",
    club: "ชมรมกีฬาฟุตบอล",
    description: "ตารางซ้อมกีฬาสีและแข่งขันภายใน",
    quarter: "2",
    status: "กำลังดำเนินการ",
    fileType: "xlsx",
    fileUrl: "#",
    originalFilename: "กีฬาสี_ซ้อม.xlsx",
    fileSize: 12288,
    uploadedAt: "10/07/2569",
    excelColumns: ["ลำดับ", "กิจกรรม", "วันซ้อม", "เวลา", "สนาม", "โค้ช"],
    excelData: [
      { "ลำดับ": "1", "กิจกรรม": "ซ้อมฟุตบอล", "วันซ้อม": "จันทร์/พุธ/ศุกร์", "เวลา": "16:00-18:00", "สนาม": "สนามกีฬา", "โค้ช": "โค้ชเอก" },
      { "ลำดับ": "2", "กิจกรรม": "ซ้อมวิ่งผลัด", "วันซ้อม": "อังคาร/พฤหัส", "เวลา": "16:00-17:30", "สนาม": "ลู่กรีฑา", "โค้ช": "โค้ชชัย" },
      { "ลำดับ": "3", "กิจกรรม": "แข่งขันกระชับมิตร", "วันซ้อม": "20/07/2569", "เวลา": "09:00-12:00", "สนาม": "สนามกีฬา", "โค้ช": "ทีมงาน" },
    ],
  },
  {
    id: "4",
    title: "แผนอบรมคุณธรรม จริยธรรม",
    fiscalYear: "2569",
    club: "อวท.",
    description: "โครงการอบรมคุณธรรม จริยธรรม สำหรับนักศึกษา",
    quarter: "2",
    status: "กำลังดำเนินการ",
    fileType: "xlsx",
    fileUrl: "#",
    originalFilename: "อบรมคุณธรรม_2569.xlsx",
    fileSize: 10240,
    uploadedAt: "12/02/2569",
    excelColumns: ["ลำดับ", "หัวข้อ", "วิทยากร", "วันที่", "ห้อง", "กลุ่มเป้าหมาย"],
    excelData: [
      { "ลำดับ": "1", "หัวข้อ": "คุณธรรมพื้นฐาน", "วิทยากร": "พระมหาสมชาย", "วันที่": "05/08/2569", "ห้อง": "หอประชุม", "กลุ่มเป้าหมาย": "ปวช.1-2" },
      { "ลำดับ": "2", "หัวข้อ": "จริยธรรมในวิชาชีพ", "วิทยากร": "อาจารย์สุนทร", "วันที่": "12/08/2569", "ห้อง": "ห้อง 302", "กลุ่มเป้าหมาย": "ปวส." },
      { "ลำดับ": "3", "หัวข้อ": "จิตอาสาพัฒนา", "วิทยากร": "คุณกมล", "วันที่": "19/08/2569", "ห้อง": "บริเวณวิทยาลัย", "กลุ่มเป้าหมาย": "ทั้งหมด" },
    ],
  },
  {
    id: "5",
    title: "แผนงาน อวท. ปี 2567",
    fiscalYear: "2567",
    club: "อวท.",
    description: "แผนงานคณะกรรมการ อวท. ประจำปีงบประมาณ 2567",
    quarter: "3",
    status: "ดำเนินการแล้ว",
    fileType: "xlsx",
    fileUrl: "#",
    originalFilename: "แผนอวท_2567.xlsx",
    fileSize: 30720,
    uploadedAt: "15/08/2567",
    excelColumns: ["ลำดับ", "โครงการ", "งบประมาณ", "เริ่มต้น", "สิ้นสุด", "ผู้รับผิดชอบ", "ผล"],
    excelData: [
      { "ลำดับ": "1", "โครงการ": "แข่งขันทักษะวิชาชีพ", "งบประมาณ": "150,000", "เริ่มต้น": "01/06/2567", "สิ้นสุด": "30/06/2567", "ผู้รับผิดชอบ": "คณะกรรมการ", "ผล": "สำเร็จ" },
      { "ลำดับ": "2", "โครงการ": "ค่ายอาสาพัฒนา", "งบประมาณ": "45,000", "เริ่มต้น": "15/07/2567", "สิ้นสุด": "17/07/2567", "ผู้รับผิดชอบ": "ฝ่ายกิจกรรม", "ผล": "สำเร็จ" },
      { "ลำดับ": "3", "โครงการ": "ทัศนศึกษาดูงาน", "งบประมาณ": "320,000", "เริ่มต้น": "10/08/2567", "สิ้นสุด": "12/08/2567", "ผู้รับผิดชอบ": "อาจารย์สุนทร", "ผล": "สำเร็จ" },
      { "ลำดับ": "4", "โครงการ": "แข่งขันกีฬาสี", "งบประมาณ": "200,000", "เริ่มต้น": "01/09/2567", "สิ้นสุด": "05/09/2567", "ผู้รับผิดชอบ": "ฝ่ายกีฬา", "ผล": "สำเร็จ" },
      { "ลำดับ": "5", "โครงการ": "อบรมคุณธรรม", "งบประมาณ": "85,000", "เริ่มต้น": "20/09/2567", "สิ้นสุด": "22/09/2567", "ผู้รับผิดชอบ": "ฝ่ายพัฒนานักศึกษา", "ผล": "สำเร็จ" },
    ],
  },
];

const FISCAL_YEARS = ["2567", "2568", "2569"];

const STATUS_CLASS: Record<string, string> = {
  "ดำเนินการแล้ว": "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800",
  "กำลังดำเนินการ": "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "รอดำเนินการ": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
};

const FILE_ICON: Record<string, string> = {
  xlsx: "📊",
  xls: "📊",
  pdf: "📄",
  docx: "📝",
  doc: "📝",
  link: "🔗",
};

// ─── Excel Grid Component ──────────────────────
function ExcelGrid({ columns, data }: { columns: string[]; data: Record<string, string>[] }) {
  if (!columns.length || !data.length) return null;
  return (
    <div className="mt-3 overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
      {/* Header row */}
      <div className="grid gap-px" style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(100px, 1fr))`,
        backgroundColor: "var(--color-border)",
      }}>
        {columns.map((col, i) => (
          <div key={i} className="bg-[var(--color-bg-secondary)] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
            {col}
          </div>
        ))}
      </div>
      {/* Data rows */}
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
        {data.map((row, ri) => (
          <div key={ri} className="grid gap-px transition-colors hover:bg-[var(--color-bg-secondary)]" style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(100px, 1fr))`,
          }}>
            {columns.map((col, ci) => (
              <div key={ci} className="bg-[var(--color-bg-card)] px-3 py-2 text-[11px]" style={{ color: "var(--color-text-primary)" }}>
                {row[col] || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────
export default function AnnualPlanView() {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", fiscalYear: "2569", club: "", description: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Fetch plans from API
  const [plans, setPlans] = useState<ActivityPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch("/api/activity-plans");
      const json = await res.json();
      if (json.plans) setPlans(json.plans);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check user role
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("aft-user-type");
      setRole(userType === "teacher" ? "teacher" : "viewer");
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Filtered data
  const filtered = useMemo(() => {
    return plans.filter(p => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.club.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.originalFilename.toLowerCase().includes(q);
      const matchYear = !yearFilter || p.fiscalYear === yearFilter;
      return matchSearch && matchYear;
    });
  }, [search, yearFilter, plans]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setUploadFile(e.target.files[0]);
  }, []);

  const handleUploadSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("กรุณาเลือกไฟล์ก่อน / Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("fiscalYear", uploadForm.fiscalYear);
    formData.append("club", uploadForm.club);
    formData.append("description", uploadForm.description);
    formData.append("quarter", "1");
    formData.append("file", uploadFile);

    try {
      const res = await fetch("/api/activity-plans", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "เกิดข้อผิดพลาด / Upload failed");
        return;
      }

      setShowUpload(false);
      setUploadForm({ title: "", fiscalYear: "2569", club: "", description: "" });
      setUploadFile(null);
      fetchPlans(); // Refresh list
    } catch (err) {
      console.error("Upload error:", err);
      alert("เกิดข้อผิดพลาดในการอัปโหลด / Upload error");
    }
  }, [uploadForm, uploadFile, fetchPlans]);

  return (
    <section id="section-action-plan" className="scroll-mt-4">
      {/* ─── Header ──────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">แผนปฏิบัติกิจกรรมประจำปีงบประมาณ ชมรมวิชาชีพ</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">Vocational Student Association Annual Activity Plan</p>
      </div>

      {/* ─── Excel Sheet Warning Banner ────────── */}
      <div className="rounded-lg border border-yellow-400/30 bg-yellow-50 px-5 py-4 dark:bg-yellow-900/10 mb-4">
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          ⚠️ ระบบอ่านไฟล์ Excel ได้เฉพาะ Sheet แรกเท่านั้น
        </p>
        <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
          ✅ <strong>วิธีที่ 1 (แนะนำ):</strong> อัปโหลดทีละ Sheet — Copy แต่ละ sheet ไปบันทึกเป็นไฟล์แยก → อัปโหลดทีละไฟล์
          <br />
          ✅ <strong>วิธีที่ 2:</strong> รวมทุก Sheet ไว้ใน Sheet เดียว — Copy ข้อมูล Sheet2, Sheet3 มาต่อท้าย Sheet1 → อัปโหลดครั้งเดียว
          <br />
          ⚠️ <strong>ไฟล์ .doc (.doc) เก่าเกินไป:</strong> กรุณาแปลงเป็น .pdf ก่อนอัปโหลด — ระบบรองรับเฉพาะ .pdf เท่านั้นสำหรับเอกสาร Word
        </p>
      </div>

      {/* ─── Control Bar ─────────────────────── */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex-1 max-w-md">
            <FilterInput value={search} onChange={setSearch} placeholder="ค้นหากิจกรรม / ชมรม / ไฟล์..." />
          </div>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="input-field w-full sm:w-44"
          >
            <option value="">🗓️ ทุกปีงบประมาณ</option>
            {FISCAL_YEARS.map(y => (
              <option key={y} value={y}>ปีงบประมาณ {y}</option>
            ))}
          </select>
        </div>
        {role === "teacher" && (
          <button
            onClick={() => setShowUpload(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            อัปโหลดแผน / Upload Plan
          </button>
        )}
      </div>

      {/* ─── Activity Cards ──────────────────── */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-lg border p-8 text-center" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm text-[var(--color-text-muted)]">ไม่พบข้อมูลแผนปฏิบัติกิจกรรม</p>
          </div>
        ) : (
          filtered.map((plan) => {
            const isExpanded = expandedId === plan.id;
            const fileIcon = FILE_ICON[plan.fileType as keyof typeof FILE_ICON] || "📁";
            const fileLabel = plan.fileType ? plan.fileType.toUpperCase() : "";

            return (
              <div
                key={plan.id}
                className="rounded-lg border transition-all duration-200 hover:shadow-md"
                style={{ borderColor: "var(--color-border)" }}
              >
                {/* Card Header — Click to expand */}
                <button
                  onClick={() => toggleExpand(plan.id)}
                  className="flex w-full items-start justify-between gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {plan.title}
                      </h3>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASS[plan.status] || ""}`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[11px] text-[var(--color-text-muted)]">🏫 {plan.club}</span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">📆 ปี {plan.fiscalYear}</span>
                      {plan.quarter && <span className="text-[11px] text-[var(--color-text-muted)]">📊 ไตรมาส {plan.quarter}</span>}
                      {plan.uploadedAt && (
                        <span className="text-[11px] text-[var(--color-text-muted)]">📅 {plan.uploadedAt}</span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="mt-1 text-[11px] text-[var(--color-text-muted)] line-clamp-1">{plan.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      {role === "teacher" && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`ลบ "${plan.title}"? / Delete "${plan.title}"?`)) {
                              fetch(`/api/activity-plans?id=${plan.id}`, { method: "DELETE" })
                                .then(res => res.json())
                                .then(json => {
                                  if (json.success) fetchPlans();
                                  else alert(json.error || "ลบไม่สำเร็จ");
                                })
                                .catch(() => alert("เกิดข้อผิดพลาด / Delete error"));
                            }
                          }}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="ลบ / Delete"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                        <span>{fileIcon}</span>
                        <span>{fileLabel}</span>
                      </span>
                    </div>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      style={{ color: "var(--color-text-muted)" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content: Excel Grid or Document Viewer */}
                {isExpanded && (
                  <div className="border-t px-4 pb-4" style={{ borderColor: "var(--color-border)" }}>
                    {/* Excel data */}
                    {plan.excelData.length > 0 && (
                      <ExcelGrid columns={plan.excelColumns} data={plan.excelData} />
                    )}

                    {/* File viewer section */}
                    {(plan.fileType === "pdf" || plan.fileType === "docx" || plan.fileType === "xlsx" || plan.fileType === "xls") && (
                      <div className="mt-2">
                        {/* PDF: show inline via file proxy */}
                        {plan.fileType === "pdf" && (
                          <iframe
                            src={`/api/activity-plans/file?id=${plan.id}`}
                            className="w-full rounded-lg border"
                            style={{ height: "500px", borderColor: "var(--color-border)" }}
                            title={plan.originalFilename}
                          />
                        )}

                        {/* DOCX: show inline via Google Docs Viewer */}
                        {plan.fileType === "docx" && plan.fileUrl && (
                          <iframe
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(plan.fileUrl)}&embedded=true`}
                            className="w-full rounded-lg border"
                            style={{ height: "500px", borderColor: "var(--color-border)" }}
                            title={plan.originalFilename}
                          />
                        )}

                        {/* Download/View button for ALL file types */}
                        <div className="mt-2 flex items-center justify-center rounded-lg border bg-gray-50 p-6 dark:bg-gray-800/30" style={{ borderColor: "var(--color-border)" }}>
                          <a
                            href={`/api/activity-plans/file?id=${plan.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-black shadow-sm transition-all hover:bg-accent-hover"
                          >
                            📥 ดาวน์โหลด / เปิดไฟล์ {plan.fileType?.toUpperCase()}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* File info */}
                    {plan.originalFilename && (
                      <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
                        📎 {plan.originalFilename} ({(plan.fileSize / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ─── Upload Modal (Teacher only) ─────── */}
      {showUpload && role === "teacher" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowUpload(false)}>
          <div
            className="card w-full max-w-lg rounded-xl p-6 shadow-2xl"
            style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                📤 อัปโหลดแผน / Upload Plan
              </h3>
              <button onClick={() => setShowUpload(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-text-secondary)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ชื่อแผน / Plan Name</label>
                <input type="text" required value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="ชื่อกิจกรรม" className="input-field" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ปีงบประมาณ</label>
                  <select value={uploadForm.fiscalYear} onChange={e => setUploadForm(f => ({ ...f, fiscalYear: e.target.value }))} className="input-field">
                    {FISCAL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ชมรม / Club</label>
                  <input type="text" value={uploadForm.club} onChange={e => setUploadForm(f => ({ ...f, club: e.target.value }))}
                    placeholder="ชื่อชมรม" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">รายละเอียด</label>
                <textarea value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="รายละเอียดแผน..." rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ไฟล์เอกสาร (.xlsx, .xls, .pdf, .docx)</label>
                <input type="file" accept=".xlsx,.xls,.pdf,.docx" onChange={handleFileChange}
                  className="w-full text-xs text-[var(--color-text-secondary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:text-xs file:font-medium file:bg-accent file:text-black file:border-accent hover:file:bg-accent-hover" />
              </div>
              {uploadFile && (
                <p className="text-xs text-[var(--color-text-secondary)]">📎 {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowUpload(false)} className="btn-outline px-5 py-2 text-sm">ยกเลิก</button>
                <button type="submit" className="btn-primary px-5 py-2 text-sm">📥 บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}