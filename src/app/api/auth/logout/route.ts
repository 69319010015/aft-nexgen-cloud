// ============================================
// AFT NexGen Cloud — Logout API Route
// POST: Destroy current session
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await createServerClientFn();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: "ออกจากระบบไม่สำเร็จ / Logout failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "ออกจากระบบสำเร็จ / Logout successful",
    });
  } catch (err) {
    console.error("Logout API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}