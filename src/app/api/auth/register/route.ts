// ============================================
// AFT NexGen Cloud — Student Registration API
// POST: Self-register with Student ID + National ID
// Creates Supabase auth user + registration request
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { studentId, fullName, nationalId, department, level } = await request.json();

    if (!studentId || !fullName || !nationalId) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบ / Missing required fields" },
        { status: 400 }
      );
    }

    if (nationalId.length !== 13) {
      return NextResponse.json(
        { error: "รหัสบัตรประชาชนต้องมี 13 หลัก / National ID must be 13 digits" },
        { status: 400 }
      );
    }

    const supabase = await createServerClientFn();

    // Create the auth user with PENDING status
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${studentId}@udtc.internal`,
      password: nationalId,
      options: {
        data: {
          full_name: fullName,
          user_type: "student",
          student_id: studentId,
        },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "รหัสนักศึกษานี้มีในระบบแล้ว / This Student ID is already registered" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      );
    }

    // Create registration request record for teacher review
    const { error: requestError } = await supabase
      .from("registration_requests")
      .insert({
        student_id: studentId,
        full_name: fullName,
        email: `${studentId}@udtc.internal`,
        department: department || null,
        level: level || null,
        status: "PENDING",
      });

    if (requestError) {
      console.error("Failed to create registration request:", requestError);
    }

    return NextResponse.json({
      message: "ลงทะเบียนสำเร็จ กรุณารอการอนุมัติจากอาจารย์ / Registration successful. Awaiting teacher approval.",
      status: "PENDING",
      user_id: authData.user?.id,
    });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}