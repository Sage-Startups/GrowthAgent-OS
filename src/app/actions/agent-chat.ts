"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentCompany, getCompanyAgent } from "@/lib/tenant"
import { revalidatePath } from "next/cache"

export async function getAgentMessages() {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    const agent = await prisma.agent.findFirst({ where: { companyId: company.id, status: "ACTIVE" } })
    if (!agent) return { messages: [] }

    const messages = await prisma.agentMessage.findMany({
      where: { agentId: agent.id },
      orderBy: { createdAt: "asc" },
      take: 50,
    })
    return { messages }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to load messages" }
  }
}

export async function sendAgentMessage(content: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  if (!content.trim()) return { error: "Message is empty" }

  try {
    const company = await getCurrentCompany()
    const agent = await getCompanyAgent(company.id)

    // Save user message
    await prisma.agentMessage.create({
      data: { agentId: agent.id, role: "user", content },
    })

    // Process command and generate response
    const response = await processAgentCommand(content, company.id, agent.id)

    // Save assistant response
    const assistantMessage = await prisma.agentMessage.create({
      data: {
        agentId: agent.id,
        role: "assistant",
        content: response,
        metadata: { processed: true },
      },
    })

    revalidatePath("/app/agent")
    return { success: true, message: assistantMessage }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to send message" }
  }
}

