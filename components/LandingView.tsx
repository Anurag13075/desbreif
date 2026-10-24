"use client";

import React from "react";
import {
  Mail,
  Calendar,
  FileText,
  Users,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Mic,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

interface LandingViewProps {
  onLaunchAutoPilot: () => void;
  onOpenVault: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onLaunchAutoPilot,
  onOpenVault,
}) => {
  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans selection:bg-[#EEF0FF]">
      
      {/* Top Header (Exact match to Image 2 - NO Sign In!) */}
      <header className="max-w-6xl mx-auto w-full px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#3B4BF8] text-white flex items-center justify-center shadow-sm">
            <div className="flex items-center space-x-0.5 h-3.5">
              <span className="w-0.5 h-2 bg-white rounded-full"></span>
              <span className="w-0.5 h-3.5 bg-white rounded-full"></span>
              <span className="w-0.5 h-1.5 bg-white rounded-full"></span>
            </div>
          </div>
          <span className="font-bold text-lg text-[#111827] tracking-tight">Debrief</span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden sm:flex items-center space-x-8 text-xs font-medium text-[#4B5563]">
          <a href="#how-it-works" className="hover:text-[#111827] transition-colors">
            How it works
          </a>
          <a href="#integrations" className="hover:text-[#111827] transition-colors">
            Integrations
          </a>
          <button onClick={onOpenVault} className="hover:text-[#111827] transition-colors">
            Call vault
          </button>
        </nav>

        {/* Right CTA */}
        <div>
          <button
            onClick={onLaunchAutoPilot}
            className="px-4 py-2 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Try Debrief
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="max-w-6xl mx-auto w-full px-6 pt-12 pb-20 text-center space-y-6">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F3F4F6] text-xs text-[#374151] font-medium border border-[#E5E7EB]">
          <span className="px-1.5 py-0.2 bg-[#3B4BF8] text-white text-[10px] font-bold rounded">New</span>
          <span>Voice powered by Wispr Flow</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Hang up the call. <br />
          Everything else is done.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
          Speak for 20 seconds after a client call. Debrief drafts the email, books the follow-up, writes the notes and updates your CRM, ready for you to approve.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={onLaunchAutoPilot}
            className="px-5 py-2.5 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm transition-all"
          >
            Try the sample call
          </button>
          <a
            href="#how-it-works"
            className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#111827] text-xs font-semibold shadow-2xs transition-all"
          >
            See how it works
          </a>
        </div>

        {/* Interactive Visual Mockup with Synapse Connecting Lines */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="bg-[#F8F9FB] rounded-4xl p-6 sm:p-10 border border-[#E5E7EB] shadow-xl text-left relative overflow-hidden">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 items-center">
              
              {/* Mockup Left Card */}
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm space-y-4">
                <div className="flex justify-between text-xs font-bold text-[#111827]">
                  <span>Your debrief</span>
                  <span className="text-[#9CA3AF] font-normal">16 seconds spoken</span>
                </div>

                <div className="text-[15px] leading-relaxed text-[#1F2937]">
                  Just got off the call with{" "}
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EEF0FF] text-[#3B4BF8] font-medium">
                    Sarah
                  </span>
                  . She{" "}
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EEF0FF] text-[#3B4BF8] font-medium">
                    approved the pricing <span className="text-[9px] bg-white border border-[#D1D5DB] px-1 rounded text-gray-500">CRM</span>
                  </span>
                  . We scheduled our next demo for{" "}
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EEF0FF] text-[#3B4BF8] font-medium">
                    Friday at 3:00 PM <span className="text-[9px] bg-white border border-[#D1D5DB] px-1 rounded text-gray-500">Calendar</span>
                  </span>
                  . I need to send her our{" "}
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EEF0FF] text-[#3B4BF8] font-medium">
                    proposal PDF by tomorrow noon <span className="text-[9px] bg-white border border-[#D1D5DB] px-1 rounded text-gray-500">Gmail</span>
                  </span>
                  , and{" "}
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EEF0FF] text-[#3B4BF8] font-medium">
                    remind Alex to prepare the contract <span className="text-[9px] bg-white border border-[#D1D5DB] px-1 rounded text-gray-500">Tasks</span>
                  </span>
                  .
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1 h-4">
                    {[10, 16, 12, 18, 8, 14, 20, 10, 14].map((h, i) => (
                      <span key={i} style={{ height: `${h}px` }} className="w-0.5 bg-[#4353FF] rounded-full" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#9CA3AF] font-mono">0:16</span>
                </div>
              </div>

              {/* Mockup Right Card */}
              <div className="space-y-2.5">
                {[
                  { icon: Mail, title: "Email the proposal to Sarah", sub: "Gmail draft, due tomorrow at noon" },
                  { icon: Calendar, title: "Demo with Sarah Jenkins", sub: "Calendar event, Friday at 3:00 PM" },
                  { icon: FileText, title: "Call notes: pricing approved", sub: "Notion page with the summary" },
                  { icon: Users, title: "Move Sarah to Pricing approved", sub: "CRM deal stage and last contact" },
                  { icon: CheckSquare, title: "Alex: prepare the contract", sub: "Task assigned to Alex" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[#4B5563]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827]">{item.title}</div>
                        <div className="text-[11px] text-[#6B7280]">{item.sub}</div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Section: Works inside the tools you already open */}
      <section id="integrations" className="max-w-6xl mx-auto w-full px-6 py-16 text-center space-y-8 border-t border-[#F3F4F6]">
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Works inside the tools you already open after every call
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            Connect once. Debrief fills each app with the right details, and you approve before anything is sent.
          </p>
        </div>

        {/* Integration Pills Row (Exact match to Image 2) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Mail, label: "Gmail" },
            { icon: Calendar, label: "Calendar" },
            { icon: FileText, label: "Notion" },
            { icon: Users, label: "Your CRM" },
            { icon: CheckSquare, label: "Tasks" },
          ].map((tool, idx) => (
            <div
              key={idx}
              className="px-5 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center space-x-2 text-xs font-bold text-[#111827]"
            >
              <tool.icon className="w-4 h-4 text-[#3B4BF8]" />
              <span>{tool.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Three steps, and the first one is just talking */}
      <section id="how-it-works" className="max-w-6xl mx-auto w-full px-6 py-16 space-y-10 border-t border-[#F3F4F6]">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] text-center">
          Three steps, and the first one is just talking
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-[#F9FAFB] rounded-3xl p-6 border border-[#E5E7EB] space-y-4">
            <div className="h-28 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {[14, 24, 18, 32, 10, 20, 28, 14, 18].map((h, i) => (
                  <span key={i} style={{ height: `${h}px` }} className="w-1 bg-[#3B4BF8] rounded-full" />
                ))}
              </div>
            </div>
            <h3 className="font-bold text-base text-[#111827]">1. Speak for 20 seconds</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Hold Fn or Ctrl + Space and ramble the way you would to a colleague. No format, no template.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#F9FAFB] rounded-3xl p-6 border border-[#E5E7EB] space-y-4">
            <div className="h-28 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col justify-center px-6 space-y-2">
              <div className="w-3/4 h-2 bg-[#EEF0FF] rounded-full" />
              <div className="w-full h-2 bg-[#EEF0FF] rounded-full" />
              <div className="w-1/2 h-2 bg-[#EEF0FF] rounded-full" />
            </div>
            <h3 className="font-bold text-base text-[#111827]">2. Review what it understood</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Names, dates and tasks are pulled out of your words and turned into drafts you can edit.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#F9FAFB] rounded-3xl p-6 border border-[#E5E7EB] space-y-4">
            <div className="h-28 bg-white rounded-2xl border border-[#E5E7EB] flex flex-col justify-center items-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold">Gmail drafted</span>
              <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold">Demo booked</span>
              <span className="px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[10px] font-bold">CRM updated</span>
            </div>
            <h3 className="font-bold text-base text-[#111827]">3. Approve and sync</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              One click sends the email, books the event, files the notes and updates the deal.
            </p>
          </div>

        </div>
      </section>

      {/* Section: Every call, kept and searchable (Exact Dark Card match to Image 2) */}
      <section className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="bg-[#111827] text-white rounded-4xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl">
          
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Every call, kept and searchable
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed max-w-md">
              Each debrief is saved to your call vault with the transcript, the actions it created and where they went, so you never wonder what you promised.
            </p>
          </div>

          {/* 3 Call Pills */}
          <div className="space-y-3">
            {[
              { initials: "SJ", name: "Sarah Jenkins", note: "Pricing approved, demo Friday", actions: "5 actions" },
              { initials: "MR", name: "Marcus Reed", note: "Needs security questionnaire", actions: "3 actions" },
              { initials: "PN", name: "Priya Nair", note: "Renewal moved to next quarter", actions: "4 actions" },
            ].map((c, i) => (
              <div
                key={i}
                className="bg-[#1F2937] p-3.5 rounded-2xl border border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#3B4BF8] text-white flex items-center justify-center font-bold text-xs">
                    {c.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{c.name}</div>
                    <div className="text-[11px] text-[#9CA3AF]">{c.note}</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#9CA3AF] bg-black/40 px-2 py-0.5 rounded-lg border border-gray-700">
                  {c.actions}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Bottom Royal Blue Banner (Exact match to Image 2) */}
      <section className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="bg-[#3B4BF8] text-white rounded-4xl p-10 sm:p-14 text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your next call can end in 20 seconds
          </h2>
          <p className="text-sm text-white/90 max-w-xl mx-auto leading-relaxed">
            Try the sample call and see all five apps update from one ramble.
          </p>
          <div>
            <button
              onClick={onLaunchAutoPilot}
              className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-[#3B4BF8] text-xs font-bold shadow-sm transition-all"
            >
              Try Debrief
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] border-t border-[#E5E7EB]">
        <div className="flex items-center space-x-2 font-bold text-[#111827]">
          <span>Debrief</span>
        </div>
        <div>
          Built for the WeMakeDevs × Wispr Flow Hackathon
        </div>
      </footer>

    </div>
  );
};
