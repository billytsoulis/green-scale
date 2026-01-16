"use client";

// @ts-ignore
import { authClient } from "@/lib/auth-client";
// @ts-ignore
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * GreenScale Auth Hook
 * Path: greenscale/apps/client-portal/src/hooks/useAuth.ts
 * Purpose: Centralized session management and route guarding.
 */

export const useAuth = (requireAuth = true) => {
  // @ts-ignore
  const { data: session, isPending, error } = authClient.useSession();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "en";

  useEffect(() => {
    if (!isPending && !session && requireAuth) {
      // Redirect unauthorized users to login
      router.push(`/${lang}/login`);
    }
  }, [session, isPending, requireAuth, router, lang]);

  return {
    user: session?.user,
    session,
    isLoading: isPending,
    isAuthenticated: !!session,
    error
  };
};