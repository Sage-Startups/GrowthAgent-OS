export type CompanyCtx = {
  name: string
  mainOffer?: string | null
  idealCustomerProfile?: string | null
  badFitTraits?: string | null
  toneOfVoice?: string | null
  averageDealValue?: number | null
  website?: string | null
  businessType?: string | null
}

export type LeadCtx = {
  name: string
  email?: string | null
  phone?: string | null
  companyName?: string | null
  website?: string | null
  source?: string | null
  message?: string | null
  estimatedValue?: number | null
  scoreBand?: string | null
  score?: number | null
  painPoints?: string | null
  fitSummary?: string | null
  researchSummary?: string | null
  recommendedAction?: string | null
}

const SAFETY_HEADER = `You are the GrowthAgent OS Lead-to-Sale Agent. You MUST return valid JSON only — no markdown, no explanation. Do not send emails, call leads, delete data or make external changes. Any external action must be returned as a recommendedAction with requiresApproval: true.`

function companyBlock(c: CompanyCtx): string {
  return `COMPANY:
- Name: ${c.name}
- Type: ${c.businessType ?? "Not specified"}
- Offer: ${c.mainOffer ?? "Not specified"}
- Ideal Customer: ${c.idealCustomerProfile ?? "Not specified"}
- Bad Fit: ${c.badFitTraits ?? "Not specified"}
- Tone: ${c.toneOfVoice ?? "Professional"}
- Avg Deal: ${c.averageDealValue ? `$${c.averageDealValue}` : "Not specified"}`
}

function leadBlock(l: LeadCtx): string {
  return `LEAD:
- Name: ${l.name}
- Company: ${l.companyName ?? "Unknown"}
- Email: ${l.email ?? "Not provided"}
- Website: ${l.website ?? "Not provided"}
- Source: ${l.source ?? "Unknown"}
- Enquiry: ${l.message ?? "No message provided"}
- Est. Value: ${l.estimatedValue ? `$${l.estimatedValue}` : "Not specified"}
- Score: ${l.score ?? "Not scored"} / Band: ${l.scoreBand ?? "Not scored"}`
}

export function buildQualificationPrompt(company: CompanyCtx, lead: LeadCtx) {
  return {
    systemPrompt: SAFETY_HEADER,
    userPrompt: `${companyBlock(company)}

${leadBlock(lead)}

TASK: Qualify and score this lead. Assess ICP fit, identify pain points, draft a reply.

SCORING: website+10, business email+8, urgency words+10, budget words+8, ICP match+5each(max+20), high value>5000+10, referral+5 | bad-fit keywords-20, generic bad-fit-15, short message<20chars-10. Bands: 80-100=HOT, 60-79=WARM, 30-59=COLD, 0-29=BAD_FIT

Return JSON only:
{"score":0-100,"scoreBand":"HOT|WARM|COLD|BAD_FIT","fitSummary":"","researchSummary":"","painPoints":[],"recommendedAction":"","draftReply":"","suggestedFollowUpDays":3,"redFlags":[],"confidence":0.0-1.0}`,
  }
}

export function buildReplyPrompt(company: CompanyCtx, lead: LeadCtx) {
  return {
    systemPrompt: SAFETY_HEADER,
    userPrompt: `${companyBlock(company)}

${leadBlock(lead)}

TASK: Write a personalised reply to this lead. Match company tone. Return for human approval — do NOT send.

Return JSON only:
{"subject":"","body":"","tone":"","keyPoints":[]}`,
  }
}

export function buildSalesCallPrompt(company: CompanyCtx, lead: LeadCtx) {
  return {
    systemPrompt: SAFETY_HEADER,
    userPrompt: `${companyBlock(company)}

${leadBlock(lead)}

TASK: Prepare a comprehensive sales call brief.

Return JSON only:
{"leadSummary":"","companyOverview":"","likelyPainPoints":[],"discoveryQuestions":[],"suggestedOfferAngle":"","risks":[],"callOpener":"","nextSteps":[]}`,
  }
}

export function buildWeeklyReportPrompt(company: CompanyCtx, stats: Record<string, unknown>) {
  return {
    systemPrompt: SAFETY_HEADER,
    userPrompt: `${companyBlock(company)}

PIPELINE STATS: ${JSON.stringify(stats)}

TASK: Generate weekly pipeline report with actionable insights.

Return JSON only:
{"executiveSummary":"","leadStats":{},"bestOpportunities":[],"missedFollowUps":[],"bottlenecks":[],"suggestedActions":[]}`,
  }
}

export function buildProposalPrompt(company: CompanyCtx, lead: LeadCtx) {
  return {
    systemPrompt: SAFETY_HEADER,
    userPrompt: `${companyBlock(company)}

${leadBlock(lead)}

TASK: Create a proposal outline for this prospect. Draft only — for human review before sending.

Return JSON only:
{"title":"","executiveSummary":"","problemStatement":"","proposedSolution":"","investmentOutline":"","nextSteps":[],"keyBenefits":[]}`,
  }
}

export function buildCompetitorPrompt(company: CompanyCtx, industry?: string) {
  return {
    systemPrompt: SAFETY_HEADER,
    userPrompt: `${companyBlock(company)}

TASK: Research competitive landscape for ${company.mainOffer ?? "this business"} in ${industry ?? "their market"}. Use general knowledge only — no external calls.

Return JSON only:
{"summary":"","competitors":[{"name":"","strengths":[],"weaknesses":[],"positioning":""}],"differentiators":[],"recommendations":[]}`,
  }
}

export function buildChatPrompt(company: CompanyCtx, message: string, context: Record<string, unknown>) {
  return {
    systemPrompt: `${SAFETY_HEADER}\n\nYou are the GrowthAgent assistant for ${company.name}. Be concise and actionable.`,
    userPrompt: `PIPELINE CONTEXT: ${JSON.stringify(context)}

USER: ${message}

Return JSON: {"success":true,"summary":"your response","recommendedActions":[]}`,
  }
}
