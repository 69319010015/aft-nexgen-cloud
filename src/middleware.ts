// ============================================
// AFT NexGen Cloud — Middleware
// Route protection based on auth status
// - Redirects logged-in users from /login to /
// - Redirects PENDING users from / to /pending
// - Redirects unauthenticated users from protected routes
// ============================================

import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get("aft-is-logged-in")?.value === "true";
  const userStatus = request.cookies.get("aft-user-status")?.value;

  // Public routes that don't need auth
  const publicRoutes = ["/login", "/register", "/pending"];

  // If logged in and on login/register page, redirect based on status
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    if (userStatus === "PENDING") {
      return NextResponse.redirect(new URL("/pending", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in but PENDING, only allow /pending
  if (isLoggedIn && userStatus === "PENDING" && pathname !== "/pending") {
    return NextResponse.redirect(new URL("/pending", request.url));
  }

  // If not logged in and trying to access protected routes (future use)
  // For now, dashboard is public

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/.*\\.png|.*\\.svg).*)",
  ],
};