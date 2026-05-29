export type LeadScoringResult = {
  score: number
  scoreBand: "HOT" | "WARM" | "COLD" | "BAD_FIT"
  fitSummary: string
  painPoints: string[]
  researchSummary: string
  recommendedAction: string
  draftReply: string
  suggestedFollowUpDays: number
  scoreBreakdown: { factor: string; points: number; description: string }[]
}

type CompanySettings = {
  name: string
  mainOffer?: string | null
  idealCustomerProfile?: string | null
  badFitTraits?: string | null
  toneOfVoice?: string | null
  averageDealValue?: number | null
}

type LeadInput = {
  name: string
  email?: string | null
  companyName?: string | null
  website?: string | null
  message?: string | null
  source?: string | null
  estimatedValue?: number | null
}

const FREE_EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com", "aol.com", "icloud.com"]
const URGENCY_WORDS = ["urgent", "asap", "immediately", "this week", "right away", "today", "quickly", "soon as possible"]
const BUDGET_WORDS = ["budget", "investment", "spend", "invest", "cost", "pricing", "how much", "afford", "allocate"]
const BAD_FIT_WORDS = ["free", "cheap", "cheapest", "student", "college", "uni ", "university", "job", "internship", "work experience", "volunteer", "pro bono", "no budget", "small budget", "minimal budget"]

export function scoreLead(company: CompanySettings, lead: LeadInput): LeadScoringResult {
  const breakdown: { factor: string; points: number; description: string }[] = []
  let score = 50 // start at neutral

  const message = (lead.message ?? "").toLowerCase()
  const email = (lead.email ?? "").toLowerCase()
  const emailDomain = email.includes("@") ? email.split("@")[1] : ""
  const icp = (company.idealCustomerProfile ?? "").toLowerCase()
  const badFit = (company.badFitTraits ?? "").toLowerCase()

  // --- Positive signals ---

  // Has website
  if (lead.website && lead.website.length > 3) {
    breakdown.push({ factor: "Has website", points: 10, description: "Company has a website — credibility signal" })
    score += 10
  }

  // Business email
  if (email && !FREE_EMAIL_DOMAINS.some((d) => emailDomain.includes(d))) {
    breakdown.push({ factor: "Business email", points: 8, description: `Uses business email (${emailDomain}) — professional signal` })
    score += 8
  }

  // Urgency signals
  const urgencyMatches = URGENCY_WORDS.filter((w) => message.includes(w))
  if (urgencyMatches.length > 0) {
    breakdown.push({ factor: "Urgency signals", points: 10, description: `Message contains urgency: "${urgencyMatches[0]}"` })
    score += 10
  }

  // Budget signals
  const budgetMatches = BUDGET_WORDS.filter((w) => message.includes(w))
  if (budgetMatches.length > 0) {
    breakdown.push({ factor: "Budget mentioned", points: 8, description: `Mentions investment/budget: "${budgetMatches[0]}"` })
    score += 8
  }

  // ICP keyword match
  if (icp.length > 5) {
    const icpKeywords = icp.split(/[\s,.\-;]+/).filter((k) => k.length > 3)
    const matches = icpKeywords.filter((kw) => {
      const lc = (lead.companyName ?? "").toLowerCase() + " " + message
      return lc.includes(kw)
    })
    const icpPoints = Math.min(matches.length * 5, 20)
    if (icpPoints > 0) {
      breakdown.push({ factor: "ICP keyword match", points: icpPoints, description: `Matches ${matches.length} ideal customer keyword(s)` })
      score += icpPoints
    }
  }

  // High estimated value
  const value = lead.estimatedValue ?? 0
  if (value > 5000) {
    breakdown.push({ factor: "High deal value", points: 10, description: `Estimated value $${value.toLocaleString()} exceeds threshold` })
    score += 10
  }

  // Referral source
  if ((lead.source ?? "").toLowerCase().includes("referral")) {
    breakdown.push({ factor: "Referral source", points: 5, description: "Came via referral — higher trust signal" })
    score += 5
  }

  // Company name present
  if (lead.companyName && lead.companyName.length > 2) {
    breakdown.push({ factor: "Company name provided", points: 5, description: "Provided company name — not solo/personal" })
    score += 5
  }

  // --- Negative signals ---

  // Bad fit keywords
  const badFitKeywords = badFit.split(/[\s,.\-;]+/).filter((k) => k.length > 3)
  const badMatches = badFitKeywords.filter((kw) => message.includes(kw) || (lead.companyName ?? "").toLowerCase().includes(kw))
  if (badMatches.length > 0) {
    breakdown.push({ factor: "Bad-fit keywords", points: -20, description: `Matches bad-fit criteria: "${badMatches[0]}"` })
    score -= 20
  }

  // Generic bad-fit words
  const genericBadMatches = BAD_FIT_WORDS.filter((w) => message.includes(w))
  if (genericBadMatches.length > 0) {
    breakdown.push({ factor: "Low-value signals", points: -15, description: `Contains: "${genericBadMatches[0]}" — budget/fit concern` })
    score -= 15
  }

  // Very short message
  if (message.length > 0 && message.length < 20) {
    breakdown.push({ factor: "Very short message", points: -10, description: "Message under 20 characters — low engagement signal" })
    score -= 10
  }

  // No message at all
  if (!message || message.trim().length === 0) {
    breakdown.push({ factor: "No message", points: -5, description: "No enquiry message provided" })
    score -= 5
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score))

  // Score band
  let scoreBand: "HOT" | "WARM" | "COLD" | "BAD_FIT"
  if (score >= 80) scoreBand = "HOT"
  else if (score >= 60) scoreBand = "WARM"
  else if (score >= 30) scoreBand = "COLD"
  else scoreBand = "BAD_FIT"

  // Generate pain points
  const painPoints: string[] = []
  if (urgencyMatches.length > 0) painPoints.push("Time-sensitive requirement — needs fast response")
  if (budgetMatches.length > 0) painPoints.push("Active budget for this solution")
  if (value > 0) painPoints.push(`Estimated deal value: $${value.toLocaleString()}`)
  if (message.length > 50) {
    const sentences = message.split(/[.!?]+/).filter((s) => s.trim().length > 10)
    if (sentences.length > 0) painPoints.push(`Key concern: "${sentences[0].trim()}"`)
  }
  if (painPoints.length === 0) painPoints.push("Pain points to be confirmed on discovery call")

  // Fit summary
  const fitSummary = scoreBand === "HOT"
    ? `Strong ICP match. ${lead.companyName ?? "This lead"} shows multiple buying signals including ${breakdown.filter(b => b.points > 0).map(b => b.factor.toLowerCase()).slice(0, 3).join(", ")}.`
    : scoreBand === "WARM"
    ? `Reasonable fit. ${lead.companyName ?? "This lead"} has some positive signals but needs qualification on budget and timeline.`
    : scoreBand === "COLD"
    ? `Weak fit signals. ${lead.companyName ?? "This lead"} may be early in research phase or lacks strong buying intent.`
    : `Likely bad fit. ${lead.companyName ?? "This lead"} matches one or more disqualifying criteria.`

  // Research summary
  const researchSummary = [
    lead.companyName ? `Company: ${lead.companyName}.` : "Company name not provided.",
    lead.website ? `Website: ${lead.website}.` : "No website provided.",
    lead.email ? `Contact email: ${email}${!FREE_EMAIL_DOMAINS.some(d => emailDomain.includes(d)) ? " (business email)" : " (free email)"}` : "",
    lead.source ? `Lead source: ${lead.source}.` : "",
    message.length > 10 ? `Enquiry summary: "${message.slice(0, 200)}${message.length > 200 ? "..." : ""}"` : "No detailed message provided.",
  ].filter(Boolean).join(" ")

  // Recommended action
  const recommendedAction = scoreBand === "HOT"
    ? "Call within 24 hours. High intent — move fast to avoid losing to competitors."
    : scoreBand === "WARM"
    ? "Send personalised email within 48 hours. Reference their company and pain points. Book a discovery call."
    : scoreBand === "COLD"
    ? "Send a brief intro email. Nurture with value content before pushing for a call."
    : "File as bad fit. Send a polite decline or redirect to a more suitable resource."

  // Draft reply
  const tone = (company.toneOfVoice ?? "professional").toLowerCase()
  const draftReply = generateDraftReply({ company, lead, scoreBand, tone })

  // Suggested follow-up days
  const suggestedFollowUpDays = scoreBand === "HOT" ? 1 : scoreBand === "WARM" ? 3 : 7

  return {
    score,
    scoreBand,
    fitSummary,
    painPoints,
    researchSummary,
    recommendedAction,
    draftReply,
    suggestedFollowUpDays,
    scoreBreakdown: breakdown,
  }
}

