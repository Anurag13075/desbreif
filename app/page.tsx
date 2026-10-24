"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { DebriefStudio } from "@/components/DebriefStudio";
import { LandingView } from "@/components/LandingView";
import { CallVaultView } from "@/components/CallVaultView";
import { ArchitectureView } from "@/components/ArchitectureView";
import { SyncExecutionModal } from "@/components/SyncExecutionModal";
import { ActionEditorModal } from "@/components/ActionEditorModal";
import { SettingsModal } from "@/components/SettingsModal";
import {
  parseUniversalVoiceRamble,
  ParsedDebriefState,
  StagedAction,
} from "@/lib/universalEntityEngine";
import { PRESET_SCENARIOS, DEFAULT_DEBRIEF_RESULT } from "@/lib/presetScenarios";
import { DebriefResult } from "@/lib/types";
import { processDebriefVoiceRamble } from "@/lib/groqDebrief";
import confetti from "canvas-confetti";

export default function DebriefApp() {
  const [currentTab, setCurrentTab] = useState<"auto-pilot" | "call-vault" | "architecture" | "landing">("auto-pilot");
  const [selectedSample, setSelectedSample] = useState<string>("sarah");
  
  // Default spoken ramble text (matching the exact text from the demo prompt in Image 1)
  const [transcript, setTranscript] = useState<string>(
    "Just got off the call with Sarah. She approved the pricing. We scheduled our next demo for Friday at 3:00 PM. I need to send her our proposal PDF by tomorrow noon, and remind Alex to prepare the contract."
  );

  // Dynamic entity parsing state
  const [parsedDebrief, setParsedDebrief] = useState<ParsedDebriefState>(() =>
    parseUniversalVoiceRamble(
      "Just got off the call with Sarah. She approved the pricing. We scheduled our next demo for Friday at 3:00 PM. I need to send her our proposal PDF by tomorrow noon, and remind Alex to prepare the contract."
    )
  );

  // Custom modified actions (if user edited via ActionEditorModal)
  const [customActions, setCustomActions] = useState<StagedAction[] | null>(null);

  // Modals & State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isActionEditorOpen, setIsActionEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");

  // Call Vault permanent history
  const [callHistory, setCallHistory] = useState<DebriefResult[]>([DEFAULT_DEBRIEF_RESULT]);

  // Load saved API key & history on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("debrief_groq_api_key");
      if (savedKey) setGroqApiKey(savedKey);

      const savedModel = localStorage.getItem("debrief_groq_model");
      if (savedModel) setSelectedModel(savedModel);

      const savedHistory = localStorage.getItem("debrief_call_vault_v2");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCallHistory(parsed);
        }
      }
    } catch (e) {
      console.warn("Storage load error:", e);
    }
  }, []);

  // When transcript updates, recalculate universal entities dynamically
  const handleTranscriptChange = (newText: string) => {
    setTranscript(newText);
    const parsed = parseUniversalVoiceRamble(newText);
    setParsedDebrief(parsed);
    setCustomActions(null); // Reset manual overrides when transcript changes
  };

  // Sample Call Selector
  const handleSelectSample = (sampleKey: string) => {
    setSelectedSample(sampleKey);
    let sampleText = "";
    switch (sampleKey) {
      case "sarah":
        sampleText =
          "Just got off the call with Sarah. She approved the pricing. We scheduled our next demo for Friday at 3:00 PM. I need to send her our proposal PDF by tomorrow noon, and remind Alex to prepare the contract.";
        break;
      case "marcus":
        sampleText =
          "Quick huddle with Marcus on the PostgreSQL read-replica migration. Zero downtime strategy approved. We are doing the dry-run on staging this Saturday at 2 AM UTC. I promised to send him the rollback runbook by Friday 4 PM, and ping DevOps team to provision the additional RDS read instance.";
        break;
      case "priya":
        sampleText =
          "Sync with Priya Nair from GlobalFin regarding annual contract renewal. She agreed to the 2-year enterprise license with custom SLA. Next meeting scheduled for Thursday at 4:30 PM. Need to email her the formal renewal order form by Wednesday 10 AM, and remind David to approve the payment terms.";
        break;
      case "david":
        sampleText =
          "Wrapped up my sync with David Vance from Peak Horizon. Partner meeting went well, they want our updated cohort retention deck and ARR breakdown by Thursday evening. Let's schedule a 45-minute follow-up Q&A next Tuesday at 11 AM. Tell Rachel to pull the Stripe billing metrics tonight.";
        break;
      case "rohan":
        sampleText =
          "Great discussion with Rohan at Flipkart. They approved our enterprise pilot for 500 agents. Follow up demo on Monday at 2:00 PM. Send him the security compliance checklist by tomorrow 5 PM, and ask Maya to configure the dedicated staging environment.";
        break;
      default:
        sampleText = PRESET_SCENARIOS[0].rambleTranscript;
    }
    handleTranscriptChange(sampleText);
  };

  // Save Groq Settings
  const handleSaveApiKey = (key: string, model: string) => {
    setGroqApiKey(key);
    setSelectedModel(model);
    try {
      localStorage.setItem("debrief_groq_api_key", key);
      localStorage.setItem("debrief_groq_model", model);
    } catch (e) {}
  };

  // Current active actions to display & sync (either custom edited or dynamically parsed)
  const activeActions = customActions || parsedDebrief.actions;

  // Active state combining parsed results with active actions
  const effectiveState: ParsedDebriefState = {
    ...parsedDebrief,
    actions: activeActions,
  };

  // Approve and Sync button trigger
  const handleApproveAndSync = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3B4BF8", "#EEF0FF", "#10B981", "#111827"],
    });

    // Save to Call Vault
    const newEntry: DebriefResult = {
      id: `debrief-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rawTranscript: transcript,
      durationSeconds: parsedDebrief.durationSeconds,
      clientName: parsedDebrief.clientName,
      companyName: parsedDebrief.companyName,
      executiveSummary: `Call concluded with ${parsedDebrief.clientName}. Actions staged and synchronized across Gmail, Google Calendar, Notion, and Slack.`,
      keyDecisions: [
        `Ratified next steps with ${parsedDebrief.clientName}`,
        `Action items auto-assigned to internal team`,
      ],
      sentiment: "positive",
      emailDraft: {
        recipientName: parsedDebrief.clientName,
        recipientEmail: `${parsedDebrief.clientName.toLowerCase().replace(/\s+/g, ".")}@${parsedDebrief.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        subject: `Recap & Next Steps — ${parsedDebrief.clientName}`,
        body: effectiveState.actions.find((a) => a.type === "email")?.payload?.body || "",
      },
      calendarEvent: {
        title: `Demo with ${parsedDebrief.clientName}`,
        startDate: "Friday",
        startTime: "15:00",
        endTime: "15:45",
        durationMinutes: 45,
        location: "Google Meet",
        attendees: [`${parsedDebrief.clientName.toLowerCase().replace(/\s+/g, ".")}@company.com`],
        description: `Follow up sync with ${parsedDebrief.clientName}`,
      },
      actionItems: effectiveState.actions.map((act) => ({
        id: act.id,
        title: act.title,
        assignee: act.payload?.assignee || "You",
        dueDate: act.payload?.dueDate || "Tomorrow",
        priority: "high",
        completed: false,
        category: "General",
      })),
      crmUpdate: {
        clientName: parsedDebrief.clientName,
        companyName: parsedDebrief.companyName,
        dealStage: "Pricing Approved",
        dealValue: "$36,000 / year",
        sentiment: "positive",
        keyDecision: "Pricing approved",
        nextStepSummary: "Demo scheduled",
      },
      teamHandoff: {
        targetPerson: "Alex",
        role: "Legal & Operations",
        messageSnippet: effectiveState.actions.find((a) => a.type === "task")?.payload?.slackMessage || "",
      },
    };

    setCallHistory((prev) => {
      const updated = [newEntry, ...prev.filter((p) => p.id !== newEntry.id)];
      try {
        localStorage.setItem("debrief_call_vault_v2", JSON.stringify(updated.slice(0, 20)));
      } catch (e) {}
      return updated;
    });

    setIsSyncModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans selection:bg-[#EEF0FF]">
      
      {/* Top Bar for landing view preview toggle */}
      <div className="bg-[#111827] text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="font-semibold">Debrief</span>
          <span className="text-gray-400">— The 30-Second Post-Call Auto-Pilot</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setCurrentTab(currentTab === "landing" ? "auto-pilot" : "landing")}
            className="hover:underline text-gray-300 font-medium"
          >
            {currentTab === "landing" ? "← Back to Auto-pilot Studio (Image 1)" : "View Landing Page (Image 2) →"}
          </button>
        </div>
      </div>

      {/* RENDER VIEW: Landing Page (Image 2) */}
      {currentTab === "landing" ? (
        <LandingView
          onLaunchAutoPilot={() => setCurrentTab("auto-pilot")}
          onOpenVault={() => setCurrentTab("call-vault")}
        />
      ) : (
        /* RENDER VIEW: Auto-Pilot Studio with Left Sidebar & Top Header (Image 1) */
        <div className="flex min-h-[calc(100vh-32px)]">
          
          {/* Left Sidebar (Exact match to Image 1) */}
          <Sidebar
            currentTab={currentTab as "auto-pilot" | "call-vault" | "architecture"}
            onSelectTab={(tab) => setCurrentTab(tab)}
            vaultCount={callHistory.length}
            groqConnected={Boolean(groqApiKey && groqApiKey.trim().length > 0)}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            
            {/* Top Header (Breadcrumb, Sample call selector, Connect Groq) */}
            <TopHeader
              breadcrumb={
                currentTab === "auto-pilot"
                  ? "Auto-pilot / New debrief"
                  : currentTab === "call-vault"
                  ? "Call Vault / Archive"
                  : "Architecture / System Design"
              }
              selectedSample={selectedSample}
              onSelectSample={handleSelectSample}
              onOpenGroqModal={() => setIsSettingsOpen(true)}
              groqConnected={Boolean(groqApiKey && groqApiKey.trim().length > 0)}
            />

            {/* View Switching */}
            <main className="flex-1 p-8 sm:p-10 max-w-7xl w-full mx-auto">
              
              {/* TAB 1: Auto-pilot Studio (Exact match to Image 1) */}
              {currentTab === "auto-pilot" && (
                <DebriefStudio
                  state={effectiveState}
                  onChangeTranscript={handleTranscriptChange}
                  onApproveAndSync={handleApproveAndSync}
                  onEditActions={() => setIsActionEditorOpen(true)}
                  isProcessing={isProcessing}
                />
              )}

              {/* TAB 2: Call Vault */}
              {currentTab === "call-vault" && (
                <CallVaultView
                  history={callHistory}
                  onSelectDebrief={(d) => {
                    handleTranscriptChange(d.rawTranscript);
                    setCurrentTab("auto-pilot");
                  }}
                />
              )}

              {/* TAB 3: Architecture */}
              {currentTab === "architecture" && <ArchitectureView />}

            </main>

          </div>

        </div>
      )}

      {/* Modal 1: Sync & Real Multi-App Execution Modal */}
      <SyncExecutionModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        actions={effectiveState.actions}
        clientName={effectiveState.clientName}
      />

      {/* Modal 2: Action Editor Modal */}
      <ActionEditorModal
        isOpen={isActionEditorOpen}
        onClose={() => setIsActionEditorOpen(false)}
        actions={effectiveState.actions}
        onSaveActions={(updated) => setCustomActions(updated)}
      />

      {/* Modal 3: Groq Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={groqApiKey}
        onSaveApiKey={handleSaveApiKey}
        currentModel={selectedModel}
      />

    </div>
  );
}
