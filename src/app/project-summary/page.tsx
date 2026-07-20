"use client";

import ProjectSummaryView from "@/views/project-summary/ProjectSummaryView";
import { ClientLayout } from "@/components/layout/ClientLayout";

export default function ProjectSummaryPage() {
  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <ProjectSummaryView />
      </div>
    </ClientLayout>
  );
}
