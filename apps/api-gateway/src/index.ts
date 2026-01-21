import express from "express";
import cors from "cors";
import http from "http";
// @ts-ignore
import { Server } from "socket.io";
// @ts-ignore - The Stateless JWT Configuration provided in your query
import { auth } from "./auth"; 
// @ts-ignore
import { toNodeHandler } from "better-auth/node";
// @ts-ignore
import { cmsRouter } from "./routes/cms";
import projectsRouter from "./routes/projects"; 
// @ts-ignore
import cmsProjectsRouter from "./routes/cms/projects"; 
// @ts-ignore
import usersRouter from "./routes/users"; 
// @ts-ignore - Custom Auth Bridge to handle explicit /get-jwt requests
import authRouter from "./routes/auth"; 

/**
 * GreenScale API Gateway - Central Orchestrator
 * Path: greenscale/apps/api-gateway/src/index.ts
 * Purpose: Manages Auth, CMS, Users, and Real-time sockets.
 * Fix: Synchronized route mounting with the JWT 'auth.ts' configuration.
 */

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  /**
   * 1. Socket.io Initialization
   */
  // @ts-ignore
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"]
    }
  });

  /**
   * 2. Global Middleware & IO Injection
   */
  app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  }));

  app.use(express.json());

  // Inject Socket.io into the request object for use in routes
  app.use((req: any, res, next) => {
    req.io = io;
    next();
  });

  /**
   * 3. Socket Event Logic
   */
  io.on("connection", (socket: any) => {
    socket.on("portal:join-preview", (previewId: string) => {
      socket.join(`preview-${previewId}`);
      console.log(`📡 [SOCKET] Portal joined room: preview-${previewId}`);
    });

    socket.on("disconnect", () => {
      console.log("📡 [SOCKET] Client disconnected");
    });
  });

  /**
   * 4. Route Handlers
   */
  
  // Phase 2 Stability: Custom Auth Bridge
  /** * CRITICAL FIX: We mount authRouter here to explicitly handle GET /api/auth/get-jwt.
   * This takes precedence over the generic handler to resolve 404 pathing errors.
   * @ts-ignore 
   */
  app.use("/api/auth", authRouter);

  // Generic Auth Routes - Handled via Better-Auth Node adapter
  // Note: Better-Auth internal routes will be available at /api/auth/*
  // @ts-ignore
  app.all("/api/auth/*", toNodeHandler(auth));
  
  // Layer 1-3 CMS Routes
  // @ts-ignore
  app.use("/api/cms", cmsRouter);

  // GS-22: Project Management & Public Catalog
  // @ts-ignore
  app.use("/api/projects", projectsRouter);
  
  // GS-22: Modular CMS Layout for Projects page
  // @ts-ignore
  app.use("/api/cms/projects", cmsProjectsRouter);

  // Investor Profile Management (Phase 1 Persistence)
  /** @ts-ignore - Handles /api/users/profile updates */
  app.use("/api/users", usersRouter);

  /**
   * 5. Health Check & Diagnostics
   */
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "operational", 
      gateway: "v2.5.0 (Auth Bridge Active)",
      services: {
        socket: "connected",
        cms: "active",
        auth: "ready",
        profiles: "enabled"
      }
    });
  });

  const PORT = process.env.PORT || 3005;

  if (process.env.NODE_ENV !== "test") {
    httpServer.listen(PORT, () => {
      console.log(`
      🚀 GreenScale API Gateway (Stateless JWT Enabled)
      -----------------------------------------
      Status:      http://localhost:${PORT}/health
      Auth Bridge: http://localhost:${PORT}/api/auth/get-jwt
      Users API:   http://localhost:${PORT}/api/users
      -----------------------------------------
      Gateway stabilized. Bridge correctly mapped to Stateless configuration.
      `);
    });
  }

  return { app };
};

startServer().catch((err) => {
  console.error("💥 Failed to start API Gateway:", err);
  process.exit(1);
});