"use client";

import React, { useState, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { useDiscoveryStore } from "@/store/useDiscoveryStore";
import { signOut } from "@/lib/auth-client";
import { Badge } from "@repo/ui";
import { 
  Home, 
  LayoutGrid, 
  Shield, 
  FileText, 
  User, 
  Save, 
  Lock, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Globe
} from "lucide-react";
import { ProfileSection } from "@/components/dashboard/settings/ProfileSection";
import { SecuritySection } from "@/components/dashboard/settings/SecuritySection";
import { LegalSection } from "@/components/dashboard/settings/LegalSection";

/**
 * GreenScale Phase 5: Account & Security Settings
 * Path: greenscale/apps/client-portal/src/app/[lang]/(dashboard)/dashboard/settings/page.tsx
 * Purpose: Centralized management for investor profiles and security configurations.
 * Logic: 
 * 1. Displays the Investor Archetype derived in Phase 1.
 * 2. Manages bilingual profile data (Name, Email).
 * 3. Provides session security and data management controls.
 */

export default function SettingsPage() {
  // 1. Hook Initialization
  // @ts-ignore
  const { user, isAuthenticated, isLoading: authLoading } = useAuth(true); 
  // @ts-ignore
  const { valueIntent, scores, setValueIntent } = useDiscoveryStore();
  const params = useParams();
  const router = useRouter();
  
  const lang = (params?.lang as string) || "en";
  const isGreek = lang === "el";
  const GATEWAY_URL = "http://localhost:3005";

  // 2. State Management
  const [activeTab, setActiveTab] = useState<"PROFILE" | "SECURITY" | "LEGAL" | "ALERTS">("PROFILE");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    intent: ""
  });

  // Sync state with stores
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        intent: valueIntent || ""
      });
    }
  }, [user, valueIntent]);

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
   * handleSignOut: Executes secure session termination
   */
  const handleSignOut = async () => {
    try {
      // 1. Better-Auth Client Call
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            // 2. Local cleanup
            localStorage.removeItem("gs-auth.token");
            // 3. Clear session storage (Phase 1 persona data)
            sessionStorage.removeItem("gs-discovery-session");
            // 4. Redirect to localized landing page
            router.push(`/${lang}`);
          }
        }
      });
    } catch (error) {
      console.error("[Auth] Sign out failure:", error);
    }
  };

  /**
   * Controller Logic: Handle Profile Persistence
   */
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("IDLE");
    try {
      const token = await retrieveToken();
      if (!token) throw new Error("Unauthorized");
      
      const res = await fetch(`${GATEWAY_URL}/api/users/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ valueIntent: formData.intent })
      });

      if (res.ok) {
        setValueIntent(formData.intent);
        setSaveStatus("SUCCESS");
        setTimeout(() => setSaveStatus("IDLE"), 3000);
      } else { setSaveStatus("ERROR"); }
    } catch (err) { setSaveStatus("ERROR"); } finally { setIsSaving(false); }
  };

  if (authLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] p-6 lg:p-16 space-y-8 font-sans" data-component="SettingsOrchestrator">
      
      {/* 1. Global Portal Navigation */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white px-8 py-5 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(`/${lang}`)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all bg-transparent border-none cursor-pointer group"
          >
            <Home size={14} /> <span>{isGreek ? "Αρχική" : "Portal Home"}</span>
          </button>
          <div className="w-[1px] h-4 bg-slate-100" />
          <button 
            onClick={() => router.push(`/${lang}/dashboard`)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all bg-transparent border-none cursor-pointer"
          >
            <LayoutGrid size={14} /> <span>{isGreek ? "Πίνακας" : "Investor Dashboard"}</span>
          </button>
        </div>
        <div className="hidden md:block">
           <Badge variant="success" showDot animate>Identity Sync Active</Badge>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left pt-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-black text-slate-900 tracking-tight leading-none">
            {isGreek ? "Ρυθμίσεις" : "Account Settings"}
          </h1>
          <p className="text-slate-500 font-medium text-lg italic">
            {isGreek ? "Διαχείριση της ψηφιακής σας κληρονομιάς." : "Governance of your digital wealth profile."}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {saveStatus === "SUCCESS" && <span className="text-emerald-600 font-bold text-xs animate-in slide-in-from-right-2">✓ Committed to Ledger</span>}
          <button 
            onClick={handleSave}
            disabled={isSaving || activeTab !== "PROFILE"}
            className="px-8 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl active:scale-95 border-none cursor-pointer flex items-center gap-3 disabled:opacity-30"
          >
            {isSaving ? "SYNCING..." : <><Save size={14} /> {isGreek ? "ΑΠΟΘΗΚΕΥΣΗ" : "SAVE CHANGES"}</>}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Switcher */}
        <aside className="lg:col-span-3 space-y-3">
          {[
            { id: "PROFILE", label: isGreek ? "Προφίλ" : "Investor Profile", icon: <User size={18} /> },
            { id: "SECURITY", label: isGreek ? "Ασφάλεια" : "Security & Keys", icon: <ShieldCheck size={18} /> },
            { id: "LEGAL", label: isGreek ? "Πολιτική" : "Privacy & Legal", icon: <FileText size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              // @ts-ignore
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-bold transition-all text-sm border-none cursor-pointer text-left ${
                activeTab === tab.id 
                  ? "bg-white shadow-lg text-emerald-900 ring-1 ring-slate-100" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          
          <div className="pt-8 px-4">
             <button
              onClick={handleSignOut}
              className="w-full py-4 flex items-center gap-3 text-red-400 hover:text-red-600 transition-colors text-xs font-black uppercase tracking-widest bg-transparent border-none cursor-pointer">
                <LogOut size={16} /> Sign Out Session
             </button>
          </div>
        </aside>

        {/* Content Area Delegation */}
        <section className="lg:col-span-9 space-y-8 min-h-[500px]">
          {activeTab === "PROFILE" && (
            // @ts-ignore
            <ProfileSection 
              formData={formData} 
              setFormData={setFormData} 
              scores={scores} 
              valueIntent={valueIntent} 
              isGreek={isGreek} 
            />
          )}

          {activeTab === "SECURITY" && (
            // @ts-ignore
            <SecuritySection isGreek={isGreek} />
          )}

          {activeTab === "LEGAL" && (
            // @ts-ignore
            <LegalSection isGreek={isGreek} />
          )}
        </section>
      </div>
    </main>
  );
}