import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean up
  await prisma.auditLog.deleteMany()
  await prisma.approvalRequest.deleteMany()
  await prisma.agentMessage.deleteMany()
  await prisma.agentTask.deleteMany()
  await prisma.agentRun.deleteMany()
  await prisma.agent.deleteMany()
  await prisma.leadScore.deleteMany()
  await prisma.leadNote.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.integration.deleteMany()
  await prisma.webhookEvent.deleteMany()
  await prisma.voiceCall.deleteMany()
  await prisma.report.deleteMany()
  await prisma.companyMember.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.company.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.plan.deleteMany()

  // Create plans
  const starterPlan = await prisma.plan.create({
    data: {
      name: "Lead Agent Starter",
      description: "Your first AI sales operator",
      setupFee: 499,
      monthlyPrice: 99,
      features: [
        "Private dashboard",
        "Mini lead CRM",
        "1 lead source",
        "AI lead research",
        "Lead scoring",
        "Draft replies",
        "Approval queue",
        "Agent chat",
        "Weekly report",
      ],
    },
  })

  const pipelinePlan = await prisma.plan.create({
    data: {
      name: "Pipeline Agent",
      description: "Full pipeline automation",
      setupFee: 1500,
      monthlyPrice: 249,
      features: [
        "Everything in Starter",
        "Up to 3 lead sources",
        "Follow-up agent",
        "Sales-call prep agent",
        "Custom scoring rules",
        "CRM updates",
        "Pipeline report",
        "Monthly optimisation",
      ],
    },
  })

  const growthPlan = await prisma.plan.create({
    data: {
      name: "Growth Agent OS",
      description: "Complete AI revenue operation",
      setupFee: 3000,
      monthlyPrice: 599,
      features: [
        "Everything in Pipeline",
        "Full agent suite",
        "Proposal prep agent",
        "Competitor monitoring",
        "Client onboarding agent",
        "Voice agent readiness",
        "Custom integrations",
        "Priority support",
        "Done-for-you workflows",
      ],
    },
  })

  // Admin user
  const adminPassword = await bcrypt.hash("admin123456", 12)
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@growthagent.os",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Demo user
  const demoPassword = await bcrypt.hash("demo123456", 12)
  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Johnson",
      email: "demo@example.com",
      password: demoPassword,
      role: "USER",
    },
  })

  // Demo company
  const demoCompany = await prisma.company.create({
    data: {
      name: "Acme Digital Agency",
      website: "https://acmedigital.com",
      businessType: "Agency",
      mainOffer: "Performance marketing and conversion optimisation for e-commerce brands",
      averageDealValue: 5000,
      idealCustomerProfile: "E-commerce brands with £1M+ revenue looking to scale paid acquisition",
      badFitTraits: "Startups with no revenue, no budget for testing",
      leadSources: ["Website contact form", "Referrals", "LinkedIn"],
      currentCRM: "HubSpot",
      toneOfVoice: "Professional and confident",
      approvalPreference: "Approve everything manually",
      setupStatus: "LIVE",
      members: {
        create: { userId: demoUser.id, role: "USER" },
      },
    },
  })

  // Subscription
  await prisma.subscription.create({
    data: {
      companyId: demoCompany.id,
      planId: pipelinePlan.id,
      status: "active",
    },
  })

  // Agents
  const researchAgent = await prisma.agent.create({
    data: {
      companyId: demoCompany.id,
      name: "Lead Research Agent",
      type: "LEAD_RESEARCH",
      description: "Researches and scores incoming leads automatically",
      status: "ACTIVE",
    },
  })

  await prisma.agent.create({
    data: {
      companyId: demoCompany.id,
      name: "Follow-Up Agent",
      type: "FOLLOW_UP",
      description: "Tracks leads and surfaces follow-up priorities",
      status: "ACTIVE",
    },
  })

  // Leads
  const leadsSeed = [
    {
      name: "Sarah Chen",
      email: "s.chen@fintechagency.com",
      phone: "+44 7700 900123",
      companyName: "Fintech Agency Ltd",
      website: "fintechagency.com",
      source: "Website form",
      status: "HOT" as const,
      scoreBand: "HOT" as const,
      score: 87,
      estimatedValue: 12000,
      painPoints: "Struggling to follow up fast enough. Sales team overwhelmed.",
      fitSummary: "Excellent ICP match. B2B agency with 20+ staff, clear budget signals.",
      researchSummary: "UK-based financial marketing agency. ~25 staff. Growing website traffic.",
      recommendedAction: "Call within 24 hours. Reference growth ops hiring.",
      draftReply: "Hi Sarah,\n\nThanks for enquiring about GrowthAgent OS...\n\nBest,\n[Your name]",
    },
    {
      name: "Marcus Webb",
      email: "marcus@builderbrand.co.uk",
      phone: "+44 7700 900456",
      companyName: "BuilderBrand Co",
      website: "builderbrand.co.uk",
      source: "LinkedIn",
      status: "FOLLOW_UP_DUE" as const,
      scoreBand: "WARM" as const,
      score: 62,
      estimatedValue: 6000,
      painPoints: "Not tracking which leads are worth time.",
      fitSummary: "Good fit. E-commerce brand with growth ambitions.",
      researchSummary: "UK e-commerce brand in home improvement. ~10 staff.",
      recommendedAction: "Follow up with pricing overview.",
      draftReply: "Hi Marcus,\n\nFollowing up on my previous message...\n\nBest,\n[Your name]",
    },
    {
      name: "Priya Sharma",
      email: "priya@saaslaunch.io",
      phone: "+44 7700 900789",
      companyName: "SaaS Launch HQ",
      website: "saaslaunch.io",
      source: "Referral",
      status: "HOT" as const,
      scoreBand: "HOT" as const,
      score: 91,
      estimatedValue: 18000,
      painPoints: "Leads from paid ads not being qualified quickly enough.",
      fitSummary: "Top ICP. SaaS company with high lead volume and budget.",
      researchSummary: "B2B SaaS company. ~40 staff. Active in growth phase.",
      recommendedAction: "Prioritise call. Highest value lead this week.",
      draftReply: "Hi Priya,\n\nWe would love to show you GrowthAgent OS in action...\n\nBest,\n[Your name]",
    },
  ]

  for (const leadData of leadsSeed) {
    const lead = await prisma.lead.create({
      data: { companyId: demoCompany.id, ...leadData },
    })

    await prisma.leadScore.create({
      data: {
        leadId: lead.id,
        score: leadData.score ?? 50,
        scoreBand: leadData.scoreBand ?? "COLD",
        reasoning: `Scored based on ICP match, company signals, and pain point alignment.`,
      },
    })
  }

  // Fetch leads for approval requests
  const leads = await prisma.lead.findMany({ where: { companyId: demoCompany.id } })
  const sarahLead = leads.find((l) => l.name === "Sarah Chen")
  const marcusLead = leads.find((l) => l.name === "Marcus Webb")

  // Approval requests
  if (sarahLead) {
    await prisma.approvalRequest.create({
      data: {
        companyId: demoCompany.id,
        leadId: sarahLead.id,
        createdByAgentId: researchAgent.id,
        type: "DRAFT_EMAIL",
        title: "Reply to Sarah Chen enquiry",
        description: "Personalised reply to a HOT lead from Fintech Agency Ltd.",
        proposedAction: "Send personalised follow-up email referencing company growth.",
        payload: { emailTo: sarahLead.email },
        status: "PENDING",
      },
    })
  }

  if (marcusLead) {
    await prisma.approvalRequest.create({
      data: {
        companyId: demoCompany.id,
        leadId: marcusLead.id,
        createdByAgentId: researchAgent.id,
        type: "CRM_STATUS_CHANGE",
        title: "Update Marcus Webb to FOLLOW_UP_DUE",
        description: "Marcus Webb has not replied in 4 days.",
        proposedAction: "Change status to FOLLOW_UP_DUE and schedule reminder.",
        payload: { newStatus: "FOLLOW_UP_DUE" },
        status: "PENDING",
      },
    })
  }

  // Agent runs
  for (let i = 0; i < 5; i++) {
    await prisma.agentRun.create({
      data: {
        agentId: researchAgent.id,
        status: "completed",
        input: { leadId: leads[i % leads.length]?.id },
        output: { researchComplete: true, score: 75 + i * 3 },
        durationMs: 3000 + i * 500,
      },
    })
  }

  // Integrations
  const integrationsList = [
    { name: "Website Form", type: "WEBSITE_FORM", status: "CONNECTED" as const },
    { name: "Gmail", type: "GMAIL", status: "COMING_SOON" as const },
    { name: "HubSpot", type: "HUBSPOT", status: "COMING_SOON" as const },
    { name: "Slack", type: "SLACK", status: "COMING_SOON" as const },
  ]

  for (const integration of integrationsList) {
    await prisma.integration.create({
      data: { companyId: demoCompany.id, ...integration },
    })
  }

  // Audit logs
  await prisma.auditLog.create({
    data: {
      companyId: demoCompany.id,
      userId: demoUser.id,
      action: "COMPANY_ONBOARDED",
      entityType: "Company",
      entityId: demoCompany.id,
      metadata: { setupStatus: "LIVE" },
    },
  })

  console.log("✅ Seed complete!")
  console.log("")
  console.log("👤 Test accounts:")
  console.log("   Admin:  admin@growthagent.os  /  admin123456")
  console.log("   Demo:   demo@example.com      /  demo123456")
  console.log("")
  console.log(`📊 Created: 3 plans, 2 users, 1 company, ${leadsSeed.length} leads, 2 approval requests, 5 agent runs`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
