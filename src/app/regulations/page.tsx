"use client";

import RegulationView from "@/views/regulations/RegulationView";
import { ClientLayout } from "@/components/layout/ClientLayout";

export default function RegulationsPage() {
  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <RegulationView />
      </div>
    </ClientLayout>
  );
}
