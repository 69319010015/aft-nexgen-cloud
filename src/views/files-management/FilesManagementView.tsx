"use client";
import { FilterInput } from "@/components/ui/FilterInput";
import { useState } from "react";

const MOCK_FILES = [
  { name: "รายงานผลการดำเนินงานประจำปี 2569", type: "PDF", season: "1", year: "2569", uploaded: "15/06/2569" },
  { name: "แผนปฏิบัติกิจกรรม ชมรมดนตรีสากล", type: "DOCX", season: "1", year: "2569", uploaded: "10/06/2569" },
  { name: "บัญชีรายรับ-รายจ่าย ชมรมหุ่นยนต์", type: "XLSX", season: "2", year: "2568", uploaded: "20/05/2569" },
  { name: "สรุปผลการแข่งขันทักษะวิชาชีพ", type: "PDF", season: "1", year: "2569", uploaded: "05/06/2569" },
  { name: "ภาพกิจกรรมค่ายอาสาพัฒนา", type: "JPG", season: "2", year: "2568", uploaded: "28/04/2569" },
  { name: "รายงานการประชุมคณะกรรมการ อวท.", type: "PDF", season: "1", year: "2569", uploaded: "01/06/2569" },
  { name: "แบบคำร้องขอซ่อมกิจกรรม", type: "DOCX", season: "2", year: "2568", uploaded: "15/03/2569" },
  { name: "ทะเบียนสมาชิก อวท. ปี 2569", type: "XLSX", season: "1", year: "2569", uploaded: "20/06/2569" },
];

const FILE_TYPES = ["ทั้งหมด", "PDF", "DOCX", "XLSX", "JPG"];

export default function FilesManagementView() {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("ทั้งหมด");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = MOCK_FILES.filter(f => {
    if (search.trim() && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (yearFilter && f.year !== yearFilter) return false;
    if (seasonFilter && f.season !== seasonFilter) return false;
    if (typeFilter !== "ทั้งหมด" && f.type !== typeFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.floor(filtered.length / PER_PAGE) + (filtered.length % PER_PAGE > 0 ? 1 : 0));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageData = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <section id="section-files" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🗂️</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">คลังไฟล์รวม</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">รวมไฟล์เอกสารทั้งหมดของระบบ อวท.</p>
      </div>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <FilterInput value={search} onChange={setSearch} placeholder="ค้นหาไฟล์เอกสาร" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ปีการศึกษา</label>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="input-field py-2 text-sm">
            <option value="">ทั้งหมด</option><option value="2569">2569</option><option value="2568">2568</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ภาคเรียน</label>
          <select value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)} className="input-field py-2 text-sm">
            <option value="">ทั้งหมด</option><option value="1">1</option><option value="2">2</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ประเภทไฟล์</label>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field py-2 text-sm">
            {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
        <table className="min-w-full divide-y" style={{ borderColor: "var(--color-border)" }}>
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชื่อไฟล์</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">ประเภท</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">ภาคเรียน</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">ปีการศึกษา</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">วันที่อัปโหลด</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">ดาวน์โหลด</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">ไม่พบไฟล์เอกสาร</td>
              </tr>
            ) : (
              pageData.map((f, i) => (
                <tr key={i} className="transition-colors hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3 text-sm font-medium">{f.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium dark:bg-secondary-900/20">{f.type}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">เทอม {f.season}</td>
                  <td className="px-4 py-3 text-center text-sm">{f.year}</td>
                  <td className="px-4 py-3 text-center text-sm">{f.uploaded}</td>
                  <td className="px-4 py-3 text-center">
                    <a href="#" onClick={e => { e.preventDefault(); window.open("#", "_blank"); }} className="text-accent-600 dark:text-accent-400 hover:underline text-sm">ดาวน์โหลด</a>
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