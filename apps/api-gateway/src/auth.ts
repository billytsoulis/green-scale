import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
import { db, schema } from "@greenscale/database";
import * as dotenv from "dotenv";
import path from "path";

/**
 * GreenScale API Gateway - Stateless JWT Configuration
 * Path: apps/api-gateway/src/auth.ts
 */

// Load environment variables explicitly from the monorepo root
const envPath = path.resolve(process.cwd(), "../../.env");
dotenv.config({ path: envPath });

console.log("\n------------------------------------------------");
console.log("⚡ [GATEWAY-AUTH] INITIALIZING MODULE");
console.log(`🔐 SECRET STATUS: ${process.env.BETTER_AUTH_SECRET ? "✅ LOADED" : "❌ MISSING"}`);
console.log("------------------------------------------------\n");

export const auth = betterAuth({
    /**
     * The baseURL must match the port the Gateway is listening on (3005).
     */
    baseURL: "http://localhost:3005",

    database: drizzleAdapter(db, {
        provider: "pg",
        /**
         * Mapping plural Drizzle constants from your schema.ts to 
         * internal keys Better Auth expects.
         */
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
            /**
             * REQUIRED for Stateless JWT:
             * This mapping resolves the "model jwks not found" error.
             */
            jwks: schema.jwks,
        }
    }),

    /**
     * JWT Plugin: Enables stateless verification.
     * This relies on the 'jwks' table added to the Canvas schema.
     */
    plugins: [
        jwt({
            jwt: {
                expirationTime: "7d",
            }
        })
    ],

    secret: process.env.BETTER_AUTH_SECRET,

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "INVESTOR",
            }
        }
    },

    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },

    trustedOrigins: ["http://localhost:3000"],

    advanced: {
        cookiePrefix: "gs-auth",
        /**
         * Note: Origin validation is handled via 'trustedOrigins'. 
         * No additional 'checkOrigin' flag is needed in the latest version.
         */
    },

    /**
     * Database Hooks
     * Fixed structure using 'after' to satisfy Drizzle Adapter types.
     */
    databaseHooks: {
        session: {
            create: {
                after: async (session: any) => {
                    console.log(`💾 [AUTH-GATEWAY] Session created for ID: ${session.userId}`);
                }
            }
        }
    },

    /**
     * Logger Configuration
     * Providing a level is sufficient to enable debug output.
     */
    logger: {
        level: "debug",
    },

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
});