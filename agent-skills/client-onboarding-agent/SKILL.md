# Client Onboarding Agent

## Name
`client-onboarding-agent`

## Description
Guides a new client through the GrowthAgent OS setup process. Validates their company configuration, ensures lead sources are connected, agents are active, and the first approval workflow is tested. Generates a personalised onboarding checklist and welcome brief.

## When to Use
- Immediately after a new company signs up
- When a company's `setupStatus` is NEW, ONBOARDING, or CONFIGURING
- When a company completes payment and needs to be activated
- When an admin triggers onboarding for a customer

## Inputs Expected
```json
{
  "company": {
    "id": "string",
    "name": "string",
    "mainOffer": "string",
    "idealCustomerProfile": "string",
    "leadSources": ["string"],
    "toneOfVoice": "string",
    "setupStatus": "string",
    "agents": ["string (agent types active)"]
  },
  "plan": {
    "name": "string",
    "features": ["string"]
  }
}
```

## Output JSON Schema
```json
{
  "welcomeMessage": "string",
  "checklistItems": [{
    "step": "number",
    "title": "string",
    "description": "string",
    "completed": "boolean",
    "requiredFor": "string (what breaks if skipped)"
  }],
  "estimatedSetupMinutes": "number",
  "recommendedFirstAction": "string",
  "warningFlags": ["string"]
}
```

## Onboarding Checklist Items
The agent generates a personalised checklist based on the company's plan and configuration:

1. **Company Profile** — Name, offer, ICP, tone
2. **Lead Sources** — At least one connected
3. **Agent Activation** — Research and scoring agents active
4. **Approval Workflow** — Test approval queue with a demo lead
5. **API Key** — Generated for webhook lead intake
6. **First Real Lead** — Run qualification on a live lead
7. **Weekly Report** — Generate first report to confirm data
8. *(Pipeline+ only)* **Follow-Up Agent** — Configured and active
9. *(Growth OS only)* **Integrations** — HubSpot or CRM connected

## Safety Rules
- NEVER activate agents without confirming setup is complete
- NEVER send welcome emails to the client's customers automatically
- Setup actions require confirmation at each step

## Approval Rules
- Onboarding checklist: no approval required
- Sending welcome email to client: requires user confirmation
- Agent activation: automatic after setup completion

## Example Output
```json
{
  "welcomeMessage": "Welcome to GrowthAgent OS, Acme Digital Agency! Your Pipeline Agent is nearly ready. Complete the 5-step setup below and your first lead will be scored automatically within minutes of arriving.",
  "checklistItems": [
    {
      "step": 1,
      "title": "Complete company profile",
      "description": "Add your main offer, ideal customer profile, and tone of voice so the agent can score and reply on your behalf.",
      "completed": true,
      "requiredFor": "Lead scoring and reply generation"
    },
    {
      "step": 2,
      "title": "Connect your first lead source",
      "description": "Add the webhook endpoint to your website contact form or import your first leads via CSV.",
      "completed": false,
      "requiredFor": "Automatic lead intake"
    },
    {
      "step": 3,
      "title": "Test the approval queue",
      "description": "Load demo leads and run qualification to see the full approval workflow.",
      "completed": false,
      "requiredFor": "Confirming agent output before going live"
    }
  ],
  "estimatedSetupMinutes": 20,
  "recommendedFirstAction": "Complete your company profile and load demo leads to see the agent in action.",
  "warningFlags": ["Lead source not connected — no leads will arrive automatically until this is done"]
}
```
