import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { env } from "@/lib/env"

export async function POST(req: NextRequest) {
  // Vapi sends webhooks for call events
  const secret = req.headers.get("x-vapi-secret")
  if (env.VOICE_WEBHOOK_SECRET && secret !== env.VOICE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const event = body.message as Record<string, unknown> | undefined
  const callId = event?.callId as string | undefined

  await prisma.webhookEvent.create({
    data: { source: "vapi", eventType: String(event?.type ?? "call"), payload: JSON.parse(JSON.stringify(body)), processed: false },
  })

  // TODO: Process Vapi call events (call-started, call-ended, transcript-update)
  return NextResponse.json({ received: true, callId })
}
