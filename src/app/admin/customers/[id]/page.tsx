import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CustomerActions } from "@/components/admin/customer-actions"
import {
  ArrowLeft, Bot, Gauge, Users, FileText, CheckSquare,
  Activity, Building2, StickyNote,
} from "lucide-react"
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import { getPlanDisplay } from "@/lib/plans"

export const dynamic = "force-dynamic"

const statusColors: Record<string, string> = {
  LIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  TESTING: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  ONBOARDING: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  CONFIGURING: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  NEW: "border-slate-500/30 bg-slate-500/10 text-slate-400",
  PAUSED: "border-red-500/30 bg-red-500/10 text-red-400",
}

const AUDIT_LABELS: Record<string, string> = {
  ADMIN_CREDIT_ADJUSTMENT: "Credits adjusted",
  ADMIN_SETUP_STATUS_CHANGED: "Setup status changed",
  ADMIN_EMPLOYEE_PAUSED: "AI employee paused",
  ADMIN_EMPLOYEE_RESUMED: "AI employee resumed",
  ADMIN_PLAN_CHANGED: "Plan changed",
  ADMIN_NOTE: "Internal note",
}

export default async function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      usage: true,
      members: { include: { user: { select: { name: true, email: true, role: true } } } },
      agents: { orderBy: { createdAt: "asc" } },
      _count: { select: { leads: true } },
    },
  })
  if (!company) notFound()

  const [pendingApprovals, recentRuns, recentAudit, hotLeads, leadStats] = await Promise.all([
    prisma.approvalRequest.findMany({
      where: { companyId: company.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.agentRun.findMany({
      where: { agent: { companyId: company.id } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { agent: { select: { name: true } } },
    }),
    prisma.auditLog.findMany({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.lead.count({ where: { companyId: company.id, scoreBand: "HOT" } }),
    prisma.lead.aggregate({
      where: { companyId: company.id, estimatedValue: { not: null } },
      _sum: { estimatedValue: true },
    }),
  ])

  const plan = getPlanDisplay(company.usage?.planName ?? company.stripePlanName)
  const usage = company.usage
  const creditPct = usage && usage.monthlyCreditLimit > 0
    ? Math.min(100, Math.round((usage.creditsUsedThisCycle / usage.monthlyCreditLimit) * 100))
    : 0
  const employeePaused = company.agents.length > 0 && company.agents.every((a) => a.status === "PAUSED")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> All customers
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-lg font-bold text-white">
              {company.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold">{company.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusColors[company.setupStatus] ?? statusColors.NEW}`}>
                  {company.setupStatus}
                </span>
                <Badge variant="outline" className="text-xs text-slate-400">{plan.label}</Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {company.businessType ?? "Business type not set"} · Customer since {formatDate(company.createdAt)}
                {company.website ? <> · <span className="text-slate-500">{company.website}</span></> : null}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Leads", value: company._count.leads, icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Hot Leads", value: hotLeads, icon: Activity, color: "text-red-400", bg: "bg-red-400/10" },
          { label: "Pipeline Value", value: formatCurrency(leadStats._sum.estimatedValue ?? 0), icon: Building2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Pending Approvals", value: pendingApprovals.length, icon: CheckSquare, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        ].map((s) => (
          <Card key={s.label} className="border-slate-800">
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: employee state + activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI employee / agents */}
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-400" /> Their AI Employee
                <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium border ${employeePaused ? statusColors.PAUSED : statusColors.LIVE}`}>
                  {employeePaused ? "PAUSED" : "WORKING"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {company.agents.length === 0 ? (
                <p className="text-sm text-slate-500 py-3 text-center">No agents configured yet.</p>
              ) : (
                company.agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between rounded-lg border border-slate-700/50 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium">{agent.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{agent.description ?? agent.type}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      agent.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-400" :
                      agent.status === "PAUSED" ? "bg-red-500/15 text-red-400" :
                      "bg-slate-500/15 text-slate-400"
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Credits & usage */}
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-400" /> AI Work Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usage ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">{usage.creditsRemaining.toLocaleString()} remaining</span>
                      <span className="text-slate-500">{usage.monthlyCreditLimit.toLocaleString()} monthly limit</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className={`h-2 rounded-full ${creditPct >= 90 ? "bg-red-500" : creditPct >= 70 ? "bg-yellow-500" : "bg-blue-500"}`}
                        style={{ width: `${creditPct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">
                      Cycle resets {formatDate(usage.billingCycleEnd)}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "Leads", value: usage.leadsSourcedThisCycle },
                      { label: "Replies", value: usage.repliesDraftedThisCycle },
                      { label: "Briefs", value: usage.callBriefsThisCycle },
                      { label: "Voice min", value: usage.voiceMinutesThisCycle },
                    ].map((m) => (
                      <div key={m.label} className="rounded-md bg-slate-800/50 px-2 py-2">
                        <div className="text-sm font-semibold">{m.value}</div>
                        <div className="text-xs text-slate-500">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 py-3 text-center">
                  No usage record yet — created automatically on first agent activity, or set a plan to initialise it.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent agent runs */}
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" /> Recent Agent Runs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentRuns.length === 0 ? (
                <p className="text-sm text-slate-500 py-3 text-center">No agent runs yet.</p>
              ) : (
                <div className="space-y-0">
                  {recentRuns.map((run) => (
                    <div key={run.id} className="flex items-center justify-between py-2.5 border-b border-slate-800/50 last:border-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${
                          run.status === "completed" ? "bg-emerald-400" :
                          run.status === "failed" ? "bg-red-400" : "bg-yellow-400"
                        }`} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{run.agent.name}</div>
                          {run.error && <div className="text-xs text-red-400 truncate">{run.error}</div>}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="text-xs text-slate-500">{formatRelativeTime(run.createdAt)}</div>
                        {run.actualCreditCost != null && (
                          <div className="text-xs text-slate-600">{run.actualCreditCost} credits</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business profile */}
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" /> Business Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: "Main offer", value: company.mainOffer },
                { label: "Average deal value", value: company.averageDealValue ? formatCurrency(company.averageDealValue) : null },
                { label: "Ideal customer", value: company.idealCustomerProfile },
                { label: "Bad-fit traits", value: company.badFitTraits },
                { label: "Tone of voice", value: company.toneOfVoice },
                { label: "Lead sources", value: company.leadSources.length ? company.leadSources.join(", ") : null },
              ].map((f) => (
                <div key={f.label}>
                  <div className="text-xs text-slate-500 mb-0.5">{f.label}</div>
                  <div className="text-slate-300">{f.value ?? <span className="text-slate-600">Not set</span>}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: manage + team + audit */}
        <div className="space-y-6">
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Manage This Account</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerActions
                companyId={company.id}
                currentStatus={company.setupStatus}
                currentPlan={plan.label}
                employeePaused={employeePaused}
              />
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" /> Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {company.members.map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                    {(m.user.name ?? m.user.email)[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{m.user.name ?? "—"}</div>
                    <div className="text-xs text-slate-500 truncate">{m.user.email}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-violet-400" /> Account History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAudit.length === 0 ? (
                <p className="text-sm text-slate-500 py-3 text-center">No history yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentAudit.map((log) => {
                    const meta = log.metadata as Record<string, unknown> | null
                    const note = log.action === "ADMIN_NOTE" && meta?.note ? String(meta.note) : null
                    return (
                      <div key={log.id} className="text-xs border-b border-slate-800/50 last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-300">
                            {AUDIT_LABELS[log.action] ?? log.action.toLowerCase().replaceAll("_", " ")}
                          </span>
                          <span className="text-slate-600 shrink-0">{formatRelativeTime(log.createdAt)}</span>
                        </div>
                        {note && <p className="text-slate-400 mt-1">{note}</p>}
                        {log.user && <p className="text-slate-600 mt-0.5">by {log.user.name ?? log.user.email}</p>}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
