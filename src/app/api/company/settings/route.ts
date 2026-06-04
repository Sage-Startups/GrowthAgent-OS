import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
    include: {
      company: {
        select: {
          id: true, name: true, website: true, businessType: true, mainOffer: true,
          averageDealValue: true, idealCustomerProfile: true, badFitTraits: true,
          leadSources: true, currentCRM: true, toneOfVoice: true, approvalPreference: true,
          leadScoringPriorities: true, setupStatus: true, stripePlanName: true,
          stripePlanStatus: true, stripeTrialEnd: true,
          openclawEnabled: true, openclawGatewayUrl: true, openclawAgentId: true,
          openclawWorkspaceId: true, openclawChannel: true, openclawSetupStatus: true,
          openclawLastTestedAt: true,
          voiceEnabled: true, voiceProvider: true, vapiAssistantId: true,
          twilioPhoneNumber: true,
          createdAt: true, updatedAt: true,
          apiKey: true,
          // openclawApiKey intentionally excluded — third-party secret, never returned to browser
          // voiceWebhookSecret intentionally excluded
        },
      },
    },
  })

  if (!membership) return NextResponse.json({ error: "No company found" }, { status: 404 })
  return NextResponse.json({ company: membership.company })
}
