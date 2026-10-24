"use client";

import React, { useState } from "react";
import { Building2, TrendingUp, DollarSign, ArrowRight, Copy, Check } from "lucide-react";
import { CrmUpdate } from "@/lib/types";

interface CrmDealCardProps {
  crm: CrmUpdate;
}

export const CrmDealCard: React.FC<CrmDealCardProps> = ({ crm }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `CRM Deal Update: ${crm.clientName} (${crm.companyName})
Stage: ${crm.dealStage}
Value: ${crm.dealValue || "N/A"}
Next Steps: ${crm.nextStepSummary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-wispr-border shadow-card p-6 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-wispr-border/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs shadow-sm">
            <Building2 className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-lg font-bold text-wispr-ink leading-tight">
                CRM & Pipeline Staging
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                HubSpot / Salesforce Sync
              </span>
            </div>
            <p className="text-[11px] text-wispr-muted">
              Auto-staged deal status for {crm.companyName}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl border border-wispr-border hover:border-wispr-ink text-xs font-semibold text-wispr-ink bg-white flex items-center space-x-1.5 transition-all shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-wispr-muted" />}
          <span>{copied ? "Copied!" : "Copy for CRM"}</span>
        </button>
      </div>

      {/* Pipeline Snapshot */}
      <div className="bg-wispr-sand/30 p-4 rounded-2xl border border-wispr-border/80 space-y-3">
        
        {/* Deal Stage & Value */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-wispr-muted font-medium">Deal Stage:</span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs">
              {crm.dealStage}
            </span>
          </div>

          {crm.dealValue && (
            <div className="flex items-center space-x-1.5 text-xs font-bold text-wispr-ink bg-white px-2.5 py-1 rounded-xl border border-wispr-border shadow-sm">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{crm.dealValue}</span>
            </div>
          )}
        </div>

        {/* Progress Bar Pipeline */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] font-semibold text-wispr-muted">
            <span>Discovery</span>
            <span className="text-emerald-700 font-bold">Pricing Approved</span>
            <span>Contract Review</span>
            <span>Closed Won</span>
          </div>
          <div className="w-full h-2 rounded-full bg-wispr-border/80 overflow-hidden flex">
            <div className="w-3/5 h-full bg-emerald-600 rounded-full" />
          </div>
        </div>

        {/* Next Step */}
        <div className="pt-2 border-t border-wispr-border/60 text-xs flex items-start space-x-2">
          <ArrowRight className="w-3.5 h-3.5 text-wispr-green flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-wispr-ink">Next Milestones: </span>
            <span className="text-wispr-muted">{crm.nextStepSummary}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
