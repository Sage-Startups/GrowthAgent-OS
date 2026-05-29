import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Bot, Search, Mail, Clock, Phone, BarChart3,
  FileText, Eye, Users, Zap, Activity, Cpu
} from "lucide-react"

type AgentStatus = "ACTIVE" | "AVAILABLE" | "COMING_SOON"
type PlanTier = "Starter" | "Pipeline" | "Growth OS"

type AgentModule = {
  id: string
  name: string
  description: string
  longDescription: string
  icon: React.ElementType
  status: AgentStatus
  plan: PlanTier
  skillFile?: string
  tasks: string[]
  safetyNote?: string
}

const agentModules: AgentModule[] = [
  {
    id: "lead-qualification",
    name: "Lead Qualification Agent",
    description: "Researches and scores incoming leads against your ICP",
    longDescription: "Analyses each new lead against your Ideal Customer Profile, assigns a score (0–100), and generates a fit summary, pain point analysis, and draft reply — all for human review.",
    icon: Search,
    status: "ACTIVE",
    plan: "Starter",
    skillFile: "lead-qualification-agent",
    tasks: ["Score & band leads", "Fit analysis", "Pain point extraction", "Draft reply prep"],
    safetyNote: "All output requires approval before sending",
  },
  {
    id: "reply-drafting",
    name: "Reply Drafting Agent",
    description: "Generates personalised email drafts in your brand tone",
    longDescription: "Crafts personalised replies using your tone of voice, lead context, and recommended action. Supports 4 styles: professional, friendly, direct, and premium-consultative.",
    icon: Mail,
    status: "ACTIVE",
    plan: "Pipeline",
    skillFile: "reply-drafting-agent",
    tasks: ["Draft personalised replies", "Match brand tone", "Reference lead context", "Approval queue submission"],
    safetyNote: "Always submitted to approval queue — never sent automatically",
  },
  {
    id: "follow-up",
    name: "Follow-Up Agent",
    description: "Tracks overdue leads and schedules timely follow-ups",
    longDescription: "Monitors your pipeline for overdue follow-ups, surfaces the highest-priority leads, and suggests follow-up messages based on lead history and status.",
    icon: Clock,
    status: "ACTIVE",
    plan: "Pipeline",
    skillFile: "follow-up-agent",
    tasks: ["Detect overdue leads", "Prioritise by score", "Draft follow-up messages", "Schedule reminders"],
  },
  {
    id: "sales-call-prep",
    name: "Sales Call Prep Agent",
    description: "Generates comprehensive call briefs before discovery calls",
    longDescription: "Produces a structured call brief covering lead background, company research, pain points, discovery questions, objection handling, and a recommended opening line.",
    icon: Phone,
    status: "ACTIVE",
    plan: "Pipeline",
    skillFile: "sales-call-prep-agent",
    tasks: ["Lead summary", "Discovery questions", "Objection prep", "Call opener"],
    safetyNote: "Internal use only — saves as a note on the lead",
  },
  {
    id: "weekly-report",
    name: "Weekly Report Agent",
    description: "Summarises your pipeline performance every week",
    longDescription: "Every Monday, generates an executive pipeline report covering new leads, hot/warm split, conversion metrics, overdue follow-ups, and top opportunities.",
    icon: BarChart3,
    status: "ACTIVE",
    plan: "Starter",
    skillFile: "weekly-report-agent",
    tasks: ["Pipeline summary", "Lead quality report", "Overdue follow-ups", "Source performance"],
  },
  {
    id: "proposal-prep",
    name: "Proposal Prep Agent",
    description: "Builds structured proposal outlines for hot leads",
    longDescription: "Generates a tailored proposal outline covering problem statement, solution fit, pricing rationale, and next steps — structured for human review before any external use.",
    icon: FileText,
    status: "AVAILABLE",
    plan: "Growth OS",
    skillFile: "proposal-prep-agent",
    tasks: ["Problem/solution mapping", "Pricing rationale", "Next step suggestions", "Objection pre-emption"],
    safetyNote: "Requires SEND_PROPOSAL approval before sharing externally",
  },
  {
    id: "competitor-monitoring",
    name: "Competitor Monitoring Agent",
    description: "Analyses competitive landscape and surfaces differentiators",
    longDescription: "Uses company and lead context to identify competitor comparisons, surface your strongest differentiators, and prepare objection-handling scripts tailored to each lead.",
    icon: Eye,
    status: "COMING_SOON",
    plan: "Growth OS",
    skillFile: "competitor-monitoring-agent",
    tasks: ["Competitor identification", "Differentiator mapping", "Objection scripts", "Positioning advice"],
    safetyNote: "Internal use only — informational output",
  },
  {
    id: "client-onboarding",
    name: "Client Onboarding Agent",
    description: "Generates personalised onboarding checklists for new clients",
    longDescription: "When a lead is marked WON, this agent generates a personalised onboarding checklist based on their business type, plan, and setup status — keeping nothing falling through the cracks.",
    icon: Users,
    status: "COMING_SOON",
    plan: "Growth OS",
    skillFile: "client-onboarding-agent",
    tasks: ["Onboarding checklist generation", "Plan-aware setup steps", "Config warnings", "Welcome email draft"],
    safetyNote: "Requires CLIENT_ONBOARDING approval for external communications",
  },
  {
    id: "lead-intake-webhook",
    name: "Lead Intake Webhook",
    description: "Captures leads from your website and external tools",
    longDescription: "Accepts leads from any source via a secure webhook endpoint. Automatically validates, creates the lead record, and optionally triggers qualification — all without manual data entry.",
    icon: Zap,
    status: "ACTIVE",
    plan: "Starter",
    tasks: ["Website form capture", "API key auth", "Auto-qualification trigger", "Real-time lead creation"],
  },
  {
    id: "agent-chat",
    name: "Agent Chat Intelligence",
    description: "Natural language interface to your entire pipeline",
    longDescription: "Ask questions about your pipeline in plain English. The agent understands commands like 'show hot leads', 'who needs a follow-up today', and 'what is our pipeline value this week'.",
    icon: Bot,
    status: "ACTIVE",
    plan: "Starter",
    tasks: ["Pipeline Q&A", "Lead lookup", "Follow-up surfacing", "Status summaries"],
  },
]

