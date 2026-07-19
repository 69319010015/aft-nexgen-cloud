"use client";
import { FilterInput } from "@/components/ui/FilterInput";
import { useState } from "react";

const MOCK_CLUBS = [
  { id: "1", name: "ชมรมดนตรีสากล", level: "ปวช. 2", semester: "1/2569", advisor: "นายสมชาย ใจดี" },
  { id: "2", name: "ชมรมกีฬาฟุตบอล", level: "ปวช. 3", semester: "1/2569", advisor: "นางสาววรินทร ม่วงคำ" },
  { id: "3", name: "ชมรมหุ่นยนต์", level: "ปวส. 1", semester: "2/2568", advisor: "นายชัยวัฒน์ ทรัพย์ทวี" },
  { id: "4", name: "ชมรมถ่ายภาพ", level: "ปวส. 2", semester: "2/2569", advisor: "นางสาวกนกวรรณ สมศรี" },
  { id: "5", name: "ชมรมอาสาพัฒนา", level: "ปวช. 2", semester: "2/2569", advisor: "นายอดิศร แก้วใส" },
];

export default function ClubListView() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = MOCK_CLUBS.filter(c => {
    if (search.trim() && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.advisor.toLowerCase().includes(search.toLowerCase())) return false;
    if (levelFilter && c.level !== levelFilter) return false;
    if (semesterFilter && c.semester !== semesterFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.floor(filtered.length / PER_PAGE) + (filtered.length % PER_PAGE > 0 ? 1 : 0));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageData = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <section id="section-club" className="scroll-mt-4">
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <FilterInput value={search} onChange={setSearch} placeholder="ค้นหาชื่อชมรม, ชื่อกลุ่ม..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ระดับชั้น</label>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="input-field py-2 text-sm">
            <option value="">ทั้งหมด</option>
            <option value="ปวช. 2">ปวช. 2</option>
            <option value="ปวช. 3">ปวช. 3</option>
            <option value="ปวส. 1">ปวส. 1</option>
            <option value="ปวส. 2">ปวส. 2</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">ปีการศึกษา</label>
          <select value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)} className="input-field py-2 text-sm">
            <option value="">ทั้งหมด</option>
            <option value="1/2569">1/2569</option>
            <option value="2/2569">2/2569</option>
            <option value="1/2568">1/2568</option>
            <option value="2/2568">2/2568</option>
          </select>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
        <table className="min-w-full divide-y" style={{ borderColor: "var(--color-border)" }}>
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชื่อชมรม</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ระดับชั้น</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ภาคเรียน</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ที่ปรึกษา</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {pageData.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">ไม่พบข้อมูลชมรมที่คุณค้นหา</td></tr>
            ) : (
              pageData.map(club => (
                <tr key={club.id} className="transition-colors hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3 text-sm">{club.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium">{club.level}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{club.semester}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{club.advisor}</td>
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