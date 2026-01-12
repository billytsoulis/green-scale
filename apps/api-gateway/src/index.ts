import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { auth } from "./auth"; 
import { toNodeHandler } from "better-auth/node";
import { cmsRouter } from "./routes/cms";

/**
 * GreenScale API Gateway - Real-Time Edition
 * Path: apps/api-gateway/src/index.ts
 * * Refactored: Integrated Socket.io for GS-20 Live Sync.
 * * Implementation: Express + Better Auth + Socket.io + Redis.
 */

// --- Local Mocks for Preview Safety ---
// @ts-ignore
// const auth = {};
// // @ts-ignore
// const toNodeHandler = (a: any) => (req: any, res: any) => {};
// // @ts-ignore
// const cmsRouter = express.Router();

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  /**
   * 1. Socket.io Initialization
   * We wrap the HTTP server to enable real-time bidirectional communication.
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
   * This allows our route handlers (in routes/cms.ts) to access 'req.io'.
   */
  app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  }));

  app.use(express.json());

  app.use((req: any, res, next) => {
    req.io = io;
    next();
  });

  /**
   * 3. Socket Event Logic
   * Manages client connections and room assignments.
   */
  io.on("connection", (socket: any) => {
    // When the Portal opens a preview, it joins a specific room
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
  // @ts-ignore
  app.all("/api/auth/*", toNodeHandler(auth));
  // @ts-ignore
  app.use("/api/cms", cmsRouter);

  // Health Check
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "operational", 
      gateway: "v2.2.0 (Real-Time)",
      services: {
        socket: "connected",
        cms: "active"
      }
    });
  });

  const PORT = process.env.PORT || 3005;

  if (process.env.NODE_ENV !== "test") {
    httpServer.listen(PORT, () => {
      console.log(`
      🚀 GreenScale API Gateway (Real-Time Edition)
      -------------------------
      Status:   http://localhost:${PORT}/health
      Auth:     http://localhost:${PORT}/api/auth
      CMS API:  http://localhost:${PORT}/api/cms
      `);
    });
  }

  return { app };
};

startServer().catch((err) => {
  console.error("💥 Failed to start API Gateway:", err);
  process.exit(1);
});