function StatusBadge({ status }: { status: AgentStatus }) {
  if (status === "ACTIVE") {
    return (
      <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 inline-block animate-pulse" />
        Active
      </Badge>
    )
  }
  if (status === "AVAILABLE") {
    return (
      <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs">
        Available
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-xs text-slate-500">
      Coming Soon
    </Badge>
  )
}

function PlanBadge({ plan }: { plan: PlanTier }) {
  const colors: Record<PlanTier, string> = {
    "Starter": "text-slate-400 border-slate-700",
    "Pipeline": "text-violet-400 border-violet-500/30 bg-violet-500/5",
    "Growth OS": "text-amber-400 border-amber-500/30 bg-amber-500/5",
  }
  return (
    <Badge variant="outline" className={`text-xs ${colors[plan]}`}>
      {plan}
    </Badge>
  )
}

export default async function AgentsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
    include: { company: true },
  })
  if (!membership) redirect("/app/onboarding")

  const company = membership.company
  const agentProvider = company.openclawEnabled ? "OpenClaw" : "Local Engine"

  const [taskCount, runCount] = await Promise.all([
    prisma.agentTask.count({ where: { agent: { companyId: company.id } } }),
    prisma.agentRun.count({ where: { agent: { companyId: company.id } } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agent Modules</h1>
          <p className="text-slate-400 mt-1">AI skill packs powering your growth operations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Running on</div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Cpu className="h-3.5 w-3.5 text-blue-400" />
              <span className={company.openclawEnabled ? "text-blue-400" : "text-slate-300"}>
                {agentProvider}
              </span>
            </div>
          </div>
          {!company.openclawEnabled && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/settings?tab=agent">Configure Agent Engine</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tasks Completed", value: taskCount, icon: Activity, color: "text-emerald-400" },
          { label: "Agent Runs", value: runCount, icon: Cpu, color: "text-blue-400" },
          { label: "Active Modules", value: agentModules.filter(m => m.status === "ACTIVE").length, icon: Bot, color: "text-violet-400" },
        ].map((s) => (
          <Card key={s.label} className="border-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agent module grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {agentModules.map((agent) => {
          const Icon = agent.icon
          const isActive = agent.status === "ACTIVE"
          const isComingSoon = agent.status === "COMING_SOON"
          return (
            <Card
              key={agent.id}
              className={`border-slate-800 transition-all ${isActive ? "hover:border-slate-700" : "opacity-70"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? "bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-blue-500/20" : "bg-slate-800"
                    }`}>
                      <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{agent.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{agent.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <StatusBadge status={agent.status} />
                    <PlanBadge plan={agent.plan} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">{agent.longDescription}</p>

                <div className="flex flex-wrap gap-1.5">
                  {agent.tasks.map((task) => (
                    <span key={task} className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                      {task}
                    </span>
                  ))}
                </div>

                {agent.safetyNote && (
                  <div className="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/10 rounded-md px-2.5 py-1.5">
                    <span className="shrink-0">🔒</span>
                    <span>{agent.safetyNote}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  {agent.skillFile ? (
                    <span className="text-xs text-slate-600 font-mono">agent-skills/{agent.skillFile}</span>
                  ) : (
                    <span />
                  )}
                  {isActive && (
                    <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                      <Link href={
                        agent.id === "lead-intake-webhook" ? "/app/settings?tab=api" :
                        agent.id === "agent-chat" ? "/app/agent" :
                        "/app/leads"
                      }>
                        Use
                      </Link>
                    </Button>
                  )}
                  {agent.status === "AVAILABLE" && (
                    <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                      <Link href="/app/settings?tab=billing">Upgrade</Link>
                    </Button>
                  )}
                  {isComingSoon && (
                    <span className="text-xs text-slate-600">Coming soon</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-start gap-3">
          <Bot className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="text-slate-300 font-medium">Agent Engine: </span>
            {company.openclawEnabled
              ? `Connected to OpenClaw gateway — advanced multi-agent orchestration active.`
              : `Running on the local deterministic engine. Connect OpenClaw in Settings → Agent to enable LLM-powered analysis.`
            }
            {" "}All external actions (sending emails, status changes) require your approval before execution.
          </div>
        </div>
      </div>
    </div>
  )
}
