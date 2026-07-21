// ============================================
// AFT NexGen Cloud — Login API Route
// POST: Authenticate Student (Student ID + National ID)
//       or Teacher (Email + Password)
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, nationalId, email, password } = body;

    let signInEmail: string;
    let signInPassword: string;
    let userType: "student" | "teacher";

    // Detect login type
    if (email && password) {
      // Teacher login
      signInEmail = email;
      signInPassword = password;
      userType = "teacher";

      if (!email.includes("@")) {
        return NextResponse.json(
          { error: "กรุณากรอกอีเมลให้ถูกต้อง / Invalid email format" },
          { status: 400 }
        );
      }

      // ─── 🚫 Strict Domain Check: @udontech.ac.th ───
      if (!email.toLowerCase().endsWith("@udontech.ac.th")) {
        return NextResponse.json(
          {
            error: "Access Denied: Please use your official @udontech.ac.th email address to sign in.",
            status: "DOMAIN_DENIED",
          },
          { status: 403 }
        );
      }
    } else if (studentId && nationalId) {
      // Student login
      signInEmail = `${studentId}@udtc.internal`;
      signInPassword = nationalId;
      userType = "student";

      if (!studentId.trim()) {
        return NextResponse.json(
          { error: "กรุณากรอกรหัสนักศึกษา / Please enter Student ID" },
          { status: 400 }
        );
      }
      if (nationalId.length !== 13) {
        return NextResponse.json(
          { error: "รหัสบัตรประชาชนต้องมี 13 หลัก / National ID must be 13 digits" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบ / Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createServerClientFn();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });

    if (error) {
      const message =
        error.message === "Invalid login credentials"
          ? "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง / Invalid credentials"
          : error.message;
      return NextResponse.json({ error: message }, { status: 401 });
    }

    // Fetch profile to check status and user type
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้ / User profile not found" },
        { status: 404 }
      );
    }

    // For students: check if approved
    if (profile.user_type === "student" && profile.status === "PENDING") {
      // Sign them out since they're not approved
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error: "บัญชีของคุณยังไม่ได้รับการอนุมัติ กรุณารอการยืนยันจากอาจารย์ / Account pending approval",
          status: "PENDING",
        },
        { status: 403 }
      );
    }

    if (profile.user_type === "student" && profile.status === "REJECTED") {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error: `บัญชีของคุณถูกปฏิเสธ: ${profile.rejection_reason || "ไม่ระบุเหตุผล"} / Account rejected`,
          status: "REJECTED",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "เข้าสู่ระบบสำเร็จ / Login successful",
      session: data.session,
      user: {
        id: profile.id,
        student_id: profile.student_id,
        full_name: profile.full_name,
        role: profile.role,
        user_type: profile.user_type,
        status: profile.status,
        email: profile.email,
      },
    });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}