import Link from "next/link"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users, Building2, FileText, CheckSquare, Activity, TrendingUp,
  AlertCircle, ArrowRight, Gauge,
} from "lucide-react"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"
import { getPlanDisplay } from "@/lib/plans"

export const dynamic = "force-dynamic"

const ACTIVITY_LABELS: Record<string, string> = {
  ADMIN_CREDIT_ADJUSTMENT: "Credits adjusted",
  ADMIN_SETUP_STATUS_CHANGED: "Setup status changed",
  ADMIN_EMPLOYEE_PAUSED: "AI employee paused",
  ADMIN_EMPLOYEE_RESUMED: "AI employee resumed",
  ADMIN_PLAN_CHANGED: "Plan changed",
  ADMIN_NOTE: "Internal note added",
}

export default async function AdminOverviewPage() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    totalUsers,
    totalCompanies,
    totalLeads,
    pendingApprovals,
    agentRunsToday,
    failedRunsToday,
    liveCompanies,
    usageRecords,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.lead.count(),
    prisma.approvalRequest.count({ where: { status: "PENDING" } }),
    prisma.agentRun.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.agentRun.count({ where: { createdAt: { gte: todayStart }, status: "failed" } }),
    prisma.company.findMany({
      where: { setupStatus: "LIVE" },
      select: { id: true, usage: { select: { planName: true } } },
    }),
    prisma.companyUsage.findMany({
      where: { monthlyCreditLimit: { gt: 0 } },
      select: { companyId: true, creditsRemaining: true, monthlyCreditLimit: true, company: { select: { name: true } } },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { company: { select: { name: true } } },
    }),
  ])

  const mrr = liveCompanies.reduce(
    (sum, c) => sum + getPlanDisplay(c.usage?.planName).monthlyPrice, 0
  )
  const lowCredit = usageRecords.filter(
    (u) => u.creditsRemaining / u.monthlyCreditLimit < 0.2
  )

  const stats = [
    { label: "Customers", value: totalCompanies, icon: Building2, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Live Employees", value: liveCompanies.length, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Est. MRR", value: formatCurrency(mrr), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Leads Managed", value: totalLeads.toLocaleString(), icon: FileText, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Pending Approvals", value: pendingApprovals, icon: CheckSquare, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Agent Runs Today", value: agentRunsToday, icon: Activity, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Failed Runs Today", value: failedRunsToday, icon: AlertCircle, color: failedRunsToday > 0 ? "text-red-400" : "text-slate-400", bg: failedRunsToday > 0 ? "bg-red-400/10" : "bg-slate-400/10" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">Mission Control</h1>
          <Badge className="border-red-500/30 bg-red-500/10 text-red-400 text-xs">Admin Only</Badge>
        </div>
        <p className="text-slate-400">Every customer&apos;s AI employee, at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-800">
            <CardContent className="p-5">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Needs attention */}
        <Card className="border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-400" /> Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowCredit.length === 0 && failedRunsToday === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                All clear — no customers need attention right now.
              </p>
            ) : (
              <>
                {lowCredit.map((u) => (
                  <Link
                    key={u.companyId}
                    href={`/admin/customers/${u.companyId}`}
                    className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 hover:border-yellow-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Gauge className="h-4 w-4 text-yellow-400 shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{u.company.name}</div>
                        <div className="text-xs text-slate-400">
                          {u.creditsRemaining.toLocaleString()} of {u.monthlyCreditLimit.toLocaleString()} credits left
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </Link>
                ))}
                {failedRunsToday > 0 && (
                  <Link
                    href="/admin/agent-runs"
                    className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 hover:border-red-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <div className="text-sm font-medium">
                        {failedRunsToday} failed agent run{failedRunsToday !== 1 ? "s" : ""} today
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </Link>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No activity yet.</p>
            ) : (
              <div className="space-y-0">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2.5 border-b border-slate-800/50 last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                      <div className="min-w-0 truncate">
                        <span className="text-sm font-medium text-slate-200">
                          {item.company?.name ?? "Platform"}
                        </span>
                        <span className="text-sm text-slate-400 ml-2">
                          — {ACTIVITY_LABELS[item.action] ?? item.action.toLowerCase().replaceAll("_", " ")}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0 ml-3">{formatRelativeTime(item.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
