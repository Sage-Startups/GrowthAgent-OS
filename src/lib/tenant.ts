import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Company } from "@prisma/client"

export async function getCurrentCompany(): Promise<Company> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
    include: { company: true },
  })

  if (!membership) throw new Error("No company found for user")
  return membership.company
}

export async function assertLeadBelongsToCompany(
  leadId: string,
  companyId: string
): Promise<void> {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, companyId },
  })
  if (!lead) throw new Error("Lead not found or access denied")
}

export async function getCompanyAgent(companyId: string) {
  const agent = await prisma.agent.findFirst({
    where: { companyId, status: "ACTIVE" },
  })
  if (!agent) throw new Error("No active agent found for company")
  return agent
}
