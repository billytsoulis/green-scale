"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { io } from "socket.io-client";
import { HeroBlock } from "@/components/theme/blocks/HeroBlock";
import { NarrativeBlock } from "@/components/theme/blocks/NarrativeBlock";
import { TeamGridBlock } from "@/components/theme/blocks/TeamGridBlock";
import { ProjectHeroBlock } from "@/components/theme/blocks/ProjectHeroBlock";
import { ProjectDirectoryBlock } from "@/components/theme/blocks/ProjectDirectoryBlock";

/**
 * GreenScale Isolated Block Preview
 * Path: apps/client-portal/src/app/[lang]/preview/block/page.tsx
 * * Phase 3: The "Puppet" route that mirrors Staff Dashboard state.
 * * Logic: Handshake (Redis) + Live Sync (Socket.io).
 */

export default function BlockPreviewPage() {
  // @ts-ignore
  const params = useParams();
  // Fixed: Cast lang to string to resolve 'ParamValue' type mismatch
  const lang = (params?.lang as string) || "en";

  // @ts-ignore
  const searchParams = useSearchParams();
  
  const previewId = searchParams.get("id");
  const type = searchParams.get("type");
  
  const [previewData, setPreviewData] = useState<any>(null);
  const [status, setStatus] = useState<"connecting" | "syncing" | "error">("connecting");
  const socketRef = useRef<any>(null);

  const gatewayUrl = "http://localhost:3005";

  useEffect(() => {
    if (!previewId) {
      setStatus("error");
      return;
    }

    /**
     * 1. Initial Handshake
     * Fetch the transient data from Redis.
     */
    const fetchInitialState = async () => {
      try {
        const res = await fetch(`${gatewayUrl}/api/cms/preview/${previewId}`);
        if (res.ok) {
          const data = await res.json();
          setPreviewData(data);
          setStatus("syncing");
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    fetchInitialState();

    /**
     * 2. Socket.io Live Sync
     */
    const socket = io(gatewayUrl);
    socketRef.current = socket;

    // @ts-ignore
    socket.on("connect", () => {
      // @ts-ignore
      socket.emit("portal:join-preview", previewId);
    });

    // @ts-ignore
    socket.on("portal:preview-sync", (data: any) => {
      setPreviewData(data);
    });

    return () => {
      // @ts-ignore
      socket.disconnect();
    };
  }, [previewId, gatewayUrl]);

  if (status === "error") {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="text-4xl text-slate-300">⚠️</div>
          <h1 className="text-xl font-bold text-slate-900">Preview Session Expired</h1>
          <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium italic">Please close this tab and click the preview icon in the dashboard again.</p>
        </div>
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing with Dashboard...</p>
        </div>
      </div>
    );
  }

  // Extract content based on language
  const currentContent = lang === "el" ? previewData.contentEl : previewData.contentEn;

  /**
   * 3. Component Rendering Switch
   * We add support for the new PROJECT blocks here.
   */
  return (
    <div className="min-h-screen bg-white" data-component="BlockPreviewPage">
      {/* Sync Status Indicator (Staff Only) */}
      <div className="fixed bottom-6 right-6 z-50 px-5 py-2 bg-slate-900/90 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Mirror Active</span>
      </div>

      <main data-component="LivePreviewWrapper">
        {type === "HERO" && <HeroBlock data={currentContent} />}
        {type === "NARRATIVE" && <NarrativeBlock data={currentContent} />}
        {type === "TEAM_GRID" && <TeamGridBlock data={currentContent} />}
        
        {/* GS-25 Support: Project Blocks */}
        {type === "PROJECT_HERO" && <ProjectHeroBlock data={currentContent} />}
        {type === "PROJECT_DIRECTORY" && <ProjectDirectoryBlock data={currentContent} lang={lang} />}
        
        {!["HERO", "NARRATIVE", "TEAM_GRID", "PROJECT_HERO", "PROJECT_DIRECTORY"].includes(type || "") && (
          <div className="p-40 text-center italic text-slate-300 font-medium">
            Unknown block type: <span className="text-emerald-600 font-bold font-mono">{type}</span>
          </div>
        )}
      </main>
    </div>
  );
}