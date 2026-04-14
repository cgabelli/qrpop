import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const middleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Proteggi /dashboard
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/accedi", req.url));
  }

  // Redirect chi è già loggato da login/register
  if ((pathname === "/accedi" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/accedi", "/register"],
};
