/**
 * 32 Real App Connectors Catalog
 * Comprehensive directory of real daily-life productivity, work, CRM, and communication tools.
 */

export interface ConnectorDef {
  id: string;
  name: string;
  category: "communication" | "calendar" | "notes" | "tasks" | "crm" | "engineering" | "finance";
  description: string;
  iconName: string;
  color: string;
  authType: "oauth" | "webhook" | "api_key" | "deeplink";
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "password" | "url";
  }[];
}

export const CONNECTOR_CATALOG: ConnectorDef[] = [
  // 1. COMMUNICATION
  {
    id: "gmail",
    name: "Gmail",
    category: "communication",
    description: "Read contacts and send real emails or create drafts directly in your Google inbox.",
    iconName: "Mail",
    color: "#EA4335",
    authType: "oauth",
    fields: [
      { key: "email", label: "Gmail Address", placeholder: "you@gmail.com", type: "text" },
      { key: "token", label: "Google OAuth Token (Optional)", placeholder: "ya29...", type: "password" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    category: "communication",
    description: "Post automated debrief recaps and teammate delegation pings to any channel or DM.",
    iconName: "MessageSquare",
    color: "#4A154B",
    authType: "webhook",
    fields: [
      { key: "webhookUrl", label: "Incoming Webhook URL", placeholder: "https://hooks.slack.com/services/...", type: "url" },
      { key: "channel", label: "Channel or Handle", placeholder: "#general or @teammate", type: "text" },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "communication",
    description: "Generate 1-click WhatsApp web chats and direct messages for clients and team.",
    iconName: "PhoneCall",
    color: "#25D366",
    authType: "deeplink",
    fields: [
      { key: "phone", label: "Default Phone Number (with country code)", placeholder: "+919876543210", type: "text" },
    ],
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    category: "communication",
    description: "Create Office 365 email drafts and schedule meetings in Microsoft 365.",
    iconName: "Mail",
    color: "#0078D4",
    authType: "api_key",
    fields: [
      { key: "email", label: "Outlook / 365 Email", placeholder: "you@outlook.com", type: "text" },
      { key: "apiKey", label: "Microsoft Graph Token (Optional)", placeholder: "EwB...", type: "password" },
    ],
  },
  {
    id: "discord",
    name: "Discord",
    category: "communication",
    description: "Post call recaps, deal announcements, and sprint handoffs to Discord server channels.",
    iconName: "MessageCircle",
    color: "#5865F2",
    authType: "webhook",
    fields: [
      { key: "webhookUrl", label: "Discord Webhook URL", placeholder: "https://discord.com/api/webhooks/...", type: "url" },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "communication",
    description: "Instant post-call telegram alert to your personal bot or team group chat.",
    iconName: "Send",
    color: "#229ED9",
    authType: "api_key",
    fields: [
      { key: "botToken", label: "Telegram Bot Token", placeholder: "123456:ABC-DEF...", type: "password" },
      { key: "chatId", label: "Chat ID", placeholder: "@yourchannel or 12345678", type: "text" },
    ],
  },

  // 2. CALENDAR & SCHEDULING
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "calendar",
    description: "Check schedule conflicts in real-time, generate Google Meet links, and book events.",
    iconName: "Calendar",
    color: "#4285F4",
    authType: "oauth",
    fields: [
      { key: "token", label: "Google OAuth Token", placeholder: "ya29...", type: "password" },
    ],
  },
  {
    id: "apple-calendar",
    name: "Apple Calendar / iCal",
    category: "calendar",
    description: "Generates standardized RFC 5545 .ICS files that automatically import into macOS & iOS Calendar.",
    iconName: "CalendarDays",
    color: "#FF3B30",
    authType: "deeplink",
    fields: [],
  },
  {
    id: "calendly",
    name: "Calendly",
    category: "calendar",
    description: "Embed your custom Calendly follow-up booking link directly into follow-up emails.",
    iconName: "Clock",
    color: "#006BFF",
    authType: "deeplink",
    fields: [
      { key: "bookingLink", label: "Your Calendly URL", placeholder: "https://calendly.com/your-name/30min", type: "url" },
    ],
  },
  {
    id: "calcom",
    name: "Cal.com",
    category: "calendar",
    description: "Open-source scheduling link integration for developer-first teams.",
    iconName: "Clock",
    color: "#111827",
    authType: "deeplink",
    fields: [
      { key: "bookingLink", label: "Cal.com Link", placeholder: "https://cal.com/your-name", type: "url" },
    ],
  },

  // 3. NOTES, DOCS & KNOWLEDGE
  {
    id: "notion",
    name: "Notion",
    category: "notes",
    description: "Pushes structured meeting pages with executive summaries and checklists to your Notion database.",
    iconName: "FileText",
    color: "#000000",
    authType: "api_key",
    fields: [
      { key: "apiKey", label: "Internal Integration Token", placeholder: "secret_...", type: "password" },
      { key: "databaseId", label: "Notion Database ID", placeholder: "1a2b3c4d5e6f...", type: "text" },
    ],
  },
  {
    id: "google-docs",
    name: "Google Docs",
    category: "notes",
    description: "Creates a formatted Google Doc with call transcripts, action points, and review notes.",
    iconName: "FileSpreadsheet",
    color: "#4285F4",
    authType: "oauth",
    fields: [
      { key: "token", label: "Google Drive/Docs Token", placeholder: "ya29...", type: "password" },
    ],
  },
  {
    id: "obsidian",
    name: "Obsidian",
    category: "notes",
    description: "1-click export formatted markdown note into your local Obsidian second-brain vault.",
    iconName: "BookOpen",
    color: "#7C3AED",
    authType: "deeplink",
    fields: [
      { key: "vaultName", label: "Obsidian Vault Name", placeholder: "MyVault", type: "text" },
    ],
  },
  {
    id: "coda",
    name: "Coda",
    category: "notes",
    description: "Appends call rows and debrief action items into interactive Coda documents.",
    iconName: "Table",
    color: "#F36A4A",
    authType: "api_key",
    fields: [
      { key: "apiKey", label: "Coda API Token", placeholder: "coda_token_...", type: "password" },
      { key: "docId", label: "Document ID", placeholder: "d_abc123", type: "text" },
    ],
  },
  {
    id: "evernote",
    name: "Evernote",
    category: "notes",
    description: "Syncs meeting notes and attachments directly to your Evernote notebooks.",
    iconName: "Bookmark",
    color: "#00A82D",
    authType: "api_key",
    fields: [
      { key: "apiKey", label: "Evernote Developer Token", placeholder: "S=s1...", type: "password" },
    ],
  },

  // 4. TASKS & PROJECT MANAGEMENT
  {
    id: "todoist",
    name: "Todoist",
    category: "tasks",
    description: "Creates tasks with due dates, priority labels, and client tags in Todoist.",
    iconName: "CheckSquare",
    color: "#E44332",
    authType: "api_key",
    fields: [
      { key: "apiToken", label: "Todoist API Token", placeholder: "0123456789abcdef...", type: "password" },
    ],
  },
  {
    id: "linear",
    name: "Linear",
    category: "tasks",
    description: "Instantly create engineering tasks, bug reports, and project milestones in Linear.",
    iconName: "Layers",
    color: "#5E6AD2",
    authType: "api_key",
    fields: [
      { key: "apiKey", label: "Linear API Key", placeholder: "lin_api_...", type: "password" },
      { key: "teamId", label: "Team ID or Key", placeholder: "ENG", type: "text" },
    ],
  },
  {
    id: "trello",
    name: "Trello",
    category: "tasks",
    description: "Adds cards to your Kanban boards with deadlines and member assignments.",
    iconName: "Columns",
    color: "#0079BF",
    authType: "api_key",
    fields: [
      { key: "apiKey", label: "Trello API Key", placeholder: "trello_key...", type: "password" },
      { key: "token", label: "User Token", placeholder: "trello_token...", type: "password" },
      { key: "listId", label: "List ID", placeholder: "5e...", type: "text" },
    ],
  },
  {
    id: "asana",
    name: "Asana",
    category: "tasks",
    description: "Creates tasks in your team's Asana workspace with assigned coworkers and due dates.",
    iconName: "CheckCircle",
    color: "#F06A6A",
    authType: "api_key",
    fields: [
      { key: "personalToken", label: "Personal Access Token", placeholder: "1/1234...", type: "password" },
      { key: "projectId", label: "Project GID", placeholder: "120...", type: "text" },
    ],
  },
  {
    id: "clickup",
    name: "ClickUp",
    category: "tasks",
    description: "Syncs post-call deliverables directly to ClickUp lists and folders.",
    iconName: "CheckSquare",
    color: "#7B68EE",
    authType: "api_key",
    fields: [
      { key: "apiToken", label: "ClickUp API Key", placeholder: "pk_...", type: "password" },
      { key: "listId", label: "List ID", placeholder: "900...", type: "text" },
    ],
  },

  // 5. CRM & SALES
  {
    id: "hubspot",
    name: "HubSpot CRM",
    category: "crm",
    description: "Updates contact properties, logs meeting activity, and advances deal pipeline stage.",
    iconName: "Building2",
    color: "#FF7A59",
    authType: "api_key",
    fields: [
      { key: "accessToken", label: "Private App Access Token", placeholder: "pat-na1-...", type: "password" },
    ],
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "crm",
    description: "Updates Salesforce Opportunity stage and creates tasks under client Account records.",
    iconName: "Cloud",
    color: "#00A1E0",
    authType: "api_key",
    fields: [
      { key: "instanceUrl", label: "Instance URL", placeholder: "https://yourcompany.my.salesforce.com", type: "url" },
      { key: "accessToken", label: "OAuth Access Token", placeholder: "00D...", type: "password" },
    ],
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    category: "crm",
    description: "Advances deals to next stage and creates scheduled follow-up activities.",
    iconName: "Target",
    color: "#000000",
    authType: "api_key",
    fields: [
      { key: "apiToken", label: "API Token", placeholder: "pipedrive_token...", type: "password" },
    ],
  },
  {
    id: "close",
    name: "Close CRM",
    category: "crm",
    description: "Logs call summaries and schedules automated email follow-up sequences in Close.",
    iconName: "Zap",
    color: "#182332",
    authType: "api_key",
    fields: [
      { key: "apiKey", label: "Close API Key", placeholder: "api_...", type: "password" },
    ],
  },
  {
    id: "folk",
    name: "Folk CRM",
    category: "crm",
    description: "Modern CRM contact sync for founders, investors, and startup networks.",
    iconName: "Users",
    color: "#3F3F46",
    authType: "api_key",
    fields: [
      { key: "apiKey", label: "Folk API Key", placeholder: "folk_...", type: "password" },
    ],
  },

  // 6. ENGINEERING & DEVOPS
  {
    id: "github",
    name: "GitHub",
    category: "engineering",
    description: "Creates GitHub issues and milestone trackers directly from technical call discussions.",
    iconName: "GitPullRequest",
    color: "#24292F",
    authType: "api_key",
    fields: [
      { key: "token", label: "Personal Access Token (classic or fine-grained)", placeholder: "ghp_...", type: "password" },
      { key: "repo", label: "Repository (owner/repo)", placeholder: "Anurag13075/desbreif", type: "text" },
    ],
  },
  {
    id: "jira",
    name: "Jira / Atlassian",
    category: "engineering",
    description: "Creates Jira sprint issues and bug tickets for development teams.",
    iconName: "Briefcase",
    color: "#0052CC",
    authType: "api_key",
    fields: [
      { key: "domain", label: "Jira Domain", placeholder: "yourteam.atlassian.net", type: "text" },
      { key: "email", label: "Atlassian Email", placeholder: "you@company.com", type: "text" },
      { key: "apiToken", label: "API Token", placeholder: "ATATT3...", type: "password" },
      { key: "projectKey", label: "Project Key", placeholder: "PROJ", type: "text" },
    ],
  },
  {
    id: "gitlab",
    name: "GitLab",
    category: "engineering",
    description: "Opens GitLab issues and milestones from post-call engineering syncs.",
    iconName: "GitBranch",
    color: "#FC6D26",
    authType: "api_key",
    fields: [
      { key: "token", label: "Personal Access Token", placeholder: "glpat-...", type: "password" },
      { key: "projectId", label: "Project ID or Path", placeholder: "group/project", type: "text" },
    ],
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    category: "engineering",
    description: "Triggers on-call alerts or incident post-mortems after critical customer outage calls.",
    iconName: "Bell",
    color: "#00573D",
    authType: "api_key",
    fields: [
      { key: "routingKey", label: "Events API v2 Routing Key", placeholder: "pd_routing_key...", type: "password" },
    ],
  },

  // 7. FINANCE & OPERATIONS
  {
    id: "stripe",
    name: "Stripe",
    category: "finance",
    description: "Auto-creates Stripe customer invoice and payment checkout link when pricing is approved.",
    iconName: "CreditCard",
    color: "#635BFF",
    authType: "api_key",
    fields: [
      { key: "secretKey", label: "Stripe Secret Key (sk_test_... or sk_live_...)", placeholder: "sk_test_...", type: "password" },
    ],
  },
  {
    id: "zapier",
    name: "Zapier Webhook",
    category: "finance",
    description: "Triggers any custom Zap connecting to over 5,000+ business applications.",
    iconName: "Zap",
    color: "#FF4A00",
    authType: "webhook",
    fields: [
      { key: "webhookUrl", label: "Catch Hook Webhook URL", placeholder: "https://hooks.zapier.com/hooks/catch/...", type: "url" },
    ],
  },
  {
    id: "make",
    name: "Make.com (Integromat)",
    category: "finance",
    description: "Webhook trigger to launch automated business workflows in Make.",
    iconName: "Workflow",
    color: "#6D28D9",
    authType: "webhook",
    fields: [
      { key: "webhookUrl", label: "Make Custom Webhook URL", placeholder: "https://hook.eu1.make.com/...", type: "url" },
    ],
  },
];
