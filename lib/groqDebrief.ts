import { DebriefResult } from "./types";
import { DEFAULT_DEBRIEF_RESULT } from "./presetScenarios";
import { lookupContactEmail, lookupTeammateHandle } from "./contacts";

interface GroqDebriefRequest {
  apiKey?: string;
  model?: string;
  transcript: string;
  speakerName?: string;
}

const SYSTEM_PROMPT = `You are Debrief, the intelligent 30-Second Post-Call Auto-Pilot for Wispr Flow (#NoHandsChallenge).
Your job is to take an informal, rushed, raw post-call voice ramble or explicit user instruction (e.g., "Write an email for Anuj considering our meeting about design engineering for our product, this happened, and this happened") and instantly synthesize high-fidelity, production-ready operational artifacts.

CRITICAL INSTRUCTIONS:
1. EMAIL GENERATION (Zero generic templates):
   - You must deeply analyze what the user actually said. If the meeting was about "design engineering", "3D CAD modeling", "product architecture", or "pricing review", the email body MUST speak directly to those specific topics and milestones.
   - Address the email directly to the person mentioned (e.g. "Hi Anuj,").
   - If an explicit email address is provided (e.g., anuj@gmail.com, anurag@gmail.com), use that exact address. If not, use standard real email format (e.g., firstname@gmail.com or personal domain).
2. CALENDAR EVENT:
   - Schedule for the date and time mentioned (e.g., Monday 4 PM, Friday 3 PM).
   - Include the recipient's real email in the attendees list.
3. INTERNAL TEAM HANDOFF (Slack/WhatsApp):
   - If a colleague is mentioned (e.g. Alex, Anurag, Rachel), draft a concise, friendly Slack message tailored to their specific assignment.
4. ACTION ITEMS & CRM:
   - Extract 3-5 real tasks with clear owners and realistic deadlines.
   - Summarize the deal stage/milestone realistically.

Return STRICT JSON matching this schema:
{
  "clientName": "...",
  "companyName": "...",
  "executiveSummary": "...",
  "keyDecisions": ["...", "..."],
  "sentiment": "enthusiastic" | "positive" | "cautious" | "urgent" | "neutral",
  "emailDraft": {
    "recipientName": "...",
    "recipientEmail": "...",
    "subject": "...",
    "body": "...",
    "attachmentsMentioned": ["..."]
  },
  "calendarEvent": {
    "title": "...",
    "startDate": "...",
    "startTime": "...",
    "endTime": "...",
    "durationMinutes": 45,
    "location": "Google Meet",
    "attendees": ["...", "..."],
    "description": "..."
  },
  "actionItems": [
    {
      "id": "act-1",
      "title": "...",
      "assignee": "...",
      "dueDate": "...",
      "priority": "high" | "medium" | "low" | "urgent",
      "completed": false,
      "category": "Document" | "Handoff" | "Calendar" | "Email" | "General"
    }
  ],
  "crmUpdate": {
    "clientName": "...",
    "companyName": "...",
    "dealStage": "Pricing Approved" | "Demo Scheduled" | "Contract Review" | "Discovery",
    "dealValue": "...",
    "sentiment": "enthusiastic",
    "keyDecision": "...",
    "nextStepSummary": "..."
  },
  "teamHandoff": {
    "targetPerson": "...",
    "role": "...",
    "messageSnippet": "..."
  }
}`;

/**
 * Context-aware rule-based synthesizer fallback
 * Used when offline or while waiting for Groq API response
 */
