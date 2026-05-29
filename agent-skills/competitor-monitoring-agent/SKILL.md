# Competitor Monitoring Agent

## Name
`competitor-monitoring-agent`

## Description
Researches the competitive landscape for the company's market. Identifies key competitors, assesses their strengths and weaknesses, surfaces differentiators, and provides positioning recommendations. Uses general knowledge — no real-time web scraping.

## When to Use
- Onboarding a new company (initial competitive analysis)
- Preparing for a sales call where competitive objections are likely
- Quarterly competitive review
- When a lead mentions a specific competitor

## Inputs Expected
```json
{
  "company": {
    "name": "string",
    "mainOffer": "string",
    "businessType": "string",
    "idealCustomerProfile": "string"
  },
  "industry": "string (optional — inferred from mainOffer if not provided)",
  "focusCompetitor": "string (optional — for single-competitor deep dive)"
}
```

## Output JSON Schema
```json
{
  "summary": "string",
  "competitors": [{
    "name": "string",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "positioning": "string",
    "pricingSignal": "string (if known)"
  }],
  "differentiators": ["string"],
  "recommendations": ["string"],
  "objectionHandling": [{
    "objection": "string",
    "response": "string"
  }]
}
```

## Safety Rules
- Use general knowledge only — no live web requests
- NEVER make false claims about competitors
- Mark any uncertain information with "(estimated)" or "(general knowledge)"
- Research is for internal use only — not to be shared with leads without review

## Approval Rules
- Research generation: no approval required
- Using competitive intel in a proposal or reply: human review required
- All outputs for internal use only by default

## Example Output
```json
{
  "summary": "The AI sales operations market is early-stage. Main alternatives are HubSpot AI features, traditional CRMs, and SDR tools like Outreach and Salesloft. GrowthAgent OS differentiates on simplicity, approval-based safety, and SMB pricing.",
  "competitors": [
    {
      "name": "HubSpot AI",
      "strengths": ["Large ecosystem", "Brand recognition", "Existing CRM integrations"],
      "weaknesses": ["Complex to configure", "Expensive at scale", "Not designed for SMBs"],
      "positioning": "Enterprise-oriented, broad platform",
      "pricingSignal": "£400–£1,500+/month"
    }
  ],
  "differentiators": [
    "Approval-first safety — human in the loop at every step",
    "Simple onboarding — live in days, not months",
    "Purpose-built for SMB agencies and consultancies",
    "Transparent AI scoring with clear reasoning"
  ],
  "recommendations": [
    "Lead with approval-first safety when prospects mention concerns about AI autonomy",
    "Compare setup time vs HubSpot when competing on simplicity",
    "Emphasise pricing transparency vs Salesloft/Outreach for SMBs"
  ],
  "objectionHandling": [
    {
      "objection": "We already use HubSpot",
      "response": "GrowthAgent OS sits alongside HubSpot — it handles the qualification and drafting layer so your HubSpot stays clean. We have a HubSpot sync integration in development."
    }
  ]
}
```
