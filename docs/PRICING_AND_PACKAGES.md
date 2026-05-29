# Pricing and Packages

## Plans

### Lead Agent Starter — $99/mo + $499 setup

Entry point. One AI sales operator, private CRM, basic automation.

Features:
- Private lead CRM dashboard
- AI lead research on every new lead
- Lead scoring (Hot / Warm / Cold / Bad Fit)
- Draft email replies (approval queue)
- Agent chat
- Weekly pipeline report
- 1 lead source

### Pipeline Agent — $249/mo + $1,500 setup

Full pipeline automation for growing businesses.

Includes everything in Starter, plus:
- Up to 3 lead sources
- Follow-up agent (overdue tracking)
- Sales-call prep agent (pre-call briefs)
- Custom scoring rules
- Pipeline report with trends
- Monthly optimisation review

### Growth Agent OS — from $599/mo + from $3,000 setup

Complete AI revenue operation for scaling businesses.

Includes everything in Pipeline, plus:
- Full agent suite
- Proposal preparation agent
- Competitor monitoring agent
- Client onboarding agent
- Voice agent (inbound + browser)
- Custom integrations
- Priority support
- Done-for-you workflow configuration

## Plan Feature Gating

Features are gated in code via `src/lib/plans.ts`. The `hasFeature(company, feature)` function checks the company's active plan against the feature list.

To add a new gated feature:
1. Add the feature key to `PlanFeature` type
2. Add it to the appropriate plan constant in `plans.ts`
3. Wrap the UI component with `hasFeature()` check
4. Show `<UpgradeCard>` for locked features

## Setup Fees

Setup fees cover:
- Discovery call (30–60 min)
- Full configuration of scoring rules and ICP
- Lead source integration and testing
- Agent walkthrough and training
- 30-day support window

## Custom Pricing

For enterprise or multi-seat deployments, contact the team directly. Custom pricing is available for:
- White-label deployments
- Multiple company workspaces
- Custom agent development
- Dedicated infrastructure
