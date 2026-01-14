import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { auth } from "./auth"; 
import { toNodeHandler } from "better-auth/node";
import { cmsRouter } from "./routes/cms";
import projectsRouter from "./routes/projects"; // GS-22: Project CRUD
import cmsProjectsRouter from "./routes/cms/projects"; // GS-22: Modular Projects Layout

/**
 * GreenScale API Gateway - GS-22 Edition
 * Path: apps/api-gateway/src/index.ts
 * * Integrated: Socket.io (Live Sync), Better Auth, Modular CMS, and Projects Catalog.
 */

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  /**
   * 1. Socket.io Initialization (GS-20)
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
  
  // Auth Routes
  // @ts-ignore
  app.all("/api/auth/*", toNodeHandler(auth));
  
  // Layer 1-3 CMS Routes (Pages, Sections, Preview Sync)
  // @ts-ignore
  app.use("/api/cms", cmsRouter);

  // GS-22: Project Management & Public Catalog
  // @ts-ignore
  app.use("/api/projects", projectsRouter);
  
  // GS-22: Modular CMS Layout for Projects page
  // @ts-ignore
  app.use("/api/cms/projects", cmsProjectsRouter);

  /**
   * 5. Health Check & Diagnostics
   */
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "operational", 
      gateway: "v2.3.0 (Projects Enabled)",
      services: {
        socket: "connected",
        cms: "active",
        projects: "active"
      }
    });
  });

  const PORT = process.env.PORT || 3005;

  if (process.env.NODE_ENV !== "test") {
    httpServer.listen(PORT, () => {
      console.log(`
      🚀 GreenScale API Gateway (GS-22 Edition)
      -----------------------------------------
      Status:      http://localhost:${PORT}/health
      Auth:        http://localhost:${PORT}/api/auth
      CMS API:     http://localhost:${PORT}/api/cms
      Projects:    http://localhost:${PORT}/api/projects
      -----------------------------------------
      Ready for Real-Time Sync & Project Management.
      `);
    });
  }

  return { app };
};

startServer().catch((err) => {
  console.error("💥 Failed to start API Gateway:", err);
  process.exit(1);
});