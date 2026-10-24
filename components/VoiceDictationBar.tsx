"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, Volume2, RotateCcw, ArrowRight, Clock, Zap } from "lucide-react";
import { PRESET_SCENARIOS } from "@/lib/presetScenarios";

interface VoiceDictationBarProps {
  transcript: string;
  onChangeTranscript: (text: string) => void;
  onProcessDebrief: (text: string) => void;
  isProcessing: boolean;
  onSelectScenario: (scenarioId: string) => void;
  activeScenarioId: string;
}

export const VoiceDictationBar: React.FC<VoiceDictationBarProps> = ({
  transcript,
  onChangeTranscript,
  onProcessDebrief,
  isProcessing,
  onSelectScenario,
  activeScenarioId,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(22);
  const recognitionRef = useRef<any>(null);

  // Microphone toggle using native Web Speech Recognition if available
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
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "en-US";

          recognition.onresult = (event: any) => {
            let current = "";
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript + " ";
            }
            onChangeTranscript(current.trim());
          };

          recognition.onerror = () => {
            setIsRecording(false);
          };

          recognition.onend = () => {
            setIsRecording(false);
          };

          recognition.start();
          recognitionRef.current = recognition;
          setIsRecording(true);
        } catch (e) {
          setIsRecording(true);
        }
      } else {
        // Fallback simulated recording mode
        setIsRecording(true);
      }
    }
  };

  // Timer simulation during recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim() || isProcessing) return;
    onProcessDebrief(transcript.trim());
  };

  return (
    <div className="bg-white rounded-3xl border border-wispr-border shadow-card p-5 sm:p-6 space-y-4">
      
      {/* Top Banner: Voice Status & Wispr Key Directive */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-wispr-border/70">
        <div className="flex items-center space-x-3">
          {/* Animated Waveform Icon */}
          <div className="flex items-center space-x-1 h-6 px-2.5 py-1 rounded-xl bg-wispr-sand border border-wispr-border">
            <span
              className={`w-1 bg-wispr-ink rounded-full transition-all ${
                isRecording || isProcessing
                  ? "h-4 animate-[ff-pulse_0.6s_infinite_alternate]"
                  : "h-2.5"
              }`}
            />
            <span
              className={`w-1 bg-wispr-ink rounded-full transition-all ${
                isRecording || isProcessing
                  ? "h-5 animate-[ff-pulse_0.8s_0.15s_infinite_alternate]"
                  : "h-4"
              }`}
            />
            <span
              className={`w-1 bg-wispr-ink rounded-full transition-all ${
                isRecording || isProcessing
                  ? "h-3 animate-[ff-pulse_0.5s_0.3s_infinite_alternate]"
                  : "h-2"
              }`}
            />
            <span
              className={`w-1 bg-wispr-ink rounded-full transition-all ${
                isRecording || isProcessing
                  ? "h-4 animate-[ff-pulse_0.7s_0.2s_infinite_alternate]"
                  : "h-3"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-wispr-ink flex items-center space-x-1.5">
              <span>Voice Ramble Input</span>
              {isRecording && (
                <span className="inline-flex items-center text-[10px] text-red-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-1" />
                  Recording Live
                </span>
              )}
            </span>
            <span className="text-[11px] text-wispr-muted">
              Speak or paste your 20-second post-call brain dump
            </span>
          </div>
        </div>

        {/* Wispr Hotkey Badge */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-wispr-muted text-[11px] hidden sm:inline">Wispr Hotkey:</span>
          <kbd className="px-2 py-1 rounded-lg bg-wispr-sand text-wispr-ink font-mono text-[11px] font-semibold border border-wispr-border shadow-tactile">
            Hold Fn / Ctrl + Space
          </kbd>
        </div>
      </div>

      {/* Main Textarea Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => onChangeTranscript(e.target.value)}
            placeholder='e.g. "Just got off the call with Sarah. She approved the pricing. We scheduled our next demo for Friday at 3:00 PM. I need to send her our proposal PDF by tomorrow noon, and remind Alex to prepare the contract."'
            className="w-full p-4 rounded-2xl bg-wispr-sand/30 border border-wispr-border text-sm text-wispr-ink font-sans focus:outline-none focus:bg-white focus:border-wispr-ink focus:ring-1 focus:ring-wispr-ink/20 transition-all leading-relaxed placeholder:text-wispr-muted/70"
          />

          {/* Character / Word count badge */}
          <div className="absolute right-3 bottom-3 flex items-center space-x-2 text-[10px] font-mono text-wispr-muted pointer-events-none">
            <Clock className="w-3 h-3" />
            <span>~{Math.max(8, Math.round(transcript.split(" ").filter(Boolean).length / 2.5))}s spoken</span>
          </div>
        </div>

        {/* Quick Scenario Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-wispr-muted text-[11px] font-semibold whitespace-nowrap">
            Try Sample:
          </span>
          {PRESET_SCENARIOS.map((sc) => {
            const isActive = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectScenario(sc.id)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? "bg-wispr-lavender text-wispr-ink border-wispr-ink shadow-tactile"
                    : "bg-white text-wispr-muted border-wispr-border hover:border-wispr-ink hover:text-wispr-ink"
                }`}
              >
                <span>{sc.client.split(" ")[0]}</span>
                <span className="text-[10px] opacity-70">({sc.tags[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions: Mic Button + Auto-Pilot Execution CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          {/* Mic Toggle Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
              isRecording
                ? "bg-red-50 text-red-700 border-red-300 shadow-sm animate-pulse"
                : "bg-white text-wispr-ink border-wispr-border hover:border-wispr-ink shadow-tactile"
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4 text-wispr-ink" />}
            <span>{isRecording ? `Stop Dictation (${recordingSeconds}s)` : "Speak with Microphone"}</span>
          </button>

          {/* Execute CTA */}
          <button
            type="submit"
            disabled={!transcript.trim() || isProcessing}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
              !transcript.trim() || isProcessing
                ? "bg-wispr-sand text-wispr-muted border border-wispr-border cursor-not-allowed"
                : "bg-wispr-lavender hover:bg-wispr-lavender-hover text-wispr-ink border-1.5 border-wispr-ink shadow-tactile hover:shadow-tactile-hover active:translate-y-0.5"
            }`}
          >
            {isProcessing ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-purple-700" />
                <span>Auto-Pilot Staging 5 Apps...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-800" />
                <span>Auto-Pilot Debrief in 30s</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
