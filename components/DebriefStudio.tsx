"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Mail,
  Calendar,
  FileText,
  Users,
  CheckSquare,
  Sparkles,
  Edit2,
  Check,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { ParsedDebriefState, StagedAction, AnnotatedSegment } from "@/lib/universalEntityEngine";

interface DebriefStudioProps {
  state: ParsedDebriefState;
  onChangeTranscript: (text: string) => void;
  onApproveAndSync: () => void;
  onEditActions: () => void;
  onTriggerAIGeneration?: () => void;
  isProcessing: boolean;
  isGroqConnected?: boolean;
}

export const DebriefStudio: React.FC<DebriefStudioProps> = ({
  state,
  onChangeTranscript,
  onApproveAndSync,
  onEditActions,
  onTriggerAIGeneration,
  isProcessing,
  isGroqConnected,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isEditingRaw, setIsEditingRaw] = useState(false);
  const [rawInputText, setRawInputText] = useState(state.rawText);
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setRawInputText(state.rawText);
  }, [state.rawText]);

  // Real-time microphone dictation using Web Speech API
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = "en-US";

          rec.onresult = (event: any) => {
            let transcriptText = "";
            for (let i = 0; i < event.results.length; i++) {
              transcriptText += event.results[i][0].transcript + " ";
            }
            const cleanText = transcriptText.trim();
            setRawInputText(cleanText);
            onChangeTranscript(cleanText);
          };

          rec.onerror = () => setIsRecording(false);
          rec.onend = () => setIsRecording(false);

          rec.start();
          recognitionRef.current = rec;
          setIsRecording(true);
        } catch (e) {
          setIsRecording(true);
        }
      } else {
        setIsRecording(true);
      }
    }
  };

  const getActionIcon = (iconType: string) => {
    switch (iconType) {
      case "mail":
        return <Mail className="w-4 h-4 text-[#3B4BF8]" />;
      case "calendar":
        return <Calendar className="w-4 h-4 text-[#3B4BF8]" />;
      case "file":
        return <FileText className="w-4 h-4 text-[#4B5563]" />;
      case "users":
        return <Users className="w-4 h-4 text-[#4B5563]" />;
      default:
        return <CheckSquare className="w-4 h-4 text-[#4B5563]" />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title & Subtitle (Exact typography match to Image 1) */}
      <div className="space-y-2.5 max-w-3xl">
        <h1 className="text-[38px] font-extrabold text-[#111827] tracking-tight leading-[1.12]">
          Hang up the call. Everything else is done.
        </h1>
        <p className="text-[15px] text-[#4B5563] leading-relaxed font-normal">
          Speak for 20 seconds after a call with Anuj, Sarah, or any client. Debrief drafts your email, books the follow-up, writes the notes and updates your CRM for you to approve.
        </p>
      </div>

      {/* 2-Card Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* CARD 1: Your Debrief */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-7 shadow-sm space-y-6 flex flex-col justify-between min-h-[460px]">
          
          {/* Header */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#111827]">Your debrief</span>
              {onTriggerAIGeneration && (
                <button
                  type="button"
                  onClick={onTriggerAIGeneration}
                  disabled={isProcessing}
                  className="px-2.5 py-0.5 rounded-full bg-[#EEF0FF] hover:bg-[#E0E4FF] text-[#3B4BF8] text-[11px] font-semibold flex items-center space-x-1 transition-all"
                  title="Ask AI to write custom email and actions for your prompt"
                >
                  {isProcessing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  <span>{isProcessing ? "AI Writing..." : "AI Generate Actions"}</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditingRaw(!isEditingRaw)}
                className="text-xs text-[#6B7280] hover:text-[#111827] flex items-center space-x-1"
                title="Edit transcript text manually"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingRaw ? "Done editing" : "Edit text"}</span>
              </button>
              <span className="text-[#9CA3AF]">•</span>
              <span className="text-[#9CA3AF] text-xs font-medium">
                {state.durationSeconds || 16}s spoken
              </span>
            </div>
          </div>

          {/* Interactive Text with Inline Highlight Entity Badges */}
          <div className="flex-1 py-2">
            {isEditingRaw ? (
              <div className="space-y-2">
                <textarea
                  rows={6}
                  value={rawInputText}
                  onChange={(e) => {
                    setRawInputText(e.target.value);
                    onChangeTranscript(e.target.value);
                  }}
                  className="w-full text-base sm:text-lg leading-relaxed text-[#1F2937] p-3 rounded-xl border border-[#D1D5DB] focus:outline-none focus:border-[#3B4BF8]"
                  placeholder="Speak or type: 'Write an email for Anuj considering our meeting about design engineering for our product, we agreed on X...'"
                />
                <p className="text-[11px] text-[#6B7280]">
                  💡 Tip: You can say real emails (e.g. <code>anuj@gmail.com</code>) or any friend's name and topic!
                </p>
              </div>
            ) : (
              <div className="text-[18px] sm:text-[19px] leading-[1.85] text-[#1F2937] font-normal selection:bg-[#EEF0FF]">
                {state.annotatedSegments.map((seg) => {
                  if (!seg.isEntity) {
                    return <span key={seg.id}>{seg.text}</span>;
                  }

                  // Inline Highlighted Entity Pill (Matching Image 1)
                  return (
                    <span
                      key={seg.id}
                      className="inline-flex items-center mx-1 my-0.5 px-2 py-0.5 rounded-lg bg-[#EEF0FF] text-[#3B4BF8] font-medium transition-all hover:bg-[#E0E4FF] cursor-default"
                    >
                      <span>{seg.text}</span>
                      {seg.badge && (
                        <span className="ml-1 px-1.5 py-0.2 bg-white text-[#4B5563] text-[10px] font-bold uppercase tracking-wider rounded border border-[#E0E4FF] shadow-2xs">
                          {seg.badge}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Bar: Mic + Waveform + Keyboard Shortcut */}
          <div className="bg-[#F8F9FA] rounded-2xl p-3 flex items-center justify-between border border-[#F3F4F6]">
            
            {/* Left: Mic Button */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-[#111827] text-white hover:bg-black"
                }`}
                title="Click to dictate post-call ramble"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Center: Waveform Bars (Exact blue/purple color match) */}
              <div className="flex items-center space-x-1 h-5">
                {[12, 18, 14, 20, 10, 16, 22, 14, 18, 12, 16, 8].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className={`w-0.5 bg-[#4353FF] rounded-full transition-all ${
                      isRecording ? "animate-[ff-pulse_0.8s_infinite_alternate]" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Keyboard Shortcut Badges */}
            <div className="text-[11px] text-[#6B7280] font-medium flex items-center space-x-1">
              <span>Hold</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E5E7EB] font-sans text-[10px] text-[#374151] font-semibold shadow-2xs">
                Fn
              </kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E5E7EB] font-sans text-[10px] text-[#374151] font-semibold shadow-2xs">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E5E7EB] font-sans text-[10px] text-[#374151] font-semibold shadow-2xs">
                Space
              </kbd>
            </div>

          </div>

        </div>

        {/* CARD 2: 5 Actions Ready */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-7 shadow-sm space-y-6 flex flex-col justify-between min-h-[460px]">
          
          {/* Header */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#111827]">
                {state.actions.length} actions ready
              </span>
              <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                Real Addresses
              </span>
            </div>
            <span className="text-[#9CA3AF] text-xs">
              Nothing is sent until you approve
            </span>
          </div>

          {/* Action Cards List (Exact match to Image 1) */}
          <div className="space-y-3.5 flex-1 py-1">
            {state.actions.map((act) => (
              <div
                key={act.id}
                onMouseEnter={() => setHoveredActionId(act.id)}
                onMouseLeave={() => setHoveredActionId(null)}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                  hoveredActionId === act.id
                    ? "bg-[#F5F6FF] border-[#3B4BF8]/40 shadow-xs"
                    : "bg-white border-transparent hover:bg-[#F9FAFB]"
                }`}
              >
                {/* Left: Icon in rounded square + Text */}
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    {getActionIcon(act.icon)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[13.5px] text-[#111827] truncate leading-tight">
                      {act.title}
                    </h4>
                    <p className="text-[12px] text-[#6B7280] truncate leading-normal">
                      {act.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right: Status Badge (Green pill matching Image 1) */}
                <div className="flex-shrink-0 ml-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[11px] font-semibold whitespace-nowrap">
                    {act.badgeText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
            
            {/* Edit actions button */}
            <button
              type="button"
              onClick={onEditActions}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#9CA3AF] text-[#111827] text-xs font-semibold shadow-2xs transition-all"
            >
              Edit destinations & text
            </button>

            {/* Approve and sync 5 actions (Vibrant royal blue button) */}
            <button
              type="button"
              onClick={onApproveAndSync}
              disabled={isProcessing || !state.actions.length}
              className="px-5 py-2.5 rounded-xl bg-[#3B4BF8] hover:bg-[#2B3BE5] text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-2"
            >
              <span>Approve and sync {state.actions.length} actions</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
