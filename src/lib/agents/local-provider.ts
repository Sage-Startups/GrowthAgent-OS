import type { AgentProvider, AgentTaskInput, AgentTaskOutput } from "./types"
import { prisma } from "@/lib/db"
import { scoreLead } from "@/lib/lead-scoring"
import { generateReply } from "@/lib/reply-generator"

export class LocalAgentProvider implements AgentProvider {
  async runTask(input: AgentTaskInput): Promise<AgentTaskOutput> {
    try {
      switch (input.taskType) {
        case "QUALIFY_LEAD":
          if (!input.leadId) throw new Error("leadId required")
          return await localQualify(input.companyId, input.leadId)
        case "GENERATE_REPLY":
          if (!input.leadId) throw new Error("leadId required")
          return await localReply(input.companyId, input.leadId)
        case "PREPARE_SALES_CALL":
          if (!input.leadId) throw new Error("leadId required")
          return await localCallPrep(input.companyId, input.leadId)
        case "GENERATE_WEEKLY_REPORT":
          return await localWeeklyReport(input.companyId)
        default:
          return { success: false, summary: `Task type ${input.taskType} not yet supported in local mode` }
      }
    } catch (err) {
      return { success: false, summary: err instanceof Error ? err.message : "Local task failed" }
    }
  }

  async sendChatMessage(input: {
    companyId: string
    userId: string
    message: string
    context: Record<string, unknown>
  }): Promise<AgentTaskOutput> {
    const summary = await localChatCommand(input.message, input.companyId)
    return { success: true, summary, recommendedActions: [] }
  }
}

async function localQualify(companyId: string, leadId: string): Promise<AgentTaskOutput> {
  const [lead, company] = await Promise.all([
    prisma.lead.findFirst({ where: { id: leadId, companyId } }),
    prisma.company.findUnique({ where: { id: companyId } }),
  ])
  if (!lead) throw new Error("Lead not found")
  if (!company) throw new Error("Company not found")

  const result = scoreLead(
    { name: company.name, mainOffer: company.mainOffer, idealCustomerProfile: company.idealCustomerProfile, badFitTraits: company.badFitTraits, toneOfVoice: company.toneOfVoice, averageDealValue: company.averageDealValue },
    { name: lead.name, email: lead.email, companyName: lead.companyName, website: lead.website, message: lead.message, source: lead.source, estimatedValue: lead.estimatedValue }
  )

  return {
    success: true,
    summary: `Lead scored ${result.score}/100 (${result.scoreBand}). ${result.fitSummary}`,
    structuredData: { score: result.score, scoreBand: result.scoreBand, fitSummary: result.fitSummary, researchSummary: result.researchSummary, painPoints: result.painPoints, recommendedAction: result.recommendedAction, draftReply: result.draftReply, suggestedFollowUpDays: result.suggestedFollowUpDays, redFlags: [], confidence: 0.85, scoreBreakdown: result.scoreBreakdown },
    draftText: result.draftReply,
    recommendedActions: (result.scoreBand === "HOT" || result.scoreBand === "WARM") ? [{ label: "Send draft reply", actionType: "SEND_EMAIL", requiresApproval: true, payload: { draftReply: result.draftReply, leadId, score: result.score } }] : [],
  }
}

async function localReply(companyId: string, leadId: string): Promise<AgentTaskOutput> {
  const [lead, company] = await Promise.all([
    prisma.lead.findFirst({ where: { id: leadId, companyId } }),
    prisma.company.findUnique({ where: { id: companyId } }),
  ])
  if (!lead) throw new Error("Lead not found")
  if (!company) throw new Error("Company not found")

  const reply = generateReply({ companyName: company.name, mainOffer: company.mainOffer, toneOfVoice: company.toneOfVoice, leadName: lead.name, leadCompany: lead.companyName, leadMessage: lead.message, scoreBand: lead.scoreBand ?? "COLD", recommendedAction: lead.recommendedAction, painPoints: lead.painPoints })
  return { success: true, summary: "Draft reply generated — awaiting approval", draftText: reply, recommendedActions: [{ label: "Send this reply", actionType: "SEND_EMAIL", requiresApproval: true, payload: { body: reply, leadId, recipientEmail: lead.email ?? "" } }] }
}

async function localCallPrep(companyId: string, leadId: string): Promise<AgentTaskOutput> {
  const [lead, company] = await Promise.all([
    prisma.lead.findFirst({ where: { id: leadId, companyId } }),
    prisma.company.findUnique({ where: { id: companyId } }),
  ])
  if (!lead) throw new Error("Lead not found")
  if (!company) throw new Error("Company not found")

  const brief = [
    `# Sales Call Brief — ${lead.name} (${lead.companyName ?? "Unknown"})`,
    `## Lead Summary\n- Name: ${lead.name}\n- Company: ${lead.companyName ?? "N/A"}\n- Score: ${lead.score ?? "N/A"}/100 (${lead.scoreBand ?? "Unscored"})\n- Est. Value: ${lead.estimatedValue ? `$${lead.estimatedValue.toLocaleString()}` : "N/A"}`,
    `## Company Overview\n${lead.researchSummary ?? "Research not yet completed."}`,
    `## Likely Pain Points\n${lead.painPoints ?? "To be uncovered on the call."}`,
    `## Discovery Questions\n1. What is driving this need right now?\n2. Have you tried to solve this before?\n3. What does success look like in 6 months?\n4. Who else is involved in the decision?\n5. What is your timeline?\n6. What budget have you set aside?`,
    `## Suggested Offer Angle\n${company.mainOffer ?? "Present your core offer"} — position around ${lead.companyName ?? "their"}'s specific pain points.`,
    `## Call Opener\n"Hi ${lead.name.split(" ")[0]}, before I tell you about what we do, what is the main thing you are trying to solve right now?"`,
  ].join("\n\n")

  return { success: true, summary: `Call brief prepared for ${lead.name}`, draftText: brief, structuredData: { leadId, leadName: lead.name, score: lead.score, scoreBand: lead.scoreBand } }
}

