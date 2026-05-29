import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
  })
  if (!membership) return NextResponse.json({ error: "No company" }, { status: 404 })

  const logs = await prisma.auditLog.findMany({
    where: { companyId: membership.companyId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, action: true, entityType: true, entityId: true, createdAt: true, metadata: true },
  })

  return NextResponse.json({ logs })
}
