# Pricing and Packages

## Positioning

GrowthAgent OS is sold as an **AI employee**, not a software tool. The comparison
point is a sales hire ($4,000–$6,000/mo, plus onboarding time and employment risk),
not a SaaS subscription. We build and configure each client's AI agents, then
monitor and tune them every month — so pricing reflects a managed service, not
self-serve software.

Every plan includes the private **CRM review hub** where the AI employee sends all
its work (scored leads, draft replies, follow-ups), and the client approves actions
from the dashboard, their phone, or email.

## The Lead Allowance

Every plan includes a **monthly lead allowance**. Always frame it as a "lead
allowance" in customer-facing copy — never "credits" or "tokens".

- **1 lead = one complete cycle**: research + ICP scoring + drafted reply + all
  follow-ups for that lead. One number, no hidden meters.
- **Overage**: prepaid top-up packs — **+100 leads for $49**, one tap from the
  dashboard. We never auto-bill overages.
- We notify the client at **80%** of their allowance.
- Unused leads **do not roll over**; the allowance resets each billing cycle.
- Clients can change tiers anytime (effective next cycle).

## Plans

All plans are **month-to-month, cancel anytime**. Pay annually, get 2 months free.

### AI Sales Assistant — $497/mo + $997 setup & build

Your first AI employee. **200 leads included per month.**

Features:
- 1 AI employee: lead research, ICP scoring (1–100), reply drafting
- Approval queue dashboard — nothing sends without sign-off
- Email + web form lead capture
- Monthly tune-up (scoring accuracy review + prompt updates)
- Email support

### AI Sales Team — $997/mo + $1,997 setup & build

Three AI employees working the pipeline. **Most popular.**
**500 leads included per month.**

Includes everything in Assistant, plus:
- 3 AI employees — adds follow-up sequencing and call-prep briefs
- Priority support (same business day)
- Monthly performance report
- Custom voice calibration refreshes

### Full AI Revenue OS — $1,997/mo + $2,997 setup & build

A complete AI sales department. **1,500 leads included per month.**

Includes everything in Team, plus:
- Full agent suite — adds proposal drafting and competitor monitoring
- Quarterly strategy call
- Dedicated Slack/WhatsApp support channel

## Guarantee

**30-Day Setup Guarantee** — if the client's AI employee hasn't researched, scored,
and drafted a reply for every lead in their pipeline within 30 days, we refund the
setup fee. Display this near the pricing CTA.

## Plan Feature Gating

Features are gated in code via `src/lib/plans.ts`. The `hasFeature(company, feature)` function checks the company's active plan against the feature list.

To add a new gated feature:
1. Add the feature key to `PlanFeature` type
2. Add it to the appropriate plan constant in `plans.ts`
3. Wrap the UI component with `hasFeature()` check
4. Show `<UpgradeCard>` for locked features

Plan prices and lead allowances used by the app live in `getPlanDisplay()` and
`PLAN_LIMITS` (`maxLeadsPerMonth`) in the same file — keep them in sync with this
document and the marketing site.

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
