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

// Keyed by lowercased plan name. Includes current "AI employee" plan names plus
// legacy names so older subscriptions still resolve correctly.
export const PLAN_FEATURES: Record<string, PlanFeature[]> = {
  // Current plans
  "ai sales assistant": STARTER_FEATURES,
  "ai sales team": PIPELINE_FEATURES,
  "full ai revenue os": GROWTH_FEATURES,
  // Generic aliases
  "starter": STARTER_FEATURES,
  "pipeline": PIPELINE_FEATURES,
  "growth": GROWTH_FEATURES,
  // Legacy plans
  "lead agent starter": STARTER_FEATURES,
  "pipeline agent": PIPELINE_FEATURES,
  "growth agent os": GROWTH_FEATURES,
}

type CompanyLike = { stripePlanName?: string | null; subscriptions?: Array<{ plan: { name: string } }> }

export function getPlanName(company: CompanyLike): string {
  if (company.stripePlanName) return company.stripePlanName
  const sub = company.subscriptions?.[0]
  if (sub?.plan?.name) return sub.plan.name
  return "starter"
}

// Resolves a plan name to its tier-defining feature set. Order matters: check the
// richest tiers first so "AI Sales Team" doesn't fall through on a partial match.
function resolveFeatures(planName: string): PlanFeature[] {
  const name = planName.toLowerCase()
  if (PLAN_FEATURES[name]) return PLAN_FEATURES[name]
  if (name.includes("revenue os") || name.includes("growth")) return GROWTH_FEATURES
  if (name.includes("team") || name.includes("pipeline")) return PIPELINE_FEATURES
  return STARTER_FEATURES
}

export function hasFeature(company: CompanyLike, feature: PlanFeature): boolean {
  return resolveFeatures(getPlanName(company)).includes(feature)
}

export function getPlanTier(company: CompanyLike): "Starter" | "Pipeline" | "Growth OS" {
  const features = resolveFeatures(getPlanName(company))
  if (features === GROWTH_FEATURES) return "Growth OS"
  if (features === PIPELINE_FEATURES) return "Pipeline"
  return "Starter"
}
