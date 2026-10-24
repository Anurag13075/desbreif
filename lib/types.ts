export type PriorityLevel = "urgent" | "high" | "medium" | "low";
export type SentimentType = "enthusiastic" | "positive" | "cautious" | "urgent" | "neutral";
export type DealStage =
  | "Discovery"
  | "Demo Scheduled"
  | "Pricing Approved"
  | "Contract Review"
  | "Closed Won"
  | "Follow-up Required";

export interface ActionItem {
  id: string;
  title: string;
  assignee: string; // e.g. "You", "Alex", "Design Team"
  dueDate: string; // e.g. "Tomorrow by 12:00 PM", "Friday 5:00 PM"
  priority: PriorityLevel;
  completed: boolean;
  category?: "Email" | "Document" | "Handoff" | "Calendar" | "General";
}

export interface CalendarEvent {
  title: string;
  startDate: string; // ISO date or "Friday, Oct 24, 2026"
  startTime: string; // e.g. "15:00"
  endTime: string; // e.g. "15:45"
  durationMinutes: number;
  location: string; // e.g. "Google Meet"
  attendees: string[]; // e.g. ["sarah.jenkins@acme.com", "you@startup.com"]
  description: string;
}

export interface DraftEmail {
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  attachmentsMentioned?: string[];
}

export interface CrmUpdate {
  clientName: string;
  companyName: string;
  dealStage: DealStage;
  dealValue?: string; // e.g. "$24,000 / year"
  sentiment: SentimentType;
  keyDecision: string;
  nextStepSummary: string;
}

export interface TeamHandoff {
  targetPerson: string; // e.g. "Alex"
  role: string; // e.g. "Legal / Contracts"
  messageSnippet: string; // Formatted ready-to-send Slack message
}

export interface DebriefResult {
  id: string;
  createdAt: string;
  rawTranscript: string;
  durationSeconds: number;
  clientName: string;
  companyName: string;
  executiveSummary: string;
  keyDecisions: string[];
  sentiment: SentimentType;
  emailDraft: DraftEmail;
  calendarEvent: CalendarEvent;
  actionItems: ActionItem[];
  crmUpdate: CrmUpdate;
  teamHandoff: TeamHandoff;
}

export interface PresetScenario {
  id: string;
  title: string;
  client: string;
  role: string;
  callDuration: string;
  rambleTranscript: string;
  tags: string[];
  summaryHighlight: string;
}
