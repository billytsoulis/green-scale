/**
 * Institutional Intelligence: NLP Sentiment Feed
 * Path: src/pages/intelligence/Forge/components/SentimentFeed.tsx
 * Purpose: Displays extracted news signals and highlights "Greenwashing" divergence.
 * UX: Vertical timeline of news signals with color-coded sentiment anchors.
 */

import { MessageSquare, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "../../../../lib/utils";

interface SentimentSignal {
  source: string;
  headline: string;
  sentiment_score: number;
  impact_weight: number;
  date: string;
}

interface SentimentFeedProps {
  signals: SentimentSignal[];
  hasDivergence: boolean;
}

export const SentimentFeed = ({ signals, hasDivergence }: SentimentFeedProps) => {
  return (
    <section className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden flex flex-col h-full text-left" data-component="SentimentFeed">
      {/* 1. Logic Alert: Sentiment Divergence */}
      {hasDivergence && (
        <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100 animate-pulse">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
             <AlertCircle />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none">Divergence Detected</h4>
            <p className="text-xs font-bold text-red-500 mt-1">Self-reported ESG metrics conflict with current news sentiment.</p>
          </div>
        </div>
      )}

      {/* 2. Header */}
      <header className="p-10 pb-6 space-y-1">
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none">NLP News Analysis</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Social & Sentiment Signal</h3>
      </header>

      {/* 3. Signals List */}
      <div className="flex-1 overflow-y-auto px-10 pb-10 space-y-6 max-h-125 no-scrollbar">
        {signals.length > 0 ? signals.map((signal, i) => {
          const score = signal.sentiment_score;
          const isNegative = score < -0.1;
          const isPositive = score > 0.1;

          return (
            <div key={i} className="group relative pl-6 border-l border-slate-100 py-2">
              {/* Timeline Anchor */}
              <div className={cn(
                "absolute -left-1.5 top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all",
                isNegative ? "bg-red-500" : isPositive ? "bg-emerald-500" : "bg-slate-300"
              )} />
              
              <div className="space-y-2">
                <header className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{signal.source}</span>
                      <span className="text-[9px] text-slate-300">•</span>
                      <span className="text-[9px] font-bold text-slate-300">{signal.date}</span>
                   </div>
                   <span className={cn(
                     "text-[10px] font-black",
                     isNegative ? "text-red-500" : isPositive ? "text-emerald-600" : "text-slate-400"
                   )}>
                     {score > 0 ? '+' : ''}{score.toFixed(2)}
                   </span>
                </header>

                <h5 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-2">
                   {signal.headline} <ExternalLink />
                </h5>

                <div className="flex items-center gap-3">
                   <div className="h-1 flex-1 bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-200" 
                        style={{ width: `${signal.impact_weight * 100}%` }}
                      />
                   </div>
                   <span className="text-[8px] font-black text-slate-300 uppercase">Impact: {Math.round(signal.impact_weight * 100)}%</span>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="py-20 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">
             No linguistic signals extracted for this entity.
          </div>
        )}
      </div>

      {/* 4. Footer Summary */}
      <footer className="p-8 bg-slate-50/50 border-t border-slate-100">
         <div className="flex items-center gap-3">
            <MessageSquare />
            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
              Linguistic modeling performed via <span className="text-slate-900">Transformer Architecture v4.2</span>
            </p>
         </div>
      </footer>
    </section>
  );
};

export default SentimentFeed;