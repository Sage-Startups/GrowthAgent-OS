import { prisma } from "@/lib/db"
import { CREDIT_COSTS, CreditAction } from "./credit-costs"
import { getPlanLimits, getPlanName } from "./plans"

const CREDIT_EXCEEDED_MESSAGE =
  "Your AI employee has reached this month's work allowance. Upgrade your plan or add more AI Work Credits to continue."

// Gets or creates CompanyUsage, initialising from plan if new
export async function getCompanyUsage(companyId: string) {
  const existing = await prisma.companyUsage.findUnique({ where: { companyId } })
  if (existing) return existing

  // Look up the company plan
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscriptions: { include: { plan: true }, take: 1, orderBy: { createdAt: "desc" } } },
  })
  const planName = company ? getPlanName(company) : "starter"
  const limits = getPlanLimits(planName)

  const now = new Date()
  const cycleEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  return prisma.companyUsage.create({
    data: {
      companyId,
      planName,
      monthlyCreditLimit: limits.monthlyCreditLimit,
      creditsUsedThisCycle: 0,
      creditsRemaining: limits.monthlyCreditLimit,
      leadsSourcedThisCycle: 0,
      repliesDraftedThisCycle: 0,
      callBriefsThisCycle: 0,
      voiceMinutesThisCycle: 0,
      activeAgentLimit: limits.maxActiveAgents,
      concurrentTaskLimit: limits.maxConcurrentTasks,
      billingCycleStart: now,
      billingCycleEnd: cycleEnd,
    },
  })
}

// Returns plan limits for a plan name string
export function getPlanLimitsForCompany(planName: string) {
  return getPlanLimits(planName)
}

// Estimates credit cost for a task type + payload
export function estimateTaskCost(taskType: string, payload?: { quantity?: number }): number {
  const qty = payload?.quantity ?? 1
  const costs: Record<string, number> = {
    QUALIFY_LEAD: CREDIT_COSTS.lead_scored + CREDIT_COSTS.deep_lead_research,
    GENERATE_REPLY: CREDIT_COSTS.personalised_reply_draft,
    CREATE_FOLLOW_UP: CREDIT_COSTS.follow_up_draft,
    PREPARE_SALES_CALL: CREDIT_COSTS.call_brief,
    GENERATE_WEEKLY_REPORT: CREDIT_COSTS.weekly_report,
    COMPETITOR_MONITORING: CREDIT_COSTS.competitor_check,
    PROPOSAL_PREP: CREDIT_COSTS.proposal_draft,
    CLIENT_ONBOARDING: CREDIT_COSTS.manual_agent_instruction,
  }
  const base = costs[taskType] ?? CREDIT_COSTS.manual_agent_instruction
  return base * qty
}

// Maps AgentTaskType to CreditAction
export function taskTypeToCreditAction(taskType: string): CreditAction {
  const map: Record<string, CreditAction> = {
    QUALIFY_LEAD: "lead_scored",
    GENERATE_REPLY: "personalised_reply_draft",
    CREATE_FOLLOW_UP: "follow_up_draft",
    PREPARE_SALES_CALL: "call_brief",
    GENERATE_WEEKLY_REPORT: "weekly_report",
    COMPETITOR_MONITORING: "competitor_check",
    PROPOSAL_PREP: "proposal_draft",
    CLIENT_ONBOARDING: "manual_agent_instruction",
  }
  return map[taskType] ?? "manual_agent_instruction"
}

