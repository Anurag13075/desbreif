import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Debrief — The 30-Second Post-Call Auto-Pilot",
  description:
    "Speak casually for 20 seconds after any call. Debrief instantly drafts your follow-up email, schedules the Google Calendar invite, delegates action items, updates CRM deal stages, and notifies your team.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-wispr-cream text-wispr-ink antialiased selection:bg-wispr-lavender selection:text-wispr-ink">
        {children}
      </body>
    </html>
  );
}
