import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
import { db, schema } from "@greenscale/database";
import * as dotenv from "dotenv";
import path from "path";

/**
 * GreenScale API Gateway - Stateless JWT Configuration
 * Path: apps/api-gateway/src/auth.ts
 * * Updated: Dynamic JWT expiration based on environment (7d dev / 1h prod).
 */

// Load environment variables explicitly from the monorepo root
const envPath = path.resolve(process.cwd(), "../../.env");
dotenv.config({ path: envPath });

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
    /**
     * The baseURL must match the port the Gateway is listening on (3005).
     */
    baseURL: "http://localhost:3005",

    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.users,
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
            jwks: schema.jwks,
        }
    }),

    plugins: [
        jwt({
            jwt: {
                // High-security for production (1h), convenience for dev (7d)
                expirationTime: isProd ? "1h" : "7d",
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

    trustedOrigins: [
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://localhost:3002"
    ],

    advanced: {
        cookiePrefix: "gs-auth",
        crossOrigin: true,
    },

    databaseHooks: {
        session: {
            create: {
                after: async (session: any) => {
                    console.log(`💾 [AUTH-GATEWAY] Session created for ID: ${session.userId} | Expires: ${isProd ? "1h" : "7d"}`);
                }
            }
        }
    },

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