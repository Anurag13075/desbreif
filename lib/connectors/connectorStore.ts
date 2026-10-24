/**
 * Connector Store & Credentials Manager
 * Securely manages real OAuth tokens, API keys, and Webhook URLs.
 */

export interface AppConnections {
  google: {
    connected: boolean;
    accessToken?: string;
    userEmail?: string;
    expiresAt?: number;
  };
  slack: {
    connected: boolean;
    webhookUrl?: string;
    channel?: string;
  };
  notion: {
    connected: boolean;
    apiKey?: string;
    databaseId?: string;
  };
  hubspot: {
    connected: boolean;
    apiKey?: string;
  };
}

const STORAGE_KEY = "debrief_real_app_connections_v1";

export const DEFAULT_CONNECTIONS: AppConnections = {
  google: { connected: false },
  slack: { connected: false },
  notion: { connected: false },
  hubspot: { connected: false },
};

export function getSavedConnections(): AppConnections {
  if (typeof window === "undefined") return DEFAULT_CONNECTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONNECTIONS;
    return { ...DEFAULT_CONNECTIONS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_CONNECTIONS;
  }
}

export function saveConnections(connections: AppConnections) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  } catch (e) {}
}

export function updateGoogleConnection(accessToken: string, userEmail?: string) {
  const current = getSavedConnections();
  current.google = {
    connected: true,
    accessToken,
    userEmail: userEmail || "your-google-account@gmail.com",
    expiresAt: Date.now() + 3600 * 1000,
  };
  saveConnections(current);
  return current;
}

export function updateSlackConnection(webhookUrl: string, channel?: string) {
  const current = getSavedConnections();
  current.slack = {
    connected: true,
    webhookUrl,
    channel: channel || "#general",
  };
  saveConnections(current);
  return current;
}

export function updateNotionConnection(apiKey: string, databaseId?: string) {
  const current = getSavedConnections();
  current.notion = {
    connected: true,
    apiKey,
    databaseId: databaseId || "",
  };
  saveConnections(current);
  return current;
}

export function updateHubspotConnection(apiKey: string) {
  const current = getSavedConnections();
  current.hubspot = {
    connected: true,
    apiKey,
  };
  saveConnections(current);
  return current;
}
