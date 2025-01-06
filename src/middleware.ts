import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { UserRole } from "@prisma/client";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const isAuth = !!request.nextauth.token;
    const userRole = request.nextauth.token?.role as UserRole;
    const isPending = userRole === UserRole.PENDING;

    const isAuthPage =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup");

    // Allow public access to the landing page
    if (request.nextUrl.pathname === "/") {
      return null;
    }

    // Handle auth pages (login/signup)
    if (isAuthPage) {
      if (isAuth) {
        // Redirect to appropriate page based on role
        return NextResponse.redirect(
          new URL(isPending ? "/pending" : "/dashboard", request.url)
        );
      }
      return null;
    }

    // Handle pending page
    if (request.nextUrl.pathname.startsWith("/pending")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      if (!isPending) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return null;
    }

    // Handle dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (!isAuth) {
        const from = request.nextUrl.pathname + request.nextUrl.search;
        return NextResponse.redirect(
          new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
        );
      }
      if (isPending) {
        return NextResponse.redirect(new URL("/pending", request.url));
      }
      return null;
    }
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle authorization
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/pending"],
};
