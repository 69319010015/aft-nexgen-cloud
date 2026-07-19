"use client";

// ============================================
// AFT NexGen Cloud — Header Component (Stripped)
// Gemini-style thin header. No branding — moved to sidebar.
// Only: Sign In/Out button + Theme Toggle on the right.
// ============================================

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SettingsModal } from "@/components/ui/SettingsModal";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export function Header() {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Check auth state on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem("aft-is-logged-in") === "true");
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleSignIn = useCallback(() => {
    router.push("/login");
  }, [router]);

  const handleSignOut = useCallback(async () => {
    setLogoutLoading(true);
    localStorage.removeItem("aft-is-logged-in");
    localStorage.removeItem("aft-session-token");
    localStorage.removeItem("aft-student-id");
    document.cookie = "aft-is-logged-in=; path=/; max-age=0; SameSite=Lax";
    setIsLoggedIn(false);
    setLogoutLoading(false);
  }, []);

  return (
    <>
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <header
        className="sticky top-0 z-50 border-b shadow-[0_4px_20px_rgba(234,179,8,0.15)]"
        style={{
          backgroundColor: "var(--color-nav-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
          {/* Right side: Settings + Sign In/Out button + Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* ⚙️ Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 transition-all duration-200 hover:border-accent-400 hover:bg-white/10 hover:text-white"
              aria-label="Settings"
              title="ตั้งค่า"
            >
              <span className="text-base">⚙️</span>
              <span>ตั้งค่า</span>
            </button>
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                disabled={logoutLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/90 transition-all duration-200 hover:border-accent-400 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                {logoutLoading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
                {logoutLoading ? "กำลังออก..." : "ออกจากระบบ / Sign Out"}
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-400 px-3 py-1.5 text-xs font-semibold text-secondary-900 transition-all duration-200 hover:bg-accent-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                เข้าสู่ระบบ / Sign In
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
