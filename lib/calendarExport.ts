import { CalendarEvent } from "./types";

/**
 * Generates an active 1-click Google Calendar web scheduling URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const baseUrl = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams();

  params.set("action", "TEMPLATE");
  params.set("text", event.title);

  // Format dates: YYYYMMDDTHHMMSSZ or compact ISO format
  // We compute a realistic upcoming Friday or parse date
  const now = new Date();
  const targetDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days out
  
  const [startHour, startMin] = (event.startTime || "15:00").split(":").map(Number);
  targetDate.setHours(startHour || 15, startMin || 0, 0, 0);

  const endDate = new Date(targetDate.getTime() + (event.durationMinutes || 45) * 60 * 1000);

  const formatIsoForGCal = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, "");

  params.set("dates", `${formatIsoForGCal(targetDate)}/${formatIsoForGCal(endDate)}`);
  params.set("details", `${event.description}\n\nGenerated automatically via Debrief (Wispr Flow)`);
  params.set("location", event.location || "Google Meet");

  if (event.attendees && event.attendees.length > 0) {
    params.set("add", event.attendees.join(","));
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generates standard RFC 5545 iCalendar (.ics) content for Apple Calendar, Outlook, and Google Calendar
 */
export function generateIcsFileContent(event: CalendarEvent): string {
  const now = new Date();
  const targetDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const [startHour, startMin] = (event.startTime || "15:00").split(":").map(Number);
  targetDate.setHours(startHour || 15, startMin || 0, 0, 0);

  const endDate = new Date(targetDate.getTime() + (event.durationMinutes || 45) * 60 * 1000);

  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Debrief Auto-Pilot//Wispr Flow Voice//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:debrief-${Date.now()}@wisprflow.ai`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `DTSTART:${formatIcsDate(targetDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${event.title.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n").replace(/,/g, "\\,")}`,
    `LOCATION:${event.location.replace(/,/g, "\\,")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return icsLines.join("\r\n");
}

/**
 * Triggers a browser file download of the generated .ics file
 */
export function downloadIcsFile(event: CalendarEvent): void {
  const content = generateIcsFileContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_invite.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
