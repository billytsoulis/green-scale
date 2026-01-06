"use client";

import React, { useState, useEffect } from "react";

/**
 * GreenScale Contact & Lead Generation - Localized Edition
 * Path: apps/client-portal/src/app/[lang]/(marketing)/contact/page.tsx
 * * Refactored to use URL-based language parameters.
 * * Synchronizes with LanguageContext for dictionary rendering.
 */

import { Button, Input, Card } from "@repo/ui";
import { useTranslation } from "@/context/LanguageContext";

export default function ContactPage({ params }: { params: { lang: string } }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    intent: "",
    amount: "500k-1m"
  });

  /**
   * @ts-ignore - Accessing the translation hook
   */
  const { t, setLang } = useTranslation();

  // Sync the context state with the URL parameter on mount
  useEffect(() => {
    if (params.lang === "el" || params.lang === "en") {
      setLang(params.lang as "en" | "el");
    }
    setMounted(true);
  }, [params.lang, setLang]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (!mounted) return null;

  return (
    <div className="bg-[#FEFCF3]" data-component="ContactPage">
      <div className="py-24 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Branding & Info */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="text-6xl font-serif font-black text-slate-900 tracking-tight leading-[1.1]">
              {t.contact.title} <br/> 
              <span className="text-brand-emerald-700">{t.contact.accent}</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
              {t.contact.description}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-brand-emerald-600">
                📍
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {params.lang === "el" ? "ΓΡΑΦΕΙΟ" : "OFFICE"}
                </p>
                <p className="font-bold text-slate-900">Neo Rysio, Thessaloniki, Greece</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-brand-emerald-600">
                ✉️
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   {params.lang === "el" ? "ΠΛΗΡΟΦΟΡΙΕΣ" : "INQUIRIES"}
                </p>
                <p className="font-bold text-slate-900">private@greenscale.finance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Multi-step Form */}
        <div className="relative">
           {/* @ts-ignore */}
           <Card variant="elevated" className="p-12 bg-white ring-8 ring-brand-emerald-50/50">
              <div className="mb-10 flex justify-between items-center">
                 <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                   {params.lang === "el" ? `ΒΗΜΑ ${step} ΑΠΟ 3` : `Step ${step} of 3`}
                 </p>
                 <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${step >= i ? "w-8 bg-brand-emerald-600" : "w-2 bg-slate-100"}`} />
                    ))}
                 </div>
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {params.lang === "el" ? "Επενδυτικό Προφίλ" : "Investment Profile"}
                  </h3>
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                        {params.lang === "el" ? "ΠΡΟΓΡΑΜΜΑΤΙΣΜΕΝΟΣ ΟΡΙΖΟΝΤΑΣ" : "PLANNED INVESTMENT HORIZON"}
                     </label>
                     <div className="grid grid-cols-2 gap-3">
                        {["< €100k", "€100k-€500k", "€500k-€1m", "€1m+"].map(opt => (
                          <button 
                            key={opt}
                            onClick={() => setFormData({...formData, amount: opt})}
                            className={`py-4 rounded-xl border font-bold text-sm transition-all ${formData.amount === opt ? "bg-brand-emerald-900 text-white border-brand-emerald-900" : "border-slate-100 hover:border-brand-emerald-200 text-slate-600"}`}
                          >
                            {opt}
                          </button>
                        ))}
                     </div>
                  </div>
                  {/* @ts-ignore */}
                  <Button onClick={nextStep} className="w-full !py-6">
                    {params.lang === "el" ? "Συνέχεια" : "Continue"}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {params.lang === "el" ? "Τι έχει αξία για εσάς;" : "What do you value most?"}
                  </h3>
                  {/* @ts-ignore */}
                  <Input 
                    label={params.lang === "el" ? "Βασικό Ενδιαφέρον" : "Primary Interest"} 
                    placeholder={params.lang === "el" ? "π.χ. Καθαρή Ενέργεια..." : "e.g. Clean Energy..."} 
                    value={formData.intent}
                    onChange={(e: any) => setFormData({...formData, intent: e.target.value})}
                  />
                  <div className="flex gap-4">
                     {/* @ts-ignore */}
                     <Button variant="ghost" onClick={prevStep} className="flex-1">
                        {params.lang === "el" ? "Πίσω" : "Back"}
                     </Button>
                     {/* @ts-ignore */}
                     <Button onClick={nextStep} className="flex-[2] !py-6">
                        {params.lang === "el" ? "Επόμενο" : "Next"}
                     </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {params.lang === "el" ? "Στοιχεία Επικοινωνίας" : "Direct Contact"}
                  </h3>
                  {/* @ts-ignore */}
                  <Input label={params.lang === "el" ? "Ονοματεπώνυμο" : "Full Name"} placeholder="John Doe" />
                  {/* @ts-ignore */}
                  <Input label="Email" type="email" placeholder="john@company.com" />
                  <div className="flex gap-4">
                     {/* @ts-ignore */}
                     <Button variant="ghost" onClick={prevStep} className="flex-1">
                        {params.lang === "el" ? "Πίσω" : "Back"}
                     </Button>
                     {/* @ts-ignore */}
                     <Button className="flex-[2] !py-6 !bg-brand-emerald-900">
                        {params.lang === "el" ? "Αίτημα Ελέγχου" : "Request Audit"}
                     </Button>
                  </div>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}