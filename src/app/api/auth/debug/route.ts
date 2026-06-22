import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// TEMPORARY diagnostic endpoint to debug login/session issues.
// Reports config + cookie state WITHOUT exposing any secret values.
// Remove once login is confirmed working.
export async function GET(req: NextRequest) {
  const cookieNames = req.cookies.getAll().map((c) => c.name)
  const url = process.env.NEXTAUTH_URL ?? null

  let tokenDecoded = false
  let tokenError: string | null = null
  try {
    const token = await getToken({ req })
    tokenDecoded = !!token
  } catch (e) {
    tokenError = e instanceof Error ? e.message : "decode error"
  }

  return NextResponse.json({
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    secretLength: (process.env.NEXTAUTH_SECRET ?? "").length,
    nextAuthUrl: url,
    nextAuthUrlProtocol: url ? url.split("://")[0] : null,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    adminEmailsConfigured: !!process.env.ADMIN_EMAILS,
    requestUrl: req.url,
    cookieNames,
    sessionTokenCookiePresent: cookieNames.some((n) => n.includes("next-auth.session-token")),
    tokenDecoded,
    tokenError,
  })
}
