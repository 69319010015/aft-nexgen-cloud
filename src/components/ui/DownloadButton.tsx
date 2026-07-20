"use client";

// ============================================
// AFT NexGen Cloud — Download Button
// Secure signed URL download from Supabase Storage
// ============================================

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface DownloadButtonProps {
  pdfPath: string | null;
  eventName: string;
}

export function DownloadButton({ pdfPath, eventName }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    if (!pdfPath) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      // Generate a signed URL with 60-second expiry
      const { data, error: signedUrlError } = await supabase.storage
        .from("project-pdfs")
        .createSignedUrl(pdfPath, 60);

      if (signedUrlError) throw signedUrlError;
      if (!data?.signedUrl) throw new Error("Failed to generate download URL");

      // Open the signed URL in a new tab for download
      window.open(data.signedUrl, "_blank");
    } catch (err) {
      console.error("Download error:", err);
      setError("ไม่สามารถดาวน์โหลดได้");
    } finally {
      setLoading(false);
    }
  }, [pdfPath]);

  if (!pdfPath) {
    return (
      <span className="text-xs text-[var(--color-text-muted)]">
        ไม่มีเอกสาร
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:bg-accent-100 dark:hover:bg-accent-900/20 text-accent-600 dark:text-accent-400 disabled:opacity-50"
        title={`ดาวน์โหลด ${eventName}`}
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        {loading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด"}
      </button>
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
    </div>
  );
}