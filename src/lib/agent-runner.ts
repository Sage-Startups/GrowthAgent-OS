import { prisma } from "@/lib/db"
import { scoreLead } from "@/lib/lead-scoring"
import { generateReply } from "@/lib/reply-generator"

type TaskType = "QUALIFY_LEAD" | "GENERATE_REPLY" | "CREATE_FOLLOW_UP" | "PREPARE_SALES_CALL" | "GENERATE_WEEKLY_REPORT"

export async function runAgentTask(
  taskType: TaskType,
  agentId: string,
  companyId: string,
  options: {
    leadId?: string
    userId?: string
    input?: Record<string, unknown>
  } = {}
) {
  const startedAt = Date.now()

  const agentRun = await prisma.agentRun.create({
    data: {
      agentId,
      status: "running",
      input: { taskType, ...options.input } as any,
    },
  })

  try {
    let output: Record<string, unknown> = {}

    if (taskType === "QUALIFY_LEAD" && options.leadId) {
      output = await qualifyLead(agentId, companyId, options.leadId)
    } else if (taskType === "GENERATE_REPLY" && options.leadId) {
      output = await generateReplyForLead(agentId, companyId, options.leadId)
    } else if (taskType === "PREPARE_SALES_CALL" && options.leadId) {
      output = await prepareSalesCall(agentId, companyId, options.leadId)
    } else if (taskType === "GENERATE_WEEKLY_REPORT") {
      output = { reportGenerated: true }
    }

    await prisma.agentRun.update({
      where: { id: agentRun.id },
      data: {
        status: "completed",
        output: output as any,
        durationMs: Date.now() - startedAt,
      },
    })

    if (options.userId) {
      await prisma.auditLog.create({
        data: {
          companyId,
          userId: options.userId,
          action: `AGENT_TASK_${taskType}`,
          entityType: "AgentRun",
          entityId: agentRun.id,
          metadata: { taskType, leadId: options.leadId },
        },
      })
    }

    return { success: true, runId: agentRun.id, output }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error"
    await prisma.agentRun.update({
      where: { id: agentRun.id },
      data: { status: "failed", error: errMsg, durationMs: Date.now() - startedAt },
    })
    return { success: false, error: errMsg }
  }
}

