import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * GreenScale Unified Middleware (SEO + Auth)
 * Path: apps/client-portal/src/middleware.ts
 * * Resolved: Infinite reload loop by strictly excluding Next.js internals and HMR.
 */

const locales = ["en", "el"];
const defaultLocale = "en";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. PROACTIVE EXCLUSION (Crucial to prevent infinite reloads) ---
  // We must ignore all internal Next.js paths, HMR, and files with extensions
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('/static') ||
    pathname.includes('.') || // Catches .ico, .svg, .css, .js
    pathname.includes('webpack-hmr') // Explicitly ignore Hot Module Replacement
  ) {
    return NextResponse.next();
  }

  // --- 2. Locale Redirection Logic ---
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const cookieLang = request.cookies.get("gs-lang")?.value;
    const acceptLang = request.headers.get("accept-language")?.split(",")[0].split("-")[0];
    
    const locale = (cookieLang || acceptLang || defaultLocale) === "el" ? "el" : "en";

    // Standard redirect: /about -> /en/about
    // We use a 307 Temporary Redirect for development to avoid browser caching redirects
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }

  // --- 3. Authentication Guard Logic ---
  // Matches [lang]/dashboard or [lang]/onboarding
  const isProtectedRoute = pathname.match(/\/(en|el)\/(dashboard|onboarding)/);

  if (isProtectedRoute) {
    const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3005";
    const authUrl = `${AUTH_BASE_URL}/api/auth/get-session`;
    const cookieHeader = request.headers.get("cookie") || "";

    // If no auth cookie, redirect to the localized login page
    if (!cookieHeader.includes("gs-auth")) {
      const lang = pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
    }

    try {
      const response = await fetch(authUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Cookie": cookieHeader,
        },
        cache: 'no-store'
      });

      if (!response.ok) {
          const lang = pathname.split("/")[1];
          return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
      }

      const session = await response.json();

      if (!session || !session.user) {
        const lang = pathname.split("/")[1];
        return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
      }

      return NextResponse.next();

    } catch (e) {
      const lang = pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Matcher Configuration
 * This ensures the middleware is invoked for all routes except static assets.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};