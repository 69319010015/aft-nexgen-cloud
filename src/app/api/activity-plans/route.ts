// ============================================
// AFT NexGen Cloud — Activity Plans API Route
// GET: Fetch all activity plans
// POST: Create new activity plan
// DELETE: Remove activity plan
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";
import * as XLSX from "xlsx";

// ─── Helper: Check if request is from demo user ──
function isDemoUser(request: NextRequest): boolean {
  const isLoggedIn = request.cookies.get("aft-is-logged-in")?.value === "true";
  const userType = request.cookies.get("aft-user-type")?.value;
  return isLoggedIn && userType === "teacher";
}

export async function DELETE(request: NextRequest) {
  try {
    const serverClient = await createServerClientFn();
    const isDemo = isDemoUser(request);

    if (!isDemo) {
      const { data: { user } } = await serverClient.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน / Please login first" }, { status: 401 });
      }
      const { data: profile } = await serverClient.from("profiles").select("user_type").eq("id", user.id).single();
      if (profile?.user_type !== "teacher") {
        return NextResponse.json({ error: "เฉพาะครูเท่านั้น / Teachers only" }, { status: 403 });
      }
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const supabase = isDemo ? createAdminClient() : serverClient;
    const { error } = await supabase.from("activity_plans").delete().eq("id", id);

    if (error) {
      console.error("DELETE error:", error);
      return NextResponse.json({ error: "ลบไม่สำเร็จ / Delete failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE activity_plans error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createServerClientFn();

    const { data, error } = await supabase
      .from("activity_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET activity_plans error:", error);
      return NextResponse.json(
        { error: "ไม่สามารถดึงข้อมูลได้ / Failed to fetch data" },
        { status: 500 }
      );
    }

    // Transform to camelCase for frontend
    const plans = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      fiscalYear: item.fiscal_year,
      club: item.club,
      description: item.description,
      quarter: item.quarter,
      status: item.status,
      fileType: item.file_type,
      fileUrl: item.file_url,
      originalFilename: item.original_filename,
      fileSize: item.file_size,
      uploadedAt: item.uploaded_at,
      excelColumns: item.excel_columns || [],
      excelData: item.excel_data || [],
    }));

    return NextResponse.json({ plans });
  } catch (err) {
    console.error("Activity Plans API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const serverClient = await createServerClientFn();
    const isDemo = isDemoUser(request);

    if (!isDemo) {
      const {
        data: { user },
      } = await serverClient.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { error: "กรุณาเข้าสู่ระบบก่อน / Please login first" },
          { status: 401 }
        );
      }

      const { data: profile } = await serverClient
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

      if (profile?.user_type !== "teacher") {
        return NextResponse.json(
          { error: "เฉพาะครูเท่านั้นที่สามารถอัปโหลดแผนได้ / Teachers only" },
          { status: 403 }
        );
      }
    }

    // Use admin client for DB + Storage (bypasses RLS)
    const admin = createAdminClient();

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const fiscalYear = formData.get("fiscalYear") as string;
    const club = formData.get("club") as string;
    const description = formData.get("description") as string;
    const quarter = formData.get("quarter") as string || "1";
    const file = formData.get("file") as File | null;

    if (!title || !fiscalYear) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อแผนและปีงบประมาณ / Title and fiscal year required" },
        { status: 400 }
      );
    }

    let fileUrl: string | null = null;
    let fileType: string | null = null;
    let fileSize = 0;
    let originalFilename = "";

    // Upload file to Supabase Storage if provided
    if (file && file.size > 0) {
      fileType = file.name.split(".").pop()?.toLowerCase() || null;
      if (fileType && !["xlsx", "xls", "pdf", "docx", "doc"].includes(fileType)) {
        fileType = "link";
      }

      fileSize = file.size;
      originalFilename = file.name;

      // Use safe ASCII filename (no Thai chars, no spaces)
      const ext = file.name.split(".").pop()?.toLowerCase() || "file";
      const safeFileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = `activity-plans/${safeFileName}`;

      const { data: uploadData, error: uploadError } = await admin.storage
        .from("uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload to storage failed:", uploadError.message);
      }

      if (!uploadError && uploadData) {
        const { data: urlData } = admin.storage
          .from("uploads")
          .getPublicUrl(filePath);

        fileUrl = urlData?.publicUrl || null;
        console.log("File uploaded successfully, URL:", fileUrl);
      }
    }

    // Parse Excel data if file is Excel type
    let excelColumns: string[] = [];
    let excelData: Record<string, string>[] = [];

    if (file && fileType && ["xlsx", "xls"].includes(fileType)) {
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        if (firstSheet) {
          const jsonData: Record<string, string>[] = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
          if (jsonData.length > 0) {
            excelColumns = Object.keys(jsonData[0]).filter(key => !key.startsWith("_EMPTY"));
            excelData = jsonData.map(row => {
              const cleanRow: Record<string, string> = {};
              excelColumns.forEach(col => { cleanRow[col] = row[col] || ""; });
              return cleanRow;
            });
          }
        }
      } catch (err) {
        console.error("Excel parse error:", err);
      }
    }

    // Insert into database using admin client
    const { data: inserted, error: insertError } = await admin
      .from("activity_plans")
      .insert({
        title,
        fiscal_year: fiscalYear,
        club: club || "",
        description: description || "",
        quarter,
        status: "ดำเนินการแล้ว",
        file_type: fileType,
        file_url: fileUrl,
        file_size: fileSize,
        original_filename: originalFilename,
        excel_columns: excelColumns,
        excel_data: excelData,
      })
      .select()
      .single();

    if (insertError) {
      console.error("INSERT activity_plans error:", insertError);
      return NextResponse.json(
        { error: "ไม่สามารถบันทึกข้อมูลได้ / Failed to save" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plan: {
        id: inserted.id,
        title: inserted.title,
        fiscalYear: inserted.fiscal_year,
        club: inserted.club,
        description: inserted.description,
        quarter: inserted.quarter,
        status: inserted.status,
        fileType: inserted.file_type,
        fileUrl: inserted.file_url,
        originalFilename: inserted.original_filename,
        fileSize: inserted.file_size,
        uploadedAt: inserted.uploaded_at,
        excelColumns: inserted.excel_columns || [],
        excelData: inserted.excel_data || [],
      },
    });
  } catch (err) {
    console.error("POST activity_plans error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}