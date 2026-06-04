# Proposal Prep Agent

## Name
`proposal-prep-agent`

## Description
Creates a structured proposal outline for a qualified lead. Includes an executive summary, problem statement, proposed solution, investment outline, key benefits, and next steps. All proposals require human review and approval before sending.

## When to Use
- After a successful discovery call
- When a lead is in CALL_BOOKED or QUALIFIED status and shows strong intent
- When a user asks the agent to prepare a proposal

## Inputs Expected
```json
{
  "company": {
    "name": "string",
    "mainOffer": "string",
    "averageDealValue": "number"
  },
  "lead": {
    "name": "string",
    "companyName": "string",
    "painPoints": "string",
    "fitSummary": "string",
    "estimatedValue": "number | null",
    "notes": "string (call notes, if available)"
  }
}
```

## Output JSON Schema
```json
{
  "title": "string",
  "executiveSummary": "string",
  "problemStatement": "string",
  "proposedSolution": "string",
  "investmentOutline": "string",
  "nextSteps": ["string"],
  "keyBenefits": ["string"]
}
```

## Proposal Structure
1. **Title** — Personalised to the prospect company
2. **Executive Summary** — Why you're the right choice for them specifically
3. **Problem Statement** — Their pain points in their own language
4. **Proposed Solution** — Your offer, mapped to their specific needs
5. **Investment Outline** — Placeholder pricing / payment options
6. **Key Benefits** — Quantified where possible
7. **Next Steps** — What happens after they say yes

## Safety Rules
- NEVER include actual pricing without explicit instruction
- NEVER send the proposal — return for human review and editing
- Proposal is a starting point, not a final document

## Approval Rules
- Proposal generation: no approval required (internal draft)
- Sending the proposal to the lead: requires `SEND_PROPOSAL` approval
- Signing/contracting: outside scope of this skill

## Example Output
```json
{
  "title": "GrowthAgent OS Proposal — SaaS Launch HQ",
  "executiveSummary": "This proposal outlines how GrowthAgent OS can help SaaS Launch HQ scale their sales pipeline from 1 to 5 reps without proportionally increasing headcount, using AI-powered lead qualification and approval-based outreach.",
  "problemStatement": "SaaS Launch HQ is scaling rapidly but your sales team is already stretched. Leads are taking too long to qualify, follow-ups are inconsistent, and you don't have a system that scales without hiring more SDRs.",
  "proposedSolution": "GrowthAgent OS Pipeline Agent: a private AI sales operator that researches every new lead within minutes, scores fit, drafts personalised replies, and manages your follow-up queue — all with human approval at every step.",
  "investmentOutline": "Pipeline Agent: £1,500 setup + £249/month. Includes up to 3 lead sources, follow-up agent, sales call prep, and monthly optimisation.",
  "nextSteps": ["Review and approve this proposal", "Book onboarding call (45 min)", "Connect your first lead source", "Agent goes live within 5 business days"],
  "keyBenefits": ["Respond to hot leads in <5 minutes", "Never miss a follow-up", "Sales call briefs prepared automatically", "Full approval control at every step"]
}
```
