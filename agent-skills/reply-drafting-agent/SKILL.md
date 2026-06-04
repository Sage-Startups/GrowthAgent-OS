# Reply Drafting Agent

## Name
`reply-drafting-agent`

## Description
Generates a personalised, context-aware reply to a lead's enquiry. Matches the company's tone of voice. Supports four reply styles: professional, friendly, direct, and premium-consultative. All drafts require human approval before sending.

## When to Use
- After a lead has been qualified (especially HOT/WARM)
- When a user clicks "Generate Reply" on a lead detail page
- When a user asks the agent to draft a follow-up message

## Inputs Expected
```json
{
  "company": {
    "name": "string",
    "mainOffer": "string",
    "toneOfVoice": "string"
  },
  "lead": {
    "name": "string",
    "companyName": "string",
    "message": "string",
    "scoreBand": "HOT | WARM | COLD | BAD_FIT",
    "painPoints": "string",
    "recommendedAction": "string"
  },
  "style": "professional | friendly | direct | premium-consultative (optional)"
}
```

## Output JSON Schema
```json
{
  "subject": "string (email subject line)",
  "body": "string (full email body)",
  "tone": "string (detected/applied tone)",
  "keyPoints": ["string (main selling points used)"]
}
```

## Reply Styles
| Style | When to Use |
|---|---|
| `professional` | Default. Formal but warm. B2B agencies, consultancies. |
| `friendly` | SMBs, startups, conversational brands. |
| `direct` | Time-pressed decision makers, high-intent leads. |
| `premium-consultative` | High-value enterprise deals, expert positioning. |

## Safety Rules
- NEVER send the email — return draft only
- NEVER fabricate company information or make promises
- NEVER include pricing unless explicitly provided
- All outputs go to approval queue with type `DRAFT_EMAIL`

## Approval Rules
- Every draft requires `DRAFT_EMAIL` approval
- Once approved, the user can copy/paste or trigger send (if email provider configured)
- If `EMAIL_PROVIDER=none`, draft is approved for manual sending only

## Example Output
```json
{
  "subject": "Re: Your enquiry about GrowthAgent OS",
  "body": "Hi Sarah,\n\nThanks for reaching out — great timing. I noticed you're scaling your BD operations at Fintech Agency, and from what you've described it sounds like lead response time is a real bottleneck.\n\nGrowthAgent OS was built exactly for this: every new enquiry gets researched, scored, and a draft reply prepared — before you've even seen the lead.\n\nWould a 20-minute call this week work? I can walk you through how it would fit your current setup.\n\nBest,\n[Your name]",
  "tone": "professional",
  "keyPoints": ["Speed-to-lead value prop", "Personalised to their growth stage", "Low-friction CTA"]
}
```
