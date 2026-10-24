"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, ExternalLink, Paperclip, Send } from "lucide-react";
import { DraftEmail } from "@/lib/types";
import { generateGmailWebUrl, generateMailtoUrl, formatEmailForClipboard } from "@/lib/emailExport";

interface DraftEmailCardProps {
  email: DraftEmail;
  clientName: string;
}

export const DraftEmailCard: React.FC<DraftEmailCardProps> = ({ email, clientName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatEmailForClipboard(email));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gmailUrl = generateGmailWebUrl(email);
  const mailtoUrl = generateMailtoUrl(email);

  return (
    <div className="bg-white rounded-3xl border border-wispr-border shadow-card p-6 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-wispr-border/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs shadow-sm">
            <Mail className="w-4 h-4 text-purple-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-lg font-bold text-wispr-ink leading-tight">
                Draft Follow-Up Email
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-wispr-sand text-[10px] font-bold text-wispr-muted">
                1-Click Ready
              </span>
            </div>
            <p className="text-[11px] text-wispr-muted">
              Auto-composed for {email.recipientName || clientName}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl border border-wispr-border hover:border-wispr-ink text-xs font-semibold text-wispr-ink bg-white flex items-center space-x-1.5 transition-all shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-wispr-muted" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-wispr-lavender hover:bg-wispr-lavender-hover text-wispr-ink font-bold text-xs border-1.5 border-wispr-ink shadow-tactile flex items-center space-x-1.5 transition-all"
          >
            <Send className="w-3 h-3 text-purple-900" />
            <span>Open in Gmail</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Email Meta Bar */}
      <div className="space-y-2 text-xs bg-wispr-sand/30 p-3 rounded-2xl border border-wispr-border/70">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-wispr-muted w-14">To:</span>
          <span className="font-medium text-wispr-ink bg-white px-2 py-0.5 rounded-lg border border-wispr-border/80">
            {email.recipientName} &lt;{email.recipientEmail}&gt;
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-wispr-muted w-14">Subject:</span>
          <span className="font-semibold text-wispr-ink">{email.subject}</span>
        </div>
      </div>

      {/* Email Body Preview */}
      <div className="bg-white p-4 rounded-2xl border border-wispr-border/80 text-xs sm:text-sm text-wispr-ink leading-relaxed whitespace-pre-line font-normal">
        {email.body}
      </div>

      {/* Attachments Staged */}
      {email.attachmentsMentioned && email.attachmentsMentioned.length > 0 && (
        <div className="flex items-center space-x-2 text-xs text-wispr-muted pt-1">
          <Paperclip className="w-3.5 h-3.5 text-wispr-muted" />
          <span className="font-semibold">Staged Attachment:</span>
          <span className="px-2 py-0.5 rounded-lg bg-wispr-sand text-wispr-ink font-mono text-[11px] border border-wispr-border">
            {email.attachmentsMentioned[0]}
          </span>
        </div>
      )}

      {/* Mailto fallback link */}
      <div className="pt-1 flex justify-end">
        <a
          href={mailtoUrl}
          className="text-[11px] text-wispr-muted hover:text-wispr-ink underline flex items-center space-x-1"
        >
          <span>Open with desktop mail client (Apple Mail / Outlook)</span>
        </a>
      </div>

    </div>
  );
};
