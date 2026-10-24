"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  CheckCircle2,
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
  Check,
  Plus,
  SlidersHorizontal,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { CONNECTOR_CATALOG, ConnectorDef } from "@/lib/connectors/catalog";
import {
  getAllSavedConfigs,
  saveConnectorConfig,
  isConnectorConfigured,
} from "@/lib/connectors/multiConnectorEngine";

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionsUpdated?: () => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({
  isOpen,
  onClose,
  onConnectionsUpdated,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeConnector, setActiveConnector] = useState<ConnectorDef | null>(null);
  const [connectorForm, setConnectorForm] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [allConfigs, setAllConfigs] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setAllConfigs(getAllSavedConfigs());
      setActiveConnector(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter connectors
  const filteredConnectors = CONNECTOR_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenConfigure = (connector: ConnectorDef) => {
    setActiveConnector(connector);
    const existing = allConfigs[connector.id] || {};
    setConnectorForm(existing);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConnector) return;

    saveConnectorConfig(activeConnector.id, connectorForm);
    setAllConfigs(getAllSavedConfigs());
    setToastMessage(`Saved configuration for ${activeConnector.name}!`);
    setTimeout(() => {
      setToastMessage(null);
      setActiveConnector(null);
    }, 1000);
    if (onConnectionsUpdated) onConnectionsUpdated();
  };

  const categories = [
    { id: "all", label: "All Connectors", count: CONNECTOR_CATALOG.length },
    { id: "communication", label: "Communication", count: 6 },
    { id: "calendar", label: "Calendar", count: 4 },
    { id: "notes", label: "Notes & Docs", count: 5 },
    { id: "tasks", label: "Tasks & PM", count: 5 },
    { id: "crm", label: "CRM & Sales", count: 5 },
    { id: "engineering", label: "Engineering", count: 4 },
    { id: "finance", label: "Finance & Webhooks", count: 3 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-3xl w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#3B4BF8] flex items-center justify-center shadow-xs">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-[#111827]">
                  Real App Connectors Marketplace
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[11px] font-bold">
                  32 Live Connectors
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Configure once. Debrief dispatches real emails, events, issues & tasks directly into your daily apps.
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
          <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* VIEW 1: Individual Connector Config Form */}
        {activeConnector ? (
          <div className="space-y-4 animate-in slide-in-from-right-4 duration-150">
            <button
              onClick={() => setActiveConnector(null)}
              className="text-xs text-[#6B7280] hover:text-[#111827] flex items-center space-x-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All 32 Connectors</span>
            </button>

            <form onSubmit={handleSaveConfig} className="p-5 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center space-x-3">
                  <div
                    style={{ backgroundColor: activeConnector.color }}
                    className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-xs"
                  >
                    {activeConnector.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#111827]">
                      {activeConnector.name}
                    </h4>
                    <p className="text-xs text-[#6B7280]">{activeConnector.description}</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-[#6B7280] bg-white px-2 py-1 rounded border border-[#E5E7EB]">
                  {activeConnector.authType.toUpperCase()}
                </span>
              </div>

              {activeConnector.fields.length === 0 ? (
                <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] text-xs text-[#4B5563]">
                  ✅ This connector operates via standardized local protocols (.ICS or OS deep link) and requires no API keys!
                </div>
              ) : (
                <div className="space-y-3">
                  {activeConnector.fields.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <label className="text-xs font-semibold text-[#374151] block">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        value={connectorForm[f.key] || ""}
                        onChange={(e) =>
                          setConnectorForm({ ...connectorForm, [f.key]: e.target.value })
                        }
                        placeholder={f.placeholder}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D1D5DB] text-xs font-medium focus:outline-none focus:border-[#3B4BF8]"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveConnector(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#111827]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save {activeConnector.name} Connector</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* VIEW 2: 32 Connectors Marketplace Grid */
          <div className="space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 32 apps (e.g. Gmail, Slack, WhatsApp, GitHub, Notion, Stripe)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-medium focus:outline-none focus:border-[#3B4BF8] focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-semibold text-[#374151] focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 32 Connectors Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {filteredConnectors.map((c) => {
                const isConn = isConnectorConfigured(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleOpenConfigure(c)}
                    className="p-3.5 rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#3B4BF8]/50 hover:bg-[#F9FAFB] cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        style={{ backgroundColor: c.color }}
                        className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs"
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-xs text-[#111827] group-hover:text-[#3B4BF8] transition-colors truncate">
                            {c.name}
                          </h4>
                          {isConn ? (
                            <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" title="Connected"></span>
                          ) : null}
                        </div>
                        <p className="text-[11px] text-[#6B7280] truncate leading-normal">
                          {c.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 ml-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isConn ? "bg-[#ECFDF5] text-[#059669]" : "bg-gray-100 text-gray-600 group-hover:bg-[#EEF0FF] group-hover:text-[#3B4BF8]"
                      }`}>
                        {isConn ? "Connected" : "Connect"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-[#E5E7EB] text-xs text-[#6B7280]">
          <span>
            Connected to <strong>{Object.keys(allConfigs).length}</strong> of 32 real applications
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
