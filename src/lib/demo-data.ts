// Sample data powering the public interactive demo at /demo.
// Everything here is fictional — it simulates "Bright Digital Agency"
// and their AI employee, Ava.

export const demoCompany = {
  name: "Bright Digital Agency",
  owner: "Maya Thompson",
  plan: "AI Sales Team",
  employeeName: "Ava",
}

export const demoStats = {
  totalLeads: 47,
  newThisWeek: 9,
  hotLeads: 6,
  warmLeads: 14,
  followUpsDue: 4,
  pipelineValue: 86500,
  tasksCompleted: 132,
  pendingApprovals: 3,
}

export const demoCredits = {
  plan: "AI Sales Team",
  limit: 1500,
  used: 640,
  remaining: 860,
  resets: "24 Jul",
  leadsSourced: 38,
  repliesDrafted: 21,
  callBriefs: 6,
}

export type DemoLead = {
  id: string
  name: string
  role: string
  company: string
  source: string
  score: number
  band: "HOT" | "WARM" | "COLD" | "BAD_FIT"
  value: number | null
  status: string
  lastActivity: string
  research: string
  painPoints: string
  scoringReason: string
  draftReply: string | null
  nextAction: string
}

export const demoLeads: DemoLead[] = [
  {
    id: "l1",
    name: "Sarah Chen",
    role: "Founder",
    company: "TechFlow Solutions",
    source: "Website form",
    score: 92,
    band: "HOT",
    value: 18000,
    status: "Draft reply ready",
    lastActivity: "12 minutes ago",
    research:
      "TechFlow Solutions is a 14-person B2B SaaS company (project-management tooling for construction firms). Recently raised a seed round and is hiring across marketing — strong signal they're investing in growth. Their site has no clear lead-nurture flow and their blog has been inactive for 3 months.",
    painPoints:
      "Enquiry mentions demand-gen is 'all founder-led right now' and they're losing inbound interest between calls. Budget likely available post-raise.",
    scoringReason:
      "Matches ICP: B2B SaaS, 10–50 headcount, funded, explicit growth pain. Decision-maker contact. Timeline language ('this quarter') indicates urgency. Scored 92 — HOT.",
    draftReply:
      "Hi Sarah,\n\nThanks for reaching out — congrats on the seed round. Founder-led growth getting stretched is exactly the stage we work best at.\n\nFor construction-tech SaaS like TechFlow, we'd typically start with a 90-day demand engine: positioning refresh, a nurture flow for the inbound you're already getting (so nothing slips between calls), and one repeatable outbound play.\n\nWould a 20-minute call this week be useful? I can walk you through what we did for two similar B2B SaaS teams.\n\nBest,\nMaya",
    nextAction: "Approve the draft reply, then Ava will schedule a follow-up for 3 days out.",
  },
  {
    id: "l2",
    name: "James Okafor",
    role: "Managing Director",
    company: "Northgate Legal",
    source: "LinkedIn",
    score: 88,
    band: "HOT",
    value: 24000,
    status: "Call brief prepared",
    lastActivity: "1 hour ago",
    research:
      "Northgate Legal is a 30-solicitor commercial law firm. They've just opened a second office and their careers page shows a new BD hire — expanding, but their web presence is dated and they rank poorly for their core practice areas.",
    painPoints:
      "Asked specifically about 'predictable client acquisition' — currently dependent on referrals, which slowed this year.",
    scoringReason:
      "High deal value, decision-maker, active expansion. Professional services fit the agency's best case studies. Scored 88 — HOT.",
    draftReply: null,
    nextAction: "Discovery call booked for Thursday — call brief is ready in the approvals queue.",
  },
  {
    id: "l3",
    name: "Priya Sharma",
    role: "Head of Growth",
    company: "Kindle & Co",
    source: "Referral",
    score: 74,
    band: "WARM",
    value: 9500,
    status: "Follow-up scheduled",
    lastActivity: "Yesterday",
    research:
      "DTC homeware brand, ~$2m revenue. Referred by an existing client. Growth lead has budget authority for agencies but mentioned they're 'comparing two other options'.",
    painPoints: "Paid social costs rising; email revenue flat for 6 months.",
    scoringReason:
      "Good fit but active comparison shopping and mid-size budget. Scored 74 — WARM. Follow-up cadence set to 2 days.",
    draftReply: null,
    nextAction: "Follow-up email drafts tomorrow morning unless she replies first.",
  },
  {
    id: "l4",
    name: "Tom Reeves",
    role: "Owner",
    company: "Reeves Fitness",
    source: "Google Ads",
    score: 41,
    band: "COLD",
    value: 2000,
    status: "Nurture sequence",
    lastActivity: "2 days ago",
    research:
      "Single-location gym owner exploring 'marketing help'. Small budget indicated on the enquiry form (<$500/mo).",
    painPoints: "Wants more members but no defined offer or budget.",
    scoringReason:
      "Below ICP budget threshold and B2C local — outside best-fit profile. Scored 41 — COLD. Placed in monthly nurture, no manual effort spent.",
    draftReply: null,
    nextAction: "No action needed — Ava will resurface him if anything changes.",
  },
  {
    id: "l5",
    name: "Elena Petrova",
    role: "Marketing Manager",
    company: "Vault Insurance Group",
    source: "Website form",
    score: 68,
    band: "WARM",
    value: 12000,
    status: "Researching",
    lastActivity: "3 hours ago",
    research:
      "Mid-market insurance group, 120 staff. Marketing manager gathering options for a website + SEO project scoped 'next quarter'.",
    painPoints: "Legacy site, poor organic visibility, long procurement cycle.",
    scoringReason:
      "Solid fit and value, but influencer (not decision-maker) and a next-quarter timeline. Scored 68 — WARM.",
    draftReply: null,
    nextAction: "Ava is preparing a tailored reply with two relevant case studies.",
  },
  {
    id: "l6",
    name: "Marcus Webb",
    role: "Co-founder",
    company: "BuildRight Homes",
    source: "Email enquiry",
    score: 85,
    band: "HOT",
    value: 15000,
    status: "Replied — awaiting response",
    lastActivity: "4 hours ago",
    research:
      "Regional home builder scaling from 20 to 45 builds/year. Wants a full lead-gen system for buyers and land agents.",
    painPoints: "No CRM, enquiries handled in a shared inbox, deals lost to slow response.",
    scoringReason: "Explicit budget, urgent pain, decision-maker. Scored 85 — HOT.",
    draftReply: null,
    nextAction: "Approved reply sent this morning. Ava follows up in 3 days if no response.",
  },
]

