import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCompanyUsage, getRemainingLimits } from "@/lib/usage-service"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const membership = await prisma.companyMember.findFirst({ where: { userId: session.user.id } })
  if (!membership) return NextResponse.json({ error: "No company" }, { status: 404 })

  const [usage, limits] = await Promise.all([
    getCompanyUsage(membership.companyId),
    getRemainingLimits(membership.companyId),
  ])

  return NextResponse.json({ usage, limits })
}
