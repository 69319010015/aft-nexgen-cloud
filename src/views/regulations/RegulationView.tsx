"use client";
import { FilterInput } from "@/components/ui/FilterInput";
import { useState, useEffect, useCallback } from "react";

const REG_DATA = [
  { name: "ข้อบังคับ อวท. ว่าด้วยการบริหารองค์การฯ พ.ศ. 2568", season: "1", year: "2569" },
  { name: "ระเบียบ อวท. ว่าด้วยการจัดตั้งชมรมวิชาชีพ พ.ศ. 2568", season: "1", year: "2569" },
  { name: "คู่มือการดำเนินงานชมรมวิชาชีพ สำหรับครูที่ปรึกษา", season: "2", year: "2568" },
  { name: "หลักเกณฑ์การประเมินผลกิจกรรมชมรมวิชาชีพประจำปี", season: "1", year: "2569" },
  { name: "คู่มือการจัดทำบัญชีรายรับ-รายจ่ายสำหรับชมรมวิชาชีพ", season: "2", year: "2568" },
  { name: "ระเบียบ อวท. ว่าด้วยการเบิกจ่ายเงินกิจกรรม พ.ศ. 2568", season: "1", year: "2569" },
  { name: "แนวปฏิบัติการจัดซ่อมกิจกรรมชมรมวิชาชีพ", season: "2", year: "2568" },
  { name: "คู่มือการสมัครสมาชิก อวท. สำหรับนักเรียนใหม่", season: "1", year: "2569" },
  { name: "ข้อบังคับ อวท. ว่าด้วยการเลือกตั้งคณะกรรมการฯ พ.ศ. 2568", season: "2", year: "2569" },
  { name: "แนวทางการจัดทำรายงานผลการดำเนินงานประจำปี", season: "1", year: "2569" },
];

export default function RegulationView() {
  const [search, setSearch] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const PER_PAGE = 5;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("aft-user-type");
      setIsLoggedIn(userType === "student" || userType === "teacher");
    }
  }, []);

  const handleUploadClick = useCallback((index: number) => {
    setUploadingIndex(index);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.onchange = () => {
      setTimeout(() => setUploadingIndex(null), 1500);
    };
    input.click();
  }, []);

  const filtered = REG_DATA.filter(d => {
    if (search.trim() && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (seasonFilter && d.season !== seasonFilter) return false;
    if (yearFilter && d.year !== yearFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.floor(filtered.length / PER_PAGE) + (filtered.length % PER_PAGE > 0 ? 1 : 0));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageData = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <section id="section-regulations" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">ระเบียบและแนวทางการปฏิบัติ อวท.</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">แนวทางและขั้นตอนการจัดกิจกรรมตามระเบียบ อวท.</p>
      </div>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <FilterInput value={search} onChange={setSearch} placeholder="ค้นหาชื่อเอกสาร" />
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-16">ลำดับ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชื่อเอกสาร/ระเบียบ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-20">ภาคเรียน</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-24">ปีการศึกษา</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase w-32">ไฟล์ดาวน์โหลด</th>
              {isLoggedIn && <th className="px-4 py-3 text-center text-xs font-semibold uppercase w-20">จัดการ</th>}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {pageData.length === 0 ? (
              <tr><td colSpan={isLoggedIn ? 6 : 5} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">ไม่พบข้อมูล</td></tr>
            ) : (
              pageData.map((d, i) => (
                <tr key={i} className="transition-colors hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">{(safePage - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-4 py-3 text-sm">{d.name}</td>
                  <td className="px-4 py-3 text-sm">เทอม {d.season}</td>
                  <td className="px-4 py-3 text-sm">{d.year}</td>
                  <td className="px-4 py-3 text-center">
                    <a href="#" onClick={e => { e.preventDefault(); window.open("#", "_blank", "noopener"); }} className="text-accent-600 dark:text-accent-400 hover:underline text-sm">ดาวน์โหลด</a>
                  </td>
                  {isLoggedIn && (
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleUploadClick(i)} disabled={uploadingIndex === i}
                        className="rounded-md border px-2 py-1 text-xs disabled:opacity-50">
                        {uploadingIndex === i ? "กำลังอัปโหลด..." : "อัปโหลด"}
                      </button>
                    </td>
                  )}
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