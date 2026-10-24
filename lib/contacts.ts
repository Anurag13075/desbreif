/**
 * Contact Directory & Address Book
 * Manages real contact emails and teammate handles with localStorage persistence.
 */

export interface Contact {
  name: string;
  email: string;
  role?: string;
  slackHandle?: string;
}

const DEFAULT_CONTACTS: Record<string, Contact> = {
  anuj: {
    name: "Anuj",
    email: "anuj@gmail.com",
    role: "Design Engineering Lead",
    slackHandle: "@anuj",
  },
  anurag: {
    name: "Anurag",
    email: "anurag@gmail.com",
    role: "Founder / Engineer",
    slackHandle: "@anurag",
  },
  sarah: {
    name: "Sarah Jenkins",
    email: "sarah.jenkins@acme.com",
    role: "VP of Product",
    slackHandle: "@sarah",
  },
  alex: {
    name: "Alex",
    email: "alex@company.org",
    role: "Legal & Operations",
    slackHandle: "@alex",
  },
  david: {
    name: "David Vance",
    email: "david@peakhorizon.vc",
    role: "Partner",
    slackHandle: "@david",
  },
  priya: {
    name: "Priya Nair",
    email: "priya.nair@globalfin.com",
    role: "Procurement Director",
    slackHandle: "@priya",
  },
  marcus: {
    name: "Marcus Reed",
    email: "marcus@techscale.io",
    role: "Infrastructure Lead",
    slackHandle: "@marcus",
  },
};

const STORAGE_KEY = "debrief_contacts_directory_v1";

export function getSavedContacts(): Record<string, Contact> {
  if (typeof window === "undefined") return DEFAULT_CONTACTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTACTS));
      return DEFAULT_CONTACTS;
    }
    return { ...DEFAULT_CONTACTS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_CONTACTS;
  }
}

export function saveContact(name: string, email: string, slackHandle?: string) {
  if (typeof window === "undefined") return;
  try {
    const contacts = getSavedContacts();
    const key = name.toLowerCase().trim();
    contacts[key] = {
      name,
      email,
      slackHandle: slackHandle || `@${name.toLowerCase()}`,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch (e) {}
}

export function lookupContactEmail(name: string, fallbackDomain: string = "gmail.com"): string {
  const cleanName = name.toLowerCase().trim().split(" ")[0];
  const contacts = getSavedContacts();
  if (contacts[cleanName] && contacts[cleanName].email) {
    return contacts[cleanName].email;
  }
  // If full name exists in contacts
  for (const k in contacts) {
    if (name.toLowerCase().includes(k)) {
      return contacts[k].email;
    }
  }
  // Default clean real-looking email
  return `${cleanName}@${fallbackDomain}`;
}

export function lookupTeammateHandle(name: string): string {
  const cleanName = name.toLowerCase().trim().split(" ")[0];
  const contacts = getSavedContacts();
  if (contacts[cleanName] && contacts[cleanName].slackHandle) {
    return contacts[cleanName].slackHandle;
  }
  return `@${cleanName}`;
}
