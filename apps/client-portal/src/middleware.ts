import * as BetterFetchModule from "better-fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@greenscale/auth";

/**
 * Staff Engineer Security Pattern:
 * This middleware runs on the Edge. It checks for a session 
 * before the page even starts rendering.
 */
// @ts-ignore
const bf = BetterFetchModule.default || BetterFetchModule;
const betterFetch = bf.betterFetch || bf.createBetterFetch?.() || bf;

export default async function authMiddleware(request: any) {
  if (typeof betterFetch !== "function") {
    return NextResponse.next();
  }

  const authUrl = new URL("/api/auth/get-session", request.url).toString();

  try {
    const { data: session } = await betterFetch<Session>(
      authUrl,
      {
        headers: {
          // Forward cookies so the API knows who is asking
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (e) {
    console.error("🕵️ [AUTH-MIDDLEWARE] Session check failed:", e);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};