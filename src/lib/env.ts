// Validates env vars exist at startup. All optional except DATABASE_URL and NEXTAUTH_SECRET.
export function validateEnv() {
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"] as const
  const missing = required.filter((k) => !process.env[k])
  if (missing.length > 0) {
    console.warn(`[env] Missing required environment variables: ${missing.join(", ")}`)
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  AGENT_PROVIDER: process.env.AGENT_PROVIDER ?? "local",
  OPENCLAW_DEFAULT_GATEWAY_URL: process.env.OPENCLAW_DEFAULT_GATEWAY_URL ?? "",
  OPENCLAW_DEFAULT_API_KEY: process.env.OPENCLAW_DEFAULT_API_KEY ?? "",
  JOB_SECRET: process.env.JOB_SECRET ?? "",
  VOICE_PROVIDER: process.env.VOICE_PROVIDER ?? "local",
  VAPI_API_KEY: process.env.VAPI_API_KEY ?? "",
  VAPI_ASSISTANT_ID: process.env.VAPI_ASSISTANT_ID ?? "",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ?? "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ?? "",
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ?? "",
  VOICE_WEBHOOK_SECRET: process.env.VOICE_WEBHOOK_SECRET ?? undefined,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
}
