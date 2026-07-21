"use client";

import ClubListView from "@/views/club/ClubListView";
import { ClientLayout } from "@/components/layout/ClientLayout";

export default function ClubPage() {
  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">🏫</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">ชมรมวิชาชีพ</h2>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">ค้นหาและคัดกรองข้อมูลชมรมวิชาชีพ</p>
        </div>
        <ClubListView />
      </div>
    </ClientLayout>
  );
}
