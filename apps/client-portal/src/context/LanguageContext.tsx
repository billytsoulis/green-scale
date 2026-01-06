"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../dictionaries/en.json";
import gr from "../dictionaries/el.json";

/**
 * GreenScale Language Context
 * Path: apps/client-portal/src/context/LanguageContext.tsx
 */

type Language = "en" | "el";
type Dictionary = typeof en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("gs-lang") as Language;
    if (savedLang) setLangState(savedLang);
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("gs-lang", newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  };

  const t = lang === "en" ? en : gr;

  // Hydration guard for server-rendered HTML
  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};