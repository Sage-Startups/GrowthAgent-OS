import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { ApprovalsClient } from "@/components/approvals/approvals-client"

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
  })
  if (!membership) redirect("/app/onboarding")

  const approvals = await prisma.approvalRequest.findMany({
    where: { companyId: membership.companyId },
    include: {
      lead: { select: { name: true, companyName: true } },
    },
    orderBy: [
      { status: "asc" },
      { createdAt: "desc" },
    ],
    take: 50,
  })

  const serialized = approvals.map((a) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    description: a.description,
    proposedAction: a.proposedAction,
    leadName: a.lead?.name ?? null,
    leadCompanyName: a.lead?.companyName ?? null,
    leadId: a.leadId,
    status: a.status as "PENDING" | "APPROVED" | "REJECTED",
    createdAt: a.createdAt,
  }))

  return <ApprovalsClient initialApprovals={serialized} />
}
