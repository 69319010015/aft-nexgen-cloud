"use client";

// ─── Tab Type ─────────────────────────────────
export type NavTab = "dashboard" | "failed" | "teacher";

export const REASONS = ["ไม่เข้าแถว", "ไม่เข้ากิจกรรม", "ไม่เข้าลูกเสือ"];
export const LEVELS = ["ปวช. 1", "ปวช. 2", "ปวช. 3", "ปวส. 1", "ปวส. 2"];

// ─── Failed Student Data Type ─────────────────
export type FailedStudent = {
  id: string;
  nameEn: string;
  nameTh: string;
  level: string;
  semester: string;
  department: string;
  room: string;
  reason: string;
}

// ─── Mock Data ────────────────────────────────
export const MOCK_FAILED: FailedStudent[] = [
  { id: "1", nameEn: "John Mala", nameTh: "นายจอห์น มาละ", level: "ปวช. 1", semester: "1/2569", department: "ช่างยนต์ / Automotive Technology", room: "2", reason: "ไม่เข้าแถว" },
  { id: "2", nameEn: "John Mala", nameTh: "นายจอห์น มาละ", level: "ปวช. 1", semester: "2/2569", department: "ช่างยนต์ / Automotive Technology", room: "2", reason: "ไม่เข้ากิจกรรม" },
  { id: "3", nameEn: "Somchai Deesur", nameTh: "นายสมชาย ดีสุด", level: "ปวส. 2", semester: "1/2569", department: "ไฟฟ้ากำลัง / Electrical Power Technology", room: "1", reason: "ไม่เข้าลูกเสือ" },
  { id: "4", nameEn: "Somsri Rakdee", nameTh: "นางสาวสมศรี รักดี", level: "ปวช. 3", semester: "1/2569", department: "เทคโนโลยีคอมพิวเตอร์ / Computer Technology", room: "3", reason: "ไม่เข้าแถว" },
  { id: "5", nameEn: "Anuwat Sena", nameTh: "นายอนุวัฒน์ เสนา", level: "ปวส. 1", semester: "2/2568", department: "ช่างเชื่อมโลหะ / Welding and Metal Fabrication", room: "1", reason: "ไม่เข้ากิจกรรม" },
];

// ─── General Menu Items ───────────────────────
export interface SectionItem {
  key: string;
  label: string;
  icon: string;
  sectionId: string;
}

export const DEPARTMENTS = [
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

export const GENERAL_MENUS: SectionItem[] = [
  { key: "home",        label: "หน้าแรก",                    icon: "🏠", sectionId: "section-home" },
  { key: "activities",  label: "รายการกิจกรรม",             icon: "📋", sectionId: "section-activities" },
  { key: "summary",     label: "ผลสรุปส่งโครงการ",           icon: "📑", sectionId: "section-summary" },
  { key: "proposal",    label: "สรุปเล่มโครงการ",            icon: "📝", sectionId: "section-proposal" },
  { key: "actionPlan",  label: "แผนปฏิบัติกิจกรรมประจำปีงบประมาณ", icon: "📅", sectionId: "section-action-plan" },
  { key: "club",        label: "ชมรมวิชาชีพ",                icon: "🏫", sectionId: "section-club" },
  { key: "regulations", label: "ระเบียบและแนวทางการปฏิบัติ อวท.", icon: "📖", sectionId: "section-regulations" },
  { key: "forms",       label: "แบบฟอร์ม อวท.",              icon: "📁", sectionId: "section-forms" },
  { key: "files",       label: "คลังไฟล์รวม",                icon: "🗂️", sectionId: "section-files" },
];

// ─── Route URL Mapping (sectionId → URL) ───
export const SECTION_ROUTES: Record<string, string> = {
  "section-home": "/",
  "section-activities": "/activities",
  "section-summary": "/project-summary",
  "section-proposal": "/book-summary",
  "section-action-plan": "/annual-plan",
  "section-club": "/club",
  "section-regulations": "/regulations",
  "section-forms": "/aft-forms",
  "section-files": "/files-management",
};

// ─── Breadcrumb Label Mapping ──────────────
export const SECTION_BREADCRUMBS: Record<string, string> = {
  "section-home": "หน้าแรก",
  "section-student-dashboard": "แดชบอร์ด",
  "section-activities": "รายการกิจกรรม",
  "section-summary": "ผลสรุปส่งโครงการ",
  "section-proposal": "สรุปเล่มโครงการ",
  "section-action-plan": "แผนปฏิบัติกิจกรรม",
  "section-club": "ชมรมวิชาชีพ",
  "section-regulations": "ระเบียบและแนวทาง",
  "section-forms": "แบบฟอร์ม อวท.",
  "section-files": "คลังไฟล์รวม",
};

