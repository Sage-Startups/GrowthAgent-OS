import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, FileText, CreditCard, CheckSquare, Activity, TrendingUp, AlertCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const mockAdminStats = {
  totalUsers: 47,
  totalCompanies: 23,
  totalLeads: 891,
  activeSubscriptions: 19,
  pendingApprovals: 34,
  agentRunsToday: 156,
  mrr: 4731,
  churnRisk: 2,
}

const recentActivity = [
  { company: "Fintech Agency Ltd", event: "New lead captured", time: "2 min ago", type: "lead" },
  { company: "BuilderBrand Co", event: "Agent run completed", time: "8 min ago", type: "agent" },
  { company: "SaaS Launch HQ", event: "Approval approved", time: "15 min ago", type: "approval" },
  { company: "Consulting DG", event: "New user signed up", time: "1h ago", type: "user" },
  { company: "Agency X", event: "Onboarding completed", time: "2h ago", type: "setup" },
  { company: "GrowthCo", event: "Subscription activated", time: "3h ago", type: "billing" },
]

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">Admin Overview</h1>
          <Badge className="border-red-500/30 bg-red-500/10 text-red-400 text-xs">Admin Only</Badge>
        </div>
        <p className="text-slate-400">Platform-wide statistics and activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: mockAdminStats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Companies", value: mockAdminStats.totalCompanies, icon: Building2, color: "text-violet-400", bg: "bg-violet-400/10" },
          { label: "Total Leads", value: mockAdminStats.totalLeads.toLocaleString(), icon: FileText, color: "text-orange-400", bg: "bg-orange-400/10" },
          { label: "Active Subs", value: mockAdminStats.activeSubscriptions, icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Pending Approvals", value: mockAdminStats.pendingApprovals, icon: CheckSquare, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          { label: "Agent Runs Today", value: mockAdminStats.agentRunsToday, icon: Activity, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "MRR", value: formatCurrency(mockAdminStats.mrr), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Churn Risk", value: mockAdminStats.churnRisk, icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
        ].map((stat) => (
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

      {/* Recent activity */}
      <Card className="border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      item.type === "lead"
                        ? "bg-blue-400"
                        : item.type === "agent"
                        ? "bg-violet-400"
                        : item.type === "approval"
                        ? "bg-yellow-400"
                        : item.type === "billing"
                        ? "bg-emerald-400"
                        : "bg-slate-400"
                    }`}
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-200">{item.company}</span>
                    <span className="text-sm text-slate-400 ml-2">— {item.event}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
