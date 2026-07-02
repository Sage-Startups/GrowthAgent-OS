import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import {
  Users, TrendingUp, Flame, Thermometer, Clock, DollarSign,
  CheckSquare, Zap, Bot, ArrowRight, Star, Bell, CheckCircle, Circle, Gauge, ShieldCheck
} from "lucide-react"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"
import { getPlanDisplay } from "@/lib/plans"
import { getCompanyUsage } from "@/lib/usage-service"

// Friendly framing of the setup lifecycle for the customer
const EMPLOYEE_STATUS: Record<string, { label: string; detail: string; dot: string }> = {
  NEW: { label: "Being built", detail: "We're building your AI employee around your business right now.", dot: "bg-yellow-400" },
  ONBOARDING: { label: "Being built", detail: "We're building your AI employee around your business right now.", dot: "bg-yellow-400" },
  CONFIGURING: { label: "Being configured", detail: "We're tuning your employee's scoring rules and tone of voice.", dot: "bg-violet-400" },
  TESTING: { label: "In final testing", detail: "We're testing your employee on real scenarios before it goes live.", dot: "bg-blue-400" },
  LIVE: { label: "On the job", detail: "Working your pipeline and sending everything here for your review.", dot: "bg-emerald-400" },
  PAUSED: { label: "Paused", detail: "Your AI employee is paused. Contact us to resume it.", dot: "bg-red-400" },
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
    include: {
      company: {
        include: {
          subscriptions: { include: { plan: true }, take: 1, orderBy: { createdAt: "desc" } },
        },
      },
    },
  })
  if (!membership) redirect("/app/onboarding")

  const companyId = membership.companyId
  const company = membership.company

  const [
    totalLeads,
    newThisWeek,
    hotLeads,
    warmLeads,
    followUpsDue,
    pipelineValueResult,
    agentTasksDone,
    pendingApprovals,
    hotLeadsList,
    overdueFu,
    pendingDrafts,
    companyUsage,
  ] = await Promise.all([
    prisma.lead.count({ where: { companyId } }),
    prisma.lead.count({ where: { companyId, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    prisma.lead.count({ where: { companyId, scoreBand: "HOT" } }),
    prisma.lead.count({ where: { companyId, scoreBand: "WARM" } }),
    prisma.lead.count({ where: { companyId, nextFollowUpAt: { lte: new Date() } } }),
    prisma.lead.aggregate({ where: { companyId, estimatedValue: { not: null } }, _sum: { estimatedValue: true } }),
    prisma.agentTask.count({ where: { agent: { companyId }, status: "COMPLETED" } }),
    prisma.approvalRequest.count({ where: { companyId, status: "PENDING" } }),
    prisma.lead.findMany({
      where: { companyId, scoreBand: "HOT" },
      orderBy: { score: "desc" },
      take: 3,
      select: { id: true, name: true, companyName: true, score: true, estimatedValue: true },
    }),
    prisma.lead.findMany({
      where: { companyId, nextFollowUpAt: { lte: new Date() } },
      orderBy: { nextFollowUpAt: "asc" },
      take: 3,
      select: { id: true, name: true, companyName: true, nextFollowUpAt: true },
    }),
    prisma.approvalRequest.findMany({
      where: { companyId, status: "PENDING", type: "DRAFT_EMAIL" },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true },
    }),
    getCompanyUsage(companyId),
  ])

  const activeAgents = await prisma.agent.count({ where: { companyId, status: "ACTIVE" } })

  const pipelineValue = pipelineValueResult._sum.estimatedValue ?? 0

  // Setup progress checks
  const setupChecks = [
    { label: "Business profile complete", done: !!(company.name && company.mainOffer) },
    { label: "Lead source connected", done: company.leadSources.length > 0 },
    { label: "Scoring rules configured", done: !!(company.idealCustomerProfile && company.idealCustomerProfile.length > 10) },
    { label: "Agent mode selected", done: true }, // local is always selected
    { label: "First lead qualified", done: hotLeads > 0 || warmLeads > 0 },
  ]
  const setupProgress = Math.round((setupChecks.filter(c => c.done).length / setupChecks.length) * 100)
  const plan = getPlanDisplay(companyUsage.planName ?? company.stripePlanName)
  const employeeStatus = EMPLOYEE_STATUS[company.setupStatus] ?? EMPLOYEE_STATUS.NEW

  const statCards = [
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "New This Week", value: newThisWeek, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Hot Leads", value: hotLeads, icon: Flame, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Warm Leads", value: warmLeads, icon: Thermometer, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Follow-Ups Due", value: followUpsDue, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Pipeline Value", value: formatCurrency(pipelineValue), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Tasks Completed", value: agentTasksDone, icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Awaiting Your Approval", value: pendingApprovals, icon: CheckSquare, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Good morning, {session?.user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-slate-400 mt-1">Here&apos;s what your AI employee has been working on for you.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-slate-400">{plan.shortLabel}</Badge>
          {pendingApprovals > 0 && (
            <Badge className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs">
              <Bell className="h-3 w-3 mr-1" /> {pendingApprovals} approval{pendingApprovals !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* AI Employee status */}
      <Card className="border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/40">
        <CardContent className="p-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 ${employeeStatus.dot}`} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">Your AI Employee</span>
                <Badge variant="outline" className="text-xs text-slate-300">{employeeStatus.label}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{employeeStatus.detail}</p>
            </div>
            <div className="flex items-center gap-5 text-center shrink-0">
              <div>
                <div className="text-lg font-bold">{activeAgents}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Active agents</div>
              </div>
              <div>
                <div className="text-lg font-bold">{agentTasksDone}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Tasks done</div>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 shrink-0 border-l border-slate-800 pl-5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Monitored &amp; tuned monthly by our team
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Prepared for your review</h2>
            <Badge className="ml-auto text-xs border-blue-500/30 bg-blue-500/10 text-blue-400">Live</Badge>
          </div>

          {hotLeadsList.length > 0 ? (
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-red-400 mb-3 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5" /> Top Opportunities
                </div>
                <div className="space-y-3">
                  {hotLeadsList.map((lead) => (
                    <div key={lead.id} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white shrink-0">{lead.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{lead.name}</div>
                        <div className="text-xs text-slate-400">{lead.companyName ?? "—"}</div>
                      </div>
                      {lead.estimatedValue && <div className="text-xs font-semibold text-emerald-400 shrink-0">{formatCurrency(lead.estimatedValue)}</div>}
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2 shrink-0" asChild>
                        <Link href={`/app/leads/${lead.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : totalLeads === 0 ? (
            <Card className="border-slate-800 border-dashed">
              <CardContent className="py-10 text-center">
                <Users className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <div className="text-sm font-medium mb-1">No leads yet</div>
                <p className="text-xs text-slate-500 mb-4">As soon as leads arrive, your AI employee researches and scores them, then queues the results here.</p>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/app/leads">Go to CRM</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-800">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-400 mb-1">From your AI employee</p>
                    <p className="text-sm text-slate-300">No HOT leads yet. I&apos;m still qualifying your newer leads — scored results will appear here as I work through them.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {overdueFu.length > 0 && (
            <Card className="border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" /> Follow-ups overdue
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {overdueFu.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                      <Link href={`/app/leads/${f.id}`} className="hover:text-white transition-colors flex-1 truncate">
                        {f.name}{f.companyName ? ` · ${f.companyName}` : ""}
                      </Link>
                      <span className="text-xs text-slate-600 shrink-0">{formatRelativeTime(f.nextFollowUpAt!)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {pendingDrafts.length > 0 && (
            <Card className="border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4 text-violet-400" /> Draft replies awaiting approval
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-4">
                  {pendingDrafts.map((d) => (
                    <li key={d.id} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                      {d.title}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/app/approvals">Review approvals <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Setup progress */}
          {setupProgress < 100 && (
            <Card className="border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Setup Progress</CardTitle>
                <div className="h-1.5 rounded-full bg-slate-800 mt-2">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all" style={{ width: `${setupProgress}%` }} />
                </div>
                <p className="text-xs text-slate-500">{setupProgress}% complete</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {setupChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2 text-xs">
                    {check.done
                      ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      : <Circle className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                    }
                    <span className={check.done ? "text-slate-400 line-through" : "text-slate-300"}>{check.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* AI Work Credits card */}
          {(() => {
            const used = companyUsage.creditsUsedThisCycle
            const limit = companyUsage.monthlyCreditLimit
            const remaining = companyUsage.creditsRemaining
            const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0
            const resetDate = companyUsage.billingCycleEnd.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
            return (
              <Card className="border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-blue-400" /> AI Work Credits
                    <Badge variant="outline" className="ml-auto text-xs text-slate-400 capitalize">{companyUsage.planName}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">{remaining.toLocaleString()} remaining</span>
                      <span className="text-slate-500">{limit.toLocaleString()} total</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className={`h-2 rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-blue-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Resets {resetDate}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-md bg-slate-800/50 px-2 py-1.5">
                      <div className="text-xs font-semibold">{companyUsage.leadsSourcedThisCycle}</div>
                      <div className="text-xs text-slate-500">Leads</div>
                    </div>
                    <div className="rounded-md bg-slate-800/50 px-2 py-1.5">
                      <div className="text-xs font-semibold">{companyUsage.repliesDraftedThisCycle}</div>
                      <div className="text-xs text-slate-500">Replies</div>
                    </div>
                    <div className="rounded-md bg-slate-800/50 px-2 py-1.5">
                      <div className="text-xs font-semibold">{companyUsage.callBriefsThisCycle}</div>
                      <div className="text-xs text-slate-500">Briefs</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-xs h-7" asChild>
                    <Link href="/app/usage">View full usage <ArrowRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })()}

          {/* Quick actions */}
          <h2 className="text-sm font-semibold text-slate-400 px-1">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: "/app/approvals", label: "Approve your employee's work", icon: CheckSquare, color: "text-yellow-400", badge: pendingApprovals > 0 ? pendingApprovals : undefined },
              { href: "/app/leads", label: "View all leads", icon: Users, color: "text-blue-400" },
              { href: "/app/agent", label: "Chat with your employee", icon: Bot, color: "text-violet-400" },
              { href: "/app/reports", label: "View reports", icon: TrendingUp, color: "text-emerald-400" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm hover:border-slate-700 hover:bg-slate-800/60 transition-all group"
              >
                <action.icon className={`h-4 w-4 ${action.color}`} />
                <span className="flex-1">{action.label}</span>
                {action.badge ? (
                  <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">{action.badge}</span>
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
