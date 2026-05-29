import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean existing data
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

  // Plans
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
        "Lead scoring (HOT/WARM/COLD)",
        "Draft reply generation",
        "Approval queue",
        "Agent chat",
        "Weekly lead report",
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
        "CRM status updates",
        "Pipeline report",
        "Monthly optimisation call",
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
        "Competitor monitoring agent",
        "Client onboarding agent",
        "Voice agent readiness",
        "Custom integrations",
        "Done-for-you workflows",
        "Priority support",
      ],
    },
  })

  console.log("✅ Plans created")

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

  console.log("✅ Users created")

  // Demo company
  const demoCompany = await prisma.company.create({
    data: {
      name: "Acme Digital Agency",
      website: "https://acmedigital.com",
      businessType: "Agency",
      mainOffer:
        "Performance marketing and conversion optimisation for e-commerce brands",
      averageDealValue: 5000,
      idealCustomerProfile:
        "E-commerce brands with £1M+ annual revenue looking to scale paid acquisition",
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

  console.log("✅ Company + subscription created")

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

  const followUpAgent = await prisma.agent.create({
    data: {
      companyId: demoCompany.id,
      name: "Follow-Up Agent",
      type: "FOLLOW_UP",
      description: "Tracks leads and surfaces follow-up priorities",
      status: "ACTIVE",
    },
  })

  await prisma.agent.create({
    data: {
      companyId: demoCompany.id,
      name: "Call Prep Agent",
      type: "CALL_PREP",
      description: "Prepares discovery call briefs",
      status: "ACTIVE",
    },
  })

  console.log("✅ Agents created")

  // Leads
  type LeadInput = {
    name: string
    email: string
    phone: string
    companyName: string
    website: string
    source: string
    status: "HOT" | "WARM" | "COLD" | "BAD_FIT" | "NEW" | "RESEARCHING" | "QUALIFIED" | "REPLIED" | "FOLLOW_UP_DUE" | "CALL_BOOKED" | "PROPOSAL_SENT" | "WON" | "LOST"
    scoreBand: "HOT" | "WARM" | "COLD" | "BAD_FIT" | null
    score: number | null
    estimatedValue: number | null
    painPoints: string
    fitSummary: string
    researchSummary: string
    recommendedAction: string
    draftReply: string
  }

  const leadsSeed: LeadInput[] = [
    {
      name: "Sarah Chen",
      email: "s.chen@fintechagency.com",
      phone: "+44 7700 900123",
      companyName: "Fintech Agency Ltd",
      website: "fintechagency.com",
      source: "Website form",
      status: "HOT",
      scoreBand: "HOT",
      score: 87,
      estimatedValue: 12000,
      painPoints:
        "Struggling to follow up fast enough. Sales team overwhelmed with volume.",
      fitSummary:
        "Excellent ICP match. B2B agency with 20+ staff, clear budget signals.",
      researchSummary:
        "UK-based financial marketing agency. ~25 staff. Growing website traffic ~12k/mo.",
      recommendedAction:
        "Call within 24 hours. Reference growth ops hiring as hook.",
      draftReply:
        "Hi Sarah,\n\nThanks for your enquiry about GrowthAgent OS — great timing.\n\nBest,\n[Your name]",
    },
    {
      name: "Marcus Webb",
      email: "marcus@builderbrand.co.uk",
      phone: "+44 7700 900456",
      companyName: "BuilderBrand Co",
      website: "builderbrand.co.uk",
      source: "LinkedIn",
      status: "FOLLOW_UP_DUE",
      scoreBand: "WARM",
      score: 62,
      estimatedValue: 6000,
      painPoints: "Not tracking which leads are worth the team's time.",
      fitSummary: "Good fit. E-commerce brand with growth ambitions.",
      researchSummary: "UK e-commerce brand in home improvement. ~10 staff.",
      recommendedAction: "Follow up with a personalised pricing overview.",
      draftReply:
        "Hi Marcus,\n\nFollowing up on my previous message...\n\nBest,\n[Your name]",
    },
    {
      name: "Priya Sharma",
      email: "priya@saaslaunch.io",
      phone: "+44 7700 900789",
      companyName: "SaaS Launch HQ",
      website: "saaslaunch.io",
      source: "Referral",
      status: "HOT",
      scoreBand: "HOT",
      score: 91,
      estimatedValue: 18000,
      painPoints: "Paid leads not being qualified fast enough. Revenue leaking.",
      fitSummary: "Top ICP match. SaaS company with high lead volume and budget.",
      researchSummary:
        "B2B SaaS company. ~40 staff. Active growth phase. Multiple open BD roles.",
      recommendedAction:
        "Prioritise call. Highest value lead this week. Strong urgency signals.",
      draftReply:
        "Hi Priya,\n\nWe would love to show you GrowthAgent OS in action...\n\nBest,\n[Your name]",
    },
    {
      name: "Tom Rigby",
      email: "t.rigby@agencyx.com",
      phone: "+44 7700 900321",
      companyName: "Agency X",
      website: "agencyx.com",
      source: "Website form",
      status: "FOLLOW_UP_DUE",
      scoreBand: "WARM",
      score: 58,
      estimatedValue: 4500,
      painPoints: "Wants pricing info but hasn't committed.",
      fitSummary: "Reasonable fit. Small agency, limited budget signals.",
      researchSummary: "UK digital agency. ~8 staff. Generalist services.",
      recommendedAction: "Send pricing overview and case study.",
      draftReply:
        "Hi Tom,\n\nHere is the pricing breakdown you asked about...\n\nBest,\n[Your name]",
    },
    {
      name: "Emma Foster",
      email: "emma@growthco.io",
      phone: "+44 7700 900654",
      companyName: "GrowthCo",
      website: "growthco.io",
      source: "Email",
      status: "QUALIFIED",
      scoreBand: "WARM",
      score: 74,
      estimatedValue: 8000,
      painPoints: "Scaling too fast for manual lead management.",
      fitSummary: "Strong fit. Growth-stage company, right pain points.",
      researchSummary: "B2B growth consultancy. ~15 staff. Recently raised seed.",
      recommendedAction: "Book discovery call. Decision expected this week.",
      draftReply:
        "Hi Emma,\n\nGreat timing on your enquiry...\n\nBest,\n[Your name]",
    },
    {
      name: "David Kim",
      email: "david@consultingdg.com",
      phone: "+44 7700 900987",
      companyName: "Consulting DG",
      website: "consultingdg.com",
      source: "Referral",
      status: "CALL_BOOKED",
      scoreBand: "HOT",
      score: 82,
      estimatedValue: 15000,
      painPoints: "Managing a growing pipeline manually is costing deals.",
      fitSummary: "Excellent fit. Senior consulting firm, high deal values.",
      researchSummary:
        "Management consulting firm. ~30 staff. Premium positioning.",
      recommendedAction:
        "Call booked. Prepare deep brief on enterprise workflow use case.",
      draftReply:
        "Hi David,\n\nLooking forward to our call tomorrow...\n\nBest,\n[Your name]",
    },
  ]

  const createdLeads = []
  for (const leadData of leadsSeed) {
    const { scoreBand, ...rest } = leadData
    const lead = await prisma.lead.create({
      data: {
        companyId: demoCompany.id,
        ...rest,
        scoreBand: scoreBand ?? undefined,
      },
    })
    createdLeads.push(lead)

    if (leadData.score && scoreBand) {
      await prisma.leadScore.create({
        data: {
          leadId: lead.id,
          score: leadData.score,
          scoreBand,
          reasoning: "Scored based on ICP match, company signals, and pain point alignment.",
        },
      })
    }
  }

  console.log(`✅ ${leadsSeed.length} leads created`)

  // Approval requests
  const sarahLead = createdLeads.find((l) => l.name === "Sarah Chen")
  const marcusLead = createdLeads.find((l) => l.name === "Marcus Webb")
  const tomLead = createdLeads.find((l) => l.name === "Tom Rigby")

  if (sarahLead) {
    await prisma.approvalRequest.create({
      data: {
        companyId: demoCompany.id,
        leadId: sarahLead.id,
        createdByAgentId: researchAgent.id,
        type: "DRAFT_EMAIL",
        title: "Reply to Sarah Chen enquiry",
        description: "Personalised reply to a HOT lead from Fintech Agency Ltd.",
        proposedAction:
          "Send personalised email referencing company growth and proposing a 20-minute demo call.",
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
        description: "Marcus has not replied in 4 days. Agent recommends status change.",
        proposedAction:
          "Change lead status from WARM to FOLLOW_UP_DUE and schedule a reminder for tomorrow 9am.",
        payload: { newStatus: "FOLLOW_UP_DUE" },
        status: "PENDING",
      },
    })
  }

  if (tomLead) {
    await prisma.approvalRequest.create({
      data: {
        companyId: demoCompany.id,
        leadId: tomLead.id,
        createdByAgentId: followUpAgent.id,
        type: "DRAFT_EMAIL",
        title: "Follow-up for Tom Rigby",
        description: "Tom requested pricing info 7 days ago. Draft follow-up ready.",
        proposedAction:
          "Send follow-up email referencing pricing interest and offering a personalised breakdown call.",
        payload: { emailTo: tomLead.email },
        status: "PENDING",
      },
    })
  }

  console.log("✅ Approval requests created")

  // Agent runs
  for (let i = 0; i < 5; i++) {
    await prisma.agentRun.create({
      data: {
        agentId: researchAgent.id,
        status: "completed",
        input: { leadId: createdLeads[i % createdLeads.length]?.id },
        output: { researchComplete: true, score: 70 + i * 4 },
        durationMs: 3000 + i * 600,
      },
    })
  }

  // Integrations
  const integrations = [
    { name: "Website Form", type: "WEBSITE_FORM", status: "CONNECTED" as const },
    { name: "Gmail", type: "GMAIL", status: "COMING_SOON" as const },
    { name: "Google Sheets", type: "GOOGLE_SHEETS", status: "COMING_SOON" as const },
    { name: "HubSpot", type: "HUBSPOT", status: "COMING_SOON" as const },
    { name: "Pipedrive", type: "PIPEDRIVE", status: "COMING_SOON" as const },
    { name: "Slack", type: "SLACK", status: "COMING_SOON" as const },
  ]

  for (const integration of integrations) {
    await prisma.integration.create({
      data: { companyId: demoCompany.id, ...integration },
    })
  }

  // Audit log
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

  console.log("✅ Agent runs, integrations, and audit log created")
  console.log("")
  console.log("🎉 Seed complete!")
  console.log("")
  console.log("👤 Test accounts:")
  console.log("   Admin:  admin@growthagent.os  /  admin123456")
  console.log("   Demo:   demo@example.com      /  demo123456")
  console.log("")
  console.log(`📊 Seeded:`)
  console.log(`   - 3 plans (Starter, Pipeline, Growth OS)`)
  console.log(`   - 2 users (admin + demo)`)
  console.log(`   - 1 company with Pipeline Agent subscription`)
  console.log(`   - 3 agents (Research, Follow-Up, Call Prep)`)
  console.log(`   - ${leadsSeed.length} leads with scores`)
  console.log(`   - 3 pending approval requests`)
  console.log(`   - 5 agent run logs`)
  console.log(`   - 6 integration placeholders`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
