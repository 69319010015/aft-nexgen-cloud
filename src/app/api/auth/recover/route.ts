// ============================================
// AFT NexGen Cloud — Password Recovery API
// POST: Teacher password recovery via email
// Students must contact teacher for resets
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมลให้ถูกต้อง / Please enter a valid email" },
        { status: 400 }
      );
    }

    const supabase = await createServerClientFn();

    // Check if user exists as a teacher
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .eq("user_type", "teacher")
      .single();

    if (!profiles) {
      // Don't reveal if the email exists or not — security best practice
      return NextResponse.json({
        message: "หากอีเมลนี้มีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้ / If this email exists in our system, we've sent a reset link.",
      });
    }

    // Send Supabase password reset email
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${request.headers.get("origin") || "http://localhost:3000"}/login`,
    });

    if (resetError) {
      console.error("Password reset error:", resetError);
    }

    return NextResponse.json({
      message: "หากอีเมลนี้มีอยู่ในระบบ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้ / If this email exists in our system, we've sent a reset link.",
    });
  } catch (err) {
    console.error("Recover API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}