import { prisma } from "@/lib/db"
import { getAgentProvider } from "@/lib/agents"
import type { AgentTaskType, AgentTaskOutput } from "@/lib/agents"
import {
  checkCanRunTask,
  reserveCredits,
  deductCredits,
  refundCredits,
  incrementCounter,
  taskTypeToCreditAction,
} from "./usage-service"

export type { AgentTaskType }

export async function runAgentTask(
  taskType: AgentTaskType,
  agentId: string,
  companyId: string,
  options: { leadId?: string; userId?: string; input?: Record<string, unknown> } = {}
) {
  const startedAt = Date.now()

  // Credit gating — check before touching anything paid
  const check = await checkCanRunTask(companyId, taskType, {})
  if (!check.allowed) {
    return { success: false, error: check.reason }
  }

  const company = await prisma.company.findUnique({ where: { id: companyId } })

  const agentRun = await prisma.agentRun.create({
    data: { agentId, status: "running", input: { taskType, ...options.input } as any },
  })

  // Reserve credits optimistically
  await reserveCredits(companyId, agentRun.id, check.estimatedCost)

  try {
    await prisma.auditLog.create({
      data: { companyId, userId: options.userId, action: "AGENT_TASK_STARTED", entityType: "AgentRun", entityId: agentRun.id, metadata: { taskType, leadId: options.leadId } as any },
    })

    const provider = getAgentProvider(company)
    const output = await provider.runTask({ companyId, userId: options.userId, leadId: options.leadId, taskType, context: options.input ?? {} })

    await applyOutput(taskType, agentId, companyId, options.leadId, output)

    await prisma.agentRun.update({
      where: { id: agentRun.id },
      data: { status: output.success ? "completed" : "failed", output: output as any, durationMs: Date.now() - startedAt },
    })

    if (output.success) {
      // Deduct actual credits and write ledger
      const actionType = taskTypeToCreditAction(taskType)
      await deductCredits(
        companyId,
        check.estimatedCost,
        actionType,
        agentRun.id,
        `${taskType} completed successfully`,
        { taskType, leadId: options.leadId }
      )
      // Increment per-feature counters
      if (taskType === "QUALIFY_LEAD") await incrementCounter(companyId, "leads", 1)
      if (taskType === "GENERATE_REPLY" || taskType === "CREATE_FOLLOW_UP") await incrementCounter(companyId, "replies", 1)
      if (taskType === "PREPARE_SALES_CALL") await incrementCounter(companyId, "callBriefs", 1)
    } else {
      // Task ran but returned failure — refund reserved credits
      await refundCredits(companyId, check.estimatedCost, agentRun.id, "Task returned failure")
    }

    if (options.userId) {
      await prisma.auditLog.create({
        data: { companyId, userId: options.userId, action: output.success ? "AGENT_TASK_COMPLETED" : "AGENT_TASK_FAILED", entityType: "AgentRun", entityId: agentRun.id, metadata: { taskType, leadId: options.leadId } as any },
      })
    }

    return { success: output.success, runId: agentRun.id, output }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error"
    await prisma.agentRun.update({ where: { id: agentRun.id }, data: { status: "failed", error: msg, durationMs: Date.now() - startedAt } })
    // Refund reserved credits on exception
    await refundCredits(companyId, check.estimatedCost, agentRun.id, "Task failed before execution")
    if (options.userId) {
      await prisma.auditLog.create({
        data: { companyId, userId: options.userId, action: "AGENT_TASK_FAILED", entityType: "AgentRun", entityId: agentRun.id, metadata: { taskType, error: msg } as any },
      })
    }
    return { success: false, error: msg }
  }
}

async function applyOutput(taskType: AgentTaskType, agentId: string, companyId: string, leadId: string | undefined, output: AgentTaskOutput) {
  if (!output.success || !output.structuredData) return
  const d = output.structuredData

  if (taskType === "QUALIFY_LEAD" && leadId) {
    const statusMap: Record<string, "HOT" | "WARM" | "COLD" | "BAD_FIT"> = { HOT: "HOT", WARM: "WARM", COLD: "COLD", BAD_FIT: "BAD_FIT" }
    const band = d.scoreBand as string
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        score: d.score as number, scoreBand: d.scoreBand as any, status: statusMap[band] ?? "COLD",
        fitSummary: d.fitSummary as string, painPoints: Array.isArray(d.painPoints) ? (d.painPoints as string[]).join("\n") : d.painPoints as string,
        researchSummary: d.researchSummary as string, recommendedAction: d.recommendedAction as string,
        draftReply: (d.draftReply ?? output.draftText) as string,
        nextFollowUpAt: new Date(Date.now() + ((d.suggestedFollowUpDays as number) ?? 3) * 86400000),
      },
    })
    const latestRun = await prisma.agentRun.findFirst({ where: { agentId }, orderBy: { createdAt: "desc" } })
    await prisma.leadScore.create({
      data: {
        leadId, score: d.score as number, scoreBand: d.scoreBand as any,
        reasoning: Array.isArray(d.scoreBreakdown) ? (d.scoreBreakdown as any[]).map(b => `${b.factor} (${b.points > 0 ? "+" : ""}${b.points}): ${b.description}`).join("\n") : `Score: ${d.score}/100 (${d.scoreBand})`,
        agentRunId: latestRun?.id,
      },
    })
    if (band === "HOT" || band === "WARM") {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } })
      await prisma.approvalRequest.create({
        data: {
          companyId, leadId, createdByAgentId: agentId, type: "DRAFT_EMAIL",
          title: `Draft reply for ${lead?.name}`,
          description: `AI-generated ${band} lead reply awaiting approval.`,
          proposedAction: `Send personalised reply to ${lead?.email ?? lead?.name}`,
          payload: { draftReply: d.draftReply ?? output.draftText, leadId, score: d.score, recipientEmail: lead?.email } as any,
          status: "PENDING",
        },
      })
      await prisma.auditLog.create({
        data: { companyId, action: "APPROVAL_CREATED", entityType: "ApprovalRequest", metadata: { leadId, type: "DRAFT_EMAIL", scoreBand: band } as any },
      })
    }
  } else if (taskType === "GENERATE_REPLY" && leadId) {
    const draft = (d.body ?? output.draftText) as string | undefined
    if (draft) await prisma.lead.update({ where: { id: leadId }, data: { draftReply: draft } })
  } else if (taskType === "PREPARE_SALES_CALL" && leadId && output.draftText) {
    await prisma.leadNote.create({ data: { leadId, content: output.draftText, authorId: agentId } })
  } else if (taskType === "GENERATE_WEEKLY_REPORT") {
    await prisma.report.create({
      data: { companyId, type: "WEEKLY", title: `Weekly Report — ${new Date().toLocaleDateString("en-GB")}`, data: output.structuredData as any, period: new Date().toISOString().split("T")[0] },
    })
    await prisma.auditLog.create({
      data: { companyId, action: "WEEKLY_REPORT_GENERATED", entityType: "Report", metadata: { period: new Date().toISOString().split("T")[0] } as any },
    })
  }
}
