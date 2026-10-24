"use client";

import React from "react";
import { Calendar, Clock, Video, Users, Download, ExternalLink, Check } from "lucide-react";
import { CalendarEvent } from "@/lib/types";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendarExport";

interface CalendarScheduleCardProps {
  event: CalendarEvent;
}

export const CalendarScheduleCard: React.FC<CalendarScheduleCardProps> = ({ event }) => {
  const googleCalendarUrl = generateGoogleCalendarUrl(event);

  const handleDownload = () => {
    downloadIcsFile(event);
  };

  return (
    <div className="bg-white rounded-3xl border border-wispr-border shadow-card p-6 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-wispr-border/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs shadow-sm">
            <Calendar className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-lg font-bold text-wispr-ink leading-tight">
                Calendar Auto-Scheduler
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                Follow-up Staged
              </span>
            </div>
            <p className="text-[11px] text-wispr-muted">
              Auto-configured for Friday at 3:00 PM
            </p>
          </div>
        </div>

        {/* 1-Click Scheduling Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-xl border border-wispr-border hover:border-wispr-ink text-xs font-semibold text-wispr-ink bg-white flex items-center space-x-1.5 transition-all shadow-sm"
            title="Download standard .ics iCalendar file for Apple Calendar or Outlook"
          >
            <Download className="w-3.5 h-3.5 text-wispr-muted" />
            <span>.ICS File</span>
          </button>

          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-wispr-lavender hover:bg-wispr-lavender-hover text-wispr-ink font-bold text-xs border-1.5 border-wispr-ink shadow-tactile flex items-center space-x-1.5 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-900" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Ticket Preview Box */}
      <div className="bg-wispr-sand/30 p-4 rounded-2xl border border-wispr-border/80 space-y-3">
        
        {/* Title & Badge */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm text-wispr-ink leading-snug">
            {event.title}
          </h4>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold whitespace-nowrap">
            45 min
          </span>
        </div>

        {/* Date, Time, Location details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-wispr-border/60">
            <Clock className="w-3.5 h-3.5 text-wispr-green" />
            <div>
              <span className="font-bold text-wispr-ink">{event.startDate}</span>
              <span className="text-wispr-muted ml-1">@ {event.startTime} - {event.endTime}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-wispr-border/60">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium text-wispr-ink truncate">{event.location}</span>
          </div>
        </div>

        {/* Attendees */}
        <div className="flex items-center space-x-2 text-xs pt-1">
          <Users className="w-3.5 h-3.5 text-wispr-muted flex-shrink-0" />
          <span className="text-wispr-muted font-medium">Invited:</span>
          <div className="flex flex-wrap gap-1.5">
            {event.attendees.map((attendee, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-white border border-wispr-border/70 text-[11px] font-mono text-wispr-ink"
              >
                {attendee}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
