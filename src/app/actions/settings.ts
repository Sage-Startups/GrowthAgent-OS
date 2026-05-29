"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentCompany } from "@/lib/tenant"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

export async function saveCompanySettings(data: {
  name: string
  website?: string
  businessType?: string
  mainOffer?: string
  averageDealValue?: number
  idealCustomerProfile?: string
  badFitTraits?: string
  toneOfVoice?: string
  approvalPreference?: string
  leadScoringPriorities?: string
}) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    await prisma.company.update({
      where: { id: company.id },
      data: {
        name: data.name,
        website: data.website,
        businessType: data.businessType,
        mainOffer: data.mainOffer,
        averageDealValue: data.averageDealValue,
        idealCustomerProfile: data.idealCustomerProfile,
        badFitTraits: data.badFitTraits,
        toneOfVoice: data.toneOfVoice,
        approvalPreference: data.approvalPreference,
        leadScoringPriorities: data.leadScoringPriorities,
      },
    })
    revalidatePath("/app/settings")
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save settings" }
  }
}

export async function regenerateApiKey() {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    const newKey = `gao_${randomUUID().replace(/-/g, "")}`
    await prisma.company.update({
      where: { id: company.id },
      data: { apiKey: newKey },
    })
    revalidatePath("/app/settings")
    return { success: true, apiKey: newKey }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to regenerate API key" }
  }
}

export async function getOrCreateApiKey() {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    if (company.apiKey) return { success: true, apiKey: company.apiKey }

    const newKey = `gao_${randomUUID().replace(/-/g, "")}`
    await prisma.company.update({
      where: { id: company.id },
      data: { apiKey: newKey },
    })
    return { success: true, apiKey: newKey }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to get API key" }
  }
}
