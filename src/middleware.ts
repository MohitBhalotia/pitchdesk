import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/dashboard",
  "/vc",
  "/start-pitch",
  "/start-a-pitch",
  "/generate-pitch",
  "/start-pitch/:path*",
  "/my-pitches",
  "/payment",
  "/investors",
];

// ⭐ Basic Auth Check (only for staging / preview)
function checkBasicAuth(request: NextRequest) {
  const enable = process.env.ENABLE_STAGING_PASSWORD === "true";
  if (!enable) return null;

  const authHeader = request.headers.get("authorization");
  const USERNAME = process.env.STAGING_BASIC_USER!;
  const PASSWORD = process.env.STAGING_BASIC_PASS!;

  if (authHeader) {
    const encoded = authHeader.split(" ")[1];
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(":");

    if (user === USERNAME && pass === PASSWORD) {
      return null; // allow request -> go to nextAuth logic
    }
  }

  return new Response("Auth Required (Staging)", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export async function middleware(request: NextRequest) {
  const basicAuthResult = checkBasicAuth(request);
  if (basicAuthResult) return basicAuthResult;
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    token.signupStep2Done &&
    (url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/signup/step1") ||
      url.pathname.startsWith("/signup/step2") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (
    token &&
    !token.signupStep2Done &&
    (url.pathname.startsWith("/signup/step1") ||
      protectedRoutes.includes(url.pathname))
  ) {
    return NextResponse.redirect(new URL("/signup/step2", request.url));
  }
  if (!token && (protectedRoutes.includes(url.pathname) || url.pathname.startsWith("/vc/"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/payment",
    "/signup/:path*",
    "/dashboard/:path*",
    "/vc",
    "/vc/:path*",
    "/start-pitch/:path*",
    "/start-a-pitch",
    "/generate-pitch/:path*",
    "/verify/:path*",
    "/my-pitches",
    "/evaluation/:path*",
    "/connect-vcs",
    "/feedback",
    "/generated-pitches",
    "/how-to-use",
    "/support",
    "/community/support",
    "/community/feedback",
    "/meet-the-team",
    "/investors",
    "/invite-competition",
    "/competitions/:path*",
  ],
};
