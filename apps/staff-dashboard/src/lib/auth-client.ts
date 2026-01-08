import { createAuthClient } from "better-auth/react";

/**
 * Staff Dashboard Auth Client
 * Path: apps/staff-dashboard/src/lib/auth-client.ts
 * * FIX: Points to Port 3005 (API Gateway) to resolve CORS errors.
 */

export const authClient = createAuthClient({
    /**
     * MUST point to the API Gateway.
     * Vite uses import.meta.env instead of process.env
     */
    baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:3005",
});

export const { useSession, signIn, signUp, signOut } = authClient;