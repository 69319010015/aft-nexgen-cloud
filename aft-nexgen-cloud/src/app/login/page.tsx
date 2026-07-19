"use client";

// ============================================
// AFT NexGen Cloud — Login Page
// Student: Student ID + National ID
// Teacher: Email + Password
// ============================================

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loginType, setLoginType] = useState<"student" | "teacher">("student");
  const [studentId, setStudentId] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [showRecover, setShowRecover] = useState(false);
  const [recoverSent, setRecoverSent] = useState(false);
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("aft-is-logged-in") === "true";
      const storedStatus = localStorage.getItem("aft-user-status");
      if (isLoggedIn) {
        if (storedStatus === "PENDING") {
          router.push("/pending");
        } else {
          router.push("/");
        }
      }
    }
  }, [router]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        // Hardcoded teacher demo account
        if (
          loginType === "teacher" &&
          email.trim() === "teacher@udontech.ac.th" &&
          password === "69319010015"
        ) {
          localStorage.setItem("aft-is-logged-in", "true");
          localStorage.setItem("aft-user-id", "teacher-001");
          localStorage.setItem("aft-user-name", "อาจารย์ผู้ดูแลระบบ");
          localStorage.setItem("aft-user-role", "admin");
          localStorage.setItem("aft-user-type", "teacher");
          localStorage.setItem("aft-user-status", "APPROVED");
          document.cookie = "aft-is-logged-in=true; path=/; max-age=86400; SameSite=Lax";
          document.cookie = "aft-user-status=APPROVED; path=/; max-age=86400; SameSite=Lax";
          router.push("/");
          return;
        }

        let body: Record<string, string> = {};

        if (loginType === "student") {
          if (!studentId.trim()) {
            setError("กรุณากรอกรหัสนักศึกษา");
            setLoading(false);
            return;
          }
          if (nationalId.length !== 13) {
            setError("รหัสบัตรประชาชนต้องมี 13 หลัก");
            setLoading(false);
            return;
          }
          body = { studentId: studentId.trim(), nationalId: nationalId.trim() };
        } else {
          if (!email.trim() || !email.includes("@")) {
            setError("กรุณากรอกอีเมลให้ถูกต้อง");
            setLoading(false);
            return;
          }
          if (!password.trim()) {
            setError("กรุณากรอกรหัสผ่าน");
            setLoading(false);
            return;
          }
          body = { email: email.trim(), password };
        }

        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.status === "PENDING") {
            setError("บัญชีของคุณยังไม่ได้รับการอนุมัติ กรุณารอการยืนยันจากอาจารย์");
            setLoading(false);
            return;
          }
          setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
          setLoading(false);
          return;
        }

        // Store session in localStorage and cookie
        localStorage.setItem("aft-is-logged-in", "true");
        localStorage.setItem("aft-user-id", data.user.student_id);
        localStorage.setItem("aft-user-name", data.user.full_name);
        localStorage.setItem("aft-user-role", data.user.role);
        localStorage.setItem("aft-user-type", data.user.user_type);
        localStorage.setItem("aft-user-status", data.user.status);
        document.cookie = `aft-is-logged-in=true; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `aft-user-status=${data.user.status}; path=/; max-age=86400; SameSite=Lax`;

        router.push("/");
      } catch (err) {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        setLoading(false);
      }
    },
    [loginType, studentId, nationalId, email, password, router]
  );

  const handleRecover = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        const res = await fetch("/api/auth/recover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: recoverEmail.trim() }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "เกิดข้อผิดพลาด");
          setLoading(false);
          return;
        }

        setRecoverSent(true);
        setLoading(false);
      } catch (err) {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        setLoading(false);
      }
    },
    [recoverEmail]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-secondary)] p-4">
      <div className="card card-gradient w-full max-w-md">
        {/* Logo and Title */}
        <div className="mb-6 text-center">
          <img
            src="/images/aft-logo.png"
            alt="AFT Logo"
            className="mx-auto mb-4 h-20 w-20 rounded-2xl object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            AFT NexGen Cloud
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            วิทยาลัยเทคนิคอุดรธานี
          </p>
        </div>

        {/* Login Type Tabs */}
        <div className="mb-6 flex rounded-lg border p-1" style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={() => { setLoginType("student"); setError(null); setShowRecover(false); }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              loginType === "student"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            นักเรียน/นักศึกษา
          </button>
          <button
            onClick={() => { setLoginType("teacher"); setError(null); setShowRecover(false); }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              loginType === "teacher"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            อาจารย์
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent-50/80 px-4 py-3 text-sm text-accent-700 dark:bg-accent-900/20 dark:text-accent-300">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Forgot Password Form */}
        {showRecover && (
          <div className="mb-4 rounded-lg border p-4" style={{ borderColor: "var(--color-border)" }}>
            <h3 className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">
              รีเซ็ตรหัสผ่าน / Reset Password
            </h3>
            {recoverSent ? (
              <p className="text-sm text-[var(--color-text-secondary)]">
                หากอีเมลนี้มีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้ กรุณาตรวจสอบอีเมลของคุณ
              </p>
            ) : (
              <form onSubmit={handleRecover} className="space-y-3">
                <input
                  type="email"
                  value={recoverEmail}
                  onChange={(e) => setRecoverEmail(e.target.value)}
                  placeholder="อีเมลอาจารย์ / Teacher Email"
                  className="input-field"
                  disabled={loading}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowRecover(false); setRecoverSent(false); }}
                    className="btn-outline flex-1 py-2 text-xs"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 py-2 text-xs"
                  >
                    {loading ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ต"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {loginType === "student" ? (
            <>
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-[var(--color-text-primary)]">
                  รหัสนักเรียน / Student ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ""))}
                  placeholder="69319010015"
                  maxLength={11}
                  className="input-field mt-1"
                  autoComplete="username"
                  disabled={loading}
                />
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
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)]">
                  อีเมล / Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@udtc.ac.th"
                  className="input-field mt-1"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)]">
                  รหัสผ่าน / Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="• • • • • • • •"
                  className="input-field mt-1"
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </>
          )}

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
                กำลังตรวจสอบ...
              </span>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        {/* Extra Links */}
        <div className="mt-4 flex flex-col items-center gap-2 text-center">
          {loginType === "teacher" && !showRecover && (
            <button
              onClick={() => { setShowRecover(true); setError(null); }}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              ลืมรหัสผ่าน? / Forgot Password?
            </button>
          )}
          <button
            onClick={() => router.push("/register")}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            ยังไม่มีบัญชี? ลงทะเบียน / Don't have an account? Register
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          สำหรับนักศึกษาและบุคลากรวิทยาลัยเทคนิคอุดรธานีเท่านั้น
        </p>
      </div>
    </div>
  );
}