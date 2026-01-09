import express from "express";
import cors from "cors";
import http from "http";
import { auth } from "./auth"; // Removed .js extension
import { toNodeHandler } from "better-auth/node";
import { cmsRouter } from "./routes/cms"; // Removed .js extension

/**
 * GreenScale API Gateway - REST Only Edition
 * Path: apps/api-gateway/src/index.ts
 * * Refactored: Removed .js extensions for better developer experience.
 * * Implementation: Express + Better Auth + Redis-Cached CMS Routes.
 */

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  /**
   * 1. Global Middleware
   */
  app.use(cors({
    origin: [
      "http://localhost:3000", // Client Portal
      "http://localhost:5173"  // Staff Dashboard
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  }));

  app.use(express.json());

  /**
   * 2. Route Handlers
   */

  // AUTH: Better Auth (REST)
  app.all("/api/auth/*", toNodeHandler(auth));

  // CMS: REST-based Tier B content with Redis Caching
  app.use("/api/cms", cmsRouter);

  // Health Check
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "operational", 
      gateway: "v2.1.1 (REST)",
      services: {
        auth: "ready",
        cms: "active"
      }
    });
  });

  const PORT = process.env.PORT || 3005;

  if (process.env.NODE_ENV !== "test") {
    httpServer.listen(PORT, () => {
      console.log(`
      🚀 GreenScale API Gateway (REST Edition)
      -------------------------
      Status:   http://localhost:${PORT}/health
      Auth:     http://localhost:${PORT}/api/auth
      CMS API:  http://localhost:${PORT}/api/cms
      `);
    });
  }

  // Return the app instance for integration testing
  return { app };
};

// Bootstrap the Gateway
startServer().catch((err) => {
  console.error("💥 Failed to start API Gateway:", err);
  process.exit(1);
});