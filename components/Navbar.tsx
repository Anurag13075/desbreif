"use client";

import React from "react";
import { Sparkles, Key, Mic, Archive, Layers, CheckCircle2 } from "lucide-react";
import { PRESET_SCENARIOS } from "@/lib/presetScenarios";

interface NavbarProps {
  currentView: "studio" | "vault" | "architecture";
  onSelectView: (view: "studio" | "vault" | "architecture") => void;
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  groqApiKey: string;
  onOpenSettings: () => void;
  totalDebriefsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  selectedScenarioId,
  onSelectScenario,
  groqApiKey,
  onOpenSettings,
  totalDebriefsCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-wispr-cream/90 backdrop-blur-md border-b border-wispr-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Wispr Tag */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-wispr-ink text-wispr-cream flex items-center justify-center font-serif text-lg font-bold shadow-tactile">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-wispr-ink leading-none">
                Debrief
              </span>
              <span className="text-[10px] font-sans text-wispr-muted tracking-wide mt-0.5">
                30-Second Post-Call Auto-Pilot
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-wispr-green-light border border-wispr-green/20 text-wispr-green text-[10px] font-bold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1" />
            <span>Wispr Flow Voice AI</span>
          </div>
        </div>

        {/* View Switcher Pills */}
        <nav className="hidden md:flex items-center bg-wispr-sand p-1 rounded-2xl border border-wispr-border text-xs font-semibold">
          <button
            onClick={() => onSelectView("studio")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              currentView === "studio"
                ? "bg-wispr-ink text-wispr-cream shadow-sm"
                : "text-wispr-muted hover:text-wispr-ink"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Live Auto-Pilot</span>
          </button>

          <button
            onClick={() => onSelectView("vault")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              currentView === "vault"
                ? "bg-wispr-ink text-wispr-cream shadow-sm"
                : "text-wispr-muted hover:text-wispr-ink"
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Call Vault ({totalDebriefsCount})</span>
          </button>

          <button
            onClick={() => onSelectView("architecture")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              currentView === "architecture"
                ? "bg-wispr-ink text-wispr-cream shadow-sm"
                : "text-wispr-muted hover:text-wispr-ink"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
        </nav>

        {/* Right Actions: Scenarios Dropdown & Groq Settings */}
        <div className="flex items-center space-x-2.5">
          {/* Preset Demo Scenarios */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-white px-2 py-1 rounded-xl border border-wispr-border text-xs">
            <span className="text-[11px] font-semibold text-wispr-muted pl-1">Demo:</span>
            <select
              value={selectedScenarioId}
              onChange={(e) => onSelectScenario(e.target.value)}
              className="bg-transparent font-medium text-wispr-ink text-xs focus:outline-none cursor-pointer pr-1"
            >
              {PRESET_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.client} ({sc.title.split("&")[0].trim()})
                </option>
              ))}
            </select>
          </div>

          {/* Groq Key Indicator Button */}
          <button
            onClick={onOpenSettings}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              groqApiKey
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : "bg-white text-wispr-ink border-wispr-border hover:border-wispr-ink shadow-sm"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{groqApiKey ? "Groq LPU Active" : "Connect Groq"}</span>
            {groqApiKey && <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-0.5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
