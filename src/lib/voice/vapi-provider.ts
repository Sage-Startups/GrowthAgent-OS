import type { VoiceProvider, VoiceSession, VoiceCallResult } from "./types"

export class VapiVoiceProvider implements VoiceProvider {
  private apiKey: string
  private assistantId: string

  constructor(config: { apiKey: string; assistantId: string }) {
    this.apiKey = config.apiKey
    this.assistantId = config.assistantId
  }

  async createBrowserSession(input: { companyId: string; assistantId?: string }): Promise<VoiceSession> {
    if (!this.apiKey) return { sessionId: "", provider: "vapi", status: "ended", metadata: { error: "Vapi not configured" } }
    // TODO: Call Vapi /calls API to create browser session
    return { sessionId: `vapi_${Date.now()}`, provider: "vapi", status: "connecting", metadata: { assistantId: input.assistantId ?? this.assistantId } }
  }

  async handleInboundCall(): Promise<VoiceCallResult> {
    return { success: false, error: "Vapi inbound not yet configured" }
  }

  async endCall(): Promise<void> {
    // TODO: Call Vapi /calls/{id}/stop
  }
}
