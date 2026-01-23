/**
 * Staff Dashboard: UI Utilities
 * Path: apps/staff-dashboard/src/lib/utils.ts
 * Purpose: Provides the 'cn' (className) helper to manage complex Tailwind 4 class merging.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn helper
 * Logic: Merges tailwind classes and resolves conflicts (e.g., p-4 and p-6).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}