async function qualifyLead(agentId: string, companyId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({ where: { id: leadId, companyId } })
  if (!lead) throw new Error("Lead not found")

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new Error("Company not found")

  await prisma.lead.update({ where: { id: leadId }, data: { status: "RESEARCHING" } })

  const result = scoreLead(
    {
      name: company.name,
      mainOffer: company.mainOffer,
      idealCustomerProfile: company.idealCustomerProfile,
      badFitTraits: company.badFitTraits,
      toneOfVoice: company.toneOfVoice,
      averageDealValue: company.averageDealValue,
    },
    {
      name: lead.name,
      email: lead.email,
      companyName: lead.companyName,
      website: lead.website,
      message: lead.message,
      source: lead.source,
      estimatedValue: lead.estimatedValue,
    }
  )

  const statusMap: Record<string, "HOT" | "WARM" | "COLD" | "BAD_FIT"> = {
    HOT: "HOT",
    WARM: "WARM",
    COLD: "COLD",
    BAD_FIT: "BAD_FIT",
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      score: result.score,
      scoreBand: result.scoreBand,
      status: statusMap[result.scoreBand],
      fitSummary: result.fitSummary,
      painPoints: result.painPoints.join("\n"),
      researchSummary: result.researchSummary,
      recommendedAction: result.recommendedAction,
      draftReply: result.draftReply,
      nextFollowUpAt: new Date(Date.now() + result.suggestedFollowUpDays * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.leadScore.create({
    data: {
      leadId,
      score: result.score,
      scoreBand: result.scoreBand,
      reasoning: result.scoreBreakdown
        .map((b) => `${b.factor} (${b.points > 0 ? "+" : ""}${b.points}): ${b.description}`)
        .join("\n"),
      agentRunId: (await prisma.agentRun.findFirst({ where: { agentId }, orderBy: { createdAt: "desc" } }))?.id,
    },
  })

  if (result.scoreBand === "HOT" || result.scoreBand === "WARM") {
    await prisma.approvalRequest.create({
      data: {
        companyId,
        leadId,
        createdByAgentId: agentId,
        type: "DRAFT_EMAIL",
        title: `Draft reply for ${lead.name}`,
        description: `AI-generated ${result.scoreBand} lead reply awaiting your approval.`,
        proposedAction: `Send personalised ${result.scoreBand.toLowerCase()} lead reply to ${lead.email ?? lead.name}`,
        payload: { draftReply: result.draftReply, leadId, score: result.score },
        status: "PENDING",
      },
    })
  }

  return { score: result.score, scoreBand: result.scoreBand, breakdown: result.scoreBreakdown }
}

async function generateReplyForLead(agentId: string, companyId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({ where: { id: leadId, companyId } })
  if (!lead) throw new Error("Lead not found")

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new Error("Company not found")

  const reply = generateReply({
    companyName: company.name,
    mainOffer: company.mainOffer,
    toneOfVoice: company.toneOfVoice,
    leadName: lead.name,
    leadCompany: lead.companyName,
    leadMessage: lead.message,
    scoreBand: lead.scoreBand ?? "COLD",
    recommendedAction: lead.recommendedAction,
    painPoints: lead.painPoints,
  })

  await prisma.lead.update({ where: { id: leadId }, data: { draftReply: reply } })

  return { reply }
}

async function prepareSalesCall(agentId: string, companyId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({ where: { id: leadId, companyId } })
  if (!lead) throw new Error("Lead not found")

  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) throw new Error("Company not found")

  const brief = generateCallBrief(company, lead)

  await prisma.leadNote.create({
    data: {
      leadId,
      content: brief,
      authorId: agentId,
    },
  })

  return { brief }
}

function generateCallBrief(
  company: { name: string; mainOffer?: string | null; idealCustomerProfile?: string | null },
  lead: {
    name: string; companyName?: string | null; website?: string | null;
    painPoints?: string | null; fitSummary?: string | null;
    researchSummary?: string | null; score?: number | null; scoreBand?: string | null;
    estimatedValue?: number | null; message?: string | null;
  }
): string {
  return `# Sales Call Brief — ${lead.name} (${lead.companyName ?? "Unknown Company"})

## Lead Summary
- **Name:** ${lead.name}
- **Company:** ${lead.companyName ?? "Not provided"}
- **Website:** ${lead.website ?? "Not provided"}
- **Score:** ${lead.score ?? "N/A"}/100 (${lead.scoreBand ?? "Unscored"})
- **Estimated Value:** ${lead.estimatedValue ? `£${lead.estimatedValue.toLocaleString()}` : "Not specified"}

## Company Overview
${lead.researchSummary ?? "Research not yet completed. Review their website and LinkedIn before the call."}

## Likely Pain Points
${lead.painPoints ?? "To be uncovered on the call."}

## Discovery Questions
1. What is driving the need for this right now?
2. Have you tried to solve this before — what happened?
3. What does success look like in 6 months?
4. Who else is involved in the decision?
5. What is your timeline for getting something in place?
6. What budget have you set aside for this?

## Suggested Offer Angle
${company.mainOffer ?? "Present your core offer"} — position it around solving ${lead.companyName ?? "their"}'s specific pain points rather than features.

## Risks / Red Flags
${lead.fitSummary ?? "Assess fit during the call."}
${lead.scoreBand === "COLD" ? "- Low intent signals — confirm genuine interest early." : ""}
${lead.estimatedValue && lead.estimatedValue < 1000 ? "- Low estimated value — confirm budget scope early." : ""}

## Call Opener
"Hi ${lead.name.split(" ")[0]}, thanks for taking the time — I have done some research on ${lead.companyName ?? "your business"} ahead of the call. Before I tell you too much about what we do, I would love to understand more about what you are trying to achieve. What is the main thing you are hoping to solve right now?"`
}
