"use client";

// ============================================
// AFT NexGen Cloud — Sidebar (SPA)
// ============================================
// Slate Dark (#0F172A) background
// Left-side gold glow shadow
// Smooth scroll to sections — no page switching
// 3 permission-gated groups
// ============================================

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTabContext } from "@/components/providers/TabProvider";
import { SECTION_BREADCRUMBS, SECTION_ROUTES } from "@/components/sidebar/SidebarMenu";
import { SettingsModal } from "@/components/ui/SettingsModal";

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
};

// ─── Mock Data ────────────────────────────────
export const MOCK_FAILED: FailedStudent[] = [
  { id: "1", nameEn: "John Mala", nameTh: "นายจอห์น มาละ", level: "ปวช. 1", semester: "1/2569", department: "ช่างยนต์ / Automotive Technology", room: "2", reason: "ไม่เข้าแถว" },
  { id: "2", nameEn: "John Mala", nameTh: "นายจอห์น มาละ", level: "ปวช. 1", semester: "2/2569", department: "ช่างยนต์ / Automotive Technology", room: "2", reason: "ไม่เข้ากิจกรรม" },
  { id: "3", nameEn: "Somchai Deesur", nameTh: "นายสมชาย ดีสุด", level: "ปวส. 2", semester: "1/2569", department: "ไฟฟ้ากำลัง / Electrical Power Technology", room: "1", reason: "ไม่เข้าลูกเสือ" },
  { id: "4", nameEn: "Somsri Rakdee", nameTh: "นางสาวสมศรี รักดี", level: "ปวช. 3", semester: "1/2569", department: "เทคโนโลยีคอมพิวเตอร์ / Computer Technology", room: "3", reason: "ไม่เข้าแถว" },
  { id: "5", nameEn: "Anuwat Sena", nameTh: "นายอนุวัฒน์ เสนา", level: "ปวส. 1", semester: "2/2568", department: "ช่างเชื่อมโลหะ / Welding and Metal Fabrication", room: "1", reason: "ไม่เข้ากิจกรรม" },
];

// ─── Sidebar Props ────────────────────────────
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

// ─── General Menu Items (Group 1 — everyone) ──
interface SectionItem {
  key: string;
  label: string;
  icon: string;
  sectionId: string;
}

