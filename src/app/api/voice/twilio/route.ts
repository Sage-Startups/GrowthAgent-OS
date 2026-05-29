import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  // Twilio sends form-encoded data
  let body: Record<string, string> = {}
  try {
    const text = await req.text()
    for (const part of text.split("&")) {
      const [k, v] = part.split("=")
      if (k) body[decodeURIComponent(k)] = decodeURIComponent(v ?? "")
    }
  } catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }) }

  await prisma.webhookEvent.create({
    data: { source: "twilio", eventType: body.CallStatus ?? "call", payload: JSON.parse(JSON.stringify(body)), processed: false },
  })

  // TODO: Handle Twilio status callbacks and create VoiceCall records
  // Return TwiML OK response
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
    headers: { "Content-Type": "text/xml" },
  })
}
