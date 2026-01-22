"use client";

import React, { use } from "react";
// @ts-ignore
import { motion } from "framer-motion";
// @ts-ignore
import { Check, ShieldCheck, Sparkles, Zap, Globe, ArrowRight } from "lucide-react";

/**
 * GreenScale Pricing Module - Phase 5 Polish
 * Path: apps/client-portal/src/app/[lang]/(marketing)/pricing/page.tsx
 * Business: Tiered access to AI Rebalancing and Project Registry.
 * UX: Framer-motion staggered grid with hover-state depth and Next.js 15 param unwrapping.
 */

import { Button, Card, Badge } from "@repo/ui";
import { useTranslation } from "@/context/LanguageContext";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function PricingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const isGreek = lang === "el";

  const tiers = [
    {
      name: isGreek ? "Essential" : "Essential",
      price: "€0",
      description: isGreek ? "Για τον συνειδητοποιημένο επενδυτή που ξεκινά τώρα." : "For the conscious investor beginning their ethical journey.",
      features: [
        isGreek ? "Έλεγχος Αξιών & Persona" : "Values Audit & Persona Mapping",
        isGreek ? "Σύνδεση 1 Τραπεζικού Λογαριασμού" : "Link 1 Banking Institution",
        isGreek ? "Βασικό Σκορ ESG" : "Basic ESG Health Score",
        isGreek ? "Μηνιαίες Αναφορές Αντικτύπου" : "Monthly Impact Statements"
      ],
      cta: isGreek ? "ΞΕΚΙΝΗΣΤΕ ΔΩΡΕΑΝ" : "START FOR FREE",
      featured: false
    },
    {
      name: isGreek ? "Professional" : "Professional",
      price: "€49",
      description: isGreek ? "Πλήρης πρόσβαση στην βελτιστοποίηση χαρτοφυλακίου AI." : "Full access to AI-driven portfolio optimization and rebalancing.",
      features: [
        isGreek ? "Όλα τα χαρακτηριστικά του Essential" : "Everything in Essential",
        isGreek ? "Απεριόριστες Τραπεζικές Συνδέσεις" : "Unlimited Banking Connections",
        isGreek ? "AI Rebalancing (Ethical Pivot)" : "AI Rebalancing (Ethical Pivot)",
        isGreek ? "Πρόσβαση στο Project Registry" : "Direct Project Registry Access",
        isGreek ? "Προτεραιότητα σε Νέες Κατανομές" : "Priority in New Allocations"
      ],
      cta: isGreek ? "ΕΠΙΛΟΓΗ PROFESSIONAL" : "SELECT PROFESSIONAL",
      featured: true
    },
    {
      name: isGreek ? "Institutional" : "Institutional",
      price: "Custom",
      description: isGreek ? "Εξατομικευμένη διαχείριση για οικογενειακά γραφεία." : "Bespoke management for family offices and institutional funds.",
      features: [
        isGreek ? "Όλα τα χαρακτηριστικά του Professional" : "Everything in Professional",
        isGreek ? "Προσωπικός Σύμβουλος ESG" : "Dedicated ESG Advisor",
        isGreek ? "White-label Αναφορές" : "White-label Reporting",
        isGreek ? "Προσαρμοσμένα Επενδυτικά Mandates" : "Custom Investment Mandates",
        isGreek ? "Υποστήριξη 24/7 Priority" : "24/7 Priority Institutional Support"
      ],
      cta: isGreek ? "ΕΠΙΚΟΙΝΩΝΙΑ" : "CONTACT SALES",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#FEFCF3]" data-component="PricingPage">
      {/* Hero Section */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-6 py-2">
            {isGreek ? "Διαφανής Τιμολόγηση" : "Transparent Pricing"}
          </Badge>
          <h1 className="text-6xl md:text-8xl font-serif font-black text-slate-900 tracking-tight leading-none">
            {isGreek ? "Επενδύστε στην" : "Invest in"} <br/>
            <span className="text-emerald-800">{isGreek ? "Διαφάνεια." : "Transparency."}</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            {isGreek 
              ? "Επιλέξτε το επίπεδο συμμετοχής που ταιριάζει στην κληρονομιά σας. Χωρίς κρυφές χρεώσεις, μόνο καθαρός αντίκτυπος." 
              : "Choose the level of involvement that suits your legacy. No hidden fees, just radical impact performance."}
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-40">
        {/* @ts-ignore */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {tiers.map((tier, idx) => (
            // @ts-ignore
            <motion.div key={idx} variants={itemVariants} className="h-full">
              <Card className={`h-full flex flex-col group transition-all duration-500 hover:-translate-y-2.5 ${tier.featured ? 'ring-8 ring-emerald-50 border-emerald-200' : 'hover:border-emerald-200'}`}>
                {tier.featured && (
                  <div className="absolute top-0 right-0 p-8">
                    <Badge className="bg-emerald-950 text-white border-none flex items-center gap-2">
                      <Sparkles size={10} /> {isGreek ? "ΔΗΜΟΦΙΛΕΣ" : "RECOMMENDED"}
                    </Badge>
                  </div>
                )}

                <div className="space-y-6 text-left flex-1">
                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{tier.price}</span>
                      {tier.price !== "Custom" && <span className="text-slate-300 font-bold text-lg">/mo</span>}
                    </div>
                  </div>

                  <p className="text-slate-500 font-medium leading-relaxed italic">
                    {tier.description}
                  </p>

                  <div className="pt-8 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                      {isGreek ? "ΠΕΡΙΛΑΜΒΑΝΕΙ" : "INCLUDES"}
                    </p>
                    <ul className="space-y-4">
                      {tier.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 group/item">
                          <div className={`mt-1 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${tier.featured ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-300'}`}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                          <span className="text-sm font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-12 mt-12 border-t border-slate-50">
                  <Button 
                    variant={tier.featured ? "primary" : "outline"} 
                    className="w-full py-6!"
                  >
                    {tier.cta}
                  </Button>
                </div>

                {/* Decorative background element for the featured card */}
                {tier.featured && (
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="bg-emerald-950 py-32 px-8 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <div className="flex justify-center gap-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
               <ShieldCheck size={28} />
             </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-white leading-tight">
            {isGreek ? (
              <>Θεσμική Ασφάλεια. <br/> Χωρίς Συμβιβασμούς.</>
            ) : (
              <>Institutional Security. <br/> No Compromises.</>
            )}
          </h2>
          <p className="text-emerald-100/60 text-lg font-medium max-w-xl mx-auto">
            {isGreek 
              ? "Όλα τα επίπεδα τιμολόγησης περιλαμβάνουν κρυπτογράφηση AES-256 και συμμόρφωση με τους κανονισμούς της ΕΕ." 
              : "All pricing tiers include AES-256 data encryption and strict adherence to EU financial regulations."}
          </p>
        </div>
        
        {/* Abstract background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-white/3 select-none pointer-events-none italic">
          GS
        </div>
      </section>
    </div>
  );
}