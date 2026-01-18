"use client";

import React, { useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { AuthLayout, Input, Button, Badge } from "@repo/ui";

/**
 * GreenScale Phase 4: KYC Onboarding
 * Path: greenscale/apps/client-portal/src/app/[lang]/onboarding/kyc/page.tsx
 * Purpose: Secure identity verification and financial profiling.
 * Logic: Multi-step form with validation simulation.
 */

export default function KYCPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as string) || "en";
  const isGreek = lang === "el";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    // Simulate KYC Verification through an external provider (e.g. Onfido/Sumsub)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push(`/${lang}/dashboard`);
  };

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
      <div className="space-y-8">
        {/* Progress Stepper */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? "bg-emerald-600" : "bg-slate-100"}`} 
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Input label={isGreek ? "Πλήρες Όνομα" : "Full Legal Name"} placeholder="John Doe" />
            <Input label={isGreek ? "Ημερομηνία Γέννησης" : "Date of Birth"} type="date" />
            <Button className="w-full" onClick={() => setStep(2)}>
              {isGreek ? "Συνεχεια" : "Continue"}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-center space-y-4 bg-slate-50">
               <div className="text-3xl">🪪</div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                 {isGreek ? "Ανεβάστε Διαβατήριο ή Ταυτότητα" : "Upload Passport or National ID"}
               </p>
               <input type="file" className="hidden" id="kyc-upload" />
               <label htmlFor="kyc-upload" className="block px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-all">
                 {isGreek ? "Επιλογη Αρχειου" : "Select Document"}
               </label>
            </div>
            <Button className="w-full" onClick={() => setStep(3)}>
              {isGreek ? "Επιβεβαιωση" : "Verify Document"}
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
            <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none cursor-pointer">
              <option>€500k - €1M</option>
              <option>€1M - €5M</option>
              <option>€5M+</option>
            </select>
            <Button className="w-full" onClick={handleComplete} disabled={loading}>
              {loading ? (isGreek ? "Επεξεργασια..." : "Processing...") : (isGreek ? "Ολοκληρωση" : "Finalize Verification")}
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}