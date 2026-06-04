# Launch Checklist

Use this before going live with a new GrowthAgent OS workspace.

## Environment

- [ ] `DATABASE_URL` set and database reachable
- [ ] `NEXTAUTH_SECRET` set (min 32 chars, generated with `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` matches your production domain
- [ ] Prisma migrations applied (`npx prisma migrate deploy`)
- [ ] Seed data removed or replaced with real data

## Stripe (if billing enabled)

- [ ] `STRIPE_SECRET_KEY` set
- [ ] `STRIPE_WEBHOOK_SECRET` set
- [ ] Stripe webhook endpoint configured: `POST /api/webhooks/stripe`
- [ ] Plans created in Stripe matching names in `PLAN_FEATURES`

## Agent Engine

- [ ] Default: local engine active (no config required)
- [ ] Optional: OpenClaw gateway URL, agent ID, and API key set
- [ ] Connection test passed (Settings → Agent → Test Connection)

## Voice (Growth Agent OS only)

- [ ] Voice provider selected (vapi / twilio)
- [ ] Provider API keys set in environment
- [ ] Webhook secret set (`VOICE_WEBHOOK_SECRET`)
- [ ] Webhook endpoint registered with provider: `POST /api/voice/webhook`

## Security

- [ ] All approval types default to PENDING (never auto-approve externally)
- [ ] Audit log accessible in Settings → Security
- [ ] API key generated for webhook ingestion
- [ ] Admin user password changed from default

## Final Checks

- [ ] Onboarding completed for demo company
- [ ] At least one lead source connected
- [ ] Agent tasks completing without errors
- [ ] Approval queue accessible and functional
