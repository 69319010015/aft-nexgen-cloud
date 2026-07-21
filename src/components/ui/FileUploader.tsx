"use client";

// ============================================
// AFT NexGen Cloud — Drag & Drop File Uploader
// Supports PDF, DOCX, PNG, JPG
// ============================================

import { useState, useCallback, useRef } from "react";

interface FileUploaderProps {
  projectId: string;
  projectName: string;
}

export function FileUploader({ projectId, projectName }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      alert("รองรับเฉพาะไฟล์ PDF, DOCX, PNG, JPG เท่านั้น");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("ไฟล์ต้องมีขนาดไม่เกิน 10 MB");
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
      simulateUpload(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
      simulateUpload(file);
    }
  }, []);

  const simulateUpload = (file: File) => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 1500);
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") return "📄";
    if (type.includes("word")) return "📝";
    if (type.includes("image")) return "🖼️";
    return "📁";
  };

  return (
    <div className="w-full">
      {uploaded ? (
        <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <span>✅</span>
          <span className="truncate max-w-[100px]">{uploadedFile?.name}</span>
          <button
            onClick={() => { setUploaded(false); setUploadedFile(null); }}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-3 text-center transition-all duration-200 ${
            isDragging
              ? "border-accent-500 bg-accent-50 dark:bg-accent-900/20"
              : "border-[var(--color-border)] hover:border-accent-400 hover:bg-[var(--color-bg-secondary)]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1">
              <svg className="h-5 w-5 animate-spin text-accent" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs text-[var(--color-text-muted)]">กำลังอัปโหลด...</span>
            </div>
          ) : (
            <>
              <svg className="mb-1 h-6 w-6 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-[10px] text-[var(--color-text-muted)]">
                ลากไฟล์มาวางหรือคลิกเพื่อเลือก
              </span>
              <span className="text-[9px] text-[var(--color-text-muted)]">
                PDF, DOCX, PNG, JPG (สูงสุด 10 MB)
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
}