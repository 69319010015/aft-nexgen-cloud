"use client";

import BookSummaryView from "@/views/book-summary/BookSummaryView";
import { ClientLayout } from "@/components/layout/ClientLayout";

export default function BookSummaryPage() {
  return (
    <ClientLayout>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <BookSummaryView />
      </div>
    </ClientLayout>
  );
}
