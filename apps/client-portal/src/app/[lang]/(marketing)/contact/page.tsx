"use client";

import React, { useState, useEffect, use } from "react";

/**
 * GreenScale Contact & Lead Generation - Localized Edition
 * Path: apps/client-portal/src/app/[lang]/(marketing)/contact/page.tsx
 * * Refactored to use URL-based language parameters.
 * * Synchronizes with LanguageContext for dictionary rendering.
 */

import { Button, Input, Card } from "@repo/ui";
import { useTranslation } from "@/context/LanguageContext";
import { MapPin, Mail } from "lucide-react";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function ContactPage({ params }: PageProps) {
  /**
   * FIX: In Next.js 15, 'params' is a Promise.
   * We must unwrap it using React.use() before accessing properties.
   */
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    intent: "",
    amount: "500k-1m"
  });

  // @ts-ignore
  const { t, setLang } = useTranslation();

  // Sync the context state with the unwrapped URL parameter
  useEffect(() => {
    if (lang === "el" || lang === "en") {
      setLang(lang as "en" | "el");
    }
    setMounted(true);
  }, [lang, setLang]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (!mounted) return null;

  return (
    <div className="bg-[#FEFCF3] min-h-screen" data-component="ContactPage">
      <div className="py-24 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Branding & Info */}
        <div className="space-y-12 text-left">
          <div className="space-y-6">
            <h1 className="text-6xl font-serif font-black text-slate-900 tracking-tight leading-[1.1]">
              {t.contact.title} <br/> 
              <span className="text-emerald-700">{t.contact.accent}</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">
              {t.contact.description}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-emerald-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
                  {lang === "el" ? "ΓΡΑΦΕΙΟ" : "OFFICE"}
                </p>
                <p className="font-bold text-slate-900">Neo Rysio, Thessaloniki, Greece</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-emerald-600">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
                   {lang === "el" ? "ΠΛΗΡΟΦΟΡΙΕΣ" : "INQUIRIES"}
                </p>
                <p className="font-bold text-slate-900">private@greenscale.finance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Multi-step Form */}
        <div className="relative">
           {/* @ts-ignore */}
           <Card className="p-12 bg-white ring-8 ring-emerald-50/50">
              <div className="mb-10 flex justify-between items-center">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                    {lang === "el" ? `ΒΗΜΑ ${step} ΑΠΟ 3` : `Step ${step} of 3`}
                  </p>
                  <div className="flex gap-1.5">
                     {[1, 2, 3].map(i => (
                       <div key={i} className={`h-1.5 rounded-full transition-all ${step >= i ? "w-8 bg-emerald-600" : "w-2 bg-slate-100"}`} />
                     ))}
                  </div>
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {lang === "el" ? "Επενδυτικό Προφίλ" : "Investment Profile"}
                  </h3>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        {lang === "el" ? "ΠΡΟΓΡΑΜΜΑΤΙΣΜΕΝΟΣ ΟΡΙΖΟΝΤΑΣ" : "PLANNED INVESTMENT HORIZON"}
                     </label>
                     <div className="grid grid-cols-2 gap-3">
                        {["< €100k", "€100k-€500k", "€500k-€1m", "€1m+"].map(opt => (
                          <button 
                            key={opt}
                            onClick={() => setFormData({...formData, amount: opt})}
                            className={`py-4 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${formData.amount === opt ? "bg-emerald-950 text-white border-emerald-950 shadow-xl" : "bg-white border-slate-50 hover:border-emerald-100 text-slate-400"}`}
                          >
                            {opt}
                          </button>
                        ))}
                     </div>
                  </div>
                  <Button onClick={nextStep} className="w-full py-6">
                    {lang === "el" ? "Συνέχεια" : "Continue"}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {lang === "el" ? "Τι έχει αξία για εσάς;" : "What do you value most?"}
                  </h3>
                  <Input 
                    label={lang === "el" ? "Βασικό Ενδιαφέρον" : "Primary Interest"} 
                    placeholder={lang === "el" ? "π.χ. Καθαρή Ενέργεια..." : "e.g. Clean Energy..."} 
                    value={formData.intent}
                    onChange={(e: any) => setFormData({...formData, intent: e.target.value})}
                  />
                  <div className="flex gap-4">
                     <Button variant="ghost" onClick={prevStep} className="flex-1">
                        {lang === "el" ? "Πίσω" : "Back"}
                     </Button>
                     <Button onClick={nextStep} className="flex-2">
                        {lang === "el" ? "Επόμενο" : "Next"}
                     </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {lang === "el" ? "Στοιχεία Επικοινωνίας" : "Direct Contact"}
                  </h3>
                  <Input label={lang === "el" ? "Ονοματεπώνυμο" : "Full Name"} placeholder="John Doe" />
                  <Input label="Email" type="email" placeholder="john@company.com" />
                  <div className="flex gap-4">
                     <Button variant="ghost" onClick={prevStep} className="flex-1">
                        {lang === "el" ? "Πίσω" : "Back"}
                     </Button>
                     <Button className="flex-2 bg-emerald-700! shadow-emerald-700/20">
                        {lang === "el" ? "Αίτημα Ελέγχου" : "Request Audit"}
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