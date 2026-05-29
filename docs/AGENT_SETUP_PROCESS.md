# Agent Setup Process

How GrowthAgent OS agents are configured and run for each company.

## Agent Types

| Type | Description | Plan Required |
|------|-------------|---------------|
| `LEAD_RESEARCH` | Researches and scores new leads | All plans |
| `FOLLOW_UP` | Tracks overdue follow-ups | Pipeline+ |
| `CALL_PREP` | Prepares pre-call briefs | Pipeline+ |
| `PROPOSAL` | Drafts proposals | Growth OS |
| `COMPETITOR_MONITOR` | Monitors competitor signals | Growth OS |
| `VOICE` | Inbound voice qualification | Growth OS |

## Engine Selection

Each company can use either engine:

### Local Engine (default)
- Deterministic scoring rules
- Pattern matching against ICP
- No external API required
- Always available as fallback

### OpenClaw Engine
- LLM-powered analysis
- Richer research and summaries
- Requires gateway URL, agent ID, API key
- Falls back to local if unreachable

## Lead Research Flow

1. Lead arrives via webhook or manual entry
2. Agent task created: `LEAD_RESEARCH`
3. Engine researches company website and signals
4. Score calculated (0–100) and band assigned
5. Draft reply generated (if enabled)
6. Approval request created for draft email
7. Audit log entry created

## Scoring Bands

| Band | Score Range | Action |
|------|-------------|--------|
| HOT | 75–100 | Immediate approval queue + notification |
| WARM | 50–74 | Add to follow-up schedule |
| COLD | 25–49 | Monitor list |
| BAD_FIT | 0–24 | Archive and close |

## Adding a New Agent

Agents are created automatically on company onboarding. To add manually:

```typescript
await prisma.agent.create({
  data: {
    companyId,
    name: "Custom Agent",
    type: "LEAD_RESEARCH",
    status: "ACTIVE",
  },
})
```
