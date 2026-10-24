"use client";

import React, { useState } from "react";
import { X, Save, Edit3 } from "lucide-react";
import { StagedAction } from "@/lib/universalEntityEngine";

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
                Edit Staged Actions
              </h3>
              <p className="text-xs text-[#6B7280]">
                Customize recipient, meeting times, or delegations before syncing
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
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {editedActions.map((act, idx) => (
              <div key={act.id} className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
                <span className="text-[11px] font-bold text-[#3B4BF8] uppercase tracking-wider block">
                  Action {idx + 1}: {act.type.toUpperCase()}
                </span>

                <div>
                  <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                    Action Title
                  </label>
                  <input
                    type="text"
                    value={act.title}
                    onChange={(e) => handleTitleChange(act.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-xs text-[#111827] focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#374151] block mb-1">
                    Details / Timing
                  </label>
                  <input
                    type="text"
                    value={act.subtitle}
                    onChange={(e) => handleSubtitleChange(act.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-xs text-[#4B5563] focus:outline-none focus:border-[#3B4BF8]"
                  />
                </div>
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
