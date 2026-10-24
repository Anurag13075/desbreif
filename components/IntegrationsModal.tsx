"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Building2,
  Save,
  Link2,
} from "lucide-react";
import {
  AppConnections,
  getSavedConnections,
  saveConnections,
} from "@/lib/connectors/connectorStore";

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionsUpdated: (connections: AppConnections) => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  isOpen,
  onClose,
  onConnectionsUpdated,
}) => {
  const [connections, setConnections] = useState<AppConnections>(getSavedConnections());
  const [activeTab, setActiveTab] = useState<"google" | "slack" | "notion" | "hubspot">("google");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [googleToken, setGoogleToken] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [slackChannel, setSlackChannel] = useState("");
  const [notionKey, setNotionKey] = useState("");
  const [notionDb, setNotionDb] = useState("");
  const [hubspotKey, setHubspotKey] = useState("");

  useEffect(() => {
    const saved = getSavedConnections();
    setConnections(saved);
    setGoogleToken(saved.google?.accessToken || "");
    setGoogleEmail(saved.google?.userEmail || "");
    setSlackWebhook(saved.slack?.webhookUrl || "");
    setSlackChannel(saved.slack?.channel || "#general");
    setNotionKey(saved.notion?.apiKey || "");
    setNotionDb(saved.notion?.databaseId || "");
    setHubspotKey(saved.hubspot?.apiKey || "");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppConnections = {
      ...connections,
      google: {
        connected: Boolean(googleToken.trim()),
        accessToken: googleToken.trim(),
        userEmail: googleEmail.trim() || "anurag@gmail.com",
      },
    };
    setConnections(updated);
    saveConnections(updated);
    onConnectionsUpdated(updated);
    showToast("Google Workspace (Gmail & Calendar) connector updated!");
  };

  const handleSaveSlack = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppConnections = {
      ...connections,
      slack: {
        connected: Boolean(slackWebhook.trim()),
        webhookUrl: slackWebhook.trim(),
        channel: slackChannel.trim() || "#general",
      },
    };
    setConnections(updated);
    saveConnections(updated);
    onConnectionsUpdated(updated);
    showToast("Slack Webhook connector updated!");
  };

  const handleSaveNotion = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppConnections = {
      ...connections,
      notion: {
        connected: Boolean(notionKey.trim() && notionDb.trim()),
        apiKey: notionKey.trim(),
        databaseId: notionDb.trim(),
      },
    };
    setConnections(updated);
    saveConnections(updated);
    onConnectionsUpdated(updated);
    showToast("Notion Meeting Notes connector updated!");
  };

  const handleSaveHubspot = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppConnections = {
      ...connections,
      hubspot: {
        connected: Boolean(hubspotKey.trim()),
        apiKey: hubspotKey.trim(),
      },
    };
    setConnections(updated);
    saveConnections(updated);
    onConnectionsUpdated(updated);
    showToast("HubSpot CRM connector updated!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#3B4BF8] flex items-center justify-center shadow-xs">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#111827]">
                Real App Connectors Hub
              </h3>
              <p className="text-xs text-[#6B7280]">
                Connect once. Read and write directly to your real Gmail, Calendar, Slack & Notion.
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

        {/* Status Toast */}
        {toastMessage && (
          <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 p-1 bg-[#F3F4F6] rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("google")}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "google"
                ? "bg-white text-[#111827] shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-red-500" />
            <span>Gmail & Calendar</span>
            {connections.google.connected && (
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("slack")}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "slack"
                ? "bg-white text-[#111827] shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Slack</span>
            {connections.slack.connected && (
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("notion")}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "notion"
                ? "bg-white text-[#111827] shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-gray-800" />
            <span>Notion</span>
            {connections.notion.connected && (
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("hubspot")}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "hubspot"
                ? "bg-white text-[#111827] shadow-xs"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-orange-500" />
            <span>HubSpot</span>
            {connections.hubspot.connected && (
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            )}
          </button>
        </div>

        {/* TAB 1: GOOGLE (GMAIL & CALENDAR) */}
        {activeTab === "google" && (
          <form onSubmit={handleSaveGoogle} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#111827]">
                    Google Workspace Real API Connector
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    Direct read/write access to Gmail and Google Calendar
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  connections.google.connected
                    ? "bg-[#ECFDF5] text-[#059669]"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {connections.google.connected ? "Real API Active" : "1-Click Web Fallback Ready"}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Your Gmail Account:
                  </label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-xs font-medium focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Google OAuth Access Token (Optional for direct silent sending):
                  </label>
                  <input
                    type="password"
                    value={googleToken}
                    onChange={(e) => setGoogleToken(e.target.value)}
                    placeholder="Bearer ya29.a0..."
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-xs font-mono focus:outline-none focus:border-[#3B4BF8]"
                  />
                  <p className="text-[11px] text-[#9CA3AF] mt-1">
                    💡 If left blank, Debrief automatically uses instant 1-click verified deep links into Gmail and Google Calendar with pre-populated drafts and attendees.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Google Connector</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SLACK */}
        {activeTab === "slack" && (
          <form onSubmit={handleSaveSlack} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#111827]">
                    Slack Real Webhook Connector
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    Directly posts teammate delegation pings to your Slack channel
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  connections.slack.connected ? "bg-[#ECFDF5] text-[#059669]" : "bg-gray-100 text-gray-600"
                }`}>
                  {connections.slack.connected ? "Connected" : "Not connected"}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Slack Incoming Webhook URL:
                  </label>
                  <input
                    type="url"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/services/T.../B.../..."
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-xs font-mono focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Default Channel / Ping:
                  </label>
                  <input
                    type="text"
                    value={slackChannel}
                    onChange={(e) => setSlackChannel(e.target.value)}
                    placeholder="#general or @anurag"
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-xs font-medium focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Slack Connector</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: NOTION */}
        {activeTab === "notion" && (
          <form onSubmit={handleSaveNotion} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#111827]">
                    Notion Real Database Connector
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    Creates real meeting pages directly inside your Notion database
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  connections.notion.connected ? "bg-[#ECFDF5] text-[#059669]" : "bg-gray-100 text-gray-600"
                }`}>
                  {connections.notion.connected ? "Connected" : "Not connected"}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Notion Integration Token:
                  </label>
                  <input
                    type="password"
                    value={notionKey}
                    onChange={(e) => setNotionKey(e.target.value)}
                    placeholder="secret_..."
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-xs font-mono focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    Notion Database ID:
                  </label>
                  <input
                    type="text"
                    value={notionDb}
                    onChange={(e) => setNotionDb(e.target.value)}
                    placeholder="e.g. 1a2b3c4d5e6f..."
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-xs font-mono focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notion Connector</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: HUBSPOT */}
        {activeTab === "hubspot" && (
          <form onSubmit={handleSaveHubspot} className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#111827]">
                    HubSpot CRM Connector
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    Direct deal pipeline and contact milestone synchronization
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  connections.hubspot.connected ? "bg-[#ECFDF5] text-[#059669]" : "bg-gray-100 text-gray-600"
                }`}>
                  {connections.hubspot.connected ? "Connected" : "Not connected"}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="font-semibold text-[#374151] block mb-1">
                    HubSpot Private App Access Token:
                  </label>
                  <input
                    type="password"
                    value={hubspotKey}
                    onChange={(e) => setHubspotKey(e.target.value)}
                    placeholder="pat-na1-..."
                    className="w-full px-3 py-2 rounded-xl border border-[#D1D5DB] text-xs font-mono focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save HubSpot Connector</span>
              </button>
            </div>
          </form>
        )}

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
