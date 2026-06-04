# Pricing and Packages

## Positioning

GrowthAgent OS is sold as an **AI employee**, not a software tool. The comparison
point is a sales hire ($3,000–$5,000/mo), not a SaaS subscription. We build and
configure each client's AI agents, then monitor and tune them every month — so
pricing reflects a managed service, not self-serve software.

Every plan includes the private **CRM review hub** where the AI employee sends all
its work (scored leads, draft replies, follow-ups), and the client approves actions
from the dashboard, their phone, or email.

## Plans

### AI Sales Assistant — $497/mo + $500 setup & build

Your first AI employee. One dedicated agent, private CRM review hub.

Features:
- 1 dedicated AI agent
- Reviews & scores every lead (Hot / Warm / Cold / Bad Fit)
- Researches each prospect
- Drafts replies in your tone
- Follow-up reminders
- Private CRM — your review hub
- Approve actions by phone or email
- We build & configure your agent
- Ongoing monitoring & tuning

### AI Sales Team — $997/mo + $1,000 setup & build

Three AI employees working your pipeline. **Most popular.**

Includes everything in Assistant, plus:
- 3 dedicated AI agents
- Follow-up agent (overdue tracking)
- Sales-call prep agent (pre-call briefs)
- Custom scoring rules for your business
- CRM auto-updates from every agent
- Weekly check-in & optimisation
- Priority support

### Full AI Revenue OS — $1,997/mo + $1,500 setup & build

A complete AI sales department for scaling businesses.

Includes everything in Sales Team, plus:
- Full agent suite
- Proposal preparation agent
- Competitor monitoring agent
- Client onboarding agent
- Voice agent (AI calls)
- Monthly performance report
- Custom integrations
- Dedicated account manager

## Plan Feature Gating

Features are gated in code via `src/lib/plans.ts`. The `hasFeature(company, feature)` function checks the company's active plan against the feature list.

To add a new gated feature:
1. Add the feature key to `PlanFeature` type
2. Add it to the appropriate plan constant in `plans.ts`
3. Wrap the UI component with `hasFeature()` check
4. Show `<UpgradeCard>` for locked features

## Setup & Build Fees

The setup & build fee covers the hands-on work of standing up each client's AI
employee. This is real labour (roughly 3–6 hours per client) and is the reason the
fee exists:
- Discovery call (30–60 min)
- Building & configuring the AI agent(s) for the client's business
- Full configuration of scoring rules and ICP
- Lead source integration and testing
- Phone/email approval channel setup
- Agent walkthrough and training
- 30-day support window

## Monitoring & Why the Retainer

The monthly price is not just software access — it covers ongoing monitoring and
tuning of each client's agents (typically 6–12 hours/month across setup, monitoring,
and check-ins). This managed-service element is the core of the offer and the reason
pricing sits well above self-serve SaaS tools.

## Custom Pricing

For enterprise or multi-seat deployments, contact the team directly. Custom pricing is available for:
- White-label deployments
- Multiple company workspaces
- Custom agent development
- Dedicated infrastructure
