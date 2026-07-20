"use client";

// ============================================
// AFT NexGen Cloud — Filter Input
// Client-side instant search for Event Name or Responsible Person
// ============================================

import { useEffect, useState, useCallback } from "react";

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FilterInput({ value, onChange, placeholder }: FilterInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce: sync local value to parent after 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  return (
    <div className="relative w-full sm:w-auto sm:min-w-[280px]">
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder || "ค้นหา ชื่อกิจกรรม หรือ ผู้รับผิดชอบ"}
        className="input-field pl-4 pr-10"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Clear search"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}