"use client";

import FilesManagementView from "@/views/files-management/FilesManagementView";
import { ClientLayout } from "@/components/layout/ClientLayout";

export default function FilesManagementPage() {
  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <FilesManagementView />
      </div>
    </ClientLayout>
  );
}
