import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { runAgentTask } from "@/lib/agent-runner"

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-job-secret")
  if (!secret || secret !== process.env.JOB_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const companyId = body.companyId as string | undefined

    const where = { status: "NEW" as const, ...(companyId ? { companyId } : {}) }
    const newLeads = await prisma.lead.findMany({ where, take: 20, include: { company: { include: { agents: { where: { status: "ACTIVE" } } } } } })

    const results: Array<{ leadId: string; success: boolean; error?: string }> = []

    for (const lead of newLeads) {
      const agent = lead.company.agents[0]
      if (!agent) { results.push({ leadId: lead.id, success: false, error: "No active agent" }); continue }
      const result = await runAgentTask("QUALIFY_LEAD", agent.id, lead.companyId, { leadId: lead.id })
      results.push({ leadId: lead.id, success: result.success, error: result.error })
    }

    return NextResponse.json({ processed: results.length, results })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Job failed" }, { status: 500 })
  }
}
