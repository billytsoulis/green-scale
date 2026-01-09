/**
 * GreenScale CMS Fetcher Utility
 * Path: apps/client-portal/src/lib/cms-client.ts
 * * Purpose: Fetches localized content blocks from the API Gateway.
 * * Strategy: Server-side fetching for SEO and performance.
 */

const GATEWAY_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3005";

export type CMSContent = Record<string, string>;

/**
 * Fetches content for a specific page from the API Gateway.
 * This function is designed to be called inside Next.js Server Components.
 */
export async function getPageContent(pageId: string, lang: string): Promise<CMSContent> {
  const url = `${GATEWAY_URL}/api/cms/${pageId}?lang=${lang}`;

  try {
    const response = await fetch(url, {
      // We use 'no-store' during development to see CMS changes immediately.
      // In production, Next.js can cache this based on revalidation tags.
      cache: "no-store", 
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ [CMS-CLIENT] Failed to fetch content for: ${pageId} (${lang})`);
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ [CMS-CLIENT] Network error fetching content for ${pageId}:`, error);
    return {};
  }
}