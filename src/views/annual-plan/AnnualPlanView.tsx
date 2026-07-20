"use client";
import { FilterInput } from "@/components/ui/FilterInput";
import { useState } from "react";

const ANNUAL_PLANS = [
  { activity: "แข่งขันทักษะวิชาชีพ ระดับสถานศึกษา", club: "อวท.", quarter: "1", year: "2569", status: "ดำเนินการแล้ว" },
  { activity: "ประชุมคณะกรรมการ อวท. ครั้งที่ 1/2569", club: "อวท.", quarter: "1", year: "2569", status: "ดำเนินการแล้ว" },
  { activity: "ค่ายอาสาพัฒนาชมรมวิชาชีพ", club: "ชมรมอาสาพัฒนา", quarter: "2", year: "2569", status: "กำลังดำเนินการ" },
  { activity: "แข่งขันกีฬาสีภายใน", club: "ชมรมกีฬาฟุตบอล", quarter: "2", year: "2569", status: "รอดำเนินการ" },
  { activity: "ทัศนศึกษาดูงานสถานประกอบการ", club: "ชมรมหุ่นยนต์", quarter: "3", year: "2569", status: "รอดำเนินการ" },
  { activity: "แสดงดนตรีไทยในงานวิชาการ", club: "ชมรมดนตรีไทย", quarter: "1", year: "2569", status: "ดำเนินการแล้ว" },
  { activity: "ถ่ายภาพงานวิชาการ", club: "ชมรมถ่ายภาพ", quarter: "2", year: "2569", status: "รอดำเนินการ" },
  { activity: "อบรมคุณธรรม จริยธรรม", club: "อวท.", quarter: "2", year: "2569", status: "กำลังดำเนินการ" },
];

const STATUS_CLASS: Record<string, string> = {
  "ดำเนินการแล้ว": "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  "กำลังดำเนินการ": "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  "รอดำเนินการ": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
};

export default function AnnualPlanView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = ANNUAL_PLANS.filter(p =>
    !search.trim() || p.activity.toLowerCase().includes(search.toLowerCase()) || p.club.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.floor(filtered.length / PER_PAGE) + (filtered.length % PER_PAGE > 0 ? 1 : 0));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageData = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <section id="section-action-plan" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">แผนปฏิบัติกิจกรรมประจำปีงบประมาณ ชมรมวิชาชีพ</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">แผนการดำเนินงานประจำปีของชมรมวิชาชีพ</p>
      </div>
      <div className="mb-4">
        <FilterInput value={search} onChange={setSearch} placeholder="ค้นหากิจกรรม / ชมรม" />
      </div>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
        <table className="min-w-full divide-y" style={{ borderColor: "var(--color-border)" }}>
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">กิจกรรม</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชมรม/อวท.</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">ไตรมาส</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">ปีการศึกษา</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">ไม่พบข้อมูลแผนปฏิบัติกิจกรรม</td>
              </tr>
            ) : (
              pageData.map((p, i) => (
                <tr key={i} className="transition-colors hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3 text-sm font-medium">{p.activity}</td>
                  <td className="px-4 py-3 text-sm">{p.club}</td>
                  <td className="px-4 py-3 text-center text-sm">ไตรมาส {p.quarter}</td>
                  <td className="px-4 py-3 text-center text-sm">{p.year}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[p.status] || ""}`}>{p.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="border-t px-4 py-3 flex items-center justify-between flex-wrap gap-2" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-xs text-[var(--color-text-secondary)]">{filtered.length} รายการ (หน้าที่ {safePage}/{totalPages})</p>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`min-w-[28px] rounded px-2 py-1 text-xs font-medium transition-colors ${
                  p === safePage ? "bg-accent-400 text-[#0F172A]" : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-accent-100"
                }`}>{p}</button>
            ))}
            <span className="text-xs text-[var(--color-text-secondary)] ml-2">ไปหน้า</span>
            <input type="number" min={1} max={totalPages} value={safePage}
              onChange={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= totalPages) setPage(v); }}
              className="w-14 rounded border px-2 py-1 text-xs text-center" style={{ borderColor: "var(--color-border)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}