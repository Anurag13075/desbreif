"use client";

import React, { useState } from "react";
import { Archive, Search, Calendar, User, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { DebriefResult } from "@/lib/types";

interface CallVaultViewProps {
  history: DebriefResult[];
  onSelectDebrief: (debrief: DebriefResult) => void;
}

export const CallVaultView: React.FC<CallVaultViewProps> = ({ history, onSelectDebrief }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  const filtered = history.filter((d) => {
    const matchesSearch =
      d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.executiveSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.rawTranscript.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      filterStage === "all" || d.crmUpdate.dealStage.toLowerCase() === filterStage.toLowerCase();

    return matchesSearch && matchesStage;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-wispr-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-wispr-ink text-wispr-cream flex items-center justify-center font-bold shadow-tactile">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-wispr-ink">
              Call Archive & Staged Debriefs
            </h2>
            <p className="text-xs text-wispr-muted">
              Permanent memory of all verbal post-call syncs & auto-generated operational artifacts
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-wispr-sand text-wispr-ink border border-wispr-border self-start sm:self-auto">
          {history.length} Calls Recorded
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-wispr-border shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-wispr-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search calls by client, company, key decisions..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-wispr-sand/30 border border-wispr-border text-xs text-wispr-ink focus:outline-none focus:border-wispr-ink focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
          <span className="text-wispr-muted whitespace-nowrap">Stage:</span>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-2 rounded-xl bg-wispr-sand/40 border border-wispr-border text-xs font-medium text-wispr-ink focus:outline-none cursor-pointer"
          >
            <option value="all">All Deal Stages</option>
            <option value="pricing approved">Pricing Approved</option>
            <option value="demo scheduled">Demo Scheduled</option>
            <option value="contract review">Contract Review</option>
            <option value="follow-up required">Follow-up Required</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-wispr-border text-center space-y-2">
            <Archive className="w-8 h-8 mx-auto text-wispr-muted/50" />
            <h4 className="font-serif text-lg font-bold text-wispr-ink">No debriefs matched</h4>
            <p className="text-xs text-wispr-muted">Try searching with another keyword</p>
          </div>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white p-5 rounded-3xl border border-wispr-border shadow-card hover:border-wispr-ink transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
              onClick={() => onSelectDebrief(d)}
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-sm text-wispr-ink">{d.clientName}</span>
                  <span className="text-wispr-muted">•</span>
                  <span className="font-semibold text-wispr-ink/80">{d.companyName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    {d.crmUpdate.dealStage}
                  </span>
                  <span className="text-[11px] text-wispr-muted ml-auto font-mono">
                    {d.createdAt}
                  </span>
                </div>

                <p className="text-xs text-wispr-ink leading-relaxed line-clamp-2">
                  {d.executiveSummary}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-wispr-muted pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-wispr-green" />
                    <span>{d.durationSeconds}s ramble</span>
                  </span>
                  <span>•</span>
                  <span>{d.actionItems.length} action items</span>
                  <span>•</span>
                  <span>Calendar: {d.calendarEvent.startDate} @ {d.calendarEvent.startTime}</span>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-wispr-sand hover:bg-wispr-lavender text-wispr-ink text-xs font-bold border border-wispr-border flex items-center space-x-1.5 transition-all self-end sm:self-center"
              >
                <span>View Staged Apps</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
