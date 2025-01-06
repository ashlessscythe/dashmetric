import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const isAuth = !!request.nextauth.token;
    const isAuthPage =
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register");

    // Allow public access to the landing page
    if (request.nextUrl.pathname === "/") {
      return null;
    }

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return null;
    }

    if (!isAuth && request.nextUrl.pathname.startsWith("/dashboard")) {
      let from = request.nextUrl.pathname;
      if (request.nextUrl.search) {
        from += request.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Allow all routes by default
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
