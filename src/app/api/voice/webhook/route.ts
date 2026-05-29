import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"
import { z } from "zod"

const webhookSchema = z.object({
  companyApiKey: z.string().optional(),
  companyId: z.string().optional(),
  direction: z.enum(["INBOUND", "OUTBOUND", "BROWSER"]).default("INBOUND"),
  phoneNumber: z.string().optional(),
  transcript: z.string().optional(),
  summary: z.string().optional(),
  provider: z.string().default("webhook"),
  duration: z.number().optional(),
  recordingUrl: z.string().optional(),
})

export async function POST(req: NextRequest) {
  // Validate webhook secret if configured
  if (env.VOICE_WEBHOOK_SECRET) {
    const signature = req.headers.get("x-webhook-secret")
    if (signature !== env.VOICE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const parsed = webhookSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const data = parsed.data
  let companyId = data.companyId

  if (!companyId && data.companyApiKey) {
    const company = await prisma.company.findUnique({ where: { apiKey: data.companyApiKey }, select: { id: true } })
    if (!company) return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    companyId = company.id
  }

  if (!companyId) return NextResponse.json({ error: "companyId or companyApiKey required" }, { status: 400 })

  const voiceCall = await prisma.voiceCall.create({
    data: {
      companyId,
      provider: data.provider,
      direction: data.direction,
      phoneNumber: data.phoneNumber,
      transcript: data.transcript,
      summary: data.summary,
      duration: data.duration,
      recordingUrl: data.recordingUrl,
      status: "completed",
      startedAt: new Date(),
      endedAt: new Date(),
    },
  })

  await prisma.auditLog.create({
    data: {
      companyId,
      action: "VOICE_CALL_RECEIVED",
      entityType: "VoiceCall",
      entityId: voiceCall.id,
      metadata: JSON.parse(JSON.stringify({ direction: data.direction, provider: data.provider })),
    },
  })

  return NextResponse.json({ success: true, callId: voiceCall.id })
}
