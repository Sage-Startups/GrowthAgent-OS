import type { VoiceProvider, VoiceSession, VoiceCallResult } from "./types"

export class LocalVoiceProvider implements VoiceProvider {
  async createBrowserSession(): Promise<VoiceSession> {
    return {
      sessionId: `local_${Date.now()}`,
      provider: "local",
      status: "ready",
      metadata: { note: "Local voice provider — configure Vapi or Twilio for real calls" },
    }
  }

  async handleInboundCall(): Promise<VoiceCallResult> {
    return { success: false, error: "Local provider does not handle inbound calls" }
  }

  async endCall(): Promise<void> {}
}
