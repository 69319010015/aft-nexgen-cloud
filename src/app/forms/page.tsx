"use client";

export default function FormsPage() {
  return (
    <main className="flex-1 min-w-0 w-full max-w-full overflow-hidden">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            แบบฟอร์ม อวท. ระเบียบและแนวทางการปฏิบัติ
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            ดาวน์โหลดแบบฟอร์มและระเบียบต่าง ๆ
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 text-center">
          <p className="text-[var(--color-text-secondary)]">หน้านี้กำลังอยู่ระหว่างการพัฒนา</p>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">This page is under development</p>
        </div>
      </div>
    </main>
  );
}