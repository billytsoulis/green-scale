import { createAuthClient } from "better-auth/react";

/**
 * Staff Engineer Tip:
 * Even though this is a separate app on port 5173, it communicates 
 * with the Auth API hosted on port 3000.
 * Path: apps/staff-dashboard/src/lib/auth-client.ts
 */
export const authClient = createAuthClient({
   baseURL: "http://localhost:3000" 
});