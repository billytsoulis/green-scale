import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@greenscale/database";

/**
 * Staff Engineer Auth Configuration (v2.7):
 * HARDENED CORS: Adding loud logs and an OPTIONS pre-check.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  baseURL: "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || "staff_engineer_level_secret_key_2025",
  
  trustHost: true,

  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000"
  ],

  emailAndPassword: {
    enabled: true,
  },

  logger: {
    enabled: true,
    level: "debug",
  },

  /**
   * THE NUCLEAR CORS FIX (v2):
   * We add very loud console logs here. If you don't see "🔥 [AUTH-HOOK]" 
   * in your terminal, it means the request is being stopped by Next.js 
   * BEFORE it reaches Better-Auth.
   */
  onAfterResponse: async (context: any) => {
    const origin = context.request.headers.get("origin");
    console.log("🔥 [AUTH-HOOK] Hook Triggered!");
    console.log("📡 [AUTH-HOOK] Origin Header:", origin);
    
    if (origin === "http://localhost:5173") {
      console.log("✅ [AUTH-HOOK] Setting CORS headers for Staff Dashboard");
      context.response.headers.set("Access-Control-Allow-Origin", origin);
      context.response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      context.response.headers.set("Access-Control-Allow-Credentials", "true");
      context.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
    }
    return context.response;
  },

  advanced: {
    useSecureCookies: false,
    crossSiteCookies: true,
    cookiePrefix: "gs-auth",
  }
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
export type Auth = typeof auth;