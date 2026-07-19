"use client";
import { FilterInput } from "@/components/ui/FilterInput";
import { useState } from "react";

const SUMMARY_DATA = [
  { club: "ชมรมดนตรีสากล", dept: "เทคโนโลยีดนตรี", project: "แข่งขันทักษะดนตรี", date: "15/05/2569", status: "อนุมัติ" },
  { club: "ชมรมกีฬาฟุตบอล", dept: "พลศึกษา", project: "แข่งกีฬาสีภายใน", date: "20/04/2569", status: "รอยืนยัน" },
  { club: "ชมรมหุ่นยนต์", dept: "เทคโนโลยีคอมพิวเตอร์", project: "แข่งขันหุ่นยนต์", date: "01/06/2569", status: "อนุมัติ" },
  { club: "ชมรมถ่ายภาพ", dept: "เทคโนโลยีคอมพิวเตอร์", project: "ถ่ายภาพงานวิชาการ", date: "28/05/2569", status: "ไม่อนุมัติ" },
  { club: "ชมรมอาสาพัฒนา", dept: "สังคมศึกษา", project: "ค่ายอาสาพัฒนา", date: "10/03/2569", status: "รอยืนยัน" },
  { club: "ชมรมดนตรีไทย", dept: "ศิลปวัฒนธรรม", project: "แสดงดนตรีไทย", date: "12/06/2569", status: "อนุมัติ" },
];

const STATUS_CLASS: Record<string, string> = {
  "อนุมัติ": "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  "ไม่อนุมัติ": "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  "รอยืนยัน": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
};

export default function ProjectSummaryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = SUMMARY_DATA.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return s.club.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q) || s.project.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.floor(filtered.length / PER_PAGE) + (filtered.length % PER_PAGE > 0 ? 1 : 0));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageData = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <section id="section-summary" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📑</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">ผลสรุปส่งโครงการ</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">ค้นหาผลการส่งเล่มรายงานของแต่ละชมรม</p>
      </div>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <FilterInput value={searchQuery} onChange={setSearchQuery} placeholder="ค้นหาสรุปเล่มโครงการ / Search summary report" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ชื่อชมรมวิชาชีพ</label>
          <select className="input-field py-2 text-sm"><option value="">ทั้งหมด</option><option>ชมรมดนตรีสากล</option><option>ชมรมกีฬาฟุตบอล</option><option>ชมรมหุ่นยนต์</option><option>ชมรมถ่ายภาพ</option><option>ชมรมอาสาพัฒนา</option></select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ภาคเรียน</label>
          <select className="input-field py-2 text-sm"><option value="">ทั้งหมด</option><option value="1">เทอม 1</option><option value="2">เทอม 2</option></select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ปีการศึกษา</label>
          <select className="input-field py-2 text-sm"><option value="">ทั้งหมด</option><option value="2569">2569</option><option value="2568">2568</option></select>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
        <table className="min-w-full divide-y" style={{ borderColor: "var(--color-border)" }}>
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชื่อโครงการ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชมรมวิชาชีพ/อวท.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">วันที่ส่ง</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">ไม่พบข้อมูลผลสรุปส่งโครงการ</td>
              </tr>
            ) : (
              pageData.map((s, i) => (
                <tr key={i} className="transition-colors hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3 text-sm font-medium">{s.project}</td>
                  <td className="px-4 py-3 text-sm">{s.club} ({s.dept})</td>
                  <td className="px-4 py-3 text-sm">{s.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[s.status] || ""}`}>{s.status}</span>
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