function synthesizeFallbackDebrief(transcript: string, speakerName: string = "Anurag Sharma"): DebriefResult {
  const lower = transcript.toLowerCase();

  // If matches Sarah prompt exactly
  if (lower.includes("sarah") && lower.includes("pricing")) {
    return {
      ...DEFAULT_DEBRIEF_RESULT,
      id: `debrief_${Date.now()}`,
      createdAt: "Just now",
      rawTranscript: transcript,
    };
  }

  // Detect real email
  const emailMatch = transcript.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const explicitEmail = emailMatch ? emailMatch[1] : null;

  // Extract client name
  let clientName = "Partner";
  let companyName = "Product Team";
  let dealStage: any = "Discovery";

  const nameMatch = transcript.match(/(?:write an email for|email for|email to|call with|sync with|with)\s+([A-Za-z]+)/i);
  if (nameMatch && nameMatch[1]) {
    clientName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1).toLowerCase();
  } else if (lower.includes("anuj")) {
    clientName = "Anuj";
  } else if (lower.includes("anurag")) {
    clientName = "Anurag";
  } else if (lower.includes("david")) {
    clientName = "David Vance";
  } else if (lower.includes("elena")) {
    clientName = "Elena Rostova";
  }

  // Look up real email
  const recipientEmail = explicitEmail || lookupContactEmail(clientName);

  // Extract topic
  let meetingTopic = "Project Review & Next Steps";
  if (lower.includes("design engineering")) {
    meetingTopic = "Design Engineering for our Product";
    dealStage = "Design Engineering Review";
  } else if (lower.includes("pricing")) {
    meetingTopic = "Pricing & Licensing Terms";
    dealStage = "Pricing Approved";
  }

  // Meeting time & day
  let dateStr = "Friday at 3:00 PM";
  let isoTime = "15:00";
  const timeMatch = transcript.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i);
  const dayMatch = transcript.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|tomorrow)/i);
  if (timeMatch && dayMatch) {
    dateStr = `${dayMatch[1]} at ${timeMatch[1].toUpperCase()}`;
  }

  // Colleague delegatee
  let delegatee = clientName.toLowerCase() === "anuj" ? "Anurag" : "Alex";
  const delMatch = transcript.match(/(?:remind|tell|ask|ping)\s+([A-Za-z]+)/i);
  if (delMatch && delMatch[1]) {
    delegatee = delMatch[1].charAt(0).toUpperCase() + delMatch[1].slice(1).toLowerCase();
  }

  return {
    id: `debrief_${Date.now()}`,
    createdAt: "Just now",
    rawTranscript: transcript,
    durationSeconds: Math.max(15, Math.round(transcript.split(" ").length / 2.3)),
    clientName: clientName,
    companyName: companyName,
    executiveSummary: `Call completed with ${clientName}. Discussion focused on ${meetingTopic}. Next milestone confirmed for ${dateStr}.`,
    keyDecisions: [
      `Key milestone agreed for ${meetingTopic}.`,
      `Follow-up session booked for ${dateStr}.`,
      `Action items assigned to ${delegatee}.`,
    ],
    sentiment: "positive",
    emailDraft: {
      recipientName: clientName,
      recipientEmail: recipientEmail,
      subject: `Recap: ${meetingTopic} — ${clientName}`,
      body: `Hi ${clientName.split(" ")[0]},

Great catching up today regarding ${meetingTopic}!

As discussed during our call, I'm summarizing our key takeaways:
• Status: Everything is moving forward smoothly on ${meetingTopic}.
• Next Milestone: We have our next review session locked for ${dateStr}.
• Internal Action: ${delegatee} is reviewing the latest specifications so we have everything ready beforehand.

Please feel free to ping me if you need any adjustments before our sync on ${dateStr}.

Best regards,
${speakerName}`,
      attachmentsMentioned: ["Meeting recap and specification documentation"],
    },
    calendarEvent: {
      title: `${meetingTopic} — ${clientName}`,
      startDate: dateStr.split(" at ")[0] || "Friday",
      startTime: isoTime,
      endTime: "15:45",
      durationMinutes: 45,
      location: "Google Meet",
      attendees: [recipientEmail, `${speakerName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`],
      description: `Follow-up review for ${meetingTopic}.\nMilestone: ${dealStage}.\nAttendees: ${clientName}, ${speakerName}.`,
    },
    actionItems: [
      {
        id: `act-${Date.now()}-1`,
        title: `Email ${clientName} the review documentation`,
        assignee: "You",
        dueDate: "Tomorrow by noon",
        priority: "high",
        completed: false,
        category: "Email",
      },
      {
        id: `act-${Date.now()}-2`,
        title: `Coordinate with ${delegatee} on deliverables`,
        assignee: delegatee,
        dueDate: dateStr,
        priority: "high",
        completed: false,
        category: "Handoff",
      },
      {
        id: `act-${Date.now()}-3`,
        title: `Review demo and staging environments for ${dateStr} call`,
        assignee: "You",
        dueDate: `${dateStr}`,
        priority: "medium",
        completed: false,
        category: "Calendar",
      },
    ],
    crmUpdate: {
      clientName: clientName,
      companyName: companyName,
      dealStage: dealStage,
      dealValue: "$24,000 / year",
      sentiment: "positive",
      keyDecision: `Primary terms aligned. Scheduled deep dive for ${dateStr}.`,
      nextStepSummary: `Send documentation to ${clientName} (${recipientEmail}); brief ${delegatee}.`,
    },
    teamHandoff: {
      targetPerson: `${delegatee}`,
      role: "Engineering & Operations",
      messageSnippet: `Hey ${delegatee}! Just finished syncing with ${clientName} regarding ${meetingTopic}. Could you please prepare the updates ahead of our ${dateStr} review? Thank you!`,
    },
  };
}

