"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentCompany } from "@/lib/tenant"
import { revalidatePath } from "next/cache"

export async function saveOpenClawConfig(data: {
  openclawEnabled: boolean
  openclawGatewayUrl?: string
  openclawAgentId?: string
  openclawWorkspaceId?: string
  openclawApiKey?: string
  openclawChannel?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    await prisma.company.update({
      where: { id: company.id },
      data: {
        openclawEnabled: data.openclawEnabled,
        openclawGatewayUrl: data.openclawGatewayUrl || null,
        openclawAgentId: data.openclawAgentId || null,
        openclawWorkspaceId: data.openclawWorkspaceId || null,
        openclawApiKey: data.openclawApiKey || null,
        openclawChannel: data.openclawChannel || null,
      },
    })
    await prisma.auditLog.create({
      data: { companyId: company.id, userId: session.user.id, action: "AGENT_PROVIDER_CHANGED", entityType: "Company", entityId: company.id, metadata: { openclawEnabled: data.openclawEnabled } as any },
    })
    revalidatePath("/app/settings")
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save config" }
  }
}

export async function testOpenClawConnection() {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    if (!company.openclawGatewayUrl) return { error: "No gateway URL configured" }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    let status: "connected" | "failed" = "failed"
    let message = ""

    try {
      const res = await fetch(`${company.openclawGatewayUrl}/health`, {
        headers: { "Authorization": `Bearer ${company.openclawApiKey ?? ""}` },
        signal: controller.signal,
      })
      status = res.ok ? "connected" : "failed"
      message = res.ok ? "Connection successful" : `Gateway returned ${res.status}`
    } catch (fetchErr) {
      message = fetchErr instanceof Error ? fetchErr.message : "Connection failed"
    } finally {
      clearTimeout(timeout)
    }

    await prisma.company.update({ where: { id: company.id }, data: { openclawLastTestedAt: new Date(), openclawSetupStatus: status } })
    await prisma.auditLog.create({
      data: { companyId: company.id, userId: session.user.id, action: "OPENCLAW_CONNECTION_TESTED", entityType: "Company", entityId: company.id, metadata: { status, message } as any },
    })
    return { success: status === "connected", status, message }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Test failed" }
  }
}

export async function getOpenClawConfig() {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }
  try {
    const company = await getCurrentCompany()
    return {
      success: true,
      config: {
        openclawEnabled: company.openclawEnabled,
        openclawGatewayUrl: company.openclawGatewayUrl,
        openclawAgentId: company.openclawAgentId,
        openclawWorkspaceId: company.openclawWorkspaceId,
        openclawChannel: company.openclawChannel,
        openclawSetupStatus: company.openclawSetupStatus,
        openclawLastTestedAt: company.openclawLastTestedAt,
        hasApiKey: !!company.openclawApiKey,
      },
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to load config" }
  }
}
