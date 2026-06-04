# Weekly Report Agent

## Name
`weekly-report-agent`

## Description
Generates a concise, actionable weekly pipeline report. Summarises new leads, pipeline health, hot opportunities, missed follow-ups, bottlenecks, and suggested actions for the week ahead. Saved to the Report table and visible on the Reports page.

## When to Use
- Every Monday morning (scheduled job)
- When a user asks "give me a weekly summary"
- When a user visits the Reports page and requests a new report

## Inputs Expected
```json
{
  "companyId": "string",
  "stats": {
    "newLeads": "number",
    "hotLeads": "number",
    "warmLeads": "number",
    "coldLeads": "number",
    "overdueFollowUps": "number",
    "totalLeads": "number",
    "wonThisWeek": "number",
    "lostThisWeek": "number",
    "agentTasksCompleted": "number"
  }
}
```

## Output JSON Schema
```json
{
  "executiveSummary": "string (2–3 sentences)",
  "leadStats": {
    "newThisWeek": "number",
    "hotCount": "number",
    "warmCount": "number",
    "coldCount": "number",
    "overdueFollowUps": "number",
    "wonThisWeek": "number"
  },
  "bestOpportunities": ["string"],
  "missedFollowUps": ["string"],
  "bottlenecks": ["string"],
  "suggestedActions": ["string"]
}
```

## Report Sections
1. **Executive Summary** — One-paragraph overview of pipeline health
2. **Lead Stats** — Numeric breakdown
3. **Best Opportunities** — Top 3 leads to focus on
4. **Missed Follow-Ups** — Overdue leads requiring immediate action
5. **Bottlenecks** — Structural issues in the pipeline
6. **Suggested Actions** — Prioritised action list for the week

## Safety Rules
- Report is read-only — no data changes
- No approval required for report generation
- Do not include sensitive personal data beyond what is already in the system

## Approval Rules
- Report generation: no approval required
- Actions suggested in the report: each requires its own approval if they involve external communication

## Example Output
```json
{
  "executiveSummary": "Strong week: 6 new leads with 2 HOT. Pipeline value grew to £84,500. Main risk is 3 overdue follow-ups that need attention today.",
  "leadStats": {
    "newThisWeek": 6,
    "hotCount": 8,
    "warmCount": 14,
    "coldCount": 6,
    "overdueFollowUps": 3,
    "wonThisWeek": 1
  },
  "bestOpportunities": [
    "Priya Sharma (SaaS Launch HQ) — Score 91, £18k, referred. Book demo urgently.",
    "Victoria Hammond (Hammond Group) — Score 89, £35k, budget confirmed. Prioritise today.",
    "James Hartley (Hartley Digital) — Score 82, £12k, HOT. Draft reply ready to approve."
  ],
  "missedFollowUps": [
    "Marcus Webb — 4 days overdue. Last contact was initial reply.",
    "Tom Rigby — 7 days overdue. Requested pricing info."
  ],
  "bottlenecks": [
    "3 HOT leads with no draft reply generated",
    "5 leads stuck in NEW status, not yet qualified"
  ],
  "suggestedActions": [
    "Approve draft replies for Priya and Victoria today",
    "Run qualification on 5 NEW leads",
    "Follow up with Marcus Webb and Tom Rigby",
    "Review and close out 2 COLD leads that haven't responded in 30+ days"
  ]
}
```
