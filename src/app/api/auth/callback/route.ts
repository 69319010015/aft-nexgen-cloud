// ============================================
// AFT NexGen Cloud — OAuth Callback Route
// Handles Google OAuth (and others) callback
// Validates email domain: @udontech.ac.th
// ============================================

import { createServerClientFn } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createServerClientFn();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      const email = data.user.email.toLowerCase();

      // ─── 🚫 Strict Domain Check: @udontech.ac.th ───
      if (!email.endsWith("@udontech.ac.th")) {
        // Sign out immediately — domain not allowed
        await supabase.auth.signOut();

        // Redirect back to login with error
        return NextResponse.redirect(
          `${origin}/login?error=domain_denied`
        );
      }

      // ─── ✅ Domain allowed — create local session ───
      // Fetch profile from database
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      // Build response
      const response = NextResponse.redirect(`${origin}${next}`);

      // Set session cookies for the app's custom auth system
      response.cookies.set("aft-is-logged-in", "true", {
        path: "/",
        maxAge: 86400,
        sameSite: "lax",
      });

      response.cookies.set("aft-user-status", profile?.status || "APPROVED", {
        path: "/",
        maxAge: 86400,
        sameSite: "lax",
      });

      return response;
    }
  }

  // ─── ❌ Error or no code — redirect to login with error ───
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}