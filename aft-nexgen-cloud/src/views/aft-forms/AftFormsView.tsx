"use client";
import { FilterInput } from "@/components/ui/FilterInput";
import { useState, useEffect } from "react";

const ALL_FORMS = [
  "01/1 แบบแสดงความจำนงของนักเรียน นักศึกษา ขอจัดตั้งองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับสถานศึกษา",
  "01/2 แบบแสดงความจำนงของนักเรียน นักศึกษา ขอจัดตั้งชมรมวิชาชีพ",
  "02/1 ประกาศวิทยาลัย เรื่อง แต่งตั้งคณะกรรมการบริหารองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย",
  "02/2 ประกาศอาชีวศึกษาจังหวัด เรื่อง แต่งตั้งคณะกรรมการบริหารองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับจังหวัด",
  "02/3 ประกาศสำนักงานคณะกรรมการการอาชีวศึกษา เรื่อง แต่งตั้งคณะกรรมการบริหารองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับภาค",
  "02/4 ประกาศสำนักงานคณะกรรมการการอาชีวศึกษา เรื่อง แต่งตั้งคณะกรรมการบริหารองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับชาติ",
  "03 ประกาศวิทยาลัย เรื่อง จัดตั้งองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับสถานศึกษา",
  "04 การจัดตั้งชมรมวิชาชีพในสังกัดองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย",
  "05 เรื่อง ขอให้พิจารณาแต่งตั้งครูที่ปรึกษาชมรมวิชาชีพ",
  "05/1 เรื่อง แต่งตั้งครูที่ปรึกษาคณะกรรมการดำเนินงานชมรมวิชาชีพ",
  "06 ใบสมัคร สมาชิกชมรมวิชาชีพ",
  "07 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย เรื่อง รับสมัครคณะกรรมการดำเนินงานชมรมวิชาชีพ",
  "07/1 ใบสมัคร เพื่อรับการเลือกแต่งตั้งเป็นคณะกรรมการดำเนินงานชมรมวิชาชีพ",
  "08 เรื่อง รายงานผลการเลือกตั้งคณะกรรมการดำเนินงานชมรมวิชาชีพ",
  "09 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย เรื่อง แต่งตั้งคณะกรรมการดำเนินงานชมรมวิชาชีพ",
  "10 ใบสมัคร สมาชิกองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับสถานศึกษา",
  "11 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย เรื่อง รับสมัครคณะกรรมการดำเนินงานองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย",
  "11/1 ใบสมัคร เพื่อรับเลือกตั้งเป็นคณะกรรมการดำเนินงานองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับสถานศึกษา/จังหวัด/ภาค/ชาติ",
  "12 เรื่อง รายงานผลการเลือกตั้งคณะกรรมการดำเนินงาน องค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับสถานศึกษา",
  "13 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับสถานศึกษา เรื่อง แต่งตั้งคณะกรรมการดำเนินงานองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับสถานศึกษา",
  "14 เรื่อง รายงานประกาศแต่งตั้งคณะกรรมการดำเนินงานองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย",
  "15 แบบสรุปการประเมินผลกิจกรรมชมรมวิชาชีพ",
  "16 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย เรื่อง แต่งตั้งคณะกรรมการประเมินผลกิจกรรมชมรมวิชาชีพ",
  "17 ประกาศการประเมินผลกิจกรรมชมรมวิชาชีพ",
  "18 ใบคำร้อง ขอลงทะเบียนซ่อมกิจกรรมชมรมวิชาชีพ",
  "19 แบบรายงานผลการซ่อมกิจกรรมชมรมวิชาชีพ",
  "20 แบบขออนุมัติใช้เงิน",
  "21 บัญชีรายรับ – รายจ่าย",
  "22 ทะเบียนคุมการใช้ จ่ายเงินกิจกรรม",
  "23 สรุปรายงานฐานะทางการเงินขององค์การนักวิชาชีพในอนาคตแห่งประเทศไทย",
  "24 บัญชีลงเวลาคณะกรรมการดำเนินงาน",
  "25 แบบบันทึกการปฏิบัติงานคณะกรรมการดำเนินงาน",
  "25/1 รายงานผลการปฏิบัติงานคณะกรรมการดำเนินงานองค์การนักวิชาชีพฯ",
  "26 ทะเบียนสมาชิกองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย",
  "27 ใบสมัคร เพื่อรับคัดเลือกเป็นชมรมวิชาชีพดีเด่น ประจำปีการศึกษา",
  "28 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย",
  "29 ขอรายงานผลการประเมิน คัดเลือก ชมรมวิชาชีพดีเด่น",
  "30 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทยระดับสถานศึกษา เรื่อง ผลการคัดเลือกชมรมวิชาชีพดีเด่น",
  "31 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย เรื่อง แต่งตั้งคณะกรรมการจัดกิจกรรมโครงการ",
  "32 ขอให้พิจารณาแต่งตั้งครูที่ปรึกษาสมาชิกดีเด่นโครงการภายใต้การนิเทศ",
  "33 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย เรื่อง แต่งตั้งครูที่ปรึกษาสมาชิกดีเด่นโครงการภายใต้การนิเทศ",
  "34 ใบสมัคร เพื่อรับคัดเลือกเป็นสมาชิกดีเด่นโครงการภายใต้การนิเทศ",
  "35 ประกาศองค์การนักวิชาชีพในอนาคตแห่งประเทศไทย ระดับสถานศึกษา/จังหวัด/ภาค/ชาติ เรื่อง แต่งตั้งคณะกรรมการคัดเลือกสมาชิกดีเด่นโครงการภายใต้การนิเทศ",
  "36 ขอรายงานผลการคัดเลือกสมาชิกดีเด่นโครงการภายใต้การนิเทศ",
].map((name, i) => {
  // Extract short code prefix (e.g. "01/1" from "01/1 แบบแสดงความจำนง...")
  const shortPrefix = name.split(" ")[0];
  // Rows 4 & 9 (0-indexed: 3, 8) get extra-compact code
  const code = (i === 3 || i === 8) ? `อวท.${shortPrefix}` : `อวท-${shortPrefix}`;
  return { code, name };
});

