import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * GreenScale Discovery Store (GS-P1 Persistent)
 * Path: apps/client-portal/src/store/useDiscoveryStore.ts
 * Update: Added persistence for scores and steps to ensure session resilience.
 */

interface DiscoveryState {
  valueIntent: string;
  currentStep: number;
  scores: {
    climate: number;
    social: number;
    governance: number;
  };
  setValueIntent: (intent: string) => void;
  setScores: (scores: { climate: number; social: number; governance: number }) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

export const useDiscoveryStore = create<DiscoveryState>()(
  // @ts-ignore - persist middleware for session stability
  persist(
    (set) => ({
      valueIntent: "",
      currentStep: 0,
      scores: { climate: 50, social: 50, governance: 50 },
      setValueIntent: (intent) => set({ valueIntent: intent }),
      setScores: (scores) => set({ scores }),
      setStep: (step) => set({ currentStep: step }),
      reset: () => set({ 
        valueIntent: "", 
        currentStep: 0, 
        scores: { climate: 50, social: 50, governance: 50 } 
      }),
    }),
    {
      name: 'gs-discovery-session',
      // @ts-ignore
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);