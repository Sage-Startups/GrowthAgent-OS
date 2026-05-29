import { z } from "zod"
import type { AgentProvider, AgentTaskInput, AgentTaskOutput } from "./types"
import { LocalAgentProvider } from "./local-provider"
import { buildQualificationPrompt, buildReplyPrompt, buildSalesCallPrompt, buildWeeklyReportPrompt, buildProposalPrompt, buildCompetitorPrompt, buildChatPrompt, type CompanyCtx, type LeadCtx } from "./prompt-builders"
import { qualificationOutputSchema, salesCallOutputSchema, weeklyReportOutputSchema, replyOutputSchema, proposalOutputSchema } from "./output-schemas"
import { prisma } from "@/lib/db"

type Config = { gatewayUrl: string; apiKey: string; agentId?: string; workspaceId?: string; channel?: string; timeoutMs?: number }

export class OpenClawProvider implements AgentProvider {
  private cfg: Required<Pick<Config, "gatewayUrl" | "apiKey" | "timeoutMs">> & Omit<Config, "gatewayUrl" | "apiKey" | "timeoutMs">
  private fallback = new LocalAgentProvider()

  constructor(config: Config) {
    this.cfg = { timeoutMs: 30000, ...config }
  }

  async runTask(input: AgentTaskInput): Promise<AgentTaskOutput> {
    try {
      const [company, lead] = await Promise.all([
        prisma.company.findUnique({ where: { id: input.companyId } }),
        input.leadId ? prisma.lead.findUnique({ where: { id: input.leadId } }) : Promise.resolve(null),
      ])

      const companyCtx: CompanyCtx = { name: company?.name ?? "Unknown", mainOffer: company?.mainOffer, idealCustomerProfile: company?.idealCustomerProfile, badFitTraits: company?.badFitTraits, toneOfVoice: company?.toneOfVoice, averageDealValue: company?.averageDealValue, website: company?.website, businessType: company?.businessType }
      const leadCtx: LeadCtx | null = lead ? { name: lead.name, email: lead.email, phone: lead.phone, companyName: lead.companyName, website: lead.website, source: lead.source, message: lead.message, estimatedValue: lead.estimatedValue, scoreBand: lead.scoreBand, score: lead.score, painPoints: lead.painPoints, fitSummary: lead.fitSummary, researchSummary: lead.researchSummary, recommendedAction: lead.recommendedAction } : null

      const schemaMap: Record<string, z.ZodTypeAny> = { QUALIFY_LEAD: qualificationOutputSchema, GENERATE_REPLY: replyOutputSchema, PREPARE_SALES_CALL: salesCallOutputSchema, GENERATE_WEEKLY_REPORT: weeklyReportOutputSchema, PROPOSAL_PREP: proposalOutputSchema }

      let prompt: { systemPrompt: string; userPrompt: string }
      switch (input.taskType) {
        case "QUALIFY_LEAD": prompt = buildQualificationPrompt(companyCtx, leadCtx!); break
        case "GENERATE_REPLY": prompt = buildReplyPrompt(companyCtx, leadCtx!); break
        case "PREPARE_SALES_CALL": prompt = buildSalesCallPrompt(companyCtx, leadCtx!); break
        case "GENERATE_WEEKLY_REPORT": prompt = buildWeeklyReportPrompt(companyCtx, input.context); break
        case "PROPOSAL_PREP": prompt = buildProposalPrompt(companyCtx, leadCtx!); break
        case "COMPETITOR_MONITORING": prompt = buildCompetitorPrompt(companyCtx); break
        default: prompt = { systemPrompt: "", userPrompt: JSON.stringify(input) }
      }

      const raw = await this.callGateway(prompt)
      const parsed = this.safeParseJSON(raw)

      const schema = schemaMap[input.taskType]
      if (schema) {
        const v = schema.safeParse(parsed)
        if (!v.success) console.warn(`[OpenClaw] Output validation warning for ${input.taskType}:`, v.error.issues[0]?.message)
      }

      return this.mapOutput(input.taskType, parsed, input.leadId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "OpenClaw error"
      console.error("[OpenClaw] runTask failed, falling back to local:", msg)
      try {
        await prisma.auditLog.create({ data: { companyId: input.companyId, userId: input.userId, action: "AGENT_OPENCLAW_FALLBACK", entityType: "AgentTask", metadata: { taskType: input.taskType, error: msg } as any } })
      } catch {}
      return this.fallback.runTask(input)
    }
  }

  async sendChatMessage(input: { companyId: string; userId: string; message: string; context: Record<string, unknown> }): Promise<AgentTaskOutput> {
    try {
      const company = await prisma.company.findUnique({ where: { id: input.companyId } })
      const companyCtx: CompanyCtx = { name: company?.name ?? "Unknown", mainOffer: company?.mainOffer, idealCustomerProfile: company?.idealCustomerProfile, badFitTraits: company?.badFitTraits, toneOfVoice: company?.toneOfVoice, averageDealValue: company?.averageDealValue, website: company?.website, businessType: company?.businessType }
      const prompt = buildChatPrompt(companyCtx, input.message, input.context)
      const raw = await this.callGateway(prompt)
      const parsed = this.safeParseJSON(raw)
      return { success: true, summary: (parsed?.summary as string) ?? raw, recommendedActions: (parsed?.recommendedActions as any) ?? [] }
    } catch (err) {
      console.error("[OpenClaw] chat failed, falling back:", err instanceof Error ? err.message : err)
      return this.fallback.sendChatMessage(input)
    }
  }

  private async callGateway(prompt: { systemPrompt: string; userPrompt: string }): Promise<string> {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), this.cfg.timeoutMs)
    try {
      const res = await fetch(`${this.cfg.gatewayUrl}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${this.cfg.apiKey}`, ...(this.cfg.agentId ? { "X-Agent-Id": this.cfg.agentId } : {}), ...(this.cfg.workspaceId ? { "X-Workspace-Id": this.cfg.workspaceId } : {}) },
        body: JSON.stringify({ systemPrompt: prompt.systemPrompt, userPrompt: prompt.userPrompt, channel: this.cfg.channel ?? "growthagent-os", outputFormat: "json" }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`)
      const data = await res.json()
      return data.output ?? data.result ?? data.content ?? data.text ?? JSON.stringify(data)
    } finally { clearTimeout(t) }
  }

  private safeParseJSON(raw: string): Record<string, unknown> {
    try { return JSON.parse(raw) } catch {}
    const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (m) { try { return JSON.parse(m[1]) } catch {} }
    const j = raw.match(/\{[\s\S]*\}/)
    if (j) { try { return JSON.parse(j[0]) } catch {} }
    return { summary: raw }
  }

  private mapOutput(taskType: string, data: Record<string, unknown>, leadId?: string): AgentTaskOutput {
    const scoreBand = data.scoreBand as string
    switch (taskType) {
      case "QUALIFY_LEAD":
        return { success: true, summary: `Scored ${data.score}/100 (${scoreBand}): ${data.fitSummary ?? ""}`, structuredData: data, draftText: data.draftReply as string, recommendedActions: (scoreBand === "HOT" || scoreBand === "WARM") ? [{ label: "Send draft reply", actionType: "SEND_EMAIL", requiresApproval: true, payload: { draftReply: data.draftReply, leadId, score: data.score } }] : [] }
      case "GENERATE_REPLY":
        return { success: true, summary: "Draft reply generated — awaiting approval", draftText: (data.body ?? data.draftReply) as string, structuredData: data, recommendedActions: [{ label: "Send this reply", actionType: "SEND_EMAIL", requiresApproval: true, payload: { subject: data.subject, body: data.body ?? data.draftReply } }] }
      case "PREPARE_SALES_CALL":
        return { success: true, summary: "Sales call brief prepared", structuredData: data, draftText: formatBrief(data) }
      case "GENERATE_WEEKLY_REPORT":
        return { success: true, summary: (data.executiveSummary as string) ?? "Weekly report generated", structuredData: data }
      default:
        return { success: true, summary: (data.summary as string) ?? "Task completed", structuredData: data }
    }
  }
}

function formatBrief(d: Record<string, unknown>): string {
  const s = (d.likelyPainPoints as string[] | undefined)?.map(p => `- ${p}`).join("\n") ?? ""
  const q = (d.discoveryQuestions as string[] | undefined)?.map((q, i) => `${i + 1}. ${q}`).join("\n") ?? ""
  return [d.leadSummary && `## Lead Summary\n${d.leadSummary}`, d.companyOverview && `## Company Overview\n${d.companyOverview}`, s && `## Likely Pain Points\n${s}`, q && `## Discovery Questions\n${q}`, d.suggestedOfferAngle && `## Offer Angle\n${d.suggestedOfferAngle}`, d.callOpener && `## Call Opener\n"${d.callOpener}"`].filter(Boolean).join("\n\n")
}