async function processAgentCommand(cmd: string, companyId: string, agentId: string): Promise<string> {
  const lower = cmd.toLowerCase().trim()

  // "show hot leads" / "hottest leads" / "hot leads"
  if (lower.includes("hot lead") || lower.includes("hottest")) {
    const hotLeads = await prisma.lead.findMany({
      where: { companyId, scoreBand: "HOT" },
      orderBy: { score: "desc" },
      take: 5,
    })
    if (!hotLeads.length) return "You have no HOT leads right now. Run qualification on your latest leads to score them."
    const list = hotLeads.map((l, i) => `${i + 1}. **${l.name}** (${l.companyName ?? "Unknown"}) — Score ${l.score ?? "N/A"}/100${l.estimatedValue ? `, Est. £${l.estimatedValue.toLocaleString()}` : ""}. ${l.recommendedAction ?? ""}`).join("\n")
    return `Your ${hotLeads.length} hottest lead${hotLeads.length > 1 ? "s" : ""} right now:\n\n${list}\n\nWould you like me to prepare a reply or sales call brief for any of these?`
  }

  // "follow up today" / "follow-up due" / "who needs follow up"
  if (lower.includes("follow up") || lower.includes("follow-up") || lower.includes("due today")) {
    const overdue = await prisma.lead.findMany({
      where: { companyId, nextFollowUpAt: { lte: new Date() } },
      orderBy: { nextFollowUpAt: "asc" },
      take: 5,
    })
    if (!overdue.length) return "No leads are overdue for follow-up right now. Your pipeline is up to date!"
    const list = overdue.map((l, i) => {
      const days = Math.floor((Date.now() - (l.nextFollowUpAt?.getTime() ?? 0)) / 86400000)
      return `${i + 1}. **${l.name}** (${l.companyName ?? "Unknown"}) — ${days === 0 ? "due today" : `${days} day${days > 1 ? "s" : ""} overdue`}`
    }).join("\n")
    return `${overdue.length} lead${overdue.length > 1 ? "s" : ""} need${overdue.length === 1 ? "s" : ""} a follow-up:\n\n${list}\n\nWould you like me to draft follow-up messages?`
  }

  // "summarise this week" / "weekly" / "weekly report"
  if (lower.includes("summar") || lower.includes("this week") || lower.includes("weekly")) {
    const weekAgo = new Date(Date.now() - 7 * 86400000)
    const [newLeads, hotLeads, tasks, totalLeads] = await Promise.all([
      prisma.lead.count({ where: { companyId, createdAt: { gte: weekAgo } } }),
      prisma.lead.count({ where: { companyId, scoreBand: "HOT" } }),
      prisma.agentTask.count({ where: { agent: { companyId }, createdAt: { gte: weekAgo } } }),
      prisma.lead.count({ where: { companyId } }),
    ])
    return `Here is your weekly pipeline summary:\n\n📊 **This Week**\n- New leads added: ${newLeads}\n- Total leads in pipeline: ${totalLeads}\n- HOT leads: ${hotLeads}\n- Agent tasks completed: ${tasks}\n\nWould you like a more detailed breakdown by source or status?`
  }

  // "which lead is best" / "best lead" / "top lead"
  if (lower.includes("best lead") || lower.includes("which lead") || lower.includes("top lead") || lower.includes("priority")) {
    const best = await prisma.lead.findFirst({
      where: { companyId, score: { not: null } },
      orderBy: { score: "desc" },
    })
    if (!best) return "No scored leads yet. Run qualification on your leads to score them."
    return `Your highest priority lead right now is **${best.name}** from ${best.companyName ?? "Unknown"} — Score ${best.score}/100 (${best.scoreBand}).\n\n${best.recommendedAction ?? "No specific action recommended yet."}\n\nWould you like me to prepare a reply or call brief?`
  }

  // "why is [name] scored" / "score for [name]"
  const scoreMatch = lower.match(/why is (.+?) score|score for (.+)|explain (.+?) score/)
  if (scoreMatch) {
    const nameQuery = (scoreMatch[1] || scoreMatch[2] || scoreMatch[3] || "").trim()
    if (nameQuery) {
      const lead = await prisma.lead.findFirst({
        where: { companyId, name: { contains: nameQuery, mode: "insensitive" } },
        include: { scores: { orderBy: { createdAt: "desc" }, take: 1 } },
      })
      if (!lead) return `I could not find a lead matching "${nameQuery}". Check the spelling or try their company name.`
      const latestScore = lead.scores[0]
      return `**${lead.name}** — Score: ${lead.score ?? "Not scored"}/100 (${lead.scoreBand ?? "Unscored"})\n\n${latestScore ? `**Scoring reasoning:**\n${latestScore.reasoning}` : "This lead has not been scored yet. Click 'Run Qualification' on the lead page."}`
    }
  }

  // "pipeline value" / "total value"
  if (lower.includes("pipeline") || lower.includes("total value") || lower.includes("revenue")) {
    const leads = await prisma.lead.findMany({
      where: { companyId, estimatedValue: { not: null } },
      select: { estimatedValue: true, scoreBand: true },
    })
    const total = leads.reduce((sum, l) => sum + (l.estimatedValue ?? 0), 0)
    const hot = leads.filter(l => l.scoreBand === "HOT").reduce((sum, l) => sum + (l.estimatedValue ?? 0), 0)
    const warm = leads.filter(l => l.scoreBand === "WARM").reduce((sum, l) => sum + (l.estimatedValue ?? 0), 0)
    return `Your current pipeline:\n\n💰 **Total estimated value:** £${total.toLocaleString()}\n🔴 HOT leads: £${hot.toLocaleString()}\n🟠 WARM leads: £${warm.toLocaleString()}\n\nThese are estimates based on lead data — actual deal values may vary.`
  }

  // Default fallback
  const totalLeads = await prisma.lead.count({ where: { companyId } })
  const hotCount = await prisma.lead.count({ where: { companyId, scoreBand: "HOT" } })
  const pendingApprovals = await prisma.approvalRequest.count({ where: { companyId, status: "PENDING" } })

  return `I received your message. Here is a quick snapshot of your pipeline:\n\n- Total leads: ${totalLeads}\n- HOT leads: ${hotCount}\n- Pending approvals: ${pendingApprovals}\n\nTry asking me:\n• "Show me my hot leads"\n• "Who needs a follow-up today?"\n• "What is the pipeline value?"\n• "Summarise this week"\n• "Which lead is best?"`
}