export type DemoApproval = {
  id: string
  type: string
  title: string
  lead: string
  summary: string
  content: string
  whatHappensNext: string
}

export const demoApprovals: DemoApproval[] = [
  {
    id: "a1",
    type: "Draft reply",
    title: "Reply to Sarah Chen (TechFlow Solutions)",
    lead: "Sarah Chen · HOT · $18,000",
    summary: "Personalised first reply referencing her seed round and founder-led growth pain.",
    content:
      "Hi Sarah,\n\nThanks for reaching out — congrats on the seed round. Founder-led growth getting stretched is exactly the stage we work best at.\n\nFor construction-tech SaaS like TechFlow, we'd typically start with a 90-day demand engine: positioning refresh, a nurture flow for the inbound you're already getting (so nothing slips between calls), and one repeatable outbound play.\n\nWould a 20-minute call this week be useful? I can walk you through what we did for two similar B2B SaaS teams.\n\nBest,\nMaya",
    whatHappensNext: "Ava sends the reply, logs it in the CRM, and schedules a 3-day follow-up.",
  },
  {
    id: "a2",
    type: "Call brief",
    title: "Discovery call brief — James Okafor (Northgate Legal)",
    lead: "James Okafor · HOT · $24,000",
    summary: "Pre-call brief for Thursday's discovery call: firm context, pain points, talking points.",
    content:
      "CALL BRIEF — Northgate Legal (Thu, 10:30)\n\nWho: James Okafor, Managing Director. 30-solicitor commercial firm, just opened a second office.\n\nWhy now: Referral flow slowed this year; wants 'predictable client acquisition'.\n\nTalking points:\n1. Their expansion signals budget — anchor on cost-per-instruction, not marketing spend.\n2. They rank poorly for 'commercial property solicitor [city]' — quick-win SEO story.\n3. Case study: 42% enquiry lift for a comparable firm in 6 months.\n\nWatch for: procurement may involve the partnership board — ask about sign-off early.",
    whatHappensNext: "The brief is pinned to the lead record and emailed to you 1 hour before the call.",
  },
  {
    id: "a3",
    type: "Follow-up",
    title: "Follow-up sequence — Priya Sharma (Kindle & Co)",
    lead: "Priya Sharma · WARM · $9,500",
    summary: "2-touch follow-up: case-study email tomorrow, check-in note in 5 days.",
    content:
      "Touch 1 (tomorrow, 9:00):\n\"Hi Priya — one thing I forgot to mention: we took a homeware brand from flat email revenue to 31% of total sales in 4 months. Happy to share the exact flow map if useful while you compare options.\"\n\nTouch 2 (day 5, if no reply):\n\"No pressure at all — should I close your file for now, or is this still on your radar for this quarter?\"",
    whatHappensNext: "Ava sends each touch on schedule and stops instantly if Priya replies.",
  },
]

export const demoActivity = [
  { time: "12 min ago", text: "Researched TechFlow Solutions and drafted a reply for your approval" },
  { time: "1 h ago", text: "Prepared Thursday's call brief for Northgate Legal" },
  { time: "3 h ago", text: "Started research on Vault Insurance Group (new website enquiry)" },
  { time: "4 h ago", text: "Sent your approved reply to Marcus Webb and scheduled a 3-day follow-up" },
  { time: "Yesterday", text: "Scored 4 new leads: 1 HOT, 2 WARM, 1 COLD" },
  { time: "Yesterday", text: "Flagged Reeves Fitness as below budget threshold — moved to nurture" },
]

export const demoChatScript: { question: string; answer: string }[] = [
  {
    question: "What should I focus on today?",
    answer:
      "Three things today: 1) Approve the reply to Sarah Chen — she's your hottest lead ($18k, funded, ready to move). 2) Skim Thursday's call brief for Northgate Legal. 3) Priya Sharma's follow-up goes out tomorrow — approve it today so nothing stalls. Everything else is handled.",
  },
  {
    question: "Why did you score Tom Reeves as COLD?",
    answer:
      "Tom runs a single-location gym with an indicated budget under $500/month — below your minimum engagement. Rather than spend your time on it, I put him in the monthly nurture sequence. If his budget or needs change, I'll flag him again.",
  },
  {
    question: "Summarise my pipeline",
    answer:
      "You have 47 leads worth roughly $86,500. 6 are HOT (focus: Sarah Chen and James Okafor — $42k combined), 14 are WARM with follow-ups scheduled, and the rest are in nurture. 3 items are waiting on your approval — that's the only thing blocking me right now.",
  },
]

export const demoChatFallback =
  "In the live product I'd answer that from your real pipeline data. In this demo, try one of the suggested questions — or hire me and ask anything you like. 😉"
