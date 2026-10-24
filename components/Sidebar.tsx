"use client";

import React from "react";
import { Mic, Archive, Layers } from "lucide-react";

interface SidebarProps {
  currentTab: "auto-pilot" | "call-vault" | "architecture";
  onSelectTab: (tab: "auto-pilot" | "call-vault" | "architecture") => void;
  vaultCount: number;
  groqConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  vaultCount,
  groqConnected,
}) => {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col justify-between p-6 border-r border-[#E5E7EB] bg-[#F9FAFB] min-h-screen">
      
      {/* Top Branding & Navigation */}
      <div className="space-y-8">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onSelectTab("auto-pilot")}>
          {/* Blue pill icon with white sound waves */}
          <div className="w-8 h-8 rounded-xl bg-[#3B4BF8] text-white flex items-center justify-center shadow-sm">
            <div className="flex items-center space-x-0.5 h-3.5">
              <span className="w-0.5 h-2 bg-white rounded-full"></span>
              <span className="w-0.5 h-3.5 bg-white rounded-full"></span>
              <span className="w-0.5 h-1.5 bg-white rounded-full"></span>
            </div>
          </div>
          <span className="font-bold text-lg text-[#111827] tracking-tight">
            Debrief
          </span>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1.5">
          {/* Auto-pilot */}
          <button
            onClick={() => onSelectTab("auto-pilot")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
              currentTab === "auto-pilot"
                ? "bg-white text-[#111827] shadow-sm border border-[#E5E7EB]"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-black/5"
            }`}
          >
            <span>Auto-pilot</span>
          </button>

          {/* Call vault */}
          <button
            onClick={() => onSelectTab("call-vault")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
              currentTab === "call-vault"
                ? "bg-white text-[#111827] shadow-sm border border-[#E5E7EB]"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-black/5"
            }`}
          >
            <span>Call vault</span>
            <span className="text-xs text-[#9CA3AF] font-medium">{vaultCount}</span>
          </button>

          {/* Architecture */}
          <button
            onClick={() => onSelectTab("architecture")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
              currentTab === "architecture"
                ? "bg-white text-[#111827] shadow-sm border border-[#E5E7EB]"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-black/5"
            }`}
          >
            <span>Architecture</span>
          </button>
        </nav>

      </div>

      {/* Bottom Status Card (Exact match to Image 1) */}
      <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-[#374151]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0 animate-pulse"></span>
          <span className="font-medium text-[11.5px]">Wispr Flow voice on</span>
        </div>

        <div className="flex items-center space-x-2 text-[#374151]">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              groqConnected ? "bg-[#10B981]" : "bg-[#F59E0B]"
            }`}
          ></span>
          <span className="font-medium text-[11.5px]">
            {groqConnected ? "Groq LPU active" : "Groq key needed"}
          </span>
        </div>
      </div>

    </aside>
  );
};
