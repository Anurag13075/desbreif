import { PresetScenario, DebriefResult } from "./types";

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "sarah-pricing-approval",
    title: "Pricing Approved & Demo Scheduled",
    client: "Sarah Jenkins",
    role: "VP of Product at Acme Corp",
    callDuration: "18-minute Zoom Call",
    rambleTranscript:
      "Just got off the call with Sarah. She approved the pricing. We scheduled our next demo for Friday at 3:00 PM. I need to send her our proposal PDF by tomorrow noon, and remind Alex to prepare the contract.",
    tags: ["Enterprise Sale", "Pricing Approved", "Contract Prep"],
    summaryHighlight: "Sarah greenlit the $36k pricing tier. Product demo locked for Friday 3 PM.",
  },
  {
    id: "david-investor-sync",
    title: "Series A Diligence & Metric Deck",
    client: "David Vance",
    role: "Partner at Peak Horizon Ventures",
    callDuration: "25-minute Phone Call",
    rambleTranscript:
      "Wrapped up my sync with David Vance from Peak Horizon. Partner meeting went well, they want our updated cohort retention deck and ARR breakdown by Thursday evening. Let's schedule a 45-minute follow-up Q&A next Tuesday at 11 AM. Tell Rachel to pull the Stripe billing metrics tonight.",
    tags: ["Investor Diligence", "Metrics Deck", "Follow-up"],
    summaryHighlight: "Peak Horizon partner enthusiasm high. Cohort retention deck due Thursday.",
  },
  {
    id: "elena-client-redesign",
    title: "Design System Sign-off & Milestone 2",
    client: "Elena Rostova",
    role: "Head of Brand at Finova Global",
    callDuration: "32-minute Google Meet",
    rambleTranscript:
      "Had a great review with Elena from Finova. She signed off on the dark mode design tokens and typography hierarchy. We need to ship the Figma component library by Monday 2 PM, and book our engineering handoff call for next Wednesday at 10 AM. Ask Maya to export the svg icon assets today.",
    tags: ["Client Sign-off", "Figma Handoff", "Asset Export"],
    summaryHighlight: "Design tokens approved. Component library delivery set for Monday.",
  },
  {
    id: "marcus-engineering-sprint",
    title: "Sprint Architecture & Database Migration",
    client: "Marcus Chen",
    role: "Staff Infrastructure Engineer",
    callDuration: "15-minute Slack Huddle",
    rambleTranscript:
      "Quick huddle with Marcus on the PostgreSQL read-replica migration. Zero downtime strategy approved. We are doing the dry-run on staging this Saturday at 2 AM UTC. I promised to send him the rollback runbook by Friday 4 PM, and ping DevOps team to provision the additional RDS read instance.",
    tags: ["DevOps Sync", "Zero Downtime", "Runbook"],
    summaryHighlight: "Migration strategy ratified. Staging dry-run scheduled for Saturday.",
  },
];

export const DEFAULT_DEBRIEF_RESULT: DebriefResult = {
  id: "debrief_sarah_01",
  createdAt: "Just now",
  rawTranscript:
    "Just got off the call with Sarah. She approved the pricing. We scheduled our next demo for Friday at 3:00 PM. I need to send her our proposal PDF by tomorrow noon, and remind Alex to prepare the contract.",
  durationSeconds: 22,
  clientName: "Sarah Jenkins",
  companyName: "Acme Corp",
  executiveSummary:
    "Sarah Jenkins officially approved the annual enterprise pricing proposal ($36,000/yr). A 45-minute product walkthrough demo was locked for Friday at 3:00 PM. High buying intent confirmed; deal has entered final contract preparation stage.",
  keyDecisions: [
    "Annual enterprise pricing tier approved without discounting requests.",
    "Live technical product demo confirmed for Friday at 3:00 PM EST.",
    "Master Services Agreement & contract preparation initiated via Alex.",
  ],
  sentiment: "enthusiastic",
  emailDraft: {
    recipientName: "Sarah Jenkins",
    recipientEmail: "sarah.jenkins@acmecorp.com",
    subject: "Recap: Pricing Approval & Demo Details for Friday 3:00 PM",
    body: `Hi Sarah,

It was wonderful catching up today! I'm thrilled that you've approved the enterprise pricing tier for our rollout.

As discussed, I have scheduled our live product walkthrough demo for this Friday at 3:00 PM EST (Google Meet invite attached). 

I am finalizing our updated proposal PDF and will have that in your inbox tomorrow before 12:00 PM noon. In the meantime, our legal team is preparing the formal contract so we can ensure a seamless transition for your team.

Looking forward to Friday!

Warm regards,
Anurag Sharma
Founder & Lead Product Architect`,
    attachmentsMentioned: ["Enterprise_Proposal_Acme_2026.pdf"],
  },
  calendarEvent: {
    title: "Acme Corp Product Demo — Sarah Jenkins & Team",
    startDate: "Friday, Oct 30, 2026",
    startTime: "15:00",
    endTime: "15:45",
    durationMinutes: 45,
    location: "Google Meet (meet.google.com/xyz-debrief-demo)",
    attendees: ["sarah.jenkins@acmecorp.com", "you@startup.com", "alex@startup.com"],
    description:
      "Product demonstration and architecture deep-dive following pricing approval. Review deployment timelines and onboarding schedule.",
  },
  actionItems: [
    {
      id: "act-1",
      title: "Send updated proposal PDF to Sarah",
      assignee: "You",
      dueDate: "Tomorrow by 12:00 PM",
      priority: "high",
      completed: false,
      category: "Document",
    },
    {
      id: "act-2",
      title: "Remind Alex to prepare enterprise master service agreement contract",
      assignee: "Alex",
      dueDate: "Tomorrow by 5:00 PM",
      priority: "high",
      completed: false,
      category: "Handoff",
    },
    {
      id: "act-3",
      title: "Prep custom staging environment with Acme branding for Friday demo",
      assignee: "You",
      dueDate: "Friday by 1:00 PM",
      priority: "medium",
      completed: false,
      category: "General",
    },
  ],
  crmUpdate: {
    clientName: "Sarah Jenkins",
    companyName: "Acme Corp",
    dealStage: "Pricing Approved",
    dealValue: "$36,000 / year",
    sentiment: "enthusiastic",
    keyDecision: "Pricing approved without revision. Contract generation underway.",
    nextStepSummary: "Deliver proposal PDF by noon tomorrow; conduct live demo Friday 3 PM.",
  },
  teamHandoff: {
    targetPerson: "Alex (Legal / Ops)",
    role: "Contract Operations",
    messageSnippet:
      "Hey Alex! Just wrapped up with Sarah from Acme Corp — she approved the annual pricing tier. Could you please generate the enterprise MSA contract template so we can send it right after Friday's 3 PM demo? Thanks!",
  },
};
