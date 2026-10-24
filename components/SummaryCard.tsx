"use client";

import React from "react";
import { CheckCircle2, User, Building, HeartHandshake, Sparkles, TrendingUp } from "lucide-react";
import { DebriefResult } from "@/lib/types";

interface SummaryCardProps {
  debrief: DebriefResult;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ debrief }) => {
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "enthusiastic":
        return {
          label: "Enthusiastic & High Intent",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "positive":
        return {
          label: "Positive Alignment",
          bg: "bg-blue-50 text-blue-800 border-blue-200",
          dot: "bg-blue-500",
        };
      case "cautious":
        return {
          label: "Cautious / Questions Pending",
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          dot: "bg-amber-500",
        };
      default:
        return {
          label: "Neutral Progression",
          bg: "bg-stone-50 text-stone-800 border-stone-200",
          dot: "bg-stone-500",
        };
    }
  };

  const sentimentInfo = getSentimentBadge(debrief.sentiment);

  return (
    <div className="bg-white rounded-3xl border border-wispr-border shadow-card p-6 space-y-5">
      
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-wispr-border/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-wispr-green text-wispr-cream flex items-center justify-center font-bold text-xs shadow-sm">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-wispr-ink leading-tight">
              Executive Call Summary
            </h3>
            <p className="text-[11px] text-wispr-muted">
              Auto-extracted from your 20-second voice debrief
            </p>
          </div>
        </div>

        {/* Client & Sentiment Pill */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-wispr-sand text-wispr-ink text-xs font-semibold border border-wispr-border">
            <User className="w-3 h-3 text-wispr-muted" />
            <span>{debrief.clientName}</span>
            <span className="text-wispr-muted">({debrief.companyName})</span>
          </div>

          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sentimentInfo.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${sentimentInfo.dot}`} />
            <span>{sentimentInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="bg-wispr-sand/40 p-4 rounded-2xl border border-wispr-border/60">
        <p className="text-xs sm:text-sm text-wispr-ink leading-relaxed font-normal">
          {debrief.executiveSummary}
        </p>
      </div>

      {/* Key Decisions Agreed Upon */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-wispr-muted flex items-center space-x-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-wispr-green" />
          <span>Key Decisions Ratified</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {debrief.keyDecisions.map((decision, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-wispr-border/80 text-xs text-wispr-ink shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{decision}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
