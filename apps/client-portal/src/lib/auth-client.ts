import { createAuthClient } from "better-auth/react";

/**
 * GreenScale Better Auth Client - Debug Mode
 * * ⚠️ NOTE: This log appears in the BROWSER CONSOLE (Press F12), 
 * not in your VS Code / Terminal window.
 */
if (typeof window !== "undefined") {
    console.log("🛠️ [AUTH-CLIENT] Attempting to connect to Gateway at:", process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3005 (fallback)");
}

export const authClient = createAuthClient({
    /**
     * The baseURL determines where auth requests (login/register) are sent.
     * If process.env.NEXT_PUBLIC_AUTH_URL is undefined, it defaults to localhost:3005.
     */
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3005",
});

// Export methods for use in components
export const { useSession, signIn, signUp, signOut } = authClient;