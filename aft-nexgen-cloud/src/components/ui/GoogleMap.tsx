"use client";

// ============================================
// Google Maps Embed — วิทยาลัยเทคนิคอุดรธานี
// ============================================

export function GoogleMap() {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
        <span className="text-lg">📍</span>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
          แผนที่วิทยาลัย — วิทยาลัยเทคนิคอุดรธานี
        </h2>
      </div>
      <div className="flex justify-center p-2">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.5816753559615!2d102.79026577502737!3d17.41502010160919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3123a4b36a50f211%3A0xe9b609ad570b3e06!2z4Lin4Li04LiU4Li04LiH4LmA4LiX4Lii4LmM4Liq4LiZ4LiX4Lij4Liy4LiZ4LmA!5e0!3m2!1sth!2sth!4v1700000000000"
          width="100%"
          height="400"
          style={{ border: 0, maxWidth: "100%" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps — วิทยาลัยเทคนิคอุดรธานี"
        />
      </div>
      <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2">
        <a
          href="https://www.google.com/maps/place/%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5/data=!4m2!3m1!1s0x0:0xe9b609ad570b3e06?sa=X&ved=1t:2428&ictx=111"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-blue-600 hover:underline dark:text-blue-400"
        >
          เปิดใน Google Maps →
        </a>
      </div>
    </div>
  );
}