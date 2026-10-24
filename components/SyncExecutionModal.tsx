"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { StagedAction } from "@/lib/universalEntityEngine";
import { generateGmailWebUrl, generateMailtoUrl } from "@/lib/emailExport";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendarExport";

interface SyncExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: StagedAction[];
  clientName: string;
}

export const SyncExecutionModal: React.FC<SyncExecutionModalProps> = ({
  isOpen,
  onClose,
  actions,
  clientName,
}) => {
  const [copiedApp, setCopiedApp] = useState<string | null>(null);

  if (!isOpen) return null;

  const emailAction = actions.find((a) => a.type === "email");
  const calendarAction = actions.find((a) => a.type === "calendar");
  const notesAction = actions.find((a) => a.type === "notes");
  const crmAction = actions.find((a) => a.type === "crm");
  const taskAction = actions.find((a) => a.type === "task");

  const gmailUrl = emailAction ? generateGmailWebUrl(emailAction.payload) : "#";
  const mailtoUrl = emailAction ? generateMailtoUrl(emailAction.payload) : "#";
  const gcalUrl = calendarAction
    ? generateGoogleCalendarUrl({
        title: calendarAction.payload.title,
        startDate: calendarAction.payload.day,
        startTime: calendarAction.payload.isoTime || "15:00",
        endTime: "15:45",
        durationMinutes: 45,
        location: "Google Meet",
        attendees: calendarAction.payload.attendees || [],
        description: calendarAction.payload.description,
      })
    : "#";

  const handleCopyNotion = () => {
    if (!notesAction) return;
    const text = `# ${notesAction.payload.title}\n\n${notesAction.payload.summary}\n\n### Key Points:\n${notesAction.payload.keyPoints.map((k: string) => `- ${k}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopiedApp("notion");
    setTimeout(() => setCopiedApp(null), 2000);
  };

  const handleCopySlack = () => {
    if (!taskAction) return;
    navigator.clipboard.writeText(taskAction.payload.slackMessage);
    setCopiedApp("slack");
    setTimeout(() => setCopiedApp(null), 2000);
  };

  const handleDownloadIcs = () => {
    if (!calendarAction) return;
    downloadIcsFile({
      title: calendarAction.payload.title,
      startDate: calendarAction.payload.day,
      startTime: calendarAction.payload.isoTime || "15:00",
      endTime: "15:45",
      durationMinutes: 45,
      location: "Google Meet",
      attendees: calendarAction.payload.attendees || [],
      description: calendarAction.payload.description,
    });
  };

  const handleOpenAllTabs = () => {
    if (gmailUrl && gmailUrl !== "#") window.open(gmailUrl, "_blank");
    if (gcalUrl && gcalUrl !== "#") window.open(gcalUrl, "_blank");
    handleCopyNotion();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#111827]">
                Synchronizing 5 Live Apps
              </h3>
              <p className="text-xs text-[#6B7280]">
                All operational artifacts ready for {clientName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Master 1-Click Launch Button */}
        <div className="p-4 rounded-2xl bg-[#EEF0FF] border border-[#3B4BF8]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-sm text-[#3B4BF8] block">
              1-Click Multi-App Auto-Pilot
            </span>
            <span className="text-xs text-[#4B5563]">
              Instantly opens Gmail compose + Google Calendar tabs and copies Notion notes
            </span>
          </div>

          <button
            onClick={handleOpenAllTabs}
            className="px-4 py-2 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch All Apps in Tabs</span>
          </button>
        </div>

        {/* Staged Apps Details List */}
        <div className="space-y-4">
          
          {/* App 1: Gmail Draft */}
          {emailAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <Mail className="w-4 h-4 text-[#3B4BF8]" />
                  <span>1. Gmail Follow-Up Draft</span>
                </div>
                <span className="text-[11px] text-[#059669] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                  Draft Prepared
                </span>
              </div>

              <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-[#E5E7EB]">
                <p className="text-[#6B7280]">
                  <strong className="text-[#111827]">To:</strong> {emailAction.payload.recipientName} ({emailAction.payload.recipientEmail})
                </p>
                <p className="text-[#6B7280]">
                  <strong className="text-[#111827]">Subject:</strong> {emailAction.payload.subject}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#3B4BF8] text-white text-xs font-semibold flex items-center space-x-1 hover:bg-[#2B3BE5]"
                >
                  <span>Open in Gmail</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={mailtoUrl}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-[#374151] text-xs font-semibold hover:bg-gray-50"
                >
                  <span>Default Mail</span>
                </a>
              </div>
            </div>
          )}

          {/* App 2: Google Calendar Event */}
          {calendarAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <Calendar className="w-4 h-4 text-[#3B4BF8]" />
                  <span>2. Google Calendar Invite</span>
                </div>
                <span className="text-[11px] text-[#059669] font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                  Locked for {calendarAction.payload.day}
                </span>
              </div>

              <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-[#E5E7EB]">
                <p className="font-semibold text-[#111827]">{calendarAction.payload.title}</p>
                <p className="text-[#6B7280]">
                  {calendarAction.payload.day} @ {calendarAction.payload.time} (45 min) • Google Meet
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <a
                  href={gcalUrl}
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
                  <span>Download .ICS</span>
                </button>
              </div>
            </div>
          )}

          {/* App 3: Notion Call Summary Notes */}
          {notesAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <FileText className="w-4 h-4 text-[#3B4BF8]" />
                  <span>3. Notion Call Summary Notes</span>
                </div>
                <button
                  onClick={handleCopyNotion}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#D1D5DB] text-xs font-semibold text-[#111827] hover:bg-gray-50 flex items-center space-x-1"
                >
                  {copiedApp === "notion" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedApp === "notion" ? "Copied!" : "Copy Notion Page"}</span>
                </button>
              </div>

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
                  <span>4. CRM Deal Stage (HubSpot / Salesforce)</span>
                </div>
                <span className="text-[11px] font-bold text-[#3B4BF8] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full">
                  {crmAction.payload.dealStage}
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Deal value: <strong className="text-[#111827]">{crmAction.payload.dealValue}</strong> • Next Milestone: {crmAction.payload.nextMilestone}
              </p>
            </div>
          )}

          {/* App 5: Colleague Task / Slack Handoff */}
          {taskAction && (
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#111827]">
                  <CheckSquare className="w-4 h-4 text-[#3B4BF8]" />
                  <span>5. Task & Slack Message for {taskAction.payload.assignee}</span>
                </div>
                <button
                  onClick={handleCopySlack}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#D1D5DB] text-xs font-semibold text-[#111827] hover:bg-gray-50 flex items-center space-x-1"
                >
                  {copiedApp === "slack" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedApp === "slack" ? "Copied!" : "Copy Slack"}</span>
                </button>
              </div>

              <div className="text-xs text-[#374151] bg-white p-3 rounded-xl border border-[#E5E7EB] font-mono">
                {taskAction.payload.slackMessage}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
