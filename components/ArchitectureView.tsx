"use client";

import React from "react";
import { Layers, ArrowRight, Zap, Mic, Mail, Calendar, CheckSquare, Building2, MessageSquare } from "lucide-react";

export const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      
      {/* Hero Header */}
      <div className="bg-white p-8 rounded-4xl border border-wispr-border shadow-card space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-wispr-lavender text-wispr-ink text-xs font-bold border border-wispr-ink shadow-sm">
          <Zap className="w-3.5 h-3.5 text-purple-800" />
          <span>Wispr Flow Hackathon • #NoHandsChallenge</span>
        </div>
        
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wispr-ink leading-tight">
          How Debrief Replaces 15 Minutes of App Juggling
        </h2>

        <p className="text-sm text-wispr-muted max-w-2xl leading-relaxed">
          Debrief turns an informal 20-second post-call voice dump into 5 synchronized, client-ready operational artifacts before you've even poured your coffee.
        </p>
      </div>

      {/* The 3-Stage Pipeline Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stage 1 */}
        <div className="bg-white p-6 rounded-3xl border border-wispr-border shadow-card space-y-3 relative">
          <div className="w-10 h-10 rounded-2xl bg-wispr-sand text-wispr-ink flex items-center justify-center font-serif text-lg font-bold border border-wispr-border shadow-sm">
            1
          </div>
          <h3 className="font-serif text-lg font-bold text-wispr-ink">
            20-Second Voice Ramble
          </h3>
          <p className="text-xs text-wispr-muted leading-relaxed">
            Hang up the phone or Meet call, hold your Wispr key, and speak informally without formatting. Zero cognitive overhead.
          </p>
          <div className="p-3 bg-wispr-sand/40 rounded-xl border border-wispr-border/70 text-[11px] font-mono text-wispr-ink italic">
            "Just got off with Sarah. Approved pricing. Demo Friday 3 PM. Send proposal PDF by tomorrow noon, tell Alex to prep contract."
          </div>
        </div>

        {/* Stage 2 */}
        <div className="bg-white p-6 rounded-3xl border border-wispr-border shadow-card space-y-3 relative">
          <div className="w-10 h-10 rounded-2xl bg-wispr-lavender text-wispr-ink flex items-center justify-center font-serif text-lg font-bold border-1.5 border-wispr-ink shadow-tactile">
            2
          </div>
          <h3 className="font-serif text-lg font-bold text-wispr-ink">
            Groq LPU Reasoning
          </h3>
          <p className="text-xs text-wispr-muted leading-relaxed">
            Llama 3.3 70B decomposes unstructured speech at 300+ tokens/second. It extracts entities, detects sentiment, and generates structured operational JSON in &lt; 800ms.
          </p>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] font-mono text-purple-900">
            • Extracted Client: Sarah Jenkins<br />
            • Event: Friday @ 15:00<br />
            • Delegatee: Alex (Legal)<br />
            • Deal: Pricing Approved
          </div>
        </div>

        {/* Stage 3 */}
        <div className="bg-white p-6 rounded-3xl border border-wispr-border shadow-card space-y-3 relative">
          <div className="w-10 h-10 rounded-2xl bg-wispr-green text-wispr-cream flex items-center justify-center font-serif text-lg font-bold shadow-sm">
            3
          </div>
          <h3 className="font-serif text-lg font-bold text-wispr-ink">
            5-App Parallel Auto-Pilot
          </h3>
          <p className="text-xs text-wispr-muted leading-relaxed">
            Instantly stages every app you'd normally have to open one-by-one:
          </p>
          <ul className="text-xs space-y-1.5 text-wispr-ink">
            <li className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-purple-700" />
              <span>Gmail draft formatted</span>
            </li>
            <li className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              <span>Google Calendar / .ICS invite</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>Notion / Linear tasks delegated</span>
            </li>
            <li className="flex items-center space-x-2">
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span>HubSpot / CRM stage updated</span>
            </li>
            <li className="flex items-center space-x-2">
              <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
              <span>Slack message drafted for Alex</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
