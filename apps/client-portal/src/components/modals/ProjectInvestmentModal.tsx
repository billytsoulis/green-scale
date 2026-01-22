"use client";

import React, { useState } from "react";
// Direct Lucide imports as per architectural pattern
// @ts-ignore
import { ShieldCheck, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * GreenScale Phase 5: Project Investment Modal
 * Path: greenscale/apps/client-portal/src/components/modals/ProjectInvestmentModal.tsx
 * Purpose: Handles the transactional entry for capital allocation.
 * Logic:
 * 1. Validates amount against minInvestment.
 * 2. Authenticates via JWT Bridge.
 * 3. Commits to POST /api/funding/invest.
 */

import { Modal, Input, Button } from "@repo/ui";

interface ProjectInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  lang: string;
  onSuccess: () => void;
}

export const ProjectInvestmentModal = ({ 
  isOpen, 
  onClose, 
  project, 
  lang,
  onSuccess 
}: ProjectInvestmentModalProps) => {
  const isGreek = lang === "el";
  const GATEWAY_URL = "http://localhost:3005";

  // 1. State Management
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minVal = parseFloat(project?.minInvestment || "0");

  /**
   * Helper: retrieveToken
   * Standard bridge implementation for authenticated requests.
   */
  const retrieveToken = async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/api/auth/get-jwt`, { credentials: "include" });
      if (res.ok) {
        const { token } = await res.json();
        return token;
      }
      return localStorage.getItem("gs-auth.token");
    } catch (e) { return localStorage.getItem("gs-auth.token"); }
  };

  /**
   * Transaction Handler
   */
  const handleInvestment = async () => {
    setError(null);
    const numericAmount = parseFloat(amount);

    // Validation AC1: Min Investment Check
    if (isNaN(numericAmount) || numericAmount < minVal) {
      setError(isGreek 
        ? `Ελάχιστη συμμετοχή: €${minVal.toLocaleString()}` 
        : `Minimum allocation: €${minVal.toLocaleString()}`
      );
      return;
    }

    setIsProcessing(true);

    try {
      const token = await retrieveToken();
      if (!token) throw new Error("Unauthorized");

      // Validation AC2: POST /api/funding/invest
      const res = await fetch(`${GATEWAY_URL}/api/funding/invest`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          projectId: project.id, 
          amount: numericAmount 
        })
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setAmount("");
      } else {
        const errData = await res.json();
        setError(errData.error || "Transaction declined by ledger.");
      }
    } catch (err) {
      setError("Network failure: Asset ledger unreachable.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isGreek ? "Επενδυτική Κατανομή" : "Capital Allocation"}
      footer={
        <>
          <Button 
            onClick={onClose} 
            className="bg-white text-slate-400 hover:bg-slate-100"
          >
            {isGreek ? "ΑΚΥΡΩΣΗ" : "CANCEL"}
          </Button>
          <Button 
            onClick={handleInvestment}
            disabled={isProcessing || !amount}
            className="bg-emerald-950 text-white shadow-xl shadow-emerald-900/20 active:scale-95"
          >
            {isProcessing ? "PROCESSING..." : (isGreek ? "ΕΠΙΒΕΒΑΙΩΣΗ" : "CONFIRM ALLOCATION")}
          </Button>
        </>
      }
    >
      <div className="space-y-8 text-left">
        {/* Project Context Header */}
        <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 flex items-center gap-5">
           <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center text-emerald-400">
             <ShieldCheck size={24} />
           </div>
           <div>
             <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest leading-none mb-1">
               {isGreek ? "Επιλεγμένο Έργο" : "Target Project"}
             </p>
             <h4 className="text-lg font-black text-slate-900 leading-none">
               {isGreek ? project?.contentEl?.title : project?.contentEn?.title}
             </h4>
           </div>
        </div>

        {/* Financial Inputs */}
        <div className="space-y-6">
          <Input 
            label={isGreek ? "ΠΟΣΟ ΕΠΕΝΔΥΣΗΣ (€)" : "INVESTMENT AMOUNT (€)"}
            placeholder={`Min: ${minVal.toLocaleString()}`}
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
            error={error}
          />

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Target IRR</p>
                <div className="flex items-center gap-1.5 text-emerald-700 font-black">
                   <TrendingUp size={14} /> <span>{project?.targetIrr}%</span>
                </div>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">ESG Rating</p>
                <span className="text-emerald-700 font-black">{project?.esgScore}/100</span>
             </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="flex gap-4 p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50">
           <AlertCircle size={18} className="text-amber-600 shrink-0" />
           <p className="text-[11px] text-amber-800/70 font-medium leading-relaxed italic">
             {isGreek 
               ? "Η επένδυση σε βιώσιμα έργα ενέχει κινδύνους κεφαλαίου. Βεβαιωθείτε ότι έχετε διαβάσει το ενημερωτικό δελτίο." 
               : "Investing in sustainable infrastructure carries capital risk. Ensure you have reviewed the prospectus and audit reports."}
           </p>
        </div>
      </div>
    </Modal>
  );
};