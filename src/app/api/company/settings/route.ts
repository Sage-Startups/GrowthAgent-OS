import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
    include: { company: true },
  })

  if (!membership) return NextResponse.json({ error: "No company found" }, { status: 404 })
  return NextResponse.json({ company: membership.company })
}
