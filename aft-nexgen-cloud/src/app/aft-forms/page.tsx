"use client";

import AftFormsView from "@/views/aft-forms/AftFormsView";
import { ClientLayout } from "@/components/layout/ClientLayout";

export default function AftFormsPage() {
  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <AftFormsView />
      </div>
    </ClientLayout>
  );
}
