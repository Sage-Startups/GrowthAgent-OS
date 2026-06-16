import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCompanyUsage, resetMonthlyCredits } from "@/lib/usage-service"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Validate admin role
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json() as { companyId?: string; action?: string; amount?: number; reason?: string }
  const { companyId, action, amount, reason } = body

  if (!companyId || !action) {
    return NextResponse.json({ error: "companyId and action are required" }, { status: 400 })
  }

  const usage = await getCompanyUsage(companyId)

  if (action === "add") {
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 })
    }
    const newRemaining = usage.creditsRemaining + amount
    const newLimit = usage.monthlyCreditLimit + amount
    await prisma.companyUsage.update({
      where: { companyId },
      data: {
        creditsRemaining: newRemaining,
        monthlyCreditLimit: newLimit,
      },
    })
    await prisma.creditLedger.create({
      data: {
        companyId,
        actionType: "admin_add",
        creditsChanged: amount,
        balanceAfter: newRemaining,
        description: reason ?? `Admin added ${amount} credits`,
        metadata: { adminUserId: session.user.id },
      },
    })
    return NextResponse.json({ success: true, creditsRemaining: newRemaining })
  }

  if (action === "remove") {
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 })
    }
    const newRemaining = Math.max(0, usage.creditsRemaining - amount)
    await prisma.companyUsage.update({
      where: { companyId },
      data: { creditsRemaining: newRemaining },
    })
    await prisma.creditLedger.create({
      data: {
        companyId,
        actionType: "admin_remove",
        creditsChanged: -amount,
        balanceAfter: newRemaining,
        description: reason ?? `Admin removed ${amount} credits`,
        metadata: { adminUserId: session.user.id },
      },
    })
    return NextResponse.json({ success: true, creditsRemaining: newRemaining })
  }

  if (action === "reset") {
    await resetMonthlyCredits(companyId)
    const refreshed = await getCompanyUsage(companyId)
    return NextResponse.json({ success: true, creditsRemaining: refreshed.creditsRemaining })
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
}
