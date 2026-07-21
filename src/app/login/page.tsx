"use client";

// ============================================
// AFT NexGen Cloud — Login Page
// Student: Student ID + National ID
// Teacher: Email + Password
// Google OAuth: @udontech.ac.th domain required
// ============================================

import { Suspense, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Domain Validation ────────────────────────
const ALLOWED_DOMAIN = "@udontech.ac.th";
const DOMAIN_ERROR_MSG = "Access Denied: Please use your official @udontech.ac.th email address to sign in.";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-secondary)] p-4"><p className="text-sm text-[var(--color-text-muted)]">กำลังโหลด...</p></div>}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const [loginType, setLoginType] = useState<"student" | "teacher" | "admin">("student");
  const [studentId, setStudentId] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [showRecover, setShowRecover] = useState(false);
  const [recoverSent, setRecoverSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for OAuth error from callback
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError === "domain_denied") {
      setError(DOMAIN_ERROR_MSG);
    } else if (oauthError === "auth_failed") {
      setError("การยืนยันตัวตนล้มเหลว กรุณาลองอีกครั้ง / Authentication failed. Please try again.");
    }
  }, [searchParams]);

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

  // ─── Google OAuth Sign-In ──────────────────
  const handleGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      if (!supabase) {
        setError("Supabase client not available. Please check your .env.local configuration.");
        setGoogleLoading(false);
        return;
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            // Pre-filter to @udontech.ac.th accounts only
            hd: "udontech.ac.th",
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง / An error occurred. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }, []);

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
          document.cookie = "aft-user-type=teacher; path=/; max-age=86400; SameSite=Lax";
          document.cookie = "aft-user-status=APPROVED; path=/; max-age=86400; SameSite=Lax";
          router.push("/");
          return;
        }

        // Hardcoded admin (อวท.) demo account
        if (
          loginType === "admin" &&
          email.trim() === "admin@udontech.ac.th" &&
          password === "69319010015"
        ) {
          localStorage.setItem("aft-is-logged-in", "true");
          localStorage.setItem("aft-user-id", "admin-001");
          localStorage.setItem("aft-user-name", "อาจารย์อวท. ผู้ดูแลระบบ");
          localStorage.setItem("aft-user-role", "admin");
          localStorage.setItem("aft-user-type", "teacher");
          localStorage.setItem("aft-user-status", "APPROVED");
          document.cookie = "aft-is-logged-in=true; path=/; max-age=86400; SameSite=Lax";
          document.cookie = "aft-user-type=teacher; path=/; max-age=86400; SameSite=Lax";
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
            นักเรียน/นักศึกษา อวท.
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
          <button
            onClick={() => { setLoginType("admin"); setError(null); setShowRecover(false); }}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              loginType === "admin"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            อาจารย์ อวท.
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

        {/* ─── Google Sign-In ─────────────── */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            {googleLoading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
            )}
            <span>{googleLoading ? "กำลังเชื่อมต่อ..." : "Sign in with Google (@udontech.ac.th)"}</span>
          </button>
        </div>

        {/* ─── Divider ────────────────────── */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: "var(--color-border)" }} />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--color-bg-secondary)] px-2 text-[var(--color-text-muted)]">
              หรือ / OR
            </span>
          </div>
        </div>

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
          {(loginType === "teacher" || loginType === "admin") && !showRecover && (
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