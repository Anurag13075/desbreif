"use client";

import React, { useState } from "react";
import { X, Save, Edit3, Mail, Calendar, FileText, Users, CheckSquare } from "lucide-react";
import { StagedAction } from "@/lib/universalEntityEngine";
import { saveContact } from "@/lib/contacts";

interface ActionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: StagedAction[];
  onSaveActions: (updatedActions: StagedAction[]) => void;
}

export const ActionEditorModal: React.FC<ActionEditorModalProps> = ({
  isOpen,
  onClose,
  actions,
  onSaveActions,
}) => {
  const [editedActions, setEditedActions] = useState<StagedAction[]>(actions);

  if (!isOpen) return null;

  const handleTitleChange = (id: string, newTitle: string) => {
    setEditedActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, title: newTitle } : act))
    );
  };

  const handleSubtitleChange = (id: string, newSub: string) => {
    setEditedActions((prev) =>
      prev.map((act) => (act.id === id ? { ...act, subtitle: newSub } : act))
    );
  };

  const handlePayloadChange = (id: string, field: string, val: any) => {
    setEditedActions((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          return {
            ...act,
            payload: {
              ...act.payload,
              [field]: val,
            },
          };
        }
        return act;
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save contact email if email action exists
    const emailAction = editedActions.find((a) => a.type === "email");
    if (emailAction?.payload?.recipientName && emailAction?.payload?.recipientEmail) {
      saveContact(emailAction.payload.recipientName, emailAction.payload.recipientEmail);
    }
    onSaveActions(editedActions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#EEF0FF] text-[#3B4BF8] flex items-center justify-center font-bold text-xs">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#111827]">
                Edit Destination Details & Message Copy
              </h3>
              <p className="text-xs text-[#6B7280]">
                Customize recipient email, meeting times, and teammate delegation before syncing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            {editedActions.map((act, idx) => (
              <div key={act.id} className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#3B4BF8] uppercase tracking-wider block">
                    Action {idx + 1}: {act.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-medium">{act.subtitle}</span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                    Display Title
                  </label>
                  <input
                    type="text"
                    value={act.title}
                    onChange={(e) => handleTitleChange(act.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>

                {/* Email specific field edits */}
                {act.type === "email" && act.payload && (
                  <div className="space-y-2 pt-1 border-t border-[#E5E7EB]">
                    <div>
                      <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                        Recipient Real Email Address
                      </label>
                      <input
                        type="email"
                        value={act.payload.recipientEmail || ""}
                        onChange={(e) => handlePayloadChange(act.id, "recipientEmail", e.target.value)}
                        placeholder="e.g. anuj@gmail.com, anurag@outlook.com"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:border-[#3B4BF8]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        value={act.payload.subject || ""}
                        onChange={(e) => handlePayloadChange(act.id, "subject", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:border-[#3B4BF8]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                        Email Body
                      </label>
                      <textarea
                        rows={4}
                        value={act.payload.body || ""}
                        onChange={(e) => handlePayloadChange(act.id, "body", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-xs text-[#111827] font-sans focus:outline-none focus:border-[#3B4BF8]"
                      />
                    </div>
                  </div>
                )}

                {/* Task/Slack specific field edits */}
                {act.type === "task" && act.payload && (
                  <div className="space-y-2 pt-1 border-t border-[#E5E7EB]">
                    <div>
                      <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                        Slack / Ping Message
                      </label>
                      <textarea
                        rows={3}
                        value={act.payload.slackMessage || ""}
                        onChange={(e) => handlePayloadChange(act.id, "slackMessage", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-xs text-[#111827] font-mono focus:outline-none focus:border-[#3B4BF8]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Save */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B7280] hover:text-[#111827]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
