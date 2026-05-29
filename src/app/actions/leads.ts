"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentCompany, assertLeadBelongsToCompany, getCompanyAgent } from "@/lib/tenant"
import { runAgentTask } from "@/lib/agent-runner"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const addLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  website: z.string().optional(),
  source: z.string().optional(),
  message: z.string().optional(),
  estimatedValue: z.number().min(0).optional(),
  notes: z.string().optional(),
})

export type AddLeadInput = z.infer<typeof addLeadSchema>

export async function addLead(data: AddLeadInput) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  const validated = addLeadSchema.safeParse(data)
  if (!validated.success) return { error: validated.error.errors[0].message }

  try {
    const company = await getCurrentCompany()
    const agent = await prisma.agent.findFirst({ where: { companyId: company.id, status: "ACTIVE" } })

    const lead = await prisma.lead.create({
      data: {
        companyId: company.id,
        name: validated.data.name,
        email: validated.data.email || null,
        phone: validated.data.phone || null,
        companyName: validated.data.companyName || null,
        website: validated.data.website || null,
        source: validated.data.source || null,
        message: validated.data.message || null,
        estimatedValue: validated.data.estimatedValue || null,
        status: "NEW",
      },
    })

    if (validated.data.notes && agent) {
      await prisma.leadNote.create({
        data: { leadId: lead.id, content: validated.data.notes, authorId: session.user.id },
      })
    }

    if (agent) {
      await prisma.agentTask.create({
        data: {
          agentId: agent.id,
          leadId: lead.id,
          title: "Research and qualify lead",
          description: `Qualify ${validated.data.name} from ${validated.data.companyName ?? "unknown company"}`,
          status: "PENDING",
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        companyId: company.id,
        userId: session.user.id,
        action: "LEAD_CREATED",
        entityType: "Lead",
        entityId: lead.id,
        metadata: { name: lead.name, source: lead.source },
      },
    })

    revalidatePath("/app/leads")
    return { success: true, leadId: lead.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create lead" }
  }
}

export async function qualifyLead(leadId: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    await assertLeadBelongsToCompany(leadId, company.id)
    const agent = await getCompanyAgent(company.id)

    const result = await runAgentTask("QUALIFY_LEAD", agent.id, company.id, {
      leadId,
      userId: session.user.id,
    })

    revalidatePath(`/app/leads/${leadId}`)
    revalidatePath("/app/leads")
    revalidatePath("/app/approvals")
    return result
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to qualify lead" }
  }
}

export async function regenerateReply(leadId: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    await assertLeadBelongsToCompany(leadId, company.id)
    const agent = await getCompanyAgent(company.id)

    const result = await runAgentTask("GENERATE_REPLY", agent.id, company.id, {
      leadId,
      userId: session.user.id,
    })

    revalidatePath(`/app/leads/${leadId}`)
    return result
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to regenerate reply" }
  }
}

export async function createFollowUp(leadId: string, days: number, customDate?: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    await assertLeadBelongsToCompany(leadId, company.id)

    const followUpDate = customDate
      ? new Date(customDate)
      : new Date(Date.now() + days * 24 * 60 * 60 * 1000)

    await prisma.lead.update({
      where: { id: leadId },
      data: { nextFollowUpAt: followUpDate, status: "FOLLOW_UP_DUE" },
    })

    const agent = await prisma.agent.findFirst({ where: { companyId: company.id, status: "ACTIVE" } })
    if (agent) {
      await prisma.agentTask.create({
        data: {
          agentId: agent.id,
          leadId,
          title: `Follow up — scheduled for ${followUpDate.toLocaleDateString("en-GB")}`,
          description: "Follow up with lead at scheduled time",
          status: "PENDING",
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        companyId: company.id,
        userId: session.user.id,
        action: "FOLLOW_UP_SCHEDULED",
        entityType: "Lead",
        entityId: leadId,
        metadata: { followUpDate: followUpDate.toISOString() },
      },
    })

    revalidatePath(`/app/leads/${leadId}`)
    revalidatePath("/app/leads")
    revalidatePath("/app")
    return { success: true, followUpDate: followUpDate.toISOString() }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to create follow-up" }
  }
}