/**
 * Main execution agent: calls Groq Llama 3.3 or falls back gracefully
 */
export async function processDebriefVoiceRamble(
  request: GroqDebriefRequest
): Promise<{ result: DebriefResult; usedGroqAI: boolean }> {
  const { apiKey, model = "llama-3.3-70b-versatile", transcript, speakerName = "Anurag Sharma" } = request;

  if (apiKey && apiKey.startsWith("gsk_")) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Voice Ramble / Prompt from ${speakerName}: "${transcript}"`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);

        // Ensure real email is used
        let finalEmail = parsed.emailDraft?.recipientEmail;
        if (!finalEmail || finalEmail.includes("example.com")) {
          finalEmail = lookupContactEmail(parsed.clientName || "Partner");
        }

        const debriefResult: DebriefResult = {
          id: `debrief_${Date.now()}`,
          createdAt: "Just now",
          rawTranscript: transcript,
          durationSeconds: Math.max(15, Math.round(transcript.split(" ").length / 2.5)),
          clientName: parsed.clientName || "Client",
          companyName: parsed.companyName || "Organization",
          executiveSummary: parsed.executiveSummary || "Call concluded successfully.",
          keyDecisions: parsed.keyDecisions || ["Key milestones ratified."],
          sentiment: parsed.sentiment || "positive",
          emailDraft: {
            recipientName: parsed.emailDraft?.recipientName || parsed.clientName || "Client",
            recipientEmail: finalEmail,
            subject: parsed.emailDraft?.subject || `Follow-up: Meeting Recap`,
            body: parsed.emailDraft?.body || `Hi ${parsed.clientName},\n\nGreat speaking with you today!`,
            attachmentsMentioned: parsed.emailDraft?.attachmentsMentioned || [],
          },
          calendarEvent: {
            title: parsed.calendarEvent?.title || `Follow-up Demo`,
            startDate: parsed.calendarEvent?.startDate || "Friday",
            startTime: parsed.calendarEvent?.startTime || "15:00",
            endTime: parsed.calendarEvent?.endTime || "15:45",
            durationMinutes: parsed.calendarEvent?.durationMinutes || 45,
            location: parsed.calendarEvent?.location || "Google Meet",
            attendees: [finalEmail, "you@domain.com"],
            description: parsed.calendarEvent?.description || "Follow-up sync",
          },
          actionItems: parsed.actionItems || [],
          crmUpdate: parsed.crmUpdate || {
            clientName: parsed.clientName || "Client",
            companyName: parsed.companyName || "Organization",
            dealStage: "Pricing Approved",
            dealValue: "$24,000 / year",
            sentiment: "positive",
            keyDecision: "Pricing approved",
            nextStepSummary: "Follow-up demo",
          },
          teamHandoff: parsed.teamHandoff || {
            targetPerson: "Alex",
            role: "Legal & Operations",
            messageSnippet: `Hey Alex, please follow up on our latest client sync.`,
          },
        };

        return { result: debriefResult, usedGroqAI: true };
      }
    } catch (err) {
      console.warn("Groq API error, falling back:", err);
    }
  }

  // Contextual rule-based synthesizer fallback
  const fallback = synthesizeFallbackDebrief(transcript, speakerName);
  return { result: fallback, usedGroqAI: false };
}
