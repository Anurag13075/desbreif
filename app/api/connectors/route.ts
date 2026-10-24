import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload, credentials } = body;

    switch (action) {
      // 1. REAL GMAIL API EXECUTION
      case "send_gmail": {
        const { to, subject, messageBody, isDraft } = payload;
        const accessToken = credentials?.googleAccessToken || process.env.GOOGLE_ACCESS_TOKEN;

        if (!accessToken) {
          // If no OAuth token yet, return mock-ready status with real Gmail deep-link
          return NextResponse.json({
            success: true,
            fallbackUrl: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody)}`,
            mode: "web_fallback",
            message: "Google OAuth token not provided. Ready to open prefilled Gmail web compose.",
          });
        }

        // Construct raw RFC 2822 email
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
        const messageParts = [
          `To: ${to}`,
          `Subject: ${utf8Subject}`,
          "Content-Type: text/plain; charset=utf-8",
          "MIME-Version: 1.0",
          "",
          messageBody,
        ];
        const rawMessage = Buffer.from(messageParts.join("\r\n"))
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        const endpoint = isDraft
          ? "https://gmail.googleapis.com/gmail/v1/users/me/drafts"
          : "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

        const reqBody = isDraft
          ? JSON.stringify({ message: { raw: rawMessage } })
          : JSON.stringify({ raw: rawMessage });

        const gmailRes = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: reqBody,
        });

        if (!gmailRes.ok) {
          const err = await gmailRes.text();
          return NextResponse.json({ error: "Gmail API error", details: err }, { status: gmailRes.status });
        }

        const data = await gmailRes.json();
        return NextResponse.json({ success: true, mode: "real_api", data });
      }

      // 2. REAL GOOGLE CALENDAR API & CONFLICT CHECKER
      case "create_gcal_event": {
        const { title, description, startDateTime, endDateTime, attendees } = payload;
        const accessToken = credentials?.googleAccessToken || process.env.GOOGLE_ACCESS_TOKEN;

        if (!accessToken) {
          return NextResponse.json({
            success: true,
            fallbackUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(description)}`,
            mode: "web_fallback",
          });
        }

        // 1. Conflict Check via freeBusy
        let hasConflict = false;
        let conflictDetails = null;

        try {
          const busyRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              timeMin: startDateTime,
              timeMax: endDateTime,
              items: [{ id: "primary" }],
            }),
          });

          if (busyRes.ok) {
            const busyData = await busyRes.json();
            const busyList = busyData.calendars?.primary?.busy || [];
            if (busyList.length > 0) {
              hasConflict = true;
              conflictDetails = busyList;
            }
          }
        } catch (e) {}

        // 2. Create Event
        const eventRes = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: title,
            description: description,
            start: { dateTime: startDateTime },
            end: { dateTime: endDateTime },
            attendees: (attendees || []).map((email: string) => ({ email })),
            conferenceData: {
              createRequest: {
                requestId: `meet-${Date.now()}`,
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            },
          }),
        });

        if (!eventRes.ok) {
          const err = await eventRes.text();
          return NextResponse.json({ error: "Calendar API error", details: err }, { status: eventRes.status });
        }

        const eventData = await eventRes.json();
        return NextResponse.json({
          success: true,
          mode: "real_api",
          hasConflict,
          conflictDetails,
          meetLink: eventData.hangoutLink || eventData.htmlLink,
          event: eventData,
        });
      }

      // 3. REAL SLACK NOTIFICATION
      case "post_slack": {
        const { text, channel } = payload;
        const webhookUrl = credentials?.slackWebhookUrl || process.env.SLACK_WEBHOOK_URL;

        if (!webhookUrl) {
          return NextResponse.json({
            success: true,
            mode: "clipboard_fallback",
            message: "Slack Webhook not set. Message ready to copy.",
          });
        }

        const slackRes = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text,
            channel: channel || "#general",
          }),
        });

        if (!slackRes.ok) {
          const err = await slackRes.text();
          return NextResponse.json({ error: "Slack API error", details: err }, { status: slackRes.status });
        }

        return NextResponse.json({ success: true, mode: "real_api" });
      }

      // 4. REAL NOTION PAGE CREATION
      case "create_notion": {
        const { title, summary, keyPoints, databaseId } = payload;
        const notionKey = credentials?.notionApiKey || process.env.NOTION_API_KEY;
        const targetDb = databaseId || credentials?.notionDatabaseId || process.env.NOTION_DATABASE_ID;

        if (!notionKey || !targetDb) {
          return NextResponse.json({
            success: true,
            mode: "markdown_fallback",
            message: "Notion API key or database ID not provided. Formatted markdown copied.",
          });
        }

        const notionRes = await fetch("https://api.notion.com/v1/pages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${notionKey}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: JSON.stringify({
            parent: { database_id: targetDb },
            properties: {
              Name: {
                title: [{ text: { content: title } }],
              },
            },
            children: [
              {
                object: "block",
                type: "heading_2",
                heading_2: { rich_text: [{ text: { content: "Executive Debrief" } }] },
              },
              {
                object: "block",
                type: "paragraph",
                paragraph: { rich_text: [{ text: { content: summary } }] },
              },
              {
                object: "block",
                type: "heading_3",
                heading_3: { rich_text: [{ text: { content: "Key Decisions & Deliverables" } }] },
              },
              ...(keyPoints || []).map((pt: string) => ({
                object: "block",
                type: "bulleted_list_item",
                bulleted_list_item: { rich_text: [{ text: { content: pt } }] },
              })),
            ],
          }),
        });

        if (!notionRes.ok) {
          const err = await notionRes.text();
          return NextResponse.json({ error: "Notion API error", details: err }, { status: notionRes.status });
        }

        const notionData = await notionRes.json();
        return NextResponse.json({ success: true, mode: "real_api", url: notionData.url });
      }

      default:
        return NextResponse.json({ error: "Invalid connector action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Connector error", message: error.message }, { status: 500 });
  }
}