// Main gating function — call before any agent task
export async function checkCanRunTask(
  companyId: string,
  taskType: string,
  payload?: { leadsCount?: number; draftsCount?: number; briefsCount?: number }
): Promise<{ allowed: boolean; reason: string; estimatedCost: number }> {
  const usage = await getCompanyUsage(companyId)
  const limits = getPlanLimits(usage.planName)
  const estimatedCost = estimateTaskCost(taskType, { quantity: 1 })

  // Check credits remaining
  if (usage.creditsRemaining < estimatedCost) {
    return { allowed: false, reason: CREDIT_EXCEEDED_MESSAGE, estimatedCost }
  }

  // Check concurrent task limit
  const runningCount = await prisma.agentRun.count({
    where: { agent: { companyId }, status: "running" },
  })
  if (runningCount >= limits.maxConcurrentTasks) {
    return {
      allowed: false,
      reason: `Your AI employee is already working on ${runningCount} task${runningCount !== 1 ? "s" : ""}. Upgrade your plan to run more tasks simultaneously.`,
      estimatedCost,
    }
  }

  // Per-task size limits
  if (payload?.leadsCount !== undefined && payload.leadsCount > limits.maxLeadsPerTask) {
    return {
      allowed: false,
      reason: `This task exceeds your plan's limit of ${limits.maxLeadsPerTask} leads per task. Upgrade your plan to process more leads at once.`,
      estimatedCost,
    }
  }
  if (payload?.draftsCount !== undefined && payload.draftsCount > limits.maxDraftsPerTask) {
    return {
      allowed: false,
      reason: `This task exceeds your plan's limit of ${limits.maxDraftsPerTask} drafts per task. Upgrade your plan to generate more drafts at once.`,
      estimatedCost,
    }
  }
  if (payload?.briefsCount !== undefined && payload.briefsCount > limits.maxBriefsPerTask) {
    return {
      allowed: false,
      reason: `This task exceeds your plan's limit of ${limits.maxBriefsPerTask} call briefs per task. Upgrade your plan to generate more briefs at once.`,
      estimatedCost,
    }
  }

  // Feature monthly limits
  if (taskType === "QUALIFY_LEAD") {
    const allowed = await checkFeatureLimit(companyId, "leads", 1)
    if (!allowed) {
      return { allowed: false, reason: CREDIT_EXCEEDED_MESSAGE, estimatedCost }
    }
  }
  if (taskType === "GENERATE_REPLY" || taskType === "CREATE_FOLLOW_UP") {
    const allowed = await checkFeatureLimit(companyId, "replies", 1)
    if (!allowed) {
      return { allowed: false, reason: CREDIT_EXCEEDED_MESSAGE, estimatedCost }
    }
  }
  if (taskType === "PREPARE_SALES_CALL") {
    const allowed = await checkFeatureLimit(companyId, "callBriefs", 1)
    if (!allowed) {
      return { allowed: false, reason: CREDIT_EXCEEDED_MESSAGE, estimatedCost }
    }
  }

  return { allowed: true, reason: "OK", estimatedCost }
}

// Reserve credits optimistically before task starts
export async function reserveCredits(companyId: string, taskId: string, amount: number): Promise<void> {
  if (amount <= 0) return
  await prisma.companyUsage.update({
    where: { companyId },
    data: {
      creditsRemaining: { decrement: amount },
      creditsUsedThisCycle: { increment: amount },
    },
  })

  // Update AgentRun with reserved amount
  await prisma.agentRun.update({
    where: { id: taskId },
    data: { creditsReserved: amount, estimatedCreditCost: amount },
  }).catch(() => {
    // taskId may not be an AgentRun id — ignore
  })
}

// Deduct actual credits after task completes — writes CreditLedger entry
export async function deductCredits(
  companyId: string,
  amount: number,
  actionType: string,
  taskId?: string,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const usage = await getCompanyUsage(companyId)
  const balanceAfter = usage.creditsRemaining

  await prisma.creditLedger.create({
    data: {
      companyId,
      taskId,
      actionType,
      creditsChanged: -amount,
      balanceAfter,
      description: description ?? `${actionType} task completed`,
      metadata: (metadata ?? {}) as unknown as import("@prisma/client").Prisma.InputJsonValue,
    },
  })

  if (taskId) {
    await prisma.agentRun.update({
      where: { id: taskId },
      data: { actualCreditCost: amount },
    }).catch(() => {
      // ignore if not an AgentRun id
    })
  }
}

// Refund reserved credits if task fails
export async function refundCredits(companyId: string, amount: number, taskId: string, reason: string): Promise<void> {
  if (amount <= 0) return
  const updated = await prisma.companyUsage.update({
    where: { companyId },
    data: {
      creditsRemaining: { increment: amount },
      creditsUsedThisCycle: { decrement: amount },
    },
  })

  await prisma.creditLedger.create({
    data: {
      companyId,
      taskId,
      actionType: "refund",
      creditsChanged: amount,
      balanceAfter: updated.creditsRemaining,
      description: reason,
      metadata: {},
    },
  })
}

