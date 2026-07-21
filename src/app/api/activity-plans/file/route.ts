// ============================================
// AFT NexGen Cloud — Activity Plans File Proxy
// GET: Download file by plan ID (proxy via admin client)
// For displaying PDF/DOCX/DOC in browser
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Fetch the plan record to get the file path
    const supabase = await createServerClientFn();
    const { data: plan, error: planError } = await supabase
      .from("activity_plans")
      .select("file_url, file_type, original_filename")
      .eq("id", id)
      .single();

    if (planError || !plan || !plan.file_url) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Use admin client to download the file (bypasses RLS)
    const admin = createAdminClient();
    const filePath = plan.file_url.split("/uploads/")[1] || "";

    if (!filePath) {
      // If not a storage URL, redirect to the file URL
      return NextResponse.redirect(plan.file_url);
    }

    const { data: fileData, error: downloadError } = await admin.storage
      .from("uploads")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
    }

    // Determine content type
    const ext = plan.file_type?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xls: "application/vnd.ms-excel",
    };
    const contentType = mimeTypes[ext || ""] || "application/octet-stream";

    // Return the file as a response
    // Filename must be URI-encoded for HTTP headers (Thai chars not allowed in header)
    const encodedFilename = encodeURIComponent(plan.original_filename || "document");
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("File proxy error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}