function generateDraftReply(params: {
  company: CompanySettings
  lead: LeadInput
  scoreBand: string
  tone: string
}): string {
  const { company, lead, scoreBand } = params
  const firstName = lead.name.split(" ")[0]
  const offer = company.mainOffer ?? "our services"

  if (scoreBand === "HOT" || scoreBand === "WARM") {
    return `Hi ${firstName},

Thank you for reaching out about ${offer}.

I have taken a look at${lead.companyName ? ` ${lead.companyName}` : " your enquiry"} and it sounds like there could be a strong fit — ${scoreBand === "HOT" ? "particularly given your timeline" : "I would like to understand your requirements better"}.

Would you be open to a 20-minute call this week? I can walk you through exactly how we would approach this for your specific situation.

Best regards,
[Your name]
${company.name}`
  }

  if (scoreBand === "COLD") {
    return `Hi ${firstName},

Thanks for getting in touch.

I have had a look at your enquiry. ${company.name} ${offer.toLowerCase().includes("help") ? offer : `can help with ${offer}`}.

I would love to understand more about what you are looking to achieve. Could you tell me a bit more about your current situation and timeline?

Best regards,
[Your name]
${company.name}`
  }

  return `Hi ${firstName},

Thank you for getting in touch with ${company.name}.

We have reviewed your enquiry. Based on what you have shared, we want to make sure we can genuinely help you — could you give me a bit more context about your project and budget?

Best regards,
[Your name]
${company.name}`
}
