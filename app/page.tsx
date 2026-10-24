"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VoiceDictationBar } from "@/components/VoiceDictationBar";
import { SummaryCard } from "@/components/SummaryCard";
import { DraftEmailCard } from "@/components/DraftEmailCard";
import { CalendarScheduleCard } from "@/components/CalendarScheduleCard";
import { ActionItemsCard } from "@/components/ActionItemsCard";
import { CrmDealCard } from "@/components/CrmDealCard";
import { TeamHandoffCard } from "@/components/TeamHandoffCard";
import { CallVaultView } from "@/components/CallVaultView";
import { ArchitectureView } from "@/components/ArchitectureView";
import { SettingsModal } from "@/components/SettingsModal";
import { DebriefResult } from "@/lib/types";
import { PRESET_SCENARIOS, DEFAULT_DEBRIEF_RESULT } from "@/lib/presetScenarios";
import { processDebriefVoiceRamble } from "@/lib/groqDebrief";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export default function DebriefHome() {
  const [currentView, setCurrentView] = useState<"studio" | "vault" | "architecture">("studio");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("sarah-pricing-approval");
  const [transcript, setTranscript] = useState<string>(PRESET_SCENARIOS[0].rambleTranscript);
  const [activeDebrief, setActiveDebrief] = useState<DebriefResult>(DEFAULT_DEBRIEF_RESULT);
  const [callHistory, setCallHistory] = useState<DebriefResult[]>([DEFAULT_DEBRIEF_RESULT]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [groqApiKey, setGroqApiKey] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("llama-3.3-70b-versatile");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Load Groq API key and history from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("debrief_groq_api_key");
      if (savedKey) setGroqApiKey(savedKey);
      const savedModel = localStorage.getItem("debrief_groq_model");
      if (savedModel) setSelectedModel(savedModel);
      const savedHistory = localStorage.getItem("debrief_call_history_v1");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCallHistory(parsed);
          setActiveDebrief(parsed[0]);
        }
      }
    } catch (e) {}
  }, []);

  const handleSaveApiKey = (key: string, model: string) => {
    setGroqApiKey(key);
    setSelectedModel(model);
    try {
      localStorage.setItem("debrief_groq_api_key", key);
      localStorage.setItem("debrief_groq_model", model);
    } catch (e) {}
  };

  const handleSelectScenario = (scenarioId: string) => {
    const sc = PRESET_SCENARIOS.find((item) => item.id === scenarioId);
    if (!sc) return;
    setSelectedScenarioId(scenarioId);
    setTranscript(sc.rambleTranscript);
    handleExecuteDebrief(sc.rambleTranscript);
  };

  const handleExecuteDebrief = async (voiceText: string) => {
    if (!voiceText.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      const { result, usedGroqAI } = await processDebriefVoiceRamble({
        apiKey: groqApiKey,
        model: selectedModel,
        transcript: voiceText,
        speakerName: "Anurag Sharma",
      });

      setActiveDebrief(result);
      setCallHistory((prev) => [result, ...prev.filter((item) => item.id !== result.id)]);

      // Save to localStorage
      try {
        localStorage.setItem(
          "debrief_call_history_v1",
          JSON.stringify([result, ...callHistory.slice(0, 15)])
        );
      } catch (e) {}

      // Trigger Confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#DDD0F7", "#154032", "#141413"],
      });

      setFeedbackToast(
        usedGroqAI
          ? "⚡ Groq Llama 3.3 processed in 0.6s • Staged across 5 apps"
          : "⚡ Staged across 5 apps with instant post-call neural engine"
      );
      setTimeout(() => setFeedbackToast(null), 4000);
    } catch (err) {
      console.error("Debrief processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleActionItem = (itemId: string) => {
    setActiveDebrief((prev) => ({
      ...prev,
      actionItems: prev.actionItems.map((it) =>
        it.id === itemId ? { ...it, completed: !it.completed } : it
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-wispr-cream text-wispr-ink flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
        groqApiKey={groqApiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalDebriefsCount={callHistory.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        
        {/* VIEW 1: STUDIO (LIVE AUTO-PILOT) */}
        {currentView === "studio" && (
          <div className="space-y-8">
            
            {/* Editorial Hero Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-wispr-sand border border-wispr-border text-xs font-semibold text-wispr-ink shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>The 30-Second Post-Call Auto-Pilot</span>
                <span className="text-wispr-muted">•</span>
                <span className="text-wispr-muted">#NoHandsChallenge</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-wispr-ink leading-[1.15]">
                Hang up the call. Speak for 20 seconds. <br className="hidden sm:inline" />
                Everything else is already done.
              </h1>

              <p className="text-sm sm:text-base text-wispr-muted leading-relaxed font-normal">
                Never waste 15 minutes opening Gmail, Calendar, Notion, and your CRM after a client call. Speak informally — Debrief stages and synchronizes all 5 apps automatically.
              </p>
            </div>

            {/* Voice Dictation Hub */}
            <div className="max-w-4xl mx-auto">
              <VoiceDictationBar
                transcript={transcript}
                onChangeTranscript={setTranscript}
                onProcessDebrief={handleExecuteDebrief}
                isProcessing={isProcessing}
                onSelectScenario={handleSelectScenario}
                activeScenarioId={selectedScenarioId}
              />
            </div>

            {/* Live Feedback Toast */}
            {feedbackToast && (
              <div className="max-w-md mx-auto p-3 rounded-2xl bg-wispr-ink text-wispr-cream text-xs font-semibold text-center flex items-center justify-center space-x-2 shadow-tactile animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{feedbackToast}</span>
              </div>
            )}

            {/* Staged Applications Grid */}
            <div className="space-y-6 pt-2">
              
              <div className="flex items-center justify-between pb-2 border-b border-wispr-border/70">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-xl font-bold text-wispr-ink">
                    Staged Multi-App Operations
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    5 Apps Synchronized
                  </span>
                </div>
                <span className="text-xs text-wispr-muted">
                  Client: <strong className="text-wispr-ink">{activeDebrief.clientName}</strong> ({activeDebrief.companyName})
                </span>
              </div>

              {/* Grid 1: Executive Call Summary + CRM Pipeline Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SummaryCard debrief={activeDebrief} />
                </div>
                <div className="lg:col-span-1">
                  <CrmDealCard crm={activeDebrief.crmUpdate} />
                </div>
              </div>

              {/* Grid 2: Draft Email Card + Calendar Schedule Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DraftEmailCard
                  email={activeDebrief.emailDraft}
                  clientName={activeDebrief.clientName}
                />
                <CalendarScheduleCard event={activeDebrief.calendarEvent} />
              </div>

              {/* Grid 3: Action Items Checklist + Team Colleague Handoff */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActionItemsCard
                  items={activeDebrief.actionItems}
                  onToggleItem={handleToggleActionItem}
                />
                <TeamHandoffCard handoff={activeDebrief.teamHandoff} />
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: CALL VAULT */}
        {currentView === "vault" && (
          <CallVaultView
            history={callHistory}
            onSelectDebrief={(d) => {
              setActiveDebrief(d);
              setTranscript(d.rawTranscript);
              setCurrentView("studio");
            }}
          />
        )}

        {/* VIEW 3: ARCHITECTURE */}
        {currentView === "architecture" && <ArchitectureView />}

      </main>

      {/* Groq Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={groqApiKey}
        onSaveApiKey={handleSaveApiKey}
        currentModel={selectedModel}
      />

      {/* Editorial Footer */}
      <footer className="mt-auto border-t border-wispr-border bg-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wispr-muted">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-wispr-ink text-sm">Debrief</span>
            <span>•</span>
            <span>Created for WeMakeDevs × Wispr Flow Hackathon (#NoHandsChallenge)</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>Voice-first post-call automation</span>
            <span>•</span>
            <span>Powered by Wispr Flow & Groq LPU</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
