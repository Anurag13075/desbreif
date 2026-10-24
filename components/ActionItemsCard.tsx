"use client";

import React, { useState } from "react";
import { CheckSquare, Square, User, Clock, Copy, Check, Tag, ArrowUpRight } from "lucide-react";
import { ActionItem } from "@/lib/types";

interface ActionItemsCardProps {
  items: ActionItem[];
  onToggleItem: (id: string) => void;
}

export const ActionItemsCard: React.FC<ActionItemsCardProps> = ({ items, onToggleItem }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyForNotion = () => {
    const formatted = items
      .map(
        (it) =>
          `[${it.completed ? "x" : " "}] ${it.title} (@${it.assignee} - Due: ${it.dueDate}) [Priority: ${it.priority.toUpperCase()}]`
      )
      .join("\n");

    navigator.clipboard.writeText(`### Debrief Action Items\n${formatted}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const completedCount = items.filter((it) => it.completed).length;

  return (
    <div className="bg-white rounded-3xl border border-wispr-border shadow-card p-6 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-wispr-border/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs shadow-sm">
            <CheckSquare className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-lg font-bold text-wispr-ink leading-tight">
                Delegated Action Items
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-wispr-sand text-[10px] font-bold text-wispr-ink">
                {completedCount}/{items.length} Done
              </span>
            </div>
            <p className="text-[11px] text-wispr-muted">
              Auto-assigned with deadlines & priority rankings
            </p>
          </div>
        </div>

        {/* Copy for Notion / Linear */}
        <button
          onClick={handleCopyForNotion}
          className="px-3 py-1.5 rounded-xl border border-wispr-border hover:border-wispr-ink text-xs font-semibold text-wispr-ink bg-white flex items-center space-x-1.5 transition-all shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-wispr-muted" />}
          <span>{copied ? "Copied Markdown!" : "Copy for Notion / Linear"}</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
              item.completed
                ? "bg-wispr-sand/30 border-wispr-border/50 opacity-60"
                : "bg-white border-wispr-border hover:border-wispr-ink shadow-sm"
            }`}
          >
            {/* Checkbox Icon */}
            <div className="mt-0.5 flex-shrink-0">
              {item.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" />
              ) : (
                <Square className="w-4 h-4 text-wispr-muted" />
              )}
            </div>

            {/* Content & Metadata */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <p
                className={`text-xs sm:text-sm font-medium text-wispr-ink leading-snug ${
                  item.completed ? "line-through text-wispr-muted" : ""
                }`}
              >
                {item.title}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {/* Assignee Badge */}
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-wispr-sand text-wispr-ink font-semibold border border-wispr-border/70">
                  <User className="w-3 h-3 text-wispr-muted" />
                  <span>Assignee: {item.assignee}</span>
                </span>

                {/* Due Date */}
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-wispr-sand/60 text-wispr-muted font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{item.dueDate}</span>
                </span>

                {/* Priority */}
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(
                    item.priority
                  )}`}
                >
                  {item.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
