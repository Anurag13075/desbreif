import { DraftEmail } from "./types";

/**
 * Generates an active 1-click Gmail web compose URL
 */
export function generateGmailWebUrl(email: DraftEmail): string {
  const baseUrl = "https://mail.google.com/mail/";
  const params = new URLSearchParams();

  params.set("view", "cm");
  params.set("fs", "1");
  params.set("to", email.recipientEmail || "");
  params.set("su", email.subject || "");
  params.set("body", email.body || "");

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generates a native mailto: link for desktop email clients (Apple Mail, Outlook)
 */
export function generateMailtoUrl(email: DraftEmail): string {
  const recipient = encodeURIComponent(email.recipientEmail || "");
  const subject = encodeURIComponent(email.subject || "");
  const body = encodeURIComponent(email.body || "");

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

/**
 * Formats email for clipboard copy
 */
export function formatEmailForClipboard(email: DraftEmail): string {
  return `To: ${email.recipientName} <${email.recipientEmail}>
Subject: ${email.subject}

${email.body}
`;
}
