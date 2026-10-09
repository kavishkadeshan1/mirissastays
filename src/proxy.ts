import { NextResponse, type NextRequest } from "next/server";
// The layouts and API handlers verify the signed session and database account.
// This early redirect only improves the unauthenticated navigation experience.
export function proxy(request: NextRequest) {
  if (!request.cookies.get("mirissa_token")?.value) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/host/:path*"] };
