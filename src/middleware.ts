import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/dashboard",
  "/start-pitch",
  "/start-a-pitch",
  "/generate-pitch",
  "my-pitches"
];
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/signup") ||
      url.pathname==="/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!token && protectedRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/start-pitch/:path*",
    "/start-a-pitch",
    "/generate-pitch/:path*",
    "/verify/:path*",
  ],
};