import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { getPlanDisplay } from "@/lib/plans"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
    include: { company: { include: { usage: { select: { planName: true } } } } },
  })

  const pendingApprovals = membership
    ? await prisma.approvalRequest.count({
        where: { companyId: membership.companyId, status: "PENDING" },
      })
    : 0

  const planLabel = membership
    ? getPlanDisplay(membership.company.usage?.planName ?? membership.company.stripePlanName).shortLabel
    : null

  return (
    <div className="flex min-h-screen bg-[hsl(222_47%_5%)]">
      <AppSidebar
        userName={session.user.name ?? null}
        userEmail={session.user.email ?? null}
        planLabel={planLabel}
        pendingApprovals={pendingApprovals}
        isAdmin={session.user.role === "ADMIN"}
      />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
