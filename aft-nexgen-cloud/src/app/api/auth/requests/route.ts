// ============================================
// AFT NexGen Cloud — Registration Requests API
// GET: Teacher views pending student registration requests
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerClientFn();

    // Verify the user is a teacher
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (!profile || profile.user_type !== "teacher") {
      return NextResponse.json(
        { error: "เฉพาะอาจารย์เท่านั้นที่ดูข้อมูลนี้ได้ / Teachers only" },
        { status: 403 }
      );
    }

    const { data: requests, error } = await supabase
      .from("registration_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("Requests API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}