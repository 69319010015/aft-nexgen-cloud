"use client";
import { FilterInput } from "@/components/ui/FilterInput";
import { useState } from "react";

const PROPOSAL_DATA = [
  { name: "โครงการแข่งขันทักษะวิชาชีพ", club: "ชมรมดนตรีสากล", season: "1", year: "2569", status: "อนุมัติ" },
  { name: "โครงการกีฬาสีภายใน", club: "ชมรมกีฬาฟุตบอล", season: "2", year: "2568", status: "รอยืนยัน" },
  { name: "โครงการแข่งขันหุ่นยนต์", club: "ชมรมหุ่นยนต์", season: "1", year: "2569", status: "อนุมัติ" },
  { name: "โครงการถ่ายภาพวิชาการ", club: "ชมรมถ่ายภาพ", season: "1", year: "2569", status: "ไม่อนุมัติ" },
  { name: "โครงการค่ายอาสาพัฒนา", club: "ชมรมอาสาพัฒนา", season: "2", year: "2568", status: "รอยืนยัน" },
  { name: "โครงการดนตรีไทยสัญจร", club: "ชมรมดนตรีสากล", season: "1", year: "2569", status: "อนุมัติ" },
];

const STATUS_CLASS: Record<string, string> = {
  "อนุมัติ": "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  "ไม่อนุมัติ": "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  "รอยืนยัน": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
};

const CLUB_OPTIONS = ["ชมรมดนตรีสากล", "ชมรมกีฬาฟุตบอล", "ชมรมหุ่นยนต์", "ชมรมถ่ายภาพ", "ชมรมอาสาพัฒนา"];

export default function BookSummaryView() {
  const [search, setSearch] = useState("");
  const [clubFilter, setClubFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = PROPOSAL_DATA.filter(d => {
    if (search.trim() && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.club.toLowerCase().includes(search.toLowerCase())) return false;
    if (clubFilter && d.club !== clubFilter) return false;
    if (seasonFilter && d.season !== seasonFilter) return false;
    if (yearFilter && d.year !== yearFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.floor(filtered.length / PER_PAGE) + (filtered.length % PER_PAGE > 0 ? 1 : 0));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageData = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <section id="section-proposal" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">สรุปเล่มโครงการ</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">ค้นหาข้อมูลสรุปเล่มโครงการและสถานะเล่มรายงาน</p>
      </div>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <FilterInput value={search} onChange={setSearch} placeholder="ค้นหาชื่อโครงการ" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ชมรมวิชาชีพ/อวท.</label>
          <select value={clubFilter} onChange={e => setClubFilter(e.target.value)} className="input-field py-2 text-sm">
            <option value="">ทั้งหมด</option>
            {CLUB_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ภาคเรียน</label>
          <select value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)} className="input-field py-2 text-sm">
            <option value="">ทั้งหมด</option><option value="1">1</option><option value="2">2</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ปีการศึกษา</label>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="input-field py-2 text-sm">
            <option value="">ทั้งหมด</option><option value="2569">2569</option><option value="2568">2568</option>
          </select>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
        <table className="min-w-full divide-y" style={{ borderColor: "var(--color-border)" }}>
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชื่อโครงการ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชมรมวิชาชีพ / อวท.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ภาคเรียน</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ปีการศึกษา</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">สถานะเล่มรายงาน</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {pageData.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">ไม่พบข้อมูลสรุปเล่มโครงการ</td></tr>
            ) : (
              pageData.map((d, i) => (
                <tr key={i} className="transition-colors hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3 text-sm font-medium">{d.name}</td>
                  <td className="px-4 py-3 text-sm">{d.club}</td>
                  <td className="px-4 py-3 text-sm">เทอม {d.season}</td>
                  <td className="px-4 py-3 text-sm">{d.year}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[d.status] || ""}`}>{d.status}</span>
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