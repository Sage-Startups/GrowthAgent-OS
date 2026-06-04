import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, DollarSign, Zap, ArrowUp, ArrowDown, Trophy } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
  })
  if (!membership) redirect("/app/onboarding")

  const companyId = membership.companyId
  const now = new Date()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const [
    totalLeads,
    leadsThisMonth,
    leadsLastMonth,
    scoreAgg,
    wonLeads,
    lostLeads,
    overdueFollowUps,
    statusBreakdown,
    sourceBreakdown,
    agentRunsThisMonth,
    agentTasksThisMonth,
    approvalStats,
    pipelineValue,
    newThisWeek,
    newPrevWeek,
  ] = await Promise.all([
    prisma.lead.count({ where: { companyId } }),
    prisma.lead.count({ where: { companyId, createdAt: { gte: monthAgo } } }),
    prisma.lead.count({ where: { companyId, createdAt: { gte: twoWeeksAgo, lt: monthAgo } } }),
    prisma.lead.aggregate({
      where: { companyId, score: { not: null } },
      _avg: { score: true },
    }),
    prisma.lead.count({ where: { companyId, status: "WON" } }),
    prisma.lead.count({ where: { companyId, status: "LOST" } }),
    prisma.lead.count({ where: { companyId, nextFollowUpAt: { lte: now }, status: { notIn: ["WON", "LOST"] } } }),
    prisma.lead.groupBy({ by: ["status"], where: { companyId }, _count: true }),
    prisma.lead.groupBy({ by: ["source"], where: { companyId, source: { not: null } }, _count: true, orderBy: { _count: { source: "desc" } }, take: 6 }),
    prisma.agentRun.count({ where: { agent: { companyId }, createdAt: { gte: monthAgo } } }),
    prisma.agentTask.count({ where: { agent: { companyId }, createdAt: { gte: monthAgo } } }),
    prisma.approvalRequest.groupBy({ by: ["status"], where: { companyId }, _count: true }),
    prisma.lead.aggregate({
      where: { companyId, estimatedValue: { not: null }, status: { notIn: ["LOST"] } },
      _sum: { estimatedValue: true },
    }),
    prisma.lead.count({ where: { companyId, createdAt: { gte: weekAgo } } }),
    prisma.lead.count({ where: { companyId, createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
  ])

  const avgScore = Math.round(scoreAgg._avg.score ?? 0)
  const totalPipeline = pipelineValue._sum.estimatedValue ?? 0
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0
  const monthChange = leadsLastMonth > 0 ? Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100) : 0
  const weekChange = newPrevWeek > 0 ? newThisWeek - newPrevWeek : newThisWeek

  const statusMap: Record<string, { label: string; color: string }> = {
    NEW: { label: "New", color: "bg-blue-400" },
    RESEARCHING: { label: "Researching", color: "bg-violet-400" },
    QUALIFIED: { label: "Qualified", color: "bg-emerald-400" },
    HOT: { label: "Hot", color: "bg-red-400" },
    WARM: { label: "Warm", color: "bg-orange-400" },
    COLD: { label: "Cold", color: "bg-slate-400" },
    BAD_FIT: { label: "Bad Fit", color: "bg-slate-600" },
    FOLLOW_UP_DUE: { label: "Follow-Up Due", color: "bg-yellow-400" },
    REPLIED: { label: "Replied", color: "bg-teal-400" },
    CALL_BOOKED: { label: "Call Booked", color: "bg-blue-500" },
    PROPOSAL_SENT: { label: "Proposal Sent", color: "bg-indigo-400" },
    WON: { label: "Won", color: "bg-green-400" },
    LOST: { label: "Lost", color: "bg-red-600" },
  }

  const approvedCount = approvalStats.find(a => a.status === "APPROVED")?._count ?? 0
  const pendingCount = approvalStats.find(a => a.status === "PENDING")?._count ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-slate-400 mt-1">Pipeline performance and agent activity overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Pipeline",
            value: formatCurrency(totalPipeline),
            change: `${weekChange >= 0 ? "+" : ""}${weekChange} this week`,
            up: weekChange >= 0,
            icon: DollarSign,
            color: "text-emerald-400",
          },
          {
            label: "Leads This Month",
            value: String(leadsThisMonth),
            change: `${monthChange >= 0 ? "+" : ""}${monthChange}% vs last month`,
            up: monthChange >= 0,
            icon: Users,
            color: "text-blue-400",
          },
          {
            label: "Avg Lead Score",
            value: `${avgScore}/100`,
            change: "from scored leads",
            up: avgScore >= 60,
            icon: Zap,
            color: "text-violet-400",
          },
          {
            label: "Conversion Rate",
            value: `${conversionRate}%`,
            change: `${wonLeads} won / ${wonLeads + lostLeads} closed`,
            up: conversionRate >= 20,
            icon: TrendingUp,
            color: "text-orange-400",
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className={`text-xs flex items-center gap-0.5 ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                  {kpi.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Lead status breakdown */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">Lead Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusBreakdown
                .sort((a, b) => b._count - a._count)
                .map((item) => {
                  const meta = statusMap[item.status] ?? { label: item.status, color: "bg-slate-400" }
                  const pct = totalLeads > 0 ? Math.round((item._count / totalLeads) * 100) : 0
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{meta.label}</span>
                        <span className="text-slate-400">{item._count} · {pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className={`h-2 rounded-full ${meta.color} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              {statusBreakdown.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No leads yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agent activity */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">Agent Activity (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Agent runs completed", value: agentRunsThisMonth, icon: "⚡" },
                { label: "Tasks created", value: agentTasksThisMonth, icon: "📋" },
                { label: "Approvals processed", value: approvedCount, icon: "✅" },
                { label: "Pending approvals", value: pendingCount, icon: "⏳" },
                { label: "Overdue follow-ups", value: overdueFollowUps, icon: "🔔" },
                { label: "Total leads in pipeline", value: totalLeads, icon: "👥" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-slate-300">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead source performance */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-400" /> Lead Source Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sourceBreakdown.map((item) => {
                const pct = totalLeads > 0 ? Math.round((item._count / totalLeads) * 100) : 0
                return (
                  <div key={item.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{item.source ?? "Unknown"}</span>
                      <span className="text-slate-400">{item._count} leads · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {sourceBreakdown.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No source data yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Won/Lost summary */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400" /> Win/Loss Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-3xl font-bold text-emerald-400">{wonLeads}</div>
                <div className="text-xs text-slate-400 mt-1">Deals Won</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-3xl font-bold text-red-400">{lostLeads}</div>
                <div className="text-xs text-slate-400 mt-1">Deals Lost</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Overdue follow-ups</span>
                <span className={overdueFollowUps > 0 ? "text-orange-400 font-medium" : "text-slate-300"}>{overdueFollowUps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">New this week</span>
                <span className="text-slate-300 font-medium">{newThisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scored leads</span>
                <span className="text-slate-300 font-medium">{totalLeads - (await prisma.lead.count({ where: { companyId, score: null } }))}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
