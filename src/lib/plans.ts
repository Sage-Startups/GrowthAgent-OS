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

// ---------- Credit / usage limits ----------

export type PlanLimits = {
  monthlyCreditLimit: number
  maxLeadsPerMonth: number
  maxRepliesPerMonth: number
  maxCallBriefsPerMonth: number
  maxVoiceMinutesPerMonth: number
  maxActiveAgents: number
  maxConcurrentTasks: number
  maxLeadsPerTask: number
  maxDraftsPerTask: number
  maxBriefsPerTask: number
}

const STARTER_LIMITS: PlanLimits = {
  monthlyCreditLimit: 500,
  maxLeadsPerMonth: 200,
  maxRepliesPerMonth: 100,
  maxCallBriefsPerMonth: 25,
  maxVoiceMinutesPerMonth: 30,
  maxActiveAgents: 1,
  maxConcurrentTasks: 1,
  maxLeadsPerTask: 50,
  maxDraftsPerTask: 25,
  maxBriefsPerTask: 5,
}

const PIPELINE_LIMITS: PlanLimits = {
  monthlyCreditLimit: 1500,
  maxLeadsPerMonth: 500,
  maxRepliesPerMonth: 400,
  maxCallBriefsPerMonth: 100,
  maxVoiceMinutesPerMonth: 100,
  maxActiveAgents: 3,
  maxConcurrentTasks: 3,
  maxLeadsPerTask: 150,
  maxDraftsPerTask: 75,
  maxBriefsPerTask: 20,
}

const GROWTH_LIMITS: PlanLimits = {
  monthlyCreditLimit: 5000,
  maxLeadsPerMonth: 1500,
  maxRepliesPerMonth: 1000,
  maxCallBriefsPerMonth: 300,
  maxVoiceMinutesPerMonth: 300,
  maxActiveAgents: 5,
  maxConcurrentTasks: 10,
  maxLeadsPerTask: 500,
  maxDraftsPerTask: 200,
  maxBriefsPerTask: 50,
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  // Current plans
  "ai sales assistant": STARTER_LIMITS,
  "ai sales team": PIPELINE_LIMITS,
  "full ai revenue os": GROWTH_LIMITS,
  // Generic aliases
  starter: STARTER_LIMITS,
  pipeline: PIPELINE_LIMITS,
  growth: GROWTH_LIMITS,
  // Legacy plans
  "lead agent starter": STARTER_LIMITS,
  "pipeline agent": PIPELINE_LIMITS,
  "growth agent os": GROWTH_LIMITS,
}

export function getPlanLimits(planName: string): PlanLimits {
  const key = planName.toLowerCase()
  if (PLAN_LIMITS[key]) return PLAN_LIMITS[key]
  if (key.includes("revenue os") || key.includes("growth")) return GROWTH_LIMITS
  if (key.includes("team") || key.includes("pipeline")) return PIPELINE_LIMITS
  return STARTER_LIMITS
}

// ---------- Display names & pricing ----------

export type PlanDisplay = {
  label: string
  shortLabel: string
  monthlyPrice: number
  setupFee: number
}

const PLAN_DISPLAYS: { starter: PlanDisplay; pipeline: PlanDisplay; growth: PlanDisplay } = {
  starter: { label: "AI Sales Assistant", shortLabel: "Assistant", monthlyPrice: 497, setupFee: 997 },
  pipeline: { label: "AI Sales Team", shortLabel: "Sales Team", monthlyPrice: 997, setupFee: 1997 },
  growth: { label: "Full AI Revenue OS", shortLabel: "Revenue OS", monthlyPrice: 1997, setupFee: 2997 },
}

// Resolves any plan name (current, alias, or legacy) to its display info
export function getPlanDisplay(planName: string | null | undefined): PlanDisplay {
  const key = (planName ?? "starter").toLowerCase()
  if (key.includes("revenue os") || key.includes("growth")) return PLAN_DISPLAYS.growth
  if (key.includes("team") || key.includes("pipeline")) return PLAN_DISPLAYS.pipeline
  return PLAN_DISPLAYS.starter
}
