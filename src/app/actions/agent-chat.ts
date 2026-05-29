"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentCompany, getCompanyAgent } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { getAgentProvider } from "@/lib/agents"

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

    await prisma.agentMessage.create({ data: { agentId: agent.id, role: "user", content } })

    // Build rich context for provider
    const [totalLeads, hotLeads, pendingApprovals, overdueFollowUps] = await Promise.all([
      prisma.lead.count({ where: { companyId: company.id } }),
      prisma.lead.count({ where: { companyId: company.id, scoreBand: "HOT" } }),
      prisma.approvalRequest.count({ where: { companyId: company.id, status: "PENDING" } }),
      prisma.lead.count({ where: { companyId: company.id, nextFollowUpAt: { lte: new Date() } } }),
    ])

    const context = { totalLeads, hotLeads, pendingApprovals, overdueFollowUps, companyName: company.name }
    const provider = getAgentProvider(company)
    const result = await provider.sendChatMessage({ companyId: company.id, userId: session.user.id, message: content, context })

    const assistantMessage = await prisma.agentMessage.create({
      data: { agentId: agent.id, role: "assistant", content: result.summary, metadata: { provider: company.openclawEnabled ? "openclaw" : "local", success: result.success } as any },
    })

    await prisma.auditLog.create({
      data: { companyId: company.id, userId: session.user.id, action: "AGENT_CHAT_MESSAGE", entityType: "AgentMessage", entityId: assistantMessage.id, metadata: { messageLength: content.length } as any },
    })

    revalidatePath("/app/agent")
    return { success: true, message: assistantMessage }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to send message" }
  }
}
