import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { runAgentTask } from "@/lib/agent-runner"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { companyApiKey, name, email, phone, companyName, website, source, message } = body

    if (!companyApiKey || !name) {
      return NextResponse.json({ error: "companyApiKey and name are required" }, { status: 400 })
    }

    const company = await prisma.company.findUnique({
      where: { apiKey: companyApiKey },
      include: { agents: { where: { status: "ACTIVE" }, take: 1 } },
    })

    if (!company) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const lead = await prisma.lead.create({
      data: {
        companyId: company.id,
        name,
        email: email || null,
        phone: phone || null,
        companyName: companyName || null,
        website: website || null,
        source: source || "webhook",
        message: message || null,
        status: "NEW",
      },
    })

    await prisma.webhookEvent.create({
      data: {
        companyId: company.id,
        source: source || "webhook",
        eventType: "LEAD_CREATED",
        payload: body,
        processed: true,
        processedAt: new Date(),
      },
    })

    let scoreResult = null
    const agent = company.agents[0]
    if (agent && company.approvalPreference !== "Approve everything manually") {
      try {
        scoreResult = await runAgentTask("QUALIFY_LEAD", agent.id, company.id, {
          leadId: lead.id,
        })
      } catch {
        // qualification is best-effort
      }
    }

    const updatedLead = await prisma.lead.findUnique({ where: { id: lead.id } })

    return NextResponse.json({
      leadId: lead.id,
      status: updatedLead?.status ?? "NEW",
      score: updatedLead?.score ?? null,
      scoreBand: updatedLead?.scoreBand ?? null,
      qualified: !!scoreResult?.success,
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
