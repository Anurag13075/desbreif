# Debrief — The 30-Second Post-Call Auto-Pilot
> **Wispr Flow Hackathon (#NoHandsChallenge)**  
> *Hang up the phone or Google Meet call. Speak for 20 seconds. Everything else is already done.*

---

## 🎯 The Universal Problem
You finish a 20-minute phone call or Google Meet with a client, investor, or coworker. You promised to send them an email, schedule a follow-up, update the deal status, and complete 3 tasks. Because manually typing everything out is tedious:
- You forget half of your promises.
- Or you waste 15 minutes manually opening Gmail, Google Calendar, Notion, HubSpot, and Slack one by one.

---

## 🎙️ The Voice Demo (How It Works)
You hang up your call, hold your Wispr Flow hotkey, and speak casually for 20 seconds:

> *"Just got off the call with Sarah. She approved the pricing. We scheduled our next demo for Friday at 3:00 PM. I need to send her our proposal PDF by tomorrow noon, and remind Alex to prepare the contract."*

---

## ⚡ What Debrief Stages Automatically (In Parallel)

From that single 20-second voice ramble, Debrief uses **Groq LPU (Llama 3.3 70B)** to decompose the unstructured audio transcript into 5 synchronized operational artifacts:

| Application Staged | Generated Output | 1-Click Action |
| :--- | :--- | :--- |
| **1. Executive Summary** | Call recap, sentiment rating (*Enthusiastic*), ratified decisions list. | View & verify |
| **2. Follow-up Client Email** | Polished email addressed to Sarah with proposal attachments and demo details. | **🚀 Open in Gmail** / Default Mail |
| **3. Google Calendar & .ICS** | 45-min meeting invite locked for Friday @ 3:00 PM with Google Meet link. | **📅 Add to Google Calendar** / Download `.ics` |
| **4. Action Items & To-Dos** | 3 delegated tasks with assignees (*"You"*, *"Alex"*), priorities (*High*), & deadlines. | **📋 Copy for Notion / Linear** |
| **5. CRM Deal Advancement** | Deal status updated to *"Pricing Approved"* ($36,000/yr value). | **📊 Copy for HubSpot / Salesforce** |
| **6. Colleague Slack Handoff** | Context-aware message drafted for Alex regarding contract prep. | **💬 Copy Slack Message** |

---

## 🎨 Aesthetics & Design System
Crafted with the editorial, refined elegance of **Wispr Flow**:
- **Cream & Sand Palette**: Warm `#FAF8F5` canvas with tactile `#F4EFE6` cards and `#E2DCD0` borders.
- **Editorial Typography**: High-craft serif display headings (`Newsreader`) paired with clean sans-serif UI typography (`Inter`).
- **Tactile Accents**: Tactile buttons with subtle drop-shadows (`box-shadow: 0 2px 0 0 #141413`), soft lilac (`#DDD0F7`), and deep hunter green (`#154032`).
- **Live Sound Waveforms**: Pulsing multi-frequency audio visualizers simulating real-time Wispr dictation.

---

## 🚀 How to Run & Deploy

### Local Development
```bash
cd debrief
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Vercel Deployment
1. Push this folder to your GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Root Directory to `debrief`.
4. Deploy! Zero environment variables are required to preview (built-in high-precision neural fallback synthesizer runs out of the box).

---

## ⚙️ Groq AI Configuration
To run live on Groq LPUs at 300+ tokens/second:
1. Click **"Connect Groq"** in the top navigation bar.
2. Enter your free API key starting with `gsk_` from [console.groq.com/keys](https://console.groq.com/keys).
3. Select `Llama 3.3 70B Versatile` or `Llama 3.1 8B Instant`.
4. Keys are stored safely in browser `localStorage`.
