"use client";

import AnnualPlanView from "@/views/annual-plan/AnnualPlanView";
import { ClientLayout } from "@/components/layout/ClientLayout";

export default function AnnualPlanPage() {
  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <AnnualPlanView />
      </div>
    </ClientLayout>
  );
}
