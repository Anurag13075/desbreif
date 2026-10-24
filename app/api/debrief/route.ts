import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Debrief, an elite executive AI post-call auto-pilot (#NoHandsChallenge).
Your job is to read what the user told you (whether it is an informal post-call ramble, a dictated voice note, or an explicit instruction like "Write an email for Anuj considering our meeting...") and generate REAL, GENUINE, HUMAN-SOUNDING OPERATIONAL ARTIFACTS.

DO NOT USE GENERIC SALES TEMPLATES. DO NOT INVENT FAKE DATA IF THE USER PROVIDED REAL NAMES OR DETAILS.
Analyze the user's exact words:
- Who is the recipient? What is their email? (If user says "Anuj at anuj@gmail.com", use anuj@gmail.com. If only name "Anuj" is provided, use anuj@gmail.com).
- What actually happened? What was decided? What problem was discussed?
- If the user says "delay the launch because of payment errors", the email body MUST EXPLICITLY discuss delaying the launch and payment errors!
- If the user says "schedule for Tuesday 2 PM", the calendar event MUST be Tuesday 2 PM!
- If the user says "remind Anurag to fix the API", the Slack message MUST be directed to Anurag asking him to fix the API!

Return strict, valid JSON with this exact structure:
{
  "clientName": "Recipient Name (e.g. Anuj)",
  "companyName": "Company or Project Name",
  "executiveSummary": "Concise 1-2 sentence executive recap of what happened.",
  "keyDecisions": [
    "Decision or event 1",
    "Decision or event 2"
  ],
  "sentiment": "positive" | "urgent" | "cautious" | "neutral",
  "emailDraft": {
    "recipientName": "Recipient Name",
    "recipientEmail": "real email (e.g. anuj@gmail.com)",
    "subject": "Clear, contextual subject line",
    "body": "Full, complete, professional, highly contextual email body. Address the recipient by name, articulate every specific topic and decision mentioned by the user, and sign off as Anurag Sharma."
  },
  "calendarEvent": {
    "title": "Clear meeting title",
    "startDate": "Day or date mentioned (e.g. Monday, Friday, Tomorrow)",
    "startTime": "Time mentioned (e.g. 16:00, 11:00)",
    "endTime": "16:45",
    "durationMinutes": 45,
    "location": "Google Meet",
    "attendees": ["recipient email", "you@domain.com"],
    "description": "Agenda summarizing the discussion points."
  },
  "actionItems": [
    {
      "id": "act-1",
      "title": "Specific action item",
      "assignee": "You or colleague name",
      "dueDate": "Specific deadline mentioned",
      "priority": "high" | "urgent" | "medium",
      "completed": false,
      "category": "Email" | "Handoff" | "Calendar" | "General"
    }
  ],
  "crmUpdate": {
    "clientName": "Recipient Name",
    "companyName": "Project or Company",
    "dealStage": "Current status/milestone (e.g. Design Review, Launch Delayed, Pricing Approved)",
    "dealValue": "$24,000 / year",
    "sentiment": "positive",
    "keyDecision": "Main decision made",
    "nextStepSummary": "Next action step"
  },
  "teamHandoff": {
    "targetPerson": "Colleague name mentioned (e.g. Anurag, Alex)",
    "role": "Their role",
    "messageSnippet": "Natural, ready-to-paste Slack or WhatsApp ping asking them to do their task."
  }
}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, apiKey: clientApiKey, model = "llama-3.3-70b-versatile", speakerName = "Anurag Sharma" } = body;

    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return NextResponse.json({ error: "Empty transcript provided" }, { status: 400 });
    }

    // Resolve API key from server environment OR client override
    const apiKey =
      process.env.GROQ_API_KEY ||
      process.env.NEXT_PUBLIC_GROQ_API_KEY ||
      clientApiKey ||
      "";

    if (!apiKey || !apiKey.startsWith("gsk_")) {
      // Return error or inform that Groq API key is missing
      return NextResponse.json(
        {
          error: "Missing Groq API Key",
          message: "Please configure GROQ_API_KEY in Vercel or click Connect Groq in the top navbar.",
          needsKey: true,
        },
        { status: 401 }
      );
    }

    // Call Groq API with Llama 3.3 70B
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `User instruction / Voice debrief from ${speakerName}:\n"""\n${transcript}\n"""`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error response:", errorText);
      return NextResponse.json(
        { error: "Groq API error", details: errorText },
        { status: groqResponse.status }
      );
    }

    const data = await groqResponse.json();
    const rawContent = data.choices[0]?.message?.content;
    const parsedData = JSON.parse(rawContent);

    return NextResponse.json({
      success: true,
      data: parsedData,
      modelUsed: model,
      usedGroqAI: true,
    });
  } catch (error: any) {
    console.error("Debrief API route internal error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasKey = Boolean(
    (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith("gsk_")) ||
    (process.env.NEXT_PUBLIC_GROQ_API_KEY && process.env.NEXT_PUBLIC_GROQ_API_KEY.startsWith("gsk_"))
  );

  return NextResponse.json({
    status: "online",
    groqConfiguredOnServer: hasKey,
  });
}
