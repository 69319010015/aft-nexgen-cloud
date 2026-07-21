"use client";

// ============================================
// AFT NexGen Cloud — Settings Provider
// Manages font style, text size, and notification
// preferences with localStorage persistence
// ============================================

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────
export type FontStyle = "default" | "sarabun";
export type TextSize = number;

interface SettingsContextValue {
  fontStyle: FontStyle;
  textSize: TextSize;
  notificationsEnabled: boolean;
  setFontStyle: (style: FontStyle) => void;
  setTextSize: (size: TextSize) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  requestNotificationPermission: () => Promise<boolean>;
}

// ─── Font family mapping ───────────────────────
const FONT_FAMILIES: Record<FontStyle, string> = {
  default: "'Kanit', 'Noto Sans Thai', sans-serif",
  sarabun: "'TH Sarabun New', serif",
};

// ─── Default text size ─────────────────────────
const DEFAULT_TEXT_SIZE = 18;

// ─── Context ───────────────────────────────────
const SettingsContext = createContext<SettingsContextValue>({
  fontStyle: "default",
  textSize: DEFAULT_TEXT_SIZE,
  notificationsEnabled: false,
  setFontStyle: () => {},
  setTextSize: () => {},
  setNotificationsEnabled: () => {},
  requestNotificationPermission: async () => false,
});

export function useSettings() {
  return useContext(SettingsContext);
}

// ─── Provider ──────────────────────────────────
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontStyle, setFontStyleState] = useState<FontStyle>("default");
  const [textSize, setTextSizeState] = useState<TextSize>(DEFAULT_TEXT_SIZE);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedFont = localStorage.getItem("aft-font-style") as FontStyle | null;
    if (storedFont && ["default", "sarabun"].includes(storedFont)) {
      setFontStyleState(storedFont);
    }

    const storedSize = localStorage.getItem("aft-text-size");
    if (storedSize) {
      const parsed = parseInt(storedSize, 10);
      if (!isNaN(parsed) && parsed >= 10 && parsed <= 50) {
        setTextSizeState(parsed);
      }
    }

    const storedNotif = localStorage.getItem("aft-notifications-enabled");
    if (storedNotif === "true") {
      setNotificationsEnabledState(true);
    }

    setMounted(true);
  }, []);

  // Apply font style to root element
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty("--font-family-body", FONT_FAMILIES[fontStyle]);
    localStorage.setItem("aft-font-style", fontStyle);
  }, [fontStyle, mounted]);

  // Apply text size to root element
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty("--text-size-base", `${textSize}px`);
    localStorage.setItem("aft-text-size", String(textSize));
  }, [textSize, mounted]);

  // Persist notification preference
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("aft-notifications-enabled", String(notificationsEnabled));
  }, [notificationsEnabled, mounted]);

  const setFontStyle = useCallback((style: FontStyle) => {
    setFontStyleState(style);
  }, []);

  const setTextSize = useCallback((size: TextSize) => {
    setTextSizeState(size);
  }, []);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setNotificationsEnabledState(enabled);
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      setNotificationsEnabledState(true);
      return true;
    }

    if (Notification.permission === "denied") {
      console.warn("Notification permission was denied");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      const granted = result === "granted";
      setNotificationsEnabledState(granted);
      return granted;
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      return false;
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        fontStyle,
        textSize,
        notificationsEnabled,
        setFontStyle,
        setTextSize,
        setNotificationsEnabled,
        requestNotificationPermission,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}