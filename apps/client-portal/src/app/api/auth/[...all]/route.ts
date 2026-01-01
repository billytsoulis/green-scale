import { auth } from "@greenscale/auth";

/**
 * Staff Engineer Auth Handler (v1.6):
 * 1. Diagnostic: Request intercepted for CORS.
 * 2. Resolution: We pass the RAW request to auth.handler first, 
 * then we wrap the response. This ensures the crypto engine gets 
 * the unmutated request object.
 * 3. Preflight: Manual OPTIONS handling ensures the browser on Port 5173 
 * receives the correct security headers.
 */

const handler = async (req: Request) => {
    const origin = req.headers.get("origin");
    
    // Handle OPTIONS immediately for preflight check
    if (req.method === "OPTIONS") {
        if (origin === "http://localhost:5173") {
            return new Response(null, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie, x-better-auth-antiforgery",
                    "Access-Control-Max-Age": "86400",
                },
            });
        }
        return new Response(null, { status: 204 });
    }

    // Pass the raw request to the Better-Auth engine
    const response = await auth.handler(req);

    // NUCLEAR CORS WRAPPER: 
    // If the request comes from our trusted Staff Dashboard, manually inject headers.
    // We do this because Next.js/Turbopack can sometimes strip headers from external packages.
    if (origin === "http://localhost:5173") {
        const newHeaders = new Headers(response.headers);
        
        newHeaders.set("Access-Control-Allow-Origin", origin);
        newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        newHeaders.set("Access-Control-Allow-Credentials", "true");
        newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, x-better-auth-antiforgery");
        
        // Return a fresh Response object with the updated headers
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    }

    return response;
};

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;