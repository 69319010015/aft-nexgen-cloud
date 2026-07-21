import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SettingsProvider } from "@/components/ui/SettingsProvider";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AFT NexGen Cloud — วิทยาลัยเทคนิคอุดรธานี",
  description:
    "ระบบบริหารจัดการโครงการและงบประมาณ วิทยาลัยเทคนิคอุดรธานี / Udon Thani Technical College Project & Budget Management System",
  keywords: [
    "UDTC",
    "วิทยาลัยเทคนิคอุดรธานี",
    "AFT NexGen Cloud",
    "งบประมาณ",
    "โครงการ",
    "budget management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${notoSansThai.variable} antialiased`}
    >
      <body
        className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
        style={{ fontFamily: "var(--font-family-body, var(--font-noto-sans-thai))", overflowX: "hidden" }}
      >
        <SupabaseProvider>
          <ThemeProvider>
            <SettingsProvider>{children}</SettingsProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}