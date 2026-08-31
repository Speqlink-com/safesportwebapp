import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Redirect root to signin
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/account/signin", request.url));
  }

  // Redirect /safesport to clinician dashboard by default
  // TODO: API will determine redirect based on user role
  if (request.nextUrl.pathname === "/safesport") {
    return NextResponse.redirect(new URL("/safesport/clinician", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/safesport"],
};
