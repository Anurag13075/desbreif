"use client";

import React from "react";
import { ChevronDown, Key } from "lucide-react";

interface TopHeaderProps {
  breadcrumb: string;
  selectedSample: string;
  onSelectSample: (sample: string) => void;
  onOpenGroqModal: () => void;
  groqConnected: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  breadcrumb,
  selectedSample,
  onSelectSample,
  onOpenGroqModal,
  groqConnected,
}) => {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-[#E5E7EB] bg-white">
      {/* Breadcrumb */}
      <div className="text-xs text-[#6B7280] font-medium flex items-center space-x-1.5">
        <span>Auto-pilot</span>
        <span>/</span>
        <span className="text-[#111827] font-semibold">New debrief</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* Sample Call Picker */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[#6B7280]">Sample call</span>
          <div className="relative inline-block">
            <select
              value={selectedSample}
              onChange={(e) => onSelectSample(e.target.value)}
              className="appearance-none bg-white border border-[#E5E7EB] text-[#111827] text-xs font-semibold px-3 py-1.5 pr-8 rounded-lg focus:outline-none focus:border-[#3B4BF8] cursor-pointer shadow-sm hover:border-[#D1D5DB]"
            >
              <option value="sarah">Sarah Jenkins: pricing approved</option>
              <option value="marcus">Marcus Reed: security review</option>
              <option value="priya">Priya Nair: renewal negotiation</option>
              <option value="david">David Vance: Series A deck</option>
              <option value="rohan">Rohan: enterprise pilot</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Connect Groq Button */}
        <button
          onClick={onOpenGroqModal}
          className="bg-white border border-[#E5E7EB] hover:border-[#111827] text-[#111827] text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
        >
          <Key className="w-3 h-3 text-[#6B7280]" />
          <span>{groqConnected ? "Groq Connected" : "Connect Groq"}</span>
        </button>
      </div>
    </header>
  );
};
