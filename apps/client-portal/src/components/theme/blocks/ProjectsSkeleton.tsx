"use client";

import React from "react";

/**
 * GreenScale Phase 5: Projects Grid Skeleton (GS-31)
 * Path: greenscale/apps/client-portal/src/components/theme/blocks/ProjectsSkeleton.tsx
 * Purpose: Shimmering placeholders for the Project Registry to maintain layout parity.
 * Tech: Uses Tailwind's 'animate-pulse' and replicates the ProjectCard dimensions.
 */

import { Card } from "@repo/ui";

const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`bg-slate-100 animate-pulse rounded-xl ${className}`} />
);

interface ProjectsSkeletonProps {
  lang: string;
}

export const ProjectsSkeleton = ({ lang }: ProjectsSkeletonProps) => {
  // ready for future implementation
  const isGreek = lang === "el";

  return (
    <div className="space-y-12 w-full animate-in fade-in duration-500" data-component="ProjectsSkeleton">
      {/* 1. Counter / Header Placeholder */}
      <header className="flex justify-between items-center bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
        <Shimmer className="h-4 w-48 rounded-lg" />
      </header>

      {/* 2. Grid of Shimmering Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex flex-col h-[500px]">
            {/* Header section (Icon + Badges) */}
            <div className="flex flex-col items-center gap-5 mb-10">
              <Shimmer className="w-16 h-16 rounded-2xl" />
              <div className="flex flex-col items-center gap-2">
                <Shimmer className="h-3 w-20" />
                <Shimmer className="h-6 w-32 rounded-full" />
                <Shimmer className="h-2 w-24 rounded-full opacity-40" />
              </div>
            </div>

            {/* Content section */}
            <div className="space-y-4 flex-1">
              <Shimmer className="h-8 w-3/4 mx-auto" />
              <div className="space-y-2">
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-4 w-5/6 mx-auto" />
              </div>
            </div>

            {/* Metrics block */}
            <div className="mt-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Shimmer className="h-16 rounded-2xl" />
                <Shimmer className="h-16 rounded-2xl" />
              </div>

              {/* Progress bar area */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Shimmer className="h-2 w-20" />
                  <Shimmer className="h-2 w-16" />
                </div>
                <Shimmer className="h-2.5 w-full rounded-full" />
                <div className="flex justify-between">
                  <Shimmer className="h-2 w-24" />
                  <Shimmer className="h-2 w-24" />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 pt-8 border-t border-slate-50 flex gap-3">
              <Shimmer className="h-14 flex-1 rounded-xl" />
              <Shimmer className="h-14 w-14 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSkeleton;