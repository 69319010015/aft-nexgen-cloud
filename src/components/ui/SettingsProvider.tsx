"use client";

// ============================================
// AFT NexGen Cloud — Settings Provider
// Manages font style, text size, and notification
// preferences with localStorage persistence
// ============================================

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────
export type FontStyle = "default" | "sarabun";
export type TextSize = "small" | "medium" | "large";

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
  default: "'Noto Sans Thai', sans-serif",
  sarabun: "'TH Sarabun New', 'TH Sarabun', sans-serif",
};

// ─── Font size mapping ─────────────────────────
const FONT_SIZES: Record<TextSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

// ─── Context ───────────────────────────────────
const SettingsContext = createContext<SettingsContextValue>({
  fontStyle: "default",
  textSize: "medium",
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
  const [textSize, setTextSizeState] = useState<TextSize>("medium");
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedFont = localStorage.getItem("aft-font-style") as FontStyle | null;
    if (storedFont && ["default", "sarabun"].includes(storedFont)) {
      setFontStyleState(storedFont);
    }

    const storedSize = localStorage.getItem("aft-text-size") as TextSize | null;
    if (storedSize && ["small", "medium", "large"].includes(storedSize)) {
      setTextSizeState(storedSize);
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
    document.documentElement.style.setProperty("--text-size-base", FONT_SIZES[textSize]);
    localStorage.setItem("aft-text-size", textSize);
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