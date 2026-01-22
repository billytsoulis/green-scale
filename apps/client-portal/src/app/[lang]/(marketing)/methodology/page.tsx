"use client";

import React, { use } from "react";
// @ts-ignore
import { motion } from "framer-motion";
// @ts-ignore
import { Database, ShieldCheck, Cpu, Search, Zap } from "lucide-react";

/**
 * GreenScale Methodology Page
 * Path: apps/client-portal/src/app/[lang]/(marketing)/methodology/page.tsx
 * Business: Explaining the GS-Audit Engine and Ethical Alpha.
 * UX: Multi-stage scroll animations and high-fidelity institutional layout.
 */

import { Card, Badge } from "@repo/ui";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default function MethodologyPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;
  const isGreek = lang === "el";

  const steps = [
    {
      id: "01",
      icon: <Database className="text-emerald-600" size={32} />,
      title: isGreek ? "Ενοποίηση Δεδομένων" : "Data Ingestion",
      desc: isGreek 
        ? "Συγκεντρώνουμε ακατέργαστα δεδομένα περιουσιακών στοιχείων από 15.000+ παγκόσμια χρηματοπιστωτικά ιδρύματα μέσω ασφαλών πρωτοκόλλων REST." 
        : "We aggregate raw asset data from 15,000+ global financial institutions via secure REST protocols and zero-knowledge proofs.",
      tech: "AES-256 / OAuth 2.1"
    },
    {
      id: "02",
      icon: <Search className="text-blue-600" size={32} />,
      title: isGreek ? "Έλεγχος GS-Audit" : "The GS-Audit Engine",
      desc: isGreek 
        ? "Κάθε περιουσιακό στοιχείο αναλύεται βάσει 120+ παραμέτρων ESG, ξεπερνώντας τις επιφανειακές αναφορές για τον εντοπισμό πραγματικού αντικτύπου." 
        : "Every asset is parsed through 120+ ESG vectors, moving beyond surface-level reporting to identify true environmental and social impact.",
      tech: "NLP / Factor Analysis"
    },
    {
      id: "03",
      icon: <Cpu className="text-amber-600" size={32} />,
      title: isGreek ? "AI Εξισορρόπηση" : "AI Optimization",
      desc: isGreek 
        ? "Το μοντέλο Ethical Pivot υπολογίζει τη βέλτιστη κατανομή κεφαλαίου για τη μεγιστοποίηση του αντικτύπου διατηρώντας την ουδετερότητα κινδύνου." 
        : "The Ethical Pivot model computes optimal capital allocation to maximize impact delta while maintaining strict risk-neutrality.",
      tech: "Mean-Variance Opt."
    },
    {
      id: "04",
      icon: <Zap className="text-emerald-500" size={32} />,
      title: isGreek ? "Άμεση Επαλήθευση" : "On-Chain Verification",
      desc: isGreek 
        ? "Οι επενδύσεις σε έργα παρακολουθούνται σε πραγματικό χρόνο, παρέχοντας αμετάβλητη απόδειξη για την αποφυγή CO2 και την παραγωγή ενέργειας." 
        : "Project investments are monitored in real-time, providing immutable proof of CO2 avoidance and renewable energy generation metrics.",
      tech: "Real-time Telemetry"
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-component="MethodologyPage">
      {/* Hero Section */}
      <section className="py-32 bg-[#FEFCF3] border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-8 text-center space-y-10 relative z-10">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-6 py-2">
            {isGreek ? "Η Επιστήμη του Αντικτύπου" : "The Science of Impact"}
          </Badge>
          <h1 className="text-6xl md:text-[7rem] font-serif font-black text-slate-900 tracking-tighter leading-[0.9]">
            {isGreek ? (
              <>Αλγόριθμοι για <br/><span className="text-emerald-800">Ηθική Υπεραπόδοση.</span></>
            ) : (
              <>Algorithms for <br/><span className="text-emerald-800">Ethical Alpha.</span></>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed italic">
            {isGreek 
              ? "Πώς μετατρέπουμε τα παραδοσιακά χαρτοφυλάκια σε εργαλεία παγκόσμιας αναγέννησης χωρίς να θυσιάζουμε τις αποδόσεις." 
              : "How we transform legacy portfolios into engines of global regeneration without compromising institutional returns."}
          </p>
        </div>
        
        {/* Abstract Geometry */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-50" />
      </section>

      {/* The 4-Pillar Process */}
      <section className="py-40 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Sticky Left Info */}
          <aside className="lg:col-span-4 lg:sticky lg:top-40 h-fit space-y-8 text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
              {isGreek ? "Η Διαδικασία" : "The Lifecycle"}
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {isGreek 
                ? "Ένα κλειστό σύστημα συλλογής δεδομένων, ανάλυσης AI και εκτέλεσης συναλλαγών σχεδιασμένο για απόλυτη ακρίβεια." 
                : "A closed-loop system of data harvesting, AI analysis, and transactional execution engineered for absolute precision."}
            </p>
            <div className="pt-8">
               <div className="p-8 bg-emerald-950 rounded-[2.5rem] text-white space-y-6 shadow-2xl">
                  <ShieldCheck size={40} className="text-emerald-400" />
                  <h4 className="text-xl font-bold">{isGreek ? "Πρότυπο Ακεραιότητας" : "Integrity Standard"}</h4>
                  <p className="text-sm text-emerald-100/60 leading-relaxed">
                    {isGreek 
                      ? "Το μοντέλο μας ελέγχεται ετησίως από ανεξάρτητους φορείς για την πρόληψη του Greenwashing." 
                      : "Our scoring model is audited annually by independent third parties to prevent 'Greenwashing' drift."}
                  </p>
               </div>
            </div>
          </aside>

          {/* Scrolling Steps */}
          <div className="lg:col-span-8">
             {/* @ts-ignore */}
             <motion.div 
               variants={containerVariants}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: "-100px" }}
               className="space-y-8"
             >
               {steps.map((step, idx) => (
                 // @ts-ignore
                 <motion.div key={step.id} variants={stepVariants}>
                   <Card className="group hover:border-emerald-200 transition-all duration-500">
                      <div className="flex flex-col md:flex-row gap-10 items-start text-left">
                         <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:scale-110 transition-all">
                            {step.icon}
                         </div>
                         <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-4">
                               <span className="font-mono text-emerald-600 font-black text-sm tracking-widest">{step.id}</span>
                               <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{step.title}</h3>
                            </div>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                               {step.desc}
                            </p>
                            <div className="pt-4 flex items-center gap-3">
                               <Badge className="bg-slate-50 text-slate-400 border-slate-100 font-mono">
                                 {step.tech}
                               </Badge>
                               <div className="h-px flex-1 bg-slate-50" />
                            </div>
                         </div>
                      </div>
                   </Card>
                 </motion.div>
               ))}
             </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-slate-900 py-32 px-8 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
           <h2 className="text-4xl md:text-6xl font-serif font-black text-white leading-tight">
             {isGreek 
               ? "Πέρα από το ESG. Προς την Αναγέννηση." 
               : "Beyond ESG. Toward Regeneration."}
           </h2>
           <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
             {isGreek 
               ? "Δεν περιοριζόμαστε στην αποφυγή του κακού. Βελτιστοποιούμε για το ριζικό καλό, διασφαλίζοντας ότι κάθε ευρώ λειτουργεί για έναν ζωντανό πλανήτη." 
               : "We don't just mitigate harm. We optimize for radical good, ensuring every Euro works toward a living planet while securing your financial future."}
           </p>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10">
              {[
                { label: isGreek ? "Ακρίβεια" : "Accuracy", val: "99.9%" },
                { label: isGreek ? "Διαφάνεια" : "Transparency", val: "100%" },
                { label: isGreek ? "Αντίκτυπος" : "Impact", val: "∞" },
                { label: isGreek ? "Ασφάλεια" : "Security", val: "Military" },
              ].map((m, i) => (
                <div key={i} className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">{m.label}</p>
                   <p className="text-3xl font-black text-white tracking-tighter">{m.val}</p>
                </div>
              ))}
           </div>
        </div>
        
        {/* Decorative background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25rem] font-black text-white/2 select-none pointer-events-none italic">
          ALPHA
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-8 text-center bg-[#FEFCF3]">
        <div className="max-w-3xl mx-auto space-y-10">
           <h3 className="text-4xl font-serif font-black text-slate-900 leading-tight">
             {isGreek ? "Έτοιμοι για τον πρώτο σας έλεγχο;" : "Ready for your first audit?"}
           </h3>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-5 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-800 transition-all border-none cursor-pointer">
                {isGreek ? "ΞΕΚΙΝΗΣΤΕ ΤΩΡΑ" : "START DISCOVERY"}
              </button>
              <button className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">
                {isGreek ? "ΕΠΙΚΟΙΝΩΝΙΑ ΜΕ ΣΥΜΒΟΥΛΟ" : "SPEAK WITH AN ADVISOR"}
              </button>
           </div>
        </div>
      </section>
    </div>
  );
}