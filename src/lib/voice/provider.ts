import { LocalVoiceProvider } from "./local-provider"
import { VapiVoiceProvider } from "./vapi-provider"
import { TwilioVoiceProvider } from "./twilio-provider"
import type { VoiceProvider } from "./types"
import { env } from "@/lib/env"

export function getVoiceProvider(companyOverride?: { voiceProvider?: string | null }): VoiceProvider {
  const provider = companyOverride?.voiceProvider ?? env.VOICE_PROVIDER
  if (provider === "vapi" && env.VAPI_API_KEY) {
    return new VapiVoiceProvider({ apiKey: env.VAPI_API_KEY, assistantId: env.VAPI_ASSISTANT_ID })
  }
  if (provider === "twilio" && env.TWILIO_ACCOUNT_SID) {
    return new TwilioVoiceProvider({ accountSid: env.TWILIO_ACCOUNT_SID, authToken: env.TWILIO_AUTH_TOKEN, phoneNumber: env.TWILIO_PHONE_NUMBER })
  }
  return new LocalVoiceProvider()
}

export { LocalVoiceProvider } from "./local-provider"
export { VapiVoiceProvider } from "./vapi-provider"
export { TwilioVoiceProvider } from "./twilio-provider"
export type { VoiceProvider, VoiceSession, VoiceCallResult } from "./types"
