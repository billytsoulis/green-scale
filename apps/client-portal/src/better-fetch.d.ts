/**
 * Staff Engineer Type Definition (v1.2):
 * This definition supports both named and default exports to resolve 
 * bundler discrepancies in the Next.js Edge Runtime.
 */
declare module "better-fetch" {
  export interface BetterFetchOptions {
    baseURL?: string;
    headers?: Record<string, string> | Headers;
    method?: string;
    body?: any;
    credentials?: string;
  }

  export type BetterFetchResponse<T> = Promise<{ data: T | null; error: any }>;

  export function betterFetch<T = any>(
    url: string, 
    options?: BetterFetchOptions
  ): BetterFetchResponse<T>;

  export function createBetterFetch(options?: BetterFetchOptions): typeof betterFetch;

  /**
   * Resolution Guard Support:
   * Next.js Turbopack often wraps ESM modules in a .default property.
   * This declaration ensures TS recognizes the fallback logic used in middleware.ts.
   */
  const defaultExport: {
    betterFetch: typeof betterFetch;
    createBetterFetch: typeof createBetterFetch;
  };
  
  export default defaultExport;
}