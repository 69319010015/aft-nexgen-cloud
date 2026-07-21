// ============================================
// AFT NexGen Cloud — Projects API Route
// GET: Fetch all projects (authenticated)
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerClientFn();

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อน / Please login first" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "ไม่สามารถดึงข้อมูลได้ / Failed to fetch data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ projects: data });
  } catch (err) {
    console.error("Projects API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}