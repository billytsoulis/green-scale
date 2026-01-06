import Redis from "ioredis";

/**
 * GreenScale Redis Utility
 * Path: apps/api-gateway/src/lib/redis.ts
 * * Performance layer for the Hybrid CMS.
 */

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 5,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("error", (err) => {
  console.error("❌ [REDIS] Connection Error:", err);
});

redis.on("connect", () => {
  console.log("🚀 [REDIS] Connected to high-performance cache layer.");
});

export default redis;