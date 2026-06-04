import { z } from "zod"

export const qualificationOutputSchema = z.object({
  score: z.number().min(0).max(100),
  scoreBand: z.enum(["HOT", "WARM", "COLD", "BAD_FIT"]),
  fitSummary: z.string(),
  researchSummary: z.string(),
  painPoints: z.array(z.string()),
  recommendedAction: z.string(),
  draftReply: z.string(),
  suggestedFollowUpDays: z.number().min(0).max(90),
  redFlags: z.array(z.string()),
  confidence: z.number().min(0).max(1),
})

export const salesCallOutputSchema = z.object({
  leadSummary: z.string(),
  companyOverview: z.string(),
  likelyPainPoints: z.array(z.string()),
  discoveryQuestions: z.array(z.string()),
  suggestedOfferAngle: z.string(),
  risks: z.array(z.string()),
  callOpener: z.string(),
  nextSteps: z.array(z.string()),
})

export const weeklyReportOutputSchema = z.object({
  executiveSummary: z.string(),
  leadStats: z.record(z.unknown()),
  bestOpportunities: z.array(z.string()),
  missedFollowUps: z.array(z.string()),
  bottlenecks: z.array(z.string()),
  suggestedActions: z.array(z.string()),
})

export const replyOutputSchema = z.object({
  subject: z.string().optional(),
  body: z.string(),
  tone: z.string().optional(),
  keyPoints: z.array(z.string()).optional(),
})

export const proposalOutputSchema = z.object({
  title: z.string(),
  executiveSummary: z.string(),
  problemStatement: z.string(),
  proposedSolution: z.string(),
  investmentOutline: z.string(),
  nextSteps: z.array(z.string()),
  keyBenefits: z.array(z.string()),
})

export const competitorOutputSchema = z.object({
  summary: z.string(),
  competitors: z.array(z.object({
    name: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    positioning: z.string(),
  })),
  differentiators: z.array(z.string()),
  recommendations: z.array(z.string()),
})

export type QualificationOutput = z.infer<typeof qualificationOutputSchema>
export type SalesCallOutput = z.infer<typeof salesCallOutputSchema>
export type WeeklyReportOutput = z.infer<typeof weeklyReportOutputSchema>
export type ReplyOutput = z.infer<typeof replyOutputSchema>
export type ProposalOutput = z.infer<typeof proposalOutputSchema>
export type CompetitorOutput = z.infer<typeof competitorOutputSchema>
