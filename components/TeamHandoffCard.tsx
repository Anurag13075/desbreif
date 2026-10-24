"use client";

import React, { useState } from "react";
import { MessageSquare, Copy, Check, Send, UserCheck } from "lucide-react";
import { TeamHandoff } from "@/lib/types";

interface TeamHandoffCardProps {
  handoff: TeamHandoff;
}

export const TeamHandoffCard: React.FC<TeamHandoffCardProps> = ({ handoff }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(handoff.messageSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-wispr-border shadow-card p-6 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-wispr-border/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold text-xs shadow-sm">
            <MessageSquare className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-lg font-bold text-wispr-ink leading-tight">
                Colleague Slack Handoff
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">
                Auto-Drafted
              </span>
            </div>
            <p className="text-[11px] text-wispr-muted">
              Ready to send to {handoff.targetPerson}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3.5 py-1.5 rounded-xl bg-wispr-lavender hover:bg-wispr-lavender-hover text-wispr-ink font-bold text-xs border-1.5 border-wispr-ink shadow-tactile flex items-center space-x-1.5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-purple-900" />}
          <span>{copied ? "Copied to Clipboard!" : "Copy Slack Message"}</span>
        </button>
      </div>

      {/* Slack-like Chat Bubble Preview */}
      <div className="bg-wispr-sand/30 p-4 rounded-2xl border border-wispr-border/80 space-y-2.5">
        
        {/* Author / Channel line */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-5 h-5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold">
            {handoff.targetPerson.charAt(0)}
          </div>
          <span className="font-bold text-wispr-ink">{handoff.targetPerson}</span>
          <span className="text-[11px] text-wispr-muted">({handoff.role})</span>
          <span className="text-[10px] text-wispr-muted font-mono ml-auto">Direct Message</span>
        </div>

        {/* Message bubble */}
        <div className="bg-white p-3.5 rounded-xl border border-wispr-border text-xs sm:text-sm text-wispr-ink leading-relaxed">
          {handoff.messageSnippet}
        </div>

      </div>

    </div>
  );
};
