"use client";

import React from "react";

/**
 * GreenScale Phase 5: Professional Loading Skeletons (GS-31)
 * Path: greenscale/apps/client-portal/src/components/dashboard/DashboardSkeleton.tsx
 * Purpose: Shimmering placeholders for the Investor Cockpit to improve perceived performance.
 * Tech: Utilizes Tailwind's 'animate-pulse' for institutional-grade loading states.
 */

import { Card } from "@repo/ui";

const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`bg-slate-100 animate-pulse rounded-xl ${className}`} />
);

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-16 space-y-12" data-component="DashboardSkeleton">
      {/* 1. Header Skeleton */}
      <header className="flex justify-between items-center max-w-7xl mx-auto text-left">
        <div className="space-y-4">
          <Shimmer className="h-12 w-64 md:w-80 rounded-2xl" />
          <Shimmer className="h-6 w-48 rounded-lg opacity-60" />
        </div>
        <div className="flex items-center gap-4">
          <Shimmer className="h-14 w-32 rounded-2xl hidden md:block" />
          <Shimmer className="h-14 w-14 rounded-2xl" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 2. Left Column Skeleton: ESG Dial wrapped in real Card */}
        <section className="lg:col-span-4 min-h-125">
          <Card className="h-full justify-between py-12">
            <Shimmer className="h-4 w-32 rounded-full" />
            
            {/* Dial Placeholder */}
            <div className="relative flex items-center justify-center my-8">
              <div className="w-56 h-56 rounded-full border-14 border-slate-50 flex items-center justify-center">
                <Shimmer className="h-16 w-16 rounded-lg" />
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                 <Shimmer className="h-3 w-20 mb-3" />
                 <Shimmer className="h-4 w-full" />
              </div>
              <Shimmer className="h-16 w-full rounded-2xl" />
            </div>
          </Card>
        </section>

        {/* 3. Right Column Skeleton: Asset Grid */}
        <section className="lg:col-span-8 space-y-12">
          {/* AUM Bar Placeholder (Using a flat variant Card) */}
          <Card variant="flat" className="p-0! shadow-sm border-none bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center w-full px-10 py-10 gap-6">
              <div className="flex items-center gap-6">
                 <Shimmer className="w-14 h-14 rounded-[1.25rem]" />
                 <div className="space-y-3 text-left">
                   <Shimmer className="h-3 w-40" />
                   <Shimmer className="h-10 w-60" />
                 </div>
              </div>
              <Shimmer className="h-14 w-40 rounded-2xl" />
            </div>
          </Card>

          {/* Holdings Grid Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-0!">
                <div className="p-8 w-full space-y-8 text-left">
                  <div className="flex justify-between items-start">
                     <div className="space-y-3">
                       <Shimmer className="h-6 w-32" />
                       <Shimmer className="h-3 w-20" />
                     </div>
                     <Shimmer className="h-8 w-16 rounded-full" />
                  </div>
                  <div className="flex items-end justify-between border-t border-slate-50 pt-6">
                     <Shimmer className="h-10 w-24" />
                     <Shimmer className="h-4 w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Chart Placeholder wrapped in Card */}
          <Card className="p-0!">
            <div className="p-10 w-full h-80 flex flex-col justify-between text-left">
               <div className="flex justify-between">
                  <div className="space-y-3">
                    <Shimmer className="h-4 w-24" />
                    <Shimmer className="h-8 w-48" />
                  </div>
                  <Shimmer className="h-10 w-32 rounded-xl" />
               </div>
               <div className="relative h-32 w-full mt-6">
                  <Shimmer className="h-full w-full rounded-2xl opacity-40" />
               </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};