"use client";

import { GoogleMap } from "@/components/ui/GoogleMap";

export default function CollegeMapView() {
  return (
    <section id="section-map" className="scroll-mt-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📍</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">แผนที่วิทยาลัย</h2>
        </div>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] ml-8">วิทยาลัยเทคนิคอุดรธานี</p>
      </div>
      <GoogleMap />
    </section>
  );
}