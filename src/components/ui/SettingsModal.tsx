"use client";

// ============================================
// AFT NexGen Cloud — Settings Modal (Pop-up)
// Preferences & Configuration popup with
// Appearance, Typography, and Notifications
// ============================================

import { useTheme } from "@/components/providers/ThemeProvider";
import { useSettings, type FontStyle, type TextSize } from "@/components/ui/SettingsProvider";
import { useState, useEffect } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const {
    fontStyle: currentFontStyle,
    textSize: currentTextSize,
    notificationsEnabled: currentNotif,
    setFontStyle,
    setTextSize,
    setNotificationsEnabled,
    requestNotificationPermission,
  } = useSettings();

  // Local draft state — only commit on Save
  const [draftTheme, setDraftTheme] = useState<"light" | "dark">(theme);
  const [draftFont, setDraftFont] = useState<FontStyle>(currentFontStyle);
  const [draftSize, setDraftSize] = useState<TextSize>(currentTextSize);
  const [draftNotif, setDraftNotif] = useState(currentNotif);
  const [mounted, setMounted] = useState(false);

  // Sync drafts when modal opens
  useEffect(() => {
    if (isOpen) {
      setDraftTheme(theme);
      setDraftFont(currentFontStyle);
      setDraftSize(currentTextSize);
      setDraftNotif(currentNotif);
    }
  }, [isOpen, theme, currentFontStyle, currentTextSize, currentNotif]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    setTheme(draftTheme);
    setFontStyle(draftFont);
    setTextSize(draftSize);
    setNotificationsEnabled(draftNotif);
    onClose();
  };

  const handleCancel = () => {
    // Discard drafts — reset to live values
    setDraftTheme(theme);
    setDraftFont(currentFontStyle);
    setDraftSize(currentTextSize);
    setDraftNotif(currentNotif);
    onClose();
  };

  const handleNotificationToggle = async () => {
    if (!draftNotif) {
      // User wants to enable — request permission first
      const granted = await requestNotificationPermission();
      setDraftNotif(granted);
    } else {
      setDraftNotif(false);
    }
  };

  // ─── Pill button helper ──────────────────────
  const pillClass = (isActive: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
      isActive
        ? "bg-accent-500 text-black border-accent-500 shadow-sm"
        : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-accent-400 hover:text-accent-400"
    }`;

  if (!mounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleCancel}
    >
      {/* ─── Modal Card ───────────────────────── */}
      <div
        className="card w-full max-w-lg rounded-xl shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg-card)",
          borderColor: "var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ─────────────────────────── */}
        <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">🛠️</span>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
              การปรับแต่งและความปลอดภัย
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30"
            aria-label="ปิดหน้าต่าง"
            title="ปิดหน้าต่าง"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-text-secondary)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ─── Appearance ─────────────────────── */}
        <div className="mb-5">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
            <span>🌓</span> โหมดการแสดงผล
          </h3>
          <div className="flex items-center gap-3 ml-1">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)", minWidth: 100 }}>รูปแบบธีม:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setDraftTheme("light")}
                className={pillClass(draftTheme === "light")}
              >
                ☀️ โหมดสว่าง
              </button>
              <button
                onClick={() => setDraftTheme("dark")}
                className={pillClass(draftTheme === "dark")}
              >
                🌙 โหมดมืด
              </button>
            </div>
          </div>
        </div>

        {/* ─── Divider ────────────────────────── */}
        <hr className="mb-5" style={{ borderColor: "var(--color-border)" }} />

        {/* ─── Typography ─────────────────────── */}
        <div className="mb-5">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
            <span>🔤</span> รูปแบบตัวอักษร
          </h3>

          {/* Font Style */}
          <div className="flex items-center gap-3 ml-1 mb-3">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)", minWidth: 100 }}>รูปแบบฟอนต์:</span>
            <div className="flex gap-2">
              <button onClick={() => setDraftFont("default")} className={pillClass(draftFont === "default")}>
                Kanit
              </button>
              <button onClick={() => setDraftFont("sarabun")} className={pillClass(draftFont === "sarabun")}>
                TH Sarabun (ฟอนต์สารบรรณ)
              </button>
            </div>
          </div>

          {/* Text Size — Slider Bar */}
          <div className="flex items-center gap-3 ml-1">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)", minWidth: 100 }}>ขนาดตัวอักษร:</span>
            <div className="flex items-center gap-2 flex-1 max-w-[200px]">
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>10</span>
              <input
                type="range"
                value={draftSize}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setDraftSize(val);
                  // Don't apply to CSS — only on Save
                }}
                min={10}
                max={22}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  accentColor: "var(--color-accent)",
                }}
              />
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>22</span>
            </div>
            <span className="text-sm font-semibold min-w-[40px] text-center" style={{ color: "var(--color-text-primary)" }}>
              {draftSize}px
            </span>
          </div>
        </div>

        {/* ─── Divider ────────────────────────── */}
        <hr className="mb-5" style={{ borderColor: "var(--color-border)" }} />

        {/* ─── Notifications ──────────────────── */}
        <div className="mb-5">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
            <span>🔔</span> การแจ้งเตือน
          </h3>
          <div className="flex items-center gap-3 ml-1">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)", minWidth: 100 }}>
              การแจ้งเตือนบนเว็บ (Web Push):
            </span>
            <button
              onClick={handleNotificationToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none ${
                draftNotif ? "bg-accent-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
              role="switch"
              aria-checked={draftNotif}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200 ${
                  draftNotif ? "translate-x-6" : "translate-x-1"
                } ${draftNotif ? "bg-gray-100" : "bg-gray-100"}`}
              />
            </button>
            <span className="text-xs" style={{ color: "var(--color-text-primary)" }}>
              {draftNotif ? "เปิดใช้งาน" : "ปิดใช้งาน"}
              <br />
              <span className="text-[10px]">(ระบบจะขออนุญาตสิทธิ์การแจ้งเตือนบนเบราว์เซอร์)</span>
            </span>
          </div>
        </div>

        {/* ─── Action Buttons ─────────────────── */}
        <div className="flex items-center justify-end gap-3 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
          <button onClick={handleCancel} className="btn-outline px-5 py-2 text-sm">
            ยกเลิก
          </button>
          <button onClick={handleSave} className="btn-primary px-5 py-2 text-sm">
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </div>
  );
}