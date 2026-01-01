import { NextResponse } from "next/server";

/**
 * Staff Engineer Debugging Tool:
 * This is a standard health check endpoint. 
 * If you can see this at /api/health, then your Next.js 'src' directory 
 * is configured correctly.
 */
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Next.js routing is functional",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}