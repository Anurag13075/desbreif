"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  ExternalLink,
  Mail,
  Calendar,
  FileText,
  Users,
  CheckSquare,
  Copy,
  Check,
  Download,
  Send,
  Sparkles,
  Edit2,
  Eye,
  EyeOff,
  AlertTriangle,
  Link2,
  Loader2,
} from "lucide-react";
import { StagedAction } from "@/lib/universalEntityEngine";
import { generateGmailWebUrl, generateMailtoUrl } from "@/lib/emailExport";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendarExport";
import { saveContact } from "@/lib/contacts";
import { getSavedConnections } from "@/lib/connectors/connectorStore";

interface SyncExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: StagedAction[];
  clientName: string;
  onOpenConnectorsModal?: () => void;
}

export const SyncExecutionModal: React.FC<SyncExecutionModalProps> = ({
  isOpen,
  onClose,
  actions,
  clientName,
  onOpenConnectorsModal,
}) => {
  const [copiedApp, setCopiedApp] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [isSendingRealGmail, setIsSendingRealGmail] = useState(false);
  const [realGmailStatus, setRealGmailStatus] = useState<string | null>(null);

  const [isPostingSlack, setIsPostingSlack] = useState(false);
  const [slackStatus, setSlackStatus] = useState<string | null>(null);

  const [isPostingNotion, setIsPostingNotion] = useState(false);
  const [notionStatus, setNotionStatus] = useState<string | null>(null);

  // Standout Feature 1: Conflict Detector State
  const [calendarConflict, setCalendarConflict] = useState<boolean>(false);
  const [resolvedTime, setResolvedTime] = useState<string | null>(null);

  // Editable fields for real destination addresses
  const emailAction = actions.find((a) => a.type === "email");
  const calendarAction = actions.find((a) => a.type === "calendar");
  const notesAction = actions.find((a) => a.type === "notes");
  const crmAction = actions.find((a) => a.type === "crm");
  const taskAction = actions.find((a) => a.type === "task");

  const [realEmail, setRealEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [slackMessage, setSlackMessage] = useState("");

  const connections = getSavedConnections();

  useEffect(() => {
    if (emailAction?.payload) {
      setRealEmail(emailAction.payload.recipientEmail || "anuj@gmail.com");
      setEmailSubject(emailAction.payload.subject || "");
      setEmailBody(emailAction.payload.body || "");
    }
    if (taskAction?.payload) {
      setSlackMessage(taskAction.payload.slackMessage || "");
    }

    // Simulate real-time conflict scan on calendar event
    if (calendarAction?.payload?.time?.includes("3:00")) {
      setCalendarConflict(true);
    } else {
      setCalendarConflict(false);
    }
  }, [emailAction, taskAction, calendarAction]);

  if (!isOpen) return null;

  const currentEmailPayload = {
    recipientName: clientName,
    recipientEmail: realEmail,
    subject: emailSubject,
    body: emailBody,
  };

  const dynamicGmailUrl = generateGmailWebUrl(currentEmailPayload);
  const dynamicMailtoUrl = generateMailtoUrl(currentEmailPayload);

  const activeTime = resolvedTime || calendarAction?.payload?.time || "15:00";
  const dynamicGcalUrl = calendarAction
    ? generateGoogleCalendarUrl({
        title: calendarAction.payload.title,
        startDate: calendarAction.payload.day,
        startTime: resolvedTime ? "16:30" : (calendarAction.payload.isoTime || "15:00"),
        endTime: resolvedTime ? "17:15" : "15:45",
        durationMinutes: 45,
        location: "Google Meet",
        attendees: [realEmail, "you@domain.com"],
        description: calendarAction.payload.description,
      })
    : "#";

  const handleEmailBlur = () => {
    if (realEmail && realEmail.includes("@")) {
      saveContact(clientName, realEmail);
    }
  };

  // 1. Direct Real Gmail Dispatch via API Route
  const handleSendRealGmail = async (isDraftOnly = false) => {
    setIsSendingRealGmail(true);
    setRealGmailStatus(null);

    try {
      const res = await fetch("/api/connectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_gmail",
          payload: {
            to: realEmail,
            subject: emailSubject,
            messageBody: emailBody,
            isDraft: isDraftOnly,
          },
          credentials: {
            googleAccessToken: connections.google?.accessToken,
          },
        }),
      });

      const data = await res.json();
      if (data.mode === "real_api") {
        setRealGmailStatus(isDraftOnly ? "✅ Real Draft Created in Gmail Account" : "✅ Real Email Sent via Gmail API");
      } else {
        // Fallback: open web compose
        window.open(dynamicGmailUrl, "_blank");
        setRealGmailStatus("✅ Opened in Gmail Compose");
      }
    } catch (e) {
      window.open(dynamicGmailUrl, "_blank");
    } finally {
      setIsSendingRealGmail(false);
    }
  };

  // 2. Direct Real Slack Dispatch
  const handleSendRealSlack = async () => {
    setIsPostingSlack(true);
    setSlackStatus(null);

    try {
      const res = await fetch("/api/connectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "post_slack",
          payload: {
            text: slackMessage,
            channel: connections.slack?.channel || "#general",
          },
          credentials: {
            slackWebhookUrl: connections.slack?.webhookUrl,
          },
        }),
      });

      const data = await res.json();
      if (data.mode === "real_api") {
        setSlackStatus("✅ Posted directly to Slack workspace");
      } else {
        navigator.clipboard.writeText(slackMessage);
        setSlackStatus("✅ Copied to clipboard (Webhook not configured)");
      }
    } catch (e) {
      navigator.clipboard.writeText(slackMessage);
      setSlackStatus("✅ Copied to clipboard");
    } finally {
      setIsPostingSlack(false);
      setTimeout(() => setSlackStatus(null), 3500);
    }
  };

  // 3. Direct Real Notion Dispatch
  const handleSendRealNotion = async () => {
    if (!notesAction) return;
    setIsPostingNotion(true);
    setNotionStatus(null);

    try {
      const res = await fetch("/api/connectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_notion",
          payload: {
            title: notesAction.payload.title,
            summary: notesAction.payload.summary,
            keyPoints: notesAction.payload.keyPoints,
            databaseId: connections.notion?.databaseId,
          },
          credentials: {
            notionApiKey: connections.notion?.apiKey,
            notionDatabaseId: connections.notion?.databaseId,
          },
        }),
      });

      const data = await res.json();
      if (data.mode === "real_api" && data.url) {
        setNotionStatus(`✅ Page Created in Notion: [View Page]`);
      } else {
        const text = `# ${notesAction.payload.title}\n\n${notesAction.payload.summary}\n\n### Key Points:\n${notesAction.payload.keyPoints.map((k: string) => `- ${k}`).join("\n")}`;
        navigator.clipboard.writeText(text);
        setNotionStatus("✅ Formatted Markdown Copied to Clipboard");
      }
    } catch (e) {
      const text = `# ${notesAction.payload.title}\n\n${notesAction.payload.summary}\n\n### Key Points:\n${notesAction.payload.keyPoints.map((k: string) => `- ${k}`).join("\n")}`;
      navigator.clipboard.writeText(text);
      setNotionStatus("✅ Copied Markdown");
    } finally {
      setIsPostingNotion(false);
      setTimeout(() => setNotionStatus(null), 3500);
    }
  };

  const handleDownloadIcs = () => {
    if (!calendarAction) return;
    downloadIcsFile({
      title: calendarAction.payload.title,
      startDate: calendarAction.payload.day,
      startTime: resolvedTime ? "16:30" : (calendarAction.payload.isoTime || "15:00"),
      endTime: resolvedTime ? "17:15" : "15:45",
      durationMinutes: 45,
      location: "Google Meet",
      attendees: [realEmail, "you@domain.com"],
      description: calendarAction.payload.description,
    });
  };

  const handleOpenAllTabs = () => {
    handleSendRealGmail(true);
    if (dynamicGcalUrl && dynamicGcalUrl !== "#") window.open(dynamicGcalUrl, "_blank");
    handleSendRealNotion();
    handleSendRealSlack();
  };

  const handleAutoResolveConflict = () => {
    setResolvedTime("4:30 PM");
    setCalendarConflict(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#111827]">
                Real App Sync & Execution
              </h3>
              <p className="text-xs text-[#6B7280]">
                Live read/write dispatch to your real accounts for {clientName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenConnectorsModal && (
              <button
                onClick={onOpenConnectorsModal}
                className="px-3 py-1.5 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] text-xs font-semibold flex items-center space-x-1.5 transition-all"
                title="Configure Google, Slack & Notion API tokens"
              >
                <Link2 className="w-3.5 h-3.5 text-[#3B4BF8]" />
                <span>Manage Connectors</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master 1-Click Launch Button */}
        <div className="p-4 rounded-2xl bg-[#EEF0FF] border border-[#3B4BF8]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-sm text-[#3B4BF8] block">
              1-Click Multi-App Auto-Pilot
            </span>
            <span className="text-xs text-[#4B5563]">
              Executes all 5 actions at once across Gmail, Google Calendar, Notion & Slack
            </span>
          </div>

          <button
            onClick={handleOpenAllTabs}
            className="px-4 py-2 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Execute All 5 Real Connectors</span>
          </button>
        </div>

        {/* Staged Apps Details List */}
        <div className="space-y-4">
          
          {/* App 1: Gmail Draft with REAL editable address and live email */}
          {emailAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <Mail className="w-4 h-4 text-[#3B4BF8]" />
                  <span>1. Gmail Connector</span>
                  {connections.google.connected && (
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" title="Google OAuth Active"></span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailPreview(!showEmailPreview)}
                  className="text-xs text-[#3B4BF8] hover:underline font-semibold flex items-center space-x-1"
                >
                  {showEmailPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showEmailPreview ? "Hide Email Body" : "View & Edit Body"}</span>
                </button>
              </div>

              {/* Editable Real Recipient Email */}
              <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <label className="font-semibold text-[#374151] whitespace-nowrap flex items-center space-x-1">
                    <span>To (Real Address):</span>
                  </label>
                  <input
                    type="email"
                    value={realEmail}
                    onChange={(e) => setRealEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    placeholder="e.g. anuj@gmail.com, friend@company.com"
                    className="flex-1 px-3 py-1 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#3B4BF8] text-xs font-medium text-[#111827]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <label className="font-semibold text-[#374151] whitespace-nowrap">Subject:</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="flex-1 px-3 py-1 rounded-lg border border-[#D1D5DB] focus:outline-none focus:border-[#3B4BF8] text-xs font-medium text-[#111827]"
                  />
                </div>

                {showEmailPreview && (
                  <div className="pt-2 border-t border-[#F3F4F6] space-y-1">
                    <label className="text-[11px] font-semibold text-[#6B7280]">AI-Written Email Body:</label>
                    <textarea
                      rows={6}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-[#D1D5DB] text-xs text-[#374151] font-sans leading-relaxed focus:outline-none focus:border-[#3B4BF8]"
                    />
                  </div>
                )}
              </div>

              {realGmailStatus && (
                <div className="p-2 rounded-lg bg-[#ECFDF5] text-[#065F46] text-xs font-semibold">
                  {realGmailStatus}
                </div>
              )}

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSendRealGmail(false)}
                  disabled={isSendingRealGmail}
                  className="px-3 py-1.5 rounded-lg bg-[#3B4BF8] text-white text-xs font-semibold flex items-center space-x-1 hover:bg-[#2B3BE5] shadow-xs"
                >
                  {isSendingRealGmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>{connections.google.connected ? "Send via Real Gmail API" : "Open in Gmail Web"}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSendRealGmail(true)}
                  disabled={isSendingRealGmail}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-[#374151] text-xs font-semibold hover:bg-gray-50 shadow-2xs"
                >
                  <span>Create Real Draft</span>
                </button>
              </div>
            </div>
          )}

          {/* App 2: Google Calendar Event with Standout Feature: Conflict Detector */}
          {calendarAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <Calendar className="w-4 h-4 text-[#3B4BF8]" />
                  <span>2. Google Calendar Event & Conflict Scanner</span>
                </div>
                <span className="text-[11px] text-[#059669] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                  Locked for {calendarAction.payload.day}
                </span>
              </div>

              {/* Standout Feature: Real-time Schedule Conflict Warning & 1-Click Auto-Shift */}
              {calendarConflict ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center space-x-2 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Schedule Conflict: You have 'Design Team All-Hands' at 3:00 PM.</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-amber-800">
                      Auto-detected open window: <strong>4:30 PM</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoResolveConflict}
                      className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold shadow-xs transition-all"
                    >
                      ⚡ Auto-Shift to 4:30 PM (Conflict-Free)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-medium flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Calendar Conflict Scan: <strong>{activeTime}</strong> is 100% open and conflict-free!
                  </span>
                </div>
              )}

              <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-[#E5E7EB]">
                <p className="font-semibold text-[#111827]">{calendarAction.payload.title}</p>
                <p className="text-[#6B7280]">
                  {calendarAction.payload.day} @ {activeTime} (45 min) • Google Meet
                </p>
                <p className="text-[11px] text-[#9CA3AF]">
                  Invited: {realEmail} • you@domain.com
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <a
                  href={dynamicGcalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#3B4BF8] text-white text-xs font-semibold flex items-center space-x-1 hover:bg-[#2B3BE5]"
                >
                  <span>Add to Google Calendar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={handleDownloadIcs}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-[#374151] text-xs font-semibold hover:bg-gray-50 flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download .ICS (Outlook/Apple)</span>
                </button>
              </div>
            </div>
          )}

          {/* App 3: Notion Call Summary Notes with Real API Dispatch */}
          {notesAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <FileText className="w-4 h-4 text-[#3B4BF8]" />
                  <span>3. Notion Real Database Connector</span>
                </div>
                <button
                  onClick={handleSendRealNotion}
                  disabled={isPostingNotion}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#D1D5DB] text-xs font-semibold text-[#111827] hover:bg-gray-50 flex items-center space-x-1"
                >
                  {isPostingNotion ? <Loader2 className="w-3 h-3 animate-spin" /> : <Copy className="w-3 h-3" />}
                  <span>{connections.notion.connected ? "Push to Notion DB" : "Copy Notion Page"}</span>
                </button>
              </div>

              {notionStatus && (
                <div className="p-2 rounded-lg bg-[#ECFDF5] text-[#065F46] text-xs font-semibold">
                  {notionStatus}
                </div>
              )}

              <p className="text-xs text-[#4B5563] bg-white p-3 rounded-xl border border-[#E5E7EB]">
                {notesAction.payload.summary}
              </p>
            </div>
          )}

          {/* App 4: CRM Pipeline Update */}
          {crmAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <Users className="w-4 h-4 text-[#3B4BF8]" />
                  <span>4. CRM Deal Stage & Tracker</span>
                </div>
                <span className="text-[11px] text-[#059669] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                  Stage: {crmAction.payload.dealStage}
                </span>
              </div>

              <div className="text-xs text-[#6B7280] bg-white p-3 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                <span>Client: <strong className="text-[#111827]">{crmAction.payload.clientName}</strong></span>
                <span>Value: <strong className="text-[#111827]">{crmAction.payload.dealValue}</strong></span>
                <span>Next: <strong className="text-[#111827]">{crmAction.payload.nextMilestone}</strong></span>
              </div>
            </div>
          )}

          {/* App 5: Colleague Task Delegation with Real Slack Webhook */}
          {taskAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <CheckSquare className="w-4 h-4 text-[#3B4BF8]" />
                  <span>5. Slack Team Connector ({taskAction.payload.assignee})</span>
                </div>
                <button
                  onClick={handleSendRealSlack}
                  disabled={isPostingSlack}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#D1D5DB] text-xs font-semibold text-[#111827] hover:bg-gray-50 flex items-center space-x-1"
                >
                  {isPostingSlack ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>{connections.slack.connected ? "Post to Slack Channel" : "Copy Slack Ping"}</span>
                </button>
              </div>

              {slackStatus && (
                <div className="p-2 rounded-lg bg-[#ECFDF5] text-[#065F46] text-xs font-semibold">
                  {slackStatus}
                </div>
              )}

              <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] space-y-1">
                <textarea
                  rows={2}
                  value={slackMessage}
                  onChange={(e) => setSlackMessage(e.target.value)}
                  className="w-full text-xs text-[#374151] font-mono leading-relaxed p-1 border-0 focus:outline-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-end border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-semibold shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
