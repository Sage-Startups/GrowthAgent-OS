# Customer Onboarding Guide

How to onboard a new GrowthAgent OS customer from sign-up to live.

## Timeline

Typical onboarding takes 5–7 business days.

| Day | Activity |
|-----|----------|
| 1 | Discovery call, access granted |
| 2–3 | Configuration: ICP, scoring rules, tone |
| 4 | Lead source connection and test |
| 5 | Live walkthrough and approval queue training |
| 7 | First live leads processed |

## Onboarding Steps (In-App)

The customer completes a 4-step wizard at `/app/onboarding`:

1. **Business** — name, type, website, main offer, deal value
2. **Customers** — ICP description, bad-fit traits
3. **Setup** — lead sources, current CRM
4. **Tone & Preferences** — voice, agent behaviour toggles

After submission, a Lead Research Agent is automatically created.

## Operator Configuration (Admin)

After the customer completes onboarding:

1. Review ICP and scoring rules in Settings → Lead Scoring
2. Configure agent engine (local or OpenClaw) in Settings → Agent
3. Test connection if using OpenClaw
4. Verify at least one lead source is active

## First Lead Test

Send a test lead via the webhook:

```bash
curl -X POST https://your-domain.com/api/leads/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "companyApiKey": "gao_...",
    "name": "Test Lead",
    "email": "test@example.com",
    "companyName": "Test Co",
    "message": "Interested in your services"
  }'
```

Verify the lead appears in the CRM and an agent task is created.

## Handover

Provide the customer with:
- Dashboard URL
- Login credentials
- API key for their lead source
- Webhook endpoint URL
- Brief video walkthrough of the approval queue
