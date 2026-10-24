"use client";

import React, { useState } from "react";
import { Key, X, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck, Zap } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string, model: string) => void;
  currentModel: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  currentModel,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [selectedModel, setSelectedModel] = useState(currentModel || "llama-3.3-70b-versatile");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim(), selectedModel);
    setStatusMessage("Settings saved successfully!");
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-wispr-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-wispr-border shadow-dropdown max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-wispr-border/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-wispr-ink text-wispr-cream flex items-center justify-center font-bold text-xs shadow-tactile">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-wispr-ink">
                Groq AI LPU Configuration
              </h3>
              <p className="text-[11px] text-wispr-muted">
                Zero-latency structured reasoning for voice debriefs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-wispr-sand hover:bg-wispr-sand-dark text-wispr-ink flex items-center justify-center text-xs font-bold transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Active Model */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-wispr-ink block">
              Active LPU Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-wispr-sand/30 border border-wispr-border text-xs text-wispr-ink focus:outline-none focus:border-wispr-ink focus:bg-white font-medium cursor-pointer"
            >
              <option value="llama-3.3-70b-versatile">
                Llama 3.3 70B Versatile (Default • Recommended Production Model)
              </option>
              <option value="llama-3.1-8b-instant">
                Llama 3.1 8B Instant (Ultra-Fast Extraction • Sub-300ms)
              </option>
              <option value="openai/gpt-oss-120b">
                OpenAI GPT-OSS 120B (Reasoning & Tool Use)
              </option>
              <option value="openai/gpt-oss-20b">
                OpenAI GPT-OSS 20B (MoE Compact)
              </option>
            </select>
          </div>

          {/* Groq Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-wispr-ink">
                Groq API Key (starts with gsk_)
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-wispr-green hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-wispr-sand/30 border border-wispr-border text-xs font-mono text-wispr-ink focus:outline-none focus:border-wispr-ink focus:bg-white"
            />
            <p className="text-[11px] text-wispr-muted">
              Keys are stored strictly inside your browser's local storage.
            </p>
          </div>

          {/* Fallback Notice */}
          <div className="p-3 rounded-xl bg-wispr-sand/40 border border-wispr-border/70 text-[11px] text-wispr-muted leading-relaxed flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-wispr-green flex-shrink-0 mt-0.5" />
            <span>
              If no API key is entered, Debrief automatically uses our built-in high-precision neural synthesizer so you can experience full end-to-end auto-pilot without setup.
            </span>
          </div>

          {statusMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Footer Save CTA */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-wispr-muted hover:text-wispr-ink"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-wispr-lavender hover:bg-wispr-lavender-hover text-wispr-ink font-bold text-xs border-1.5 border-wispr-ink shadow-tactile transition-all"
            >
              Save Configuration
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
