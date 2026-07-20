// ============================================
// AFT NexGen Cloud — Approval API
// PUT: Teacher approves/rejects pending student
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { requestId, action, rejectionReason } = await request.json();
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
        { error: "เฉพาะอาจารย์เท่านั้นที่ดำเนินการนี้ได้ / Teachers only" },
        { status: 403 }
      );
    }

    if (!requestId || !action || !["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้อง / Invalid request" },
        { status: 400 }
      );
    }

    // Update the registration request
    const { data: regRequest, error: updateError } = await supabase
      .from("registration_requests")
      .update({
        status: action,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: action === "REJECTED" ? (rejectionReason || null) : null,
      })
      .eq("id", requestId)
      .select()
      .single();

    if (updateError) throw updateError;

    // If approved, also update the user's profile status
    if (action === "APPROVED" && regRequest) {
      // Find the auth user by email
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const matchedUser = authUsers?.users?.find(
        (u) => u.email === regRequest.email
      );

      if (matchedUser) {
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            status: "APPROVED",
            approved_by: user.id,
            approved_at: new Date().toISOString(),
          })
          .eq("id", matchedUser.id);

        if (profileUpdateError) {
          console.error("Failed to update profile status:", profileUpdateError);
        }
      }
    }

    return NextResponse.json({
      message:
        action === "APPROVED"
          ? "อนุมัติการลงทะเบียนเรียบร้อย / Registration approved"
          : "ปฏิเสธการลงทะเบียนเรียบร้อย / Registration rejected",
      request: regRequest,
    });
  } catch (err) {
    console.error("Approve API error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ / Internal server error" },
      { status: 500 }
    );
  }
}