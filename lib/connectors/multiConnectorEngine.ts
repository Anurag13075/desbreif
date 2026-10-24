/**
 * Multi-Connector Execution & Credentials Storage Engine
 * Manages configuration and real-world execution for all 32 daily-life applications.
 */

import { CONNECTOR_CATALOG, ConnectorDef } from "./catalog";

const STORAGE_KEY = "debrief_all_32_connectors_v2";

export function getAllSavedConfigs(): Record<string, Record<string, string>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveConnectorConfig(connectorId: string, fields: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    const all = getAllSavedConfigs();
    all[connectorId] = fields;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {}
}

export function isConnectorConfigured(connectorId: string): boolean {
  const configs = getAllSavedConfigs();
  const conf = configs[connectorId];
  if (!conf) return false;
  return Object.values(conf).some((val) => val && val.trim().length > 0);
}

export async function executeAppConnector(
  connectorId: string,
  payload: {
    clientName: string;
    email: string;
    subject: string;
    summary: string;
    messageText: string;
    dateStr?: string;
  }
): Promise<{ success: boolean; message: string; url?: string }> {
  const configs = getAllSavedConfigs();
  const conf = configs[connectorId] || {};

  switch (connectorId) {
    // 1. WhatsApp
    case "whatsapp": {
      const phone = conf.phone ? conf.phone.replace(/[^0-9]/g, "") : "";
      const text = encodeURIComponent(`Hi ${payload.clientName}!\n\n${payload.summary}\n\nLooking forward to our next sync on ${payload.dateStr || "Monday"}!`);
      const waUrl = phone
        ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}`
        : `https://api.whatsapp.com/send?text=${text}`;
      window.open(waUrl, "_blank");
      return { success: true, message: "Opened WhatsApp chat" };
    }

    // 2. Obsidian
    case "obsidian": {
      const vault = conf.vaultName ? encodeURIComponent(conf.vaultName) : "Vault";
      const title = encodeURIComponent(`${payload.clientName} — Post-Call Debrief`);
      const content = encodeURIComponent(`# ${payload.clientName} Post-Call Notes\n\n${payload.summary}\n\n## Action Items\n- ${payload.messageText}`);
      const obsUrl = `obsidian://new?vault=${vault}&name=${title}&content=${content}`;
      window.open(obsUrl, "_blank");
      return { success: true, message: "Exported to Obsidian Vault" };
    }

    // 3. Calendly / Cal.com
    case "calendly":
    case "calcom": {
      const link = conf.bookingLink || (connectorId === "calendly" ? "https://calendly.com" : "https://cal.com");
      window.open(link, "_blank");
      return { success: true, message: `Opened ${connectorId} booking page` };
    }

    // 4. Discord Webhook
    case "discord": {
      if (!conf.webhookUrl) {
        return { success: false, message: "Discord webhook URL not configured." };
      }
      try {
        await fetch(conf.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `**Debrief: Post-Call Sync with ${payload.clientName}**\n${payload.summary}\n*Deliverable:* ${payload.messageText}`,
          }),
        });
        return { success: true, message: "Posted to Discord channel!" };
      } catch (e: any) {
        return { success: false, message: "Discord webhook failed: " + e.message };
      }
    }

    // 5. Zapier / Make Webhook
    case "zapier":
    case "make": {
      const url = conf.webhookUrl;
      if (!url) return { success: false, message: `${connectorId} webhook URL not set.` };
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client: payload.clientName,
            email: payload.email,
            subject: payload.subject,
            summary: payload.summary,
            task: payload.messageText,
            timestamp: new Date().toISOString(),
          }),
        });
        return { success: true, message: `Triggered ${connectorId} scenario!` };
      } catch (e: any) {
        return { success: false, message: `${connectorId} trigger error.` };
      }
    }

    // 6. Generic Proxy via /api/connectors
    default: {
      try {
        const res = await fetch("/api/connectors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: connectorId,
            payload: {
              ...payload,
              conf,
            },
            credentials: conf,
          }),
        });
        const data = await res.json();
        return {
          success: Boolean(data.success),
          message: data.message || `Synchronized with ${connectorId}`,
          url: data.url,
        };
      } catch (e: any) {
        return { success: false, message: `Connector error: ${e.message}` };
      }
    }
  }
}