const GENERAL_MENUS: SectionItem[] = [
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

export function Sidebar({ isOpen, onClose, onOpen }: SidebarProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [studentBoxOpen, setStudentBoxOpen] = useState(false);
  const [teacherBoxOpen, setTeacherBoxOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { setActiveTab, setBreadcrumbs } = useTabContext();

  // Check auth state
  useEffect(() => {
    const check = () => {
      setIsLoggedIn(localStorage.getItem("aft-is-logged-in") === "true");
      setUserType(localStorage.getItem("aft-user-type"));
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  // Auto-open list boxes on login
  useEffect(() => {
    if (isLoggedIn) {
      setStudentBoxOpen(true);
      if (userType === "teacher") setTeacherBoxOpen(true);
    }
  }, [isLoggedIn, userType]);

  const isTeacher = isLoggedIn && userType === "teacher";

  const handleSignIn = useCallback(() => router.push("/login"), [router]);

  const handleSignOut = useCallback(async () => {
    setLogoutLoading(true);
    localStorage.removeItem("aft-is-logged-in");
    localStorage.removeItem("aft-session-token");
    localStorage.removeItem("aft-student-id");
    document.cookie = "aft-is-logged-in=; path=/; max-age=0; SameSite=Lax";
    setIsLoggedIn(false);
    setLogoutLoading(false);
  }, []);

  // Navigate to route or scroll section
  const goToRoute = useCallback((sectionId: string) => {
    onClose();
    const route = SECTION_ROUTES[sectionId];
    const label = SECTION_BREADCRUMBS[sectionId] || null;
    setBreadcrumbs(label
      ? [{ label: "หน้าแรก", icon: "🏠" }, { label }]
      : [{ label: "หน้าแรก", icon: "🏠" }]);
    if (route) {
      router.push(route);
    } else {
      // Fallback — scroll to section
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [router, onClose, setBreadcrumbs]);

  const handleSubItemClick = useCallback((tab: NavTab) => {
    setActiveTab(tab);
    onClose();
    const sectionIds: Record<NavTab, string> = {
      dashboard: "section-student-dashboard",
      failed: "section-failed",
      teacher: "section-teacher",
    };
    const sectionId = sectionIds[tab];
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [setActiveTab, onClose]);

  // ─── Style helpers ──────────────────────────
  const navBtnClass = (isActive: boolean) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
      isActive
        ? "bg-yellow-500/20 text-yellow-300 shadow-[inset_0_0_12px_rgba(234,179,8,0.15)]"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  const subBtnClass = (isActive: boolean) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
      isActive
        ? "bg-yellow-500/15 text-yellow-300"
        : "text-white/60 hover:bg-white/10 hover:text-white/90"
    }`;

  const sectionHeaderClass = "flex items-center gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-yellow-400/70";

  // ─── Shared sidebar inner content ───
  const sidebarContent = (
    <div className="flex h-full w-64 flex-col text-white shadow-[-6px_0_30px_rgba(234,179,8,0.3),inset_-1px_0_0_rgba(234,179,8,0.15)]" style={{ backgroundColor: "#0F172A" }}>
      {/* Close X button — desktop */}
      <div className="hidden md:flex items-center justify-end px-3 pt-2">
        <button
          onClick={onClose}
          className="mat-mdc-button-touch-target flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white"
          aria-label="Close sidebar"
          title="ปิดแผง"
        >
          <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Branding Block */}
      <div className="flex flex-col items-start gap-3 border-b border-white/10 px-5 pb-5 pt-2">
        <div className="flex items-center gap-3">
          <img
            src="/images/aft-logo.png"
            alt="AFT Logo"
            className="h-10 w-10 rounded-lg object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div>
            <h1 className="text-base font-bold leading-tight text-white">AFT NexGen Cloud</h1>
            <p className="text-[11px] leading-tight text-white/80">อวท. เน็กซ์เจน คลาวด์</p>
          </div>
        </div>
        <p className="text-[10px] leading-tight text-white/40">วิทยาลัยเทคนิคอุดรธานี / Udon Thani Technical College</p>
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav className="mt-3 flex-1 space-y-1 px-3 overflow-y-auto">
        {/* ============================================= */}
        {/* 📦 Group 1: General Menus — Everyone         */}
        {/* ============================================= */}
        <div className={sectionHeaderClass}>
          <span>📦</span>
          <span>หน้าแรกและข้อมูลทั่วไป</span>
        </div>

        {GENERAL_MENUS.map((item) => {
          return (
            <button
              key={item.key}
              onClick={() => goToRoute(item.sectionId)}
              className={navBtnClass(false)}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1 text-xs font-medium text-left">{item.label}</span>
            </button>
          );
        })}

        {/* ============================================= */}
        {/* 🎓 Group 2: Student Listbox — Login only     */}
        {/* ============================================= */}
        {isLoggedIn && (
          <>
            <div className="mt-5 mb-1 border-t border-white/10 pt-3">
              <button
                onClick={() => setStudentBoxOpen(prev => !prev)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-yellow-400/70 transition-all duration-200 hover:text-yellow-300"
              >
                <span>🎓</span>
                <span className="flex-1 text-left">กลุ่ม 2: Student</span>
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${studentBoxOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {studentBoxOpen && (
              <div className="ml-3 space-y-1 overflow-hidden transition-all duration-300 ease-in-out border-l-2 border-yellow-500/20 pl-2">
                <button
                  onClick={() => handleSubItemClick("failed")}
                  className={subBtnClass(false)}
                >
                  <span className="text-sm">⚠️</span>
                  <span className="flex-1 text-[11px] font-medium text-left">รายงานนักศึกษาไม่ผ่านกิจกรรม</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ============================================= */}
        {/* 👨‍🏫 Group 3: Teacher Listbox — Teacher only   */}
        {/* ============================================= */}
        {isTeacher && (
          <>
            <div className="mt-5 mb-1 border-t border-white/10 pt-3">
              <button
                onClick={() => setTeacherBoxOpen(prev => !prev)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-yellow-400/70 transition-all duration-200 hover:text-yellow-300"
              >
                <span>👨‍🏫</span>
                <span className="flex-1 text-left">กลุ่ม 3: Teacher</span>
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${teacherBoxOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {teacherBoxOpen && (
              <div className="ml-3 space-y-1 overflow-hidden transition-all duration-300 ease-in-out border-l-2 border-yellow-500/20 pl-2">
                <button
                  onClick={() => handleSubItemClick("teacher")}
                  className={subBtnClass(false)}
                >
                  <span className="text-sm">🧑‍🏫</span>
                  <span className="flex-1 text-[11px] font-medium text-left">Teacher Dashboard</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ─── Divider ─── */}
        <div className="my-4 border-t border-white/10"></div>

        {/* ⚙️ Settings */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          <span className="text-base">⚙️</span>
          <span className="text-xs">ตั้งค่า</span>
        </button>

        {/* Login / Sign Out Button */}
        {isLoggedIn ? (
          <button
            onClick={handleSignOut}
            disabled={logoutLoading}
            className="flex w-full items-center gap-3 rounded-lg border border-white/30 px-3 py-2.5 text-white/80 transition-all duration-200 hover:bg-white hover:text-black disabled:opacity-50"
          >
            {logoutLoading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
            <span className="text-xs">{logoutLoading ? "กำลังออก..." : "ออกจากระบบ"}</span>
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex w-full items-center gap-3 rounded-lg border border-white/30 px-3 py-2.5 text-white/80 transition-all duration-200 hover:bg-white hover:text-black"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="text-xs">เข้าสู่ระบบ</span>
          </button>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* ─── MOBILE: Trigger button ─── */}
      <button
        onClick={onOpen}
        className={`mat-mdc-button-touch-target fixed left-2 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-accent-400/60 shadow-lg shadow-yellow-500/20 transition-all duration-200 hover:bg-white/10 md:hidden ${isOpen ? "hidden" : "flex"}`}
        style={{ backgroundColor: "#0F172A" }}
        aria-label="Open sidebar"
        title="เปิดเมนู"
      >
        <svg className="h-5 w-5 stroke-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ─── MOBILE: Backdrop overlay ─── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ─── MOBILE: Fixed overlay sidebar ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-yellow-500/20 shadow-2xl transition-transform duration-300 ease-in-out md:fixed md:z-40 md:shadow-2xl md:transition-all md:duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:overflow-hidden ${
          isOpen ? "md:w-64 md:opacity-100" : "md:w-0 md:opacity-0"
        }`}
        style={{ backgroundColor: "#0F172A" }}
      >
        {/* Mobile Close X */}
        <div className="flex items-center justify-end px-3 pt-2 md:hidden">
          <button
            onClick={onClose}
            className="mat-mdc-button-touch-target flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Close sidebar"
            title="ปิด"
          >
            <svg className="h-5 w-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* ─── DESKTOP: Toggle button (fixed top-left) ─── */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed left-0 top-1 z-50 mat-mdc-button-touch-target hidden md:flex flex-shrink-0 border-y border-r border-accent-400/30 bg-white px-2 py-2 text-black transition-all duration-200 hover:bg-gray-200 shadow-md shadow-yellow-500/20 rounded-r-lg"
          aria-label="Open sidebar"
          title="เปิดแผง"
        >
          <svg className="h-5 w-5 stroke-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </>
  );
}