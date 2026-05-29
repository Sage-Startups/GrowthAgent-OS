# GrowthAgent OS — Agent Skill Packs

This folder contains productised agent skill packs for the GrowthAgent OS platform. Each skill represents a self-contained AI agent capability that can be:

1. **Used locally** via the built-in deterministic engine (no external AI required)
2. **Connected to OpenClaw** by copying the skill into a client workspace
3. **Upgraded to LLM-powered** by using the prompt templates in `/src/lib/agents/prompt-builders.ts`

## Available Skills

| Skill | Plan | Status |
|---|---|---|
| `lead-qualification-agent` | Starter+ | Active |
| `reply-drafting-agent` | Starter+ | Active |
| `follow-up-agent` | Pipeline+ | Active |
| `sales-call-prep-agent` | Pipeline+ | Active |
| `weekly-report-agent` | Starter+ | Active |
| `proposal-prep-agent` | Growth OS | Active |
| `competitor-monitoring-agent` | Growth OS | Active |
| `client-onboarding-agent` | All plans | Active |

## How to Use a Skill Pack

### Option 1: Local Mode (no configuration needed)
All skills work out of the box using the local deterministic engine at `src/lib/agents/local-provider.ts`. No external configuration required.

### Option 2: Connect to OpenClaw
1. Copy the skill folder into your OpenClaw workspace
2. Configure the gateway URL in GrowthAgent OS settings → Agent → OpenClaw
3. The app will automatically route tasks to OpenClaw when configured

### Option 3: LLM Upgrade
Each skill has a corresponding prompt builder in `src/lib/agents/prompt-builders.ts`. Point the prompt at any LLM API (OpenAI, Anthropic, etc.) to get richer, context-aware outputs. The output schemas in `src/lib/agents/output-schemas.ts` ensure structured, validated responses.

## Skill File Format

Each `SKILL.md` contains:
- **Name** — Machine-readable identifier
- **Description** — What the skill does
- **When to Use** — Trigger conditions
- **Inputs Expected** — JSON schema for inputs
- **Output JSON Schema** — Validated output structure
- **Safety Rules** — What the agent must never do
- **Approval Rules** — Which actions require human sign-off
- **Example Output** — Reference implementation

## Safety Architecture

Every skill in this pack follows the **Approval-First** principle:

> The agent can research, draft, and recommend — but cannot execute external actions without explicit human approval.

Approval types are defined in `prisma/schema.prisma` under `ApprovalType`:
- `DRAFT_EMAIL` — Email draft awaiting send approval
- `SEND_EMAIL` — Approved email ready to send
- `FOLLOW_UP` — Follow-up message awaiting approval
- `CALL_SCRIPT` — Call brief (no approval required — internal only)
- `BOOK_CALL` — Calendar booking awaiting confirmation
- `PROPOSAL_OUTLINE` — Proposal draft for review
- `SEND_PROPOSAL` — Approved proposal ready to send
- `CRM_STATUS_CHANGE` — Lead status change awaiting confirmation