export default function AftFormsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const PER_PAGE = 5;

  useEffect(() => {
    if (typeof window !== "undefined") setIsTeacher(localStorage.getItem("aft-user-type") === "teacher");
  }, []);

  const filtered = ALL_FORMS.filter(f =>
    !search.trim() || f.code.toLowerCase().includes(search.toLowerCase()) || f.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.floor(filtered.length / PER_PAGE) + (filtered.length % PER_PAGE > 0 ? 1 : 0));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pageForms = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  return (
    <section id="section-forms" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📁</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">แบบฟอร์ม อวท.</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">คลังเอกสารแบบฟอร์มทางการ อวท. ทั้งหมด 43 แบบฟอร์ม</p>
      </div>
      {showAlert && (
        <div className="mb-4 rounded-lg border border-yellow-400/30 bg-yellow-50 px-4 py-3 dark:bg-yellow-900/10 adaptive-text-banner">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-sm">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-black dark:text-white">กรุณาปิด Sidebar ก่อนดาวน์โหลดแบบฟอร์ม</p>
              <p className="mt-0.5 text-xs text-black/80 dark:text-white/80">เพื่อความสะดวกในการแสดงผลเอกสาร ควรปิดเมนูด้านข้างก่อนเปิดไฟล์</p>
            </div>
            <button onClick={() => setShowAlert(false)} className="text-black/50 dark:text-white/50 hover:opacity-70">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
      <div className="mb-4">
        <FilterInput value={search} onChange={setSearch} placeholder="ค้นหาชื่อแบบฟอร์ม หรือ รหัสแบบฟอร์ม" />
      </div>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
        <table className="min-w-full divide-y" style={{ borderColor: "var(--color-border)" }}>
          <thead>
            <tr className="bg-[var(--color-bg-secondary)]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">รหัสแบบฟอร์ม</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ชื่อแบบฟอร์ม</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">ดาวน์โหลด</th>
              {isTeacher && <th className="px-4 py-3 text-center text-xs font-semibold uppercase">จัดการ</th>}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {pageForms.length === 0 ? (
              <tr>
                <td colSpan={isTeacher ? 4 : 3} className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">ไม่พบแบบฟอร์มที่ค้นหา</td>
              </tr>
            ) : (
              pageForms.map((f, i) => (
                <tr key={i} className="transition-colors hover:bg-[var(--color-bg-secondary)]">
                  <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">{f.code}</td>
                  <td className="px-4 py-3 text-sm">{f.name}</td>
                  <td className="px-4 py-3 text-center">
                    <a href="#" onClick={e => { e.preventDefault(); window.open("#", "_blank"); }} className="text-accent-600 dark:text-accent-400 hover:underline text-sm">ดาวน์โหลด .docx</a>
                  </td>
                  {isTeacher && (
                    <td className="px-4 py-3 text-center">
                      <button className="rounded-md border px-2 py-1 text-xs" disabled>อัปโหลด</button>
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