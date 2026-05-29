# Sales Call Prep Agent

## Name
`sales-call-prep-agent`

## Description
Generates a comprehensive, ready-to-use sales call brief for a specific lead. Includes lead summary, company overview, likely pain points, tailored discovery questions, suggested offer angle, risk flags, and a strong opening line. Saved as a LeadNote for easy access during the call.

## When to Use
- Before a scheduled call with a lead
- When a user clicks "Prepare Call Brief" on a lead detail page
- When a user asks the agent to prepare for a call

## Inputs Expected
```json
{
  "company": {
    "name": "string",
    "mainOffer": "string",
    "idealCustomerProfile": "string"
  },
  "lead": {
    "name": "string",
    "companyName": "string",
    "website": "string",
    "painPoints": "string",
    "fitSummary": "string",
    "researchSummary": "string",
    "score": "number",
    "scoreBand": "string",
    "estimatedValue": "number | null",
    "message": "string"
  }
}
```

## Output JSON Schema
```json
{
  "leadSummary": "string",
  "companyOverview": "string",
  "likelyPainPoints": ["string"],
  "discoveryQuestions": ["string"],
  "suggestedOfferAngle": "string",
  "risks": ["string"],
  "callOpener": "string",
  "nextSteps": ["string"]
}
```

## Discovery Question Framework
The agent generates questions across these categories:
1. **Trigger** — What prompted this now?
2. **History** — Have they tried to solve this before?
3. **Success** — What does winning look like?
4. **Decision** — Who else is involved?
5. **Timeline** — When do they need a solution?
6. **Budget** — What's the investment range?

## Safety Rules
- NEVER book a call without user confirmation
- Brief is for internal use only — never shared with the lead automatically
- No approval required (read-only, internal document)

## Approval Rules
- Call brief generation: no approval required
- Booking a call after the brief: requires `BOOK_CALL` approval
- Sending a proposal after the call: requires `SEND_PROPOSAL` approval

## Example Output
```json
{
  "leadSummary": "Sarah Chen, Head of BD at Fintech Agency Ltd. Score: 87/100 (HOT). Est. value: £12,000. Came in via website form 2 days ago.",
  "companyOverview": "UK-based financial marketing agency (~25 staff). Serves fintech clients. Growing rapidly — recently posted a 'growth ops' role on LinkedIn.",
  "likelyPainPoints": [
    "Lead response too slow — losing hot leads to competitors",
    "Small sales team, overwhelmed with enquiry volume",
    "No structured follow-up system"
  ],
  "discoveryQuestions": [
    "What triggered reaching out now — was there a specific lead you lost?",
    "How are you currently managing new enquiries — what does that process look like?",
    "How quickly do you need this solved?",
    "Who else would be involved in a decision like this?"
  ],
  "suggestedOfferAngle": "Position Pipeline Agent around speed-to-lead and the approval queue — they need control, not automation they can't see.",
  "risks": ["Small team — may resist new systems", "Not confirmed budget yet"],
  "callOpener": "Hi Sarah, before I tell you about what we do — I'd love to understand more about the lead response challenge you mentioned. What's the current gap?",
  "nextSteps": ["Confirm budget range", "Send Pipeline Agent overview deck", "Follow up within 24h if no response"]
}
```