export async function prepareSalesCall(leadId: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    await assertLeadBelongsToCompany(leadId, company.id)
    const agent = await getCompanyAgent(company.id)

    const result = await runAgentTask("PREPARE_SALES_CALL", agent.id, company.id, {
      leadId,
      userId: session.user.id,
    })

    revalidatePath(`/app/leads/${leadId}`)
    return result
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to prepare sales call" }
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    await assertLeadBelongsToCompany(leadId, company.id)

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: status as any },
    })

    await prisma.auditLog.create({
      data: {
        companyId: company.id,
        userId: session.user.id,
        action: "LEAD_STATUS_UPDATED",
        entityType: "Lead",
        entityId: leadId,
        metadata: { newStatus: status },
      },
    })

    revalidatePath(`/app/leads/${leadId}`)
    revalidatePath("/app/leads")
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update lead status" }
  }
}

export async function addLeadNote(leadId: string, content: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()
    await assertLeadBelongsToCompany(leadId, company.id)

    await prisma.leadNote.create({
      data: { leadId, content, authorId: session.user.id },
    })

    revalidatePath(`/app/leads/${leadId}`)
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to add note" }
  }
}

export async function loadDemoLeads() {
  const session = await getServerSession(authOptions)
  if (!session) return { error: "Unauthorized" }

  try {
    const company = await getCurrentCompany()

    const demoLeads = [
      {
        name: "James Hartley",
        email: "james@hartleydigital.co.uk",
        phone: "+44 7700 900001",
        companyName: "Hartley Digital",
        website: "hartleydigital.co.uk",
        source: "Website form",
        message: "Hi, we need a complete website redesign for our e-commerce brand. We have a budget and need to move quickly — ideally launching before our summer campaign. Turnover is around £2M. Looking for a serious agency partner.",
        estimatedValue: 12000,
        status: "NEW" as const,
      },
      {
        name: "Priya Nair",
        email: "priya@growthstack.io",
        phone: "+44 7700 900002",
        companyName: "GrowthStack",
        website: "growthstack.io",
        source: "Referral",
        message: "We are a Series A SaaS company and need a partner to help us build out our sales infrastructure and lead capture system. Budget approved, timeline is this quarter.",
        estimatedValue: 18000,
        status: "NEW" as const,
      },
      {
        name: "Dan Kowalski",
        email: "dan@accelerateseo.com",
        phone: "+44 7700 900003",
        companyName: "Accelerate SEO",
        website: "accelerateseo.com",
        source: "LinkedIn",
        message: "Interested in learning more about your services. We run a digital marketing agency and are looking to improve our lead qualification process. Open to a conversation.",
        estimatedValue: 6000,
        status: "NEW" as const,
      },
      {
        name: "Chris Student",
        email: "chris.student@gmail.com",
        phone: "",
        companyName: "",
        website: "",
        source: "Website form",
        message: "Hi I am a student and would love some free advice on how to get my first clients. Looking for free resources or maybe some pro bono help to get started.",
        estimatedValue: 0,
        status: "NEW" as const,
      },
      {
        name: "Victoria Hammond",
        email: "victoria@hammondgroup.co.uk",
        phone: "+44 7700 900005",
        companyName: "Hammond Group Consulting",
        website: "hammondgroup.co.uk",
        source: "Referral",
        message: "We are a management consultancy firm. Our managing director asked me to reach out — we are looking for an AI-powered sales operations solution urgently. Budget is not a constraint. We need a presentation-ready brief by end of month.",
        estimatedValue: 35000,
        status: "NEW" as const,
      },
      {
        name: "Tom Generic",
        email: "tom@yahoo.com",
        phone: "",
        companyName: "",
        website: "",
        source: "Website form",
        message: "hi",
        estimatedValue: null,
        status: "NEW" as const,
      },
    ]

    for (const leadData of demoLeads) {
      await prisma.lead.create({
        data: { companyId: company.id, ...leadData },
      })
    }

    await prisma.auditLog.create({
      data: {
        companyId: company.id,
        userId: session.user.id,
        action: "DEMO_LEADS_LOADED",
        entityType: "Company",
        entityId: company.id,
        metadata: { count: demoLeads.length },
      },
    })

    revalidatePath("/app/leads")
    return { success: true, count: demoLeads.length }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to load demo leads" }
  }
}