// Reset monthly cycle — call on billing renewal
export async function resetMonthlyCredits(companyId: string): Promise<void> {
  const usage = await getCompanyUsage(companyId)
  const limits = getPlanLimits(usage.planName)
  const now = new Date()
  const cycleEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  await prisma.companyUsage.update({
    where: { companyId },
    data: {
      creditsUsedThisCycle: 0,
      creditsRemaining: limits.monthlyCreditLimit,
      leadsSourcedThisCycle: 0,
      repliesDraftedThisCycle: 0,
      callBriefsThisCycle: 0,
      voiceMinutesThisCycle: 0,
      billingCycleStart: now,
      billingCycleEnd: cycleEnd,
    },
  })

  await prisma.creditLedger.create({
    data: {
      companyId,
      actionType: "cycle_reset",
      creditsChanged: limits.monthlyCreditLimit,
      balanceAfter: limits.monthlyCreditLimit,
      description: "Monthly credit cycle reset",
      metadata: {},
    },
  })
}

// Apply plan limits when subscription changes
export async function applyPlanLimits(companyId: string, planName: string): Promise<void> {
  const limits = getPlanLimits(planName)
  const existing = await prisma.companyUsage.findUnique({ where: { companyId } })

  if (!existing) {
    await getCompanyUsage(companyId)
    return
  }

  const creditDelta = limits.monthlyCreditLimit - existing.monthlyCreditLimit
  const newRemaining = Math.max(0, existing.creditsRemaining + creditDelta)

  await prisma.companyUsage.update({
    where: { companyId },
    data: {
      planName,
      monthlyCreditLimit: limits.monthlyCreditLimit,
      creditsRemaining: newRemaining,
      activeAgentLimit: limits.maxActiveAgents,
      concurrentTaskLimit: limits.maxConcurrentTasks,
    },
  })
}

// Check if a feature monthly limit allows more usage
export async function checkFeatureLimit(
  companyId: string,
  featureType: "leads" | "replies" | "callBriefs" | "voiceMinutes",
  quantity: number
): Promise<boolean> {
  const usage = await getCompanyUsage(companyId)
  const limits = getPlanLimits(usage.planName)

  switch (featureType) {
    case "leads":
      return usage.leadsSourcedThisCycle + quantity <= limits.maxLeadsPerMonth
    case "replies":
      return usage.repliesDraftedThisCycle + quantity <= limits.maxRepliesPerMonth
    case "callBriefs":
      return usage.callBriefsThisCycle + quantity <= limits.maxCallBriefsPerMonth
    case "voiceMinutes":
      return usage.voiceMinutesThisCycle + quantity <= limits.maxVoiceMinutesPerMonth
  }
}

// Increment monthly feature counter
export async function incrementCounter(
  companyId: string,
  featureType: "leads" | "replies" | "callBriefs" | "voiceMinutes",
  quantity: number
): Promise<void> {
  const field: Record<string, string> = {
    leads: "leadsSourcedThisCycle",
    replies: "repliesDraftedThisCycle",
    callBriefs: "callBriefsThisCycle",
    voiceMinutes: "voiceMinutesThisCycle",
  }
  await prisma.companyUsage.update({
    where: { companyId },
    data: { [field[featureType]]: { increment: quantity } },
  })
}

export async function getRemainingCredits(companyId: string): Promise<number> {
  const usage = await getCompanyUsage(companyId)
  return usage.creditsRemaining
}

export async function getRemainingLimits(companyId: string) {
  const usage = await getCompanyUsage(companyId)
  const limits = getPlanLimits(usage.planName)
  return {
    credits: usage.creditsRemaining,
    creditLimit: limits.monthlyCreditLimit,
    leads: limits.maxLeadsPerMonth - usage.leadsSourcedThisCycle,
    leadLimit: limits.maxLeadsPerMonth,
    replies: limits.maxRepliesPerMonth - usage.repliesDraftedThisCycle,
    replyLimit: limits.maxRepliesPerMonth,
    callBriefs: limits.maxCallBriefsPerMonth - usage.callBriefsThisCycle,
    callBriefLimit: limits.maxCallBriefsPerMonth,
    voiceMinutes: limits.maxVoiceMinutesPerMonth - usage.voiceMinutesThisCycle,
    voiceMinuteLimit: limits.maxVoiceMinutesPerMonth,
    concurrentTasks: limits.maxConcurrentTasks,
    activeAgents: limits.maxActiveAgents,
  }
}
