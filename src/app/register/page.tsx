"use client";

// ============================================
// AFT NexGen Cloud — Student Registration Page
// Self-registration with teacher approval workflow
// ============================================

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const DEPARTMENTS = [
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

const LEVELS = ["ปวช. 1", "ปวช. 2", "ปวช. 3", "ปวส. 1", "ปวส. 2"];

export default function RegisterPage() {
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [confirmNationalId, setConfirmNationalId] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!studentId.trim() || studentId.length < 5) {
        setError("กรุณากรอกรหัสนักศึกษาให้ถูกต้อง");
        return;
      }
      if (!fullName.trim()) {
        setError("กรุณากรอกชื่อ-นามสกุล");
        return;
      }
      if (nationalId.length !== 13) {
        setError("รหัสบัตรประชาชนต้องมี 13 หลัก");
        return;
      }
      if (nationalId !== confirmNationalId) {
        setError("รหัสบัตรประชาชนไม่ตรงกัน");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: studentId.trim(),
            fullName: fullName.trim(),
            nationalId: nationalId.trim(),
            department: department || undefined,
            level: level || undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "ลงทะเบียนไม่สำเร็จ");
          setLoading(false);
          return;
        }

        setSuccess(true);
        setLoading(false);
      } catch (err) {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        setLoading(false);
      }
    },
    [studentId, fullName, nationalId, confirmNationalId, department, level]
  );

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-secondary)] p-4">
        <div className="card card-gradient w-full max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-900/30">
              <svg className="h-8 w-8 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            ลงทะเบียนสำเร็จ!
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            กรุณารอการอนุมัติจากอาจารย์ที่ปรึกษา
            <br />
            คุณจะได้รับอีเมลแจ้งเตือนเมื่อได้รับการอนุมัติ
          </p>
          <button
            onClick={() => router.push("/login")}
            className="btn-primary mt-6 w-full py-2.5"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-secondary)] p-4">
      <div className="card card-gradient w-full max-w-lg">
        {/* Logo and Title */}
        <div className="mb-6 text-center">
          <img
            src="/images/aft-logo.png"
            alt="AFT Logo"
            className="mx-auto mb-4 h-16 w-16 rounded-2xl object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            ลงทะเบียนนักศึกษา
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Student Registration — วิทยาลัยเทคนิคอุดรธานี
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent-50/80 px-4 py-3 text-sm text-accent-700 dark:bg-accent-900/20 dark:text-accent-300">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-[var(--color-text-primary)]">
              รหัสนักศึกษา / Student ID
            </label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))}
              placeholder="69319010015"
              maxLength={11}
              className="input-field mt-1"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[var(--color-text-primary)]">
              ชื่อ-นามสกุล / Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="นายสมชาย ใจดี"
              className="input-field mt-1"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-[var(--color-text-primary)]">
                สาขาวิชา / Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-field mt-1"
                disabled={loading}
              >
                <option value="">เลือกสาขา...</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-[var(--color-text-primary)]">
                ระดับ / Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="input-field mt-1"
                disabled={loading}
              >
                <option value="">เลือกระดับ...</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-[var(--color-text-primary)]">
              เลขบัตรประชาชน 13 หลัก / National ID
            </label>
            <input
              id="nationalId"
              type="password"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • • • • • • • • •"
              maxLength={13}
              className="input-field mt-1"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmNationalId" className="block text-sm font-medium text-[var(--color-text-primary)]">
              ยืนยันเลขบัตรประชาชน / Confirm National ID
            </label>
            <input
              id="confirmNationalId"
              type="password"
              value={confirmNationalId}
              onChange={(e) => setConfirmNationalId(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • • • • • • • • •"
              maxLength={13}
              className="input-field mt-1"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-base font-semibold disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                กำลังลงทะเบียน...
              </span>
            ) : (
              "ลงทะเบียน"
            )}
          </button>
        </form>

        {/* Link to login */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ / Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
}