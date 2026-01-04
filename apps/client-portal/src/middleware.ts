import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * GreenScale Auth Middleware - Stateless Proxy Implementation
 * Path: apps/client-portal/src/middleware.ts
 * * This middleware intercepts requests to protected routes and verifies
 * the session by proxying the browser's cookies to the API Gateway.
 */

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Environment Configuration
  // We use the internal Gateway URL for server-to-server calls
  const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3005";
  const authUrl = `${AUTH_BASE_URL}/api/auth/get-session`;
  
  // 2. Cookie Extraction
  // We pull the raw cookie string to proxy it exactly as the browser sent it
  const cookieHeader = request.headers.get("cookie") || "";

  // 3. Early Exit for Unauthenticated Users
  // If the 'gs-auth' prefix isn't present, the user is definitely not logged in
  if (!cookieHeader.includes("gs-auth")) {
    console.log(`⚠️ [AUTH] No session cookies found for ${pathname}. Redirecting to /login`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    /**
     * 4. Session Verification via Gateway
     * We send the entire Cookie header. This is critical because Better Auth 
     * uses signed cookies (token + signature), and the Gateway needs the 
     * full string to verify the authenticity of the session.
     */
    const response = await fetch(authUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Cookie": cookieHeader,
      },
      // Ensure we don't cache an 'Unauthorized' result accidentally
      cache: 'no-store'
    });

    // 5. Handle Gateway Errors (like the 500 error seen previously)
    if (!response.ok) {
        console.error(`❌ [AUTH] Gateway returned status ${response.status} for ${pathname}`);
        // If the gateway is down or crashing, we redirect to login for safety
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await response.json();

    // 6. Final Validation
    // Better Auth returns 'null' or an object without a user if the session is invalid
    if (!session || !session.user) {
      console.log(`🕵️ [AUTH] Invalid session returned by Gateway for ${pathname}.`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 7. Success: Access Granted
    console.log(`✅ [AUTH] Access Granted for: ${session.user.email}`);
    return NextResponse.next();

  } catch (e) {
    console.error("🔥 [AUTH] Critical Failure connecting to API Gateway:", e);
    // On network failure, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

/**
 * Matcher Configuration
 * Defines which routes this middleware should protect.
 * We specifically target the dashboard and its sub-paths.
 */
export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};