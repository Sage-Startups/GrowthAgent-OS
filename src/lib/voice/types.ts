export type VoiceDirection = "INBOUND" | "OUTBOUND" | "BROWSER"

export type VoiceSession = {
  sessionId: string
  provider: string
  status: "ready" | "connecting" | "connected" | "ended"
  metadata?: Record<string, unknown>
}

export type VoiceCallResult = {
  success: boolean
  callId?: string
  transcript?: string
  summary?: string
  duration?: number
  error?: string
}

export interface VoiceProvider {
  createBrowserSession(input: {
    companyId: string
    leadId?: string
    assistantId?: string
  }): Promise<VoiceSession>
  handleInboundCall(input: {
    companyId: string
    from: string
    to: string
    callSid?: string
    payload: Record<string, unknown>
  }): Promise<VoiceCallResult>
  endCall(input: { sessionId: string; callSid?: string }): Promise<void>
}
