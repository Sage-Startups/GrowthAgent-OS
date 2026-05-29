import { PrismaClient, VoiceDirection } from "@prisma/client"
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
      stripePlanName: "Lead Agent Starter",
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

  // 10 realistic leads
  const now = new Date()
  const pastDay = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)

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
      draftReply: "Hi Sarah,\n\nThanks for enquiring about GrowthAgent OS. I would love to show you how we help agencies like yours qualify and follow up with leads faster.\n\nBest,\n[Your name]",
      nextFollowUpAt: pastDay(1),
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
      nextFollowUpAt: pastDay(3),
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
    {
      name: "James Fletcher",
      email: "james@growthlabs.co",
      phone: "+44 7700 900321",
      companyName: "GrowthLabs Consulting",
      website: "growthlabs.co",
      source: "Google Ads",
      status: "QUALIFIED" as const,
      scoreBand: "WARM" as const,
      score: 71,
      estimatedValue: 9000,
      painPoints: "Spending too much time manually qualifying leads from ads.",
      fitSummary: "Consulting firm with growing team. Good fit for Pipeline plan.",
      researchSummary: "B2B consulting firm based in Manchester. ~15 staff.",
      recommendedAction: "Book demo call. Highlight time savings.",
    },
    {
      name: "Emma Wilson",
      email: "emma@startupco.io",
      phone: "+44 7700 900654",
      companyName: "StartupCo",
      website: "startupco.io",
      source: "Cold outreach",
      status: "COLD" as const,
      scoreBand: "COLD" as const,
      score: 35,
      estimatedValue: 2500,
      painPoints: "No clear budget yet.",
      fitSummary: "Early stage. Monitor for 3 months.",
      researchSummary: "Pre-revenue startup. Limited traction.",
      recommendedAction: "Move to nurture list. Revisit in Q2.",
    },
    {
      name: "Tom Rigby",
      email: "tom@scalecreative.com",
      phone: "+44 7700 900987",
      companyName: "Scale Creative",
      website: "scalecreative.com",
      source: "Website form",
      status: "REPLIED" as const,
      scoreBand: "WARM" as const,
      score: 65,
      estimatedValue: 7500,
      painPoints: "Agency growing fast, CRM becoming unmanageable.",
      fitSummary: "Creative agency with real pain around lead management.",
      researchSummary: "UK creative agency. ~20 staff. Active client portfolio.",
      recommendedAction: "Prepare discovery call brief.",
    },
    {
      name: "Natasha Okafor",
      email: "n.okafor@nexusdigital.co.uk",
      phone: "+44 7700 900112",
      companyName: "Nexus Digital",
      website: "nexusdigital.co.uk",
      source: "Referral",
      status: "CALL_BOOKED" as const,
      scoreBand: "HOT" as const,
      score: 84,
      estimatedValue: 15000,
      painPoints: "No process for converting enquiries. Losing deals to follow-up gaps.",
      fitSummary: "Strong ICP match. Scaling digital agency with multiple clients.",
      researchSummary: "Digital marketing agency. London. ~30 staff.",
      recommendedAction: "Call brief prepared. Focus on ROI from faster qualification.",
    },
    {
      name: "David Park",
      email: "david@coachingacademy.co.uk",
      phone: "+44 7700 900445",
      companyName: "The Coaching Academy",
      website: "coachingacademy.co.uk",
      source: "Social media",
      status: "NEW" as const,
      scoreBand: "WARM" as const,
      score: 55,
      estimatedValue: 4500,
      painPoints: "Unknown — enquiry just received.",
      fitSummary: "Coaching business with good volume. Worth qualifying.",
      researchSummary: "Online coaching platform. Small team. Good testimonials.",
      recommendedAction: "Research and qualify within 24 hours.",
    },
    {
      name: "Sophie Grant",
      email: "sophie@freelancecopy.co.uk",
      companyName: "Sophie Grant Copywriting",
      website: "freelancecopy.co.uk",
      source: "Website form",
      status: "BAD_FIT" as const,
      scoreBand: "BAD_FIT" as const,
      score: 12,
      painPoints: "Wants to use the tool for personal use, not business.",
      fitSummary: "Bad fit. Single freelancer, no lead volume.",
      researchSummary: "Solo copywriter. No team. Very limited enquiries.",
      recommendedAction: "Close and archive. Not a fit for any plan.",
    },
    {
      name: "Ryan Maddox",
      email: "ryan@ecomboost.io",
      phone: "+44 7700 900776",
      companyName: "EcomBoost Agency",
      website: "ecomboost.io",
      source: "LinkedIn",
      status: "PROPOSAL_SENT" as const,
      scoreBand: "HOT" as const,
      score: 82,
      estimatedValue: 22000,
      painPoints: "Managing 50+ new enquiries a month with no system.",
      fitSummary: "High-volume e-commerce agency. Growth Agent OS fit.",
      researchSummary: "Performance marketing agency for e-commerce. ~35 staff.",
      recommendedAction: "Follow up on proposal. Decision expected this week.",
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
        reasoning: "Scored based on ICP match, company signals, and pain point alignment.",
      },
    })
  }

  // Fetch leads for approval requests
  const leads = await prisma.lead.findMany({ where: { companyId: demoCompany.id } })
  const sarahLead = leads.find((l) => l.name === "Sarah Chen")
  const marcusLead = leads.find((l) => l.name === "Marcus Webb")
  const priyaLead = leads.find((l) => l.name === "Priya Sharma")

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

  if (priyaLead) {
    await prisma.approvalRequest.create({
      data: {
        companyId: demoCompany.id,
        leadId: priyaLead.id,
        createdByAgentId: researchAgent.id,
        type: "DRAFT_EMAIL",
        title: "Reply to Priya Sharma — Top Priority",
        description: "Highest-scored lead this week. Ready to send personalised reply.",
        proposedAction: "Send personalised email highlighting ROI and booking link.",
        payload: { emailTo: priyaLead.email },
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

  // Voice call (demo)
  await prisma.voiceCall.create({
    data: {
      companyId: demoCompany.id,
      provider: "local",
      direction: VoiceDirection.BROWSER,
      status: "completed",
      duration: 185,
      summary: "Demo voice session. Asked about hot leads and follow-ups.",
      transcript: "User: Summarise today's hot leads. Agent: You have 3 HOT leads...",
      startedAt: pastDay(1),
      endedAt: pastDay(1),
    },
  })

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

  await prisma.auditLog.create({
    data: {
      companyId: demoCompany.id,
      action: "LEAD_SCORED",
      entityType: "Lead",
      entityId: leads[0]?.id,
      metadata: { scoreBand: "HOT", score: 87 },
    },
  })

  await prisma.auditLog.create({
    data: {
      companyId: demoCompany.id,
      action: "VOICE_CALL_RECEIVED",
      entityType: "VoiceCall",
      metadata: { direction: "BROWSER", provider: "local" },
    },
  })

  // Suppress unused variable warnings
  void adminUser
  void starterPlan
  void growthPlan

  console.log("✅ Seed complete!")
  console.log("")
  console.log("👤 Test accounts:")
  console.log("   Admin:  admin@growthagent.os  /  admin123456")
  console.log("   Demo:   demo@example.com      /  demo123456")
  console.log("")
  console.log(`📊 Created: 3 plans, 2 users, 1 company, ${leadsSeed.length} leads, 3 approval requests, 5 agent runs, 1 voice call`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
