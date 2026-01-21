"use client";

import { useState, useEffect, useRef } from "react";

import { useParams, useRouter } from "next/navigation";
import { AuthLayout, Input, Button } from "@repo/ui";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/useAuth";

/**
 * GreenScale Phase 4: KYC Onboarding
 * Path: greenscale/apps/client-portal/src/app/[lang]/onboarding/kyc/page.tsx
 * Purpose: Secure identity verification and financial profiling.
 * Logic: Multi-step form with validation simulation.
 */

export default function KYCPage() {
  const params = useParams();
  const router = useRouter();
  
  // @ts-ignore
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const lang = (params?.lang as string) || "en";
  const isGreek = lang === "el";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  
  const hasInitialSyncRun = useRef(false);

  const GATEWAY_URL = "http://localhost:3005";

  /**
   * Helper: retrieveToken
   * Fix: Added Mock Purge logic. If a token is found but it contains "mock-jwt",
   * it is immediately discarded to allow the bridge to provide a real one.
   */
  const retrieveToken = async () => {
    try {
      // 1. Direct call to our now-verified Backend Bridge
      const res = await fetch(`${GATEWAY_URL}/api/auth/get-jwt`, {
        credentials: "include" // REQUIRED to send the session cookie
      });
      
      if (res.ok) {
        const { token } = await res.json();
        
        // SECURITY: If the bridge is still returning a mock string, reject it
        if (token && token.startsWith("mock-")) {
          console.error("🛑 [Security] Bridge returned a MOCK token. Check backend implementation.");
          return null;
        }
        return token;
      }

      // 2. LocalStorage Fallback (With Purge)
      const stored = localStorage.getItem("gs-auth.token");
      if (stored && stored.startsWith("mock-")) {
        console.warn("⚠️ [KYC] Stale mock token detected in storage. Purging...");
        localStorage.removeItem("gs-auth.token");
        return null;
      }
      return stored;
    } catch (e) {
      return null;
    }
  };

  /**
   * 1. Hydration Logic
   */
  useEffect(() => {
    if (authLoading || !isAuthenticated || hasInitialSyncRun.current) return;

    const hydrateProgress = async () => {
      hasInitialSyncRun.current = true;
      
      try {
        const token = await retrieveToken();
        
        if (!token) {
          console.warn("[KYC] Valid session token not found. Retrying hydration in 1s...");
          hasInitialSyncRun.current = false;
          // Short delay to allow session cookie stabilization
          setTimeout(() => setLoading(false), 1000);
          return;
        }

        const res = await fetch(`${GATEWAY_URL}/api/users/me`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.profile?.kycStep) {
            setStep(data.profile.kycStep);
          }
        } else {
          const err = await res.json();
          console.error("[KYC] Gateway rejected identity validation:", err.error);
          // If 401, it means the token signature is invalid (shared secret mismatch)
        }
      } catch (err) {
        console.error("[KYC Hydration Error] Failed to link with PostgreSQL:", err);
      } finally {
        setLoading(false);
      }
    };

    hydrateProgress();
  }, [isAuthenticated, authLoading, GATEWAY_URL]);

  /**
   * 2. Persistence logic
   */
  const saveProgress = async (nextStep: number, additionalData = {}) => {
    setSyncing(true);
    try {
      const token = await retrieveToken();
      if (!token) throw new Error("Security token missing.");

      const res = await fetch(`${GATEWAY_URL}/api/users/profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          kycStep: nextStep,
          ...additionalData
        })
      });

      if (res.ok) {
        setStep(nextStep);
      } else {
        const errorData = await res.json();
        console.error("[KYC Persistence] Database update rejected:", errorData);
      }
    } catch (err) {
      console.error("[KYC Persistence] Sync failure:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleFinalize = async () => {
    setSyncing(true);
    await saveProgress(4, { kycStatus: "VERIFIED" });
    // @ts-ignore
    router.push(`/${lang}/dashboard`);
  };

  if (authLoading || loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
        Synchronizing identity vault...
      </div>
    </div>
  );

  return (
    <AuthLayout 
      title={isGreek ? "Επαλήθευση Ταυτότητας" : "Identity Verification"}
      description={isGreek ? "Απαιτείται από τους κανονισμούς της ΕΕ για την προστασία των επενδύσεων." : "Required by EU regulations to safeguard high-value allocations."}
      footer={
        <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest text-center">
          {isGreek ? "Κρυπτογραφημένο με AES-256" : "Encrypted with AES-256"}
        </p>
      }
    >
      <div className="space-y-8" data-component="PersistentKYC">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full transition-all duration-700 ${s <= step ? "bg-emerald-600" : "bg-slate-100"}`} 
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Input label={isGreek ? "Πλήρες Όνομα" : "Full Legal Name"} placeholder="John Doe" />
            <Input label={isGreek ? "Ημερομηνία Γέννησης" : "Date of Birth"} type="date" />
            <Button className="w-full" onClick={() => saveProgress(2)} disabled={syncing}>
              {syncing ? "..." : (isGreek ? "Συνεχεια" : "Continue")}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-center space-y-4 bg-slate-50">
               <div className="text-3xl">🪪</div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{isGreek ? "Ανεβάστε Διαβατήριο ή Ταυτότητα" : "Upload Passport or National ID"}</p>
               <input type="file" className="hidden" id="kyc-upload" />
               <label htmlFor="kyc-upload" className="block px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-all">
                 {isGreek ? "Επιλογη Αρχειου" : "Select Document"}
               </label>
            </div>
            <Button className="w-full" onClick={() => saveProgress(3)} disabled={syncing}>
              {syncing ? "..." : (isGreek ? "Επιβεβαιωση" : "Verify Document")}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-ping" />
            </div>
            <h3 className="font-bold text-slate-900">{isGreek ? "Οικονομικό Προφίλ" : "Financial Profile"}</h3>
            <p className="text-sm text-slate-500">{isGreek ? "Επιβεβαιώστε την ετήσια καθαρή σας θέση." : "Please confirm your annual investable net worth."}</p>
            <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none cursor-pointer text-slate-900">
              <option>€500k - €1M</option>
              <option>€1M - €5M</option>
              <option>€5M+</option>
            </select>
            <Button className="w-full" onClick={handleFinalize} disabled={syncing}>
              {syncing ? "..." : (isGreek ? "Ολοκληρωση" : "Finalize Verification")}
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}