async function localWeeklyReport(companyId: string): Promise<AgentTaskOutput> {
  const weekAgo = new Date(Date.now() - 7 * 86400000)
  const [newLeads, hotCount, warmCount, coldCount, overdue, total] = await Promise.all([
    prisma.lead.count({ where: { companyId, createdAt: { gte: weekAgo } } }),
    prisma.lead.count({ where: { companyId, scoreBand: "HOT" } }),
    prisma.lead.count({ where: { companyId, scoreBand: "WARM" } }),
    prisma.lead.count({ where: { companyId, scoreBand: "COLD" } }),
    prisma.lead.count({ where: { companyId, nextFollowUpAt: { lte: new Date() }, status: { notIn: ["WON", "LOST"] } } }),
    prisma.lead.count({ where: { companyId } }),
  ])
  const summary = `Weekly report: ${newLeads} new leads this week. Pipeline: ${hotCount} HOT, ${warmCount} WARM, ${coldCount} COLD out of ${total} total. ${overdue} overdue follow-ups.`
  return {
    success: true,
    summary,
    structuredData: { executiveSummary: summary, leadStats: { newLeads, hotCount, warmCount, coldCount, total, overdue }, bestOpportunities: hotCount > 0 ? [`${hotCount} HOT lead${hotCount > 1 ? "s" : ""} ready for outreach`] : [], missedFollowUps: overdue > 0 ? [`${overdue} overdue follow-up${overdue > 1 ? "s" : ""}`] : [], bottlenecks: [], suggestedActions: [overdue > 0 ? `Follow up with ${overdue} overdue lead${overdue > 1 ? "s" : ""}` : null, hotCount > 0 ? `Prioritise ${hotCount} HOT lead${hotCount > 1 ? "s" : ""}` : null].filter(Boolean) as string[] },
  }
}

async function localChatCommand(cmd: string, companyId: string): Promise<string> {
  const lower = cmd.toLowerCase()

  if (lower.includes("hot lead") || lower.includes("hottest")) {
    const leads = await prisma.lead.findMany({ where: { companyId, scoreBand: "HOT" }, orderBy: { score: "desc" }, take: 5 })
    if (!leads.length) return "No HOT leads yet. Run qualification to score your leads."
    return `Your ${leads.length} hottest leads:\n\n${leads.map((l, i) => `${i + 1}. **${l.name}** (${l.companyName ?? "Unknown"}) — ${l.score}/100${l.estimatedValue ? `, $${l.estimatedValue.toLocaleString()}` : ""}`).join("\n")}`
  }
  if (lower.includes("follow up") || lower.includes("follow-up")) {
    const leads = await prisma.lead.findMany({ where: { companyId, nextFollowUpAt: { lte: new Date() } }, take: 5 })
    if (!leads.length) return "No overdue follow-ups. Your pipeline is up to date!"
    return `${leads.length} leads need follow-up:\n\n${leads.map((l, i) => `${i + 1}. **${l.name}** (${l.companyName ?? "Unknown"})`).join("\n")}`
  }
  if (lower.includes("summar") || lower.includes("this week") || lower.includes("weekly")) {
    const weekAgo = new Date(Date.now() - 7 * 86400000)
    const [newLeads, hot, total] = await Promise.all([prisma.lead.count({ where: { companyId, createdAt: { gte: weekAgo } } }), prisma.lead.count({ where: { companyId, scoreBand: "HOT" } }), prisma.lead.count({ where: { companyId } })])
    return `Weekly summary:\n- New leads: ${newLeads}\n- Total: ${total}\n- HOT: ${hot}`
  }
  if (lower.includes("best lead") || lower.includes("which lead") || lower.includes("priority") || lower.includes("worth chasing")) {
    const best = await prisma.lead.findFirst({ where: { companyId, score: { not: null } }, orderBy: { score: "desc" } })
    if (!best) return "No scored leads yet."
    return `Best lead: **${best.name}** (${best.companyName ?? "Unknown"}) — ${best.score}/100 (${best.scoreBand})\n\n${best.recommendedAction ?? ""}`
  }
  if (lower.includes("qualify") && lower.includes("new")) {
    const count = await prisma.lead.count({ where: { companyId, status: "NEW" } })
    return `${count} unqualified leads. Use "Run Qualification" on each lead page, or POST /api/jobs/qualify-new-leads to qualify all at once.`
  }
  if (lower.includes("pipeline") || lower.includes("value") || lower.includes("revenue")) {
    const leads = await prisma.lead.findMany({ where: { companyId, estimatedValue: { not: null } }, select: { estimatedValue: true, scoreBand: true } })
    const total = leads.reduce((s, l) => s + (l.estimatedValue ?? 0), 0)
    const hot = leads.filter(l => l.scoreBand === "HOT").reduce((s, l) => s + (l.estimatedValue ?? 0), 0)
    return `Pipeline value:\n💰 Total: $${total.toLocaleString()}\n🔴 HOT: $${hot.toLocaleString()}`
  }
  const [total, hotCount, pending] = await Promise.all([prisma.lead.count({ where: { companyId } }), prisma.lead.count({ where: { companyId, scoreBand: "HOT" } }), prisma.approvalRequest.count({ where: { companyId, status: "PENDING" } })])
  return `Pipeline snapshot:\n- Total leads: ${total}\n- HOT: ${hotCount}\n- Pending approvals: ${pending}\n\nTry: "show hot leads", "who needs follow-up", "pipeline value", "summarise this week"`
}
