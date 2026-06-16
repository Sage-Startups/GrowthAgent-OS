export type CreditAction =
  | "basic_lead_found"
  | "lead_scored"
  | "deep_lead_research"
  | "contact_enrichment"
  | "personalised_reply_draft"
  | "follow_up_draft"
  | "call_brief"
  | "proposal_draft"
  | "competitor_check"
  | "voice_minute"
  | "weekly_report"
  | "manual_agent_instruction"

export const CREDIT_COSTS: Record<CreditAction, number> = {
  basic_lead_found: 1,
  lead_scored: 1,
  deep_lead_research: 2,
  contact_enrichment: 3,
  personalised_reply_draft: 2,
  follow_up_draft: 2,
  call_brief: 5,
  proposal_draft: 20,
  competitor_check: 10,
  voice_minute: 2,
  weekly_report: 15,
  manual_agent_instruction: 5,
}
