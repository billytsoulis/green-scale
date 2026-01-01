import { createAuthClient } from "better-auth/react";

/**
 * Staff Engineer Tip:
 * We place the 'lib' folder inside 'src' to keep all source code unified.
 * Path: apps/client-portal/src/lib/auth-client.ts
 */
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
});