import express from "express";
import cors from "cors";
import { auth } from "./auth";
import { toNodeHandler } from "better-auth/node";

/**
 * GreenScale API Gateway - Main Entry Point
 * This service acts as the central authentication and routing hub.
 */
const app = express();

/**
 * CORS Configuration
 * We explicitly allow the Client Portal (port 3000) to access this API.
 * 'credentials: true' is required for Better Auth to set session cookies.
 */
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// Parse JSON bodies for incoming requests
app.use(express.json());

/**
 * Better Auth Route Handler
 * * FIX: We use 'toNodeHandler(auth)' to bridge the gap between 
 * Express (Node.js) and the Better Auth Web-standard handler.
 */
app.all("/api/auth/*", toNodeHandler(auth));

/**
 * Start the Gateway on port 3005
 * We moved this from 3001 to avoid conflicts with the Next.js Docs application.
 */
const PORT = process.env.PORT || 3005;

const server = app.listen(PORT, () => {
    console.log(`
    🚀 GreenScale API Gateway
    -------------------------
    Endpoint: http://localhost:${PORT}
    Trusted Origin: http://localhost:3000
    `);
});

/**
 * Error Handling for Server Startup
 * Specifically handles the 'EADDRINUSE' error to provide a clear fix.
 */
server.on('error', (e: any) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`
    ❌ ERROR: Port ${PORT} is already in use.
    -----------------------------------------
    This usually happens if a previous instance is still running.
    Run 'fuser -k ${PORT}/tcp' to free up the port and try again.
    `);
    process.exit(1);
  } else {
    console.error("Server Error:", e);
  }
});