"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getPlanLimits } from "@/lib/plans"

const SETUP_STATUSES = ["NEW", "ONBOARDING", "CONFIGURING", "TESTING", "LIVE", "PAUSED"] as const
type SetupStatusValue = (typeof SETUP_STATUSES)[number]

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Admin access required")
  }
  return session
}

function revalidateCustomer(companyId: string) {
  revalidatePath("/admin")
  revalidatePath("/admin/customers")
  revalidatePath(`/admin/customers/${companyId}`)
}

// Adds (or removes, with a negative amount) AI Work Credits for a company.
// Writes a ledger entry and audit log so every manual adjustment is traceable.
export async function adjustCompanyCredits(companyId: string, amount: number, reason: string) {
  const session = await requireAdmin()
  if (!Number.isFinite(amount) || amount === 0) return { error: "Enter a non-zero amount" }
  if (!reason.trim()) return { error: "A reason is required for credit adjustments" }

  const usage = await prisma.companyUsage.findUnique({ where: { companyId } })
  if (!usage) return { error: "No usage record found for this company" }

  const newRemaining = Math.max(0, usage.creditsRemaining + amount)
  await prisma.$transaction([
    prisma.companyUsage.update({
      where: { companyId },
      data: { creditsRemaining: newRemaining },
    }),
    prisma.creditLedger.create({
      data: {
        companyId,
        actionType: "admin_adjustment",
        creditsChanged: amount,
        balanceAfter: newRemaining,
        description: reason.trim(),
        metadata: { adminId: session.user.id },
      },
    }),
    prisma.auditLog.create({
      data: {
        companyId,
        userId: session.user.id,
        action: "ADMIN_CREDIT_ADJUSTMENT",
        entityType: "CompanyUsage",
        entityId: usage.id,
        metadata: { amount, reason: reason.trim() },
      },
    }),
  ])

  revalidateCustomer(companyId)
  return { success: true }
}

// Moves a customer through the setup lifecycle (NEW → ONBOARDING → ... → LIVE)
export async function setCompanySetupStatus(companyId: string, status: string) {
  const session = await requireAdmin()
  if (!SETUP_STATUSES.includes(status as SetupStatusValue)) {
    return { error: "Invalid setup status" }
  }

  await prisma.$transaction([
    prisma.company.update({
      where: { id: companyId },
      data: { setupStatus: status as SetupStatusValue },
    }),
    prisma.auditLog.create({
      data: {
        companyId,
        userId: session.user.id,
        action: "ADMIN_SETUP_STATUS_CHANGED",
        entityType: "Company",
        entityId: companyId,
        metadata: { status },
      },
    }),
  ])

  revalidateCustomer(companyId)
  return { success: true }
}

// Pauses or resumes every agent for a company — the "send the employee home" switch
export async function setEmployeePaused(companyId: string, paused: boolean) {
  const session = await requireAdmin()

  await prisma.$transaction([
    prisma.agent.updateMany({
      where: { companyId },
      data: { status: paused ? "PAUSED" : "ACTIVE" },
    }),
    prisma.auditLog.create({
      data: {
        companyId,
        userId: session.user.id,
        action: paused ? "ADMIN_EMPLOYEE_PAUSED" : "ADMIN_EMPLOYEE_RESUMED",
        entityType: "Agent",
        metadata: { paused },
      },
    }),
  ])

  revalidateCustomer(companyId)
  return { success: true }
}

// Changes a customer's plan and re-applies the matching credit limits
export async function setCompanyPlan(companyId: string, planName: string) {
  const session = await requireAdmin()
  if (!planName.trim()) return { error: "Plan name required" }

  const limits = getPlanLimits(planName)
  await prisma.$transaction([
    prisma.company.update({
      where: { id: companyId },
      data: { stripePlanName: planName },
    }),
    prisma.companyUsage.upsert({
      where: { companyId },
      update: {
        planName,
        monthlyCreditLimit: limits.monthlyCreditLimit,
        activeAgentLimit: limits.maxActiveAgents,
        concurrentTaskLimit: limits.maxConcurrentTasks,
      },
      create: {
        companyId,
        planName,
        monthlyCreditLimit: limits.monthlyCreditLimit,
        creditsRemaining: limits.monthlyCreditLimit,
        activeAgentLimit: limits.maxActiveAgents,
        concurrentTaskLimit: limits.maxConcurrentTasks,
        billingCycleEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.auditLog.create({
      data: {
        companyId,
        userId: session.user.id,
        action: "ADMIN_PLAN_CHANGED",
        entityType: "Company",
        entityId: companyId,
        metadata: { planName },
      },
    }),
  ])

  revalidateCustomer(companyId)
  return { success: true }
}

// Internal note on a customer, stored in the audit trail
export async function addCustomerNote(companyId: string, note: string) {
  const session = await requireAdmin()
  if (!note.trim()) return { error: "Note cannot be empty" }

  await prisma.auditLog.create({
    data: {
      companyId,
      userId: session.user.id,
      action: "ADMIN_NOTE",
      entityType: "Company",
      entityId: companyId,
      metadata: { note: note.trim() },
    },
  })

  revalidateCustomer(companyId)
  return { success: true }
}
