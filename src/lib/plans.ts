export type PlanFeature =
  | "lead_crm"
  | "lead_scoring"
  | "agent_chat"
  | "approval_queue"
  | "weekly_reports"
  | "follow_up_agent"
  | "sales_call_prep"
  | "proposal_prep"
  | "competitor_monitoring"
  | "client_onboarding"
  | "voice_agent"
  | "multiple_lead_sources"
  | "custom_integrations"

const STARTER_FEATURES: PlanFeature[] = [
  "lead_crm", "lead_scoring", "agent_chat", "approval_queue", "weekly_reports",
]

const PIPELINE_FEATURES: PlanFeature[] = [
  ...STARTER_FEATURES,
  "follow_up_agent", "sales_call_prep", "multiple_lead_sources",
]

const GROWTH_FEATURES: PlanFeature[] = [
  ...PIPELINE_FEATURES,
  "proposal_prep", "competitor_monitoring", "client_onboarding", "voice_agent", "custom_integrations",
]

export const PLAN_FEATURES: Record<string, PlanFeature[]> = {
  "Lead Agent Starter": STARTER_FEATURES,
  "starter": STARTER_FEATURES,
  "Pipeline Agent": PIPELINE_FEATURES,
  "pipeline": PIPELINE_FEATURES,
  "Growth Agent OS": GROWTH_FEATURES,
  "growth": GROWTH_FEATURES,
}

type CompanyLike = { stripePlanName?: string | null; subscriptions?: Array<{ plan: { name: string } }> }

export function getPlanName(company: CompanyLike): string {
  if (company.stripePlanName) return company.stripePlanName
  const sub = company.subscriptions?.[0]
  if (sub?.plan?.name) return sub.plan.name
  return "starter"
}

export function hasFeature(company: CompanyLike, feature: PlanFeature): boolean {
  const planName = getPlanName(company).toLowerCase()
  // Match by key prefix
  const features = PLAN_FEATURES[planName]
    ?? Object.entries(PLAN_FEATURES).find(([k]) => planName.includes(k.toLowerCase().split(" ")[0]))?.[1]
    ?? STARTER_FEATURES
  return features.includes(feature)
}

export function getPlanTier(company: CompanyLike): "Starter" | "Pipeline" | "Growth OS" {
  const name = getPlanName(company).toLowerCase()
  if (name.includes("growth")) return "Growth OS"
  if (name.includes("pipeline")) return "Pipeline"
  return "Starter"
}
