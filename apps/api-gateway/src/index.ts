import express from "express";
import cors from "cors";
import { auth } from "./auth";
import { toNodeHandler } from "better-auth/node";
import { cmsRouter } from "./routes/cms";

/**
 * GreenScale API Gateway - Main Entry Point
 * Path: apps/api-gateway/src/index.ts
 * * Updated: Added explicit CORS for Staff Dashboard (5173) and CMS routes.
 */
const app = express();

app.use(cors({
    origin: [
      "http://localhost:3000", // Client Portal
      "http://localhost:5173"  // Staff Dashboard (Vite)
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

app.use(express.json());

/**
 * Better Auth Route Handler
 */
app.all("/api/auth/*", toNodeHandler(auth));

/**
 * Hybrid CMS Routes
 */
app.use("/api/cms", cmsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "operational", timestamp: new Date().toISOString() });
});

export { app };

const PORT = process.env.PORT || 3005;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
      console.log(`
      🚀 GreenScale API Gateway
      -------------------------
      Endpoint: http://localhost:${PORT}
      `);
  });
}