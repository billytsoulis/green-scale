import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { auth } from "./auth"; 
import { toNodeHandler } from "better-auth/node";
import { cmsRouter } from "./routes/cms";
import projectsRouter from "./routes/projects"; 
import cmsProjectsRouter from "./routes/cms/projects"; 
import usersRouter from "./routes/users"; 
import authRouter from "./routes/auth"; 
import bankingRouter from "./routes/banking";
import fundingRouter from "./routes/funding";

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
   * 2. Global Middleware
   */
  app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  }));

  app.use(express.json());

  // Inject Socket.io into the request object
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
    });
  });

  /**
   * 4. Route Handlers
   */
  
  // Phase 2: Custom Auth Bridge
  // CRITICAL: Mounted BEFORE generic handler to catch /get-jwt.
  /** @ts-ignore */
  app.use("/api/auth", authRouter);

  // Better-Auth Core Handlers
  // @ts-ignore
  app.all("/api/auth/*", toNodeHandler(auth));
  
  // Phase 3: Banking & Asset Ledger (Server-side Math)
  /** @ts-ignore */
  app.use("/api/banking", bankingRouter);
  app.use("/api/funding", fundingRouter);

  // Layer 1-3 CMS Routes
  // @ts-ignore
  app.use("/api/cms", cmsRouter);

  // Project Management API
  // @ts-ignore
  app.use("/api/projects", projectsRouter);
  
  // Modular Projects Page CMS Layout
  // @ts-ignore
  app.use("/api/cms/projects", cmsProjectsRouter);

  // User Profile Management
  /** @ts-ignore */
  app.use("/api/users", usersRouter);

  /**
   * 5. Health Check & Diagnostics
   */
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "operational", 
      gateway: "v3.0.0 (Phase 3 Active)",
      services: {
        banking: "ledger-online",
        auth: "bridge-active",
        profiles: "sync-enabled"
      }
    });
  });

  const PORT = process.env.PORT || 3005;

  if (process.env.NODE_ENV !== "test") {
    httpServer.listen(PORT, () => {
      console.log(`
      🚀 GreenScale API Gateway (Phase 3 Ledger Active)
      -----------------------------------------
      Status:      http://localhost:${PORT}/health
      Banking API: http://localhost:${PORT}/api/banking/sync
      Auth Bridge: http://localhost:${PORT}/api/auth/get-jwt
      Users API:   http://localhost:${PORT}/api/users
      -----------------------------------------
      Server-side asset normalization and weighted ESG math active.
      `);
    });
  }

  return { app };
};

startServer().catch((err) => {
  console.error("💥 Failed to start API Gateway:", err);
  process.exit(1);
});