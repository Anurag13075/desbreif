"use client";

import React, { useState, useEffect } from "react";
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
import { getSavedContacts, saveContact } from "@/lib/contacts";
import confetti from "canvas-confetti";

export default function DebriefApp() {
  const [currentTab, setCurrentTab] = useState<"auto-pilot" | "call-vault" | "architecture" | "landing">("auto-pilot");
  const [selectedSample, setSelectedSample] = useState<string>("anuj");
  
  // Default spoken ramble text showcasing Anuj and real design engineering discussion
  const [transcript, setTranscript] = useState<string>(
    "Write an email for Anuj at anuj@gmail.com, considering our meeting about design engineering for our product. We finalized the 3D model specs and approved the component hierarchy. Next review scheduled for Monday at 4:00 PM. I promised to send him the updated Figma prototype by tomorrow noon, and remind Anurag to test the API endpoints."
  );

  // Dynamic entity parsing state
  const [parsedDebrief, setParsedDebrief] = useState<ParsedDebriefState>(() =>
    parseUniversalVoiceRamble(
      "Write an email for Anuj at anuj@gmail.com, considering our meeting about design engineering for our product. We finalized the 3D model specs and approved the component hierarchy. Next review scheduled for Monday at 4:00 PM. I promised to send him the updated Figma prototype by tomorrow noon, and remind Anurag to test the API endpoints."
    )
  );

  // Custom modified actions (if user edited via ActionEditorModal or AI synthesis)
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

  // AI Generation Trigger (calls Groq Llama 3.3 or deep generative engine)
  const handleTriggerAIGeneration = async () => {
    if (!transcript.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      const { result, usedGroqAI } = await processDebriefVoiceRamble({
        apiKey: groqApiKey,
        model: selectedModel,
        transcript: transcript,
        speakerName: "Anurag Sharma",
      });

      // Save real contact
      if (result.clientName && result.emailDraft.recipientEmail) {
        saveContact(result.clientName, result.emailDraft.recipientEmail);
      }

      // Map AI generation into staged action cards
      const updatedActions: StagedAction[] = [
        {
          id: "act-email",
          type: "email",
          icon: "mail",
          title: `Email ${result.clientName.split(" ")[0]} (${result.emailDraft.recipientEmail})`,
          subtitle: `Gmail draft: ${result.emailDraft.subject}`,
          badgeText: "Draft ready",
          isDraftReady: true,
          payload: {
            recipientName: result.clientName,
            recipientEmail: result.emailDraft.recipientEmail,
            subject: result.emailDraft.subject,
            body: result.emailDraft.body,
          },
        },
        {
          id: "act-calendar",
          type: "calendar",
          icon: "calendar",
          title: `Meeting with ${result.clientName}`,
          subtitle: `Calendar event, ${result.calendarEvent.startDate} at ${result.calendarEvent.startTime}`,
          badgeText: "Ready",
          payload: {
            title: result.calendarEvent.title,
            day: result.calendarEvent.startDate,
            time: result.calendarEvent.startTime,
            isoTime: result.calendarEvent.startTime,
            durationMinutes: result.calendarEvent.durationMinutes,
            location: result.calendarEvent.location,
            attendees: result.calendarEvent.attendees,
            description: result.calendarEvent.description,
          },
        },
        {
          id: "act-notes",
          type: "notes",
          icon: "file",
          title: `Call notes: ${result.clientName}`,
          subtitle: `Notion page with summary & decisions`,
          badgeText: "Ready",
          payload: {
            title: `${result.clientName} (${result.companyName}) — Post-Call Debrief`,
            dealStage: result.crmUpdate.dealStage,
            summary: result.executiveSummary,
            keyPoints: result.keyDecisions,
          },
        },
        {
          id: "act-crm",
          type: "crm",
          icon: "users",
          title: `Move ${result.clientName} to ${result.crmUpdate.dealStage}`,
          subtitle: `CRM deal stage and last-contact date`,
          badgeText: "Ready",
          payload: result.crmUpdate,
        },
        {
          id: "act-task",
          type: "task",
          icon: "check",
          title: `${result.teamHandoff.targetPerson}: Action Item`,
          subtitle: `Task assigned via Slack`,
          badgeText: "Ready",
          payload: {
            assignee: result.teamHandoff.targetPerson,
            slackMessage: result.teamHandoff.messageSnippet,
          },
        },
      ];

      setCustomActions(updatedActions);
    } catch (err) {
      console.error("AI Generation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Sample Call Selector
  const handleSelectSample = (sampleKey: string) => {
    setSelectedSample(sampleKey);
    let sampleText = "";
    switch (sampleKey) {
      case "anuj":
        sampleText =
          "Write an email for Anuj at anuj@gmail.com, considering our meeting about design engineering for our product. We finalized the 3D model specs and approved the component hierarchy. Next review scheduled for Monday at 4:00 PM. I promised to send him the updated Figma prototype by tomorrow noon, and remind Anurag to test the API endpoints.";
        break;
      case "sarah":
        sampleText =
          "Just got off the call with Sarah Jenkins at sarah.jenkins@acme.com. She approved the pricing. We scheduled our next demo for Friday at 3:00 PM. I need to send her our proposal PDF by tomorrow noon, and remind Alex to prepare the contract.";
        break;
      case "priya":
        sampleText =
          "Sync with Priya Nair from GlobalFin regarding annual contract renewal. She agreed to the 2-year enterprise license with custom SLA. Next meeting scheduled for Thursday at 4:30 PM. Need to email her the formal renewal order form by Wednesday 10 AM, and remind David to approve the payment terms.";
        break;
      case "david":
        sampleText =
          "Wrapped up my sync with David Vance from Peak Horizon. Partner meeting went well, they want our updated cohort retention deck and ARR breakdown by Thursday evening. Let's schedule a 45-minute follow-up Q&A next Tuesday at 11 AM. Tell Rachel to pull the Stripe billing metrics tonight.";
        break;
      case "marcus":
        sampleText =
          "Quick huddle with Marcus on the PostgreSQL read-replica migration. Zero downtime strategy approved. We are doing the dry-run on staging this Saturday at 2 AM UTC. I promised to send him the rollback runbook by Friday 4 PM, and ping DevOps team to provision the additional RDS read instance.";
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

  // Current active actions to display & sync
  const activeActions = customActions || parsedDebrief.actions;

  const effectiveState: ParsedDebriefState = {
    ...parsedDebrief,
    actions: activeActions,
  };

  // Approve and Sync trigger
  const handleApproveAndSync = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3B4BF8", "#EEF0FF", "#10B981", "#111827"],
    });

    // Save to Call Vault
    const emailAct = effectiveState.actions.find((a) => a.type === "email");
    const recipientEmail = emailAct?.payload?.recipientEmail || "anuj@gmail.com";

    const newEntry: DebriefResult = {
      id: `debrief-${Date.now()}`,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rawTranscript: transcript,
      durationSeconds: parsedDebrief.durationSeconds,
      clientName: parsedDebrief.clientName,
      companyName: parsedDebrief.companyName,
      executiveSummary: `Call concluded with ${parsedDebrief.clientName}. Actions staged and synchronized across Gmail (${recipientEmail}), Google Calendar, Notion, and Slack.`,
      keyDecisions: [
        `Ratified next steps with ${parsedDebrief.clientName}`,
        `Action items auto-assigned to internal team`,
      ],
      sentiment: "positive",
      emailDraft: {
        recipientName: parsedDebrief.clientName,
        recipientEmail: recipientEmail,
        subject: emailAct?.payload?.subject || `Recap — ${parsedDebrief.clientName}`,
        body: emailAct?.payload?.body || "",
      },
      calendarEvent: {
        title: `Meeting with ${parsedDebrief.clientName}`,
        startDate: "Monday",
        startTime: "16:00",
        endTime: "16:45",
        durationMinutes: 45,
        location: "Google Meet",
        attendees: [recipientEmail, "you@domain.com"],
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
        dealValue: "$24,000 / year",
        sentiment: "positive",
        keyDecision: "Terms approved",
        nextStepSummary: "Next review scheduled",
      },
      teamHandoff: {
        targetPerson: "Anurag",
        role: "Engineering",
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
          <span className="text-gray-400">— Real Post-Call Auto-Pilot (Wispr Flow #NoHandsChallenge)</span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setCurrentTab(currentTab === "landing" ? "auto-pilot" : "landing")}
            className="hover:underline text-gray-300 font-medium"
          >
            {currentTab === "landing" ? "← Back to Auto-pilot Studio " : "View Landing Page  →"}
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
                  onTriggerAIGeneration={handleTriggerAIGeneration}
                  isProcessing={isProcessing}
                  isGroqConnected={Boolean(groqApiKey && groqApiKey.trim().length > 0)}
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
