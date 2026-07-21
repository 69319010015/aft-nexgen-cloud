"use client";

// ============================================
// AFT NexGen Cloud — Pending Approval Page
// Read-only view for students awaiting teacher approval
// ============================================

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PendingPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("aft-is-logged-in") === "true";
    const status = localStorage.getItem("aft-user-status");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (status === "APPROVED") {
      router.push("/");
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("aft-is-logged-in");
    localStorage.removeItem("aft-user-id");
    localStorage.removeItem("aft-user-name");
    localStorage.removeItem("aft-user-role");
    localStorage.removeItem("aft-user-type");
    localStorage.removeItem("aft-user-status");
    document.cookie = "aft-is-logged-in=; path=/; max-age=0; SameSite=Lax";
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-secondary)] p-4">
      <div className="card card-gradient w-full max-w-md text-center">
        {/* Pending Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/30">
            <svg className="h-10 w-10 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          รอการอนุมัติ
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Pending Approval
        </p>

        <div className="mt-6 space-y-3 text-left">
          <div className="rounded-lg border p-4" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
              📋 สถานะบัญชีของคุณ
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              บัญชีของคุณกำลังรอการอนุมัติจากอาจารย์ที่ปรึกษา
              <br />
              กรุณาตรวจสอบอีเมลหรือติดต่ออาจารย์โดยตรง
            </p>
          </div>

          <div className="rounded-lg border p-4" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
              🔒 ข้อจำกัด
            </h3>
            <ul className="mt-1 space-y-1 text-xs text-[var(--color-text-muted)]">
              <li>• ไม่สามารถเข้าถึงหน้าหลักและฟีเจอร์ต่าง ๆ ได้</li>
              <li>• ดูได้เฉพาะหน้านี้เท่านั้น</li>
              <li>• เมื่อได้รับการอนุมัติแล้วจะสามารถเข้าใช้งานได้ทันที</li>
            </ul>
          </div>

          <div className="rounded-lg border p-4" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
              💡 ข้อแนะนำ
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              ติดต่ออาจารย์ที่ปรึกษาหรือฝ่ายทะเบียนเพื่อยืนยันตัวตน
              <br />
              หรือตรวจสอบอีเมลที่ใช้ลงทะเบียน
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="btn-outline mt-6 w-full py-2.5"
        >
          ออกจากระบบ / Sign Out
        </button>
      </div>
    </div>
  );
}