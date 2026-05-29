import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, DollarSign, Zap, ArrowUp, ArrowDown } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-slate-400 mt-1">Pipeline performance and agent activity overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pipeline", value: formatCurrency(84500), change: "+18%", up: true, icon: DollarSign, color: "text-emerald-400" },
          { label: "Leads This Month", value: "23", change: "+6", up: true, icon: Users, color: "text-blue-400" },
          { label: "Avg Lead Score", value: "72/100", change: "+4pts", up: true, icon: Zap, color: "text-violet-400" },
          { label: "Conversion Rate", value: "34%", change: "-2%", up: false, icon: TrendingUp, color: "text-orange-400" },
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
            <div className="space-y-4">
              {[
                { label: "New", count: 7, pct: 15, color: "bg-blue-400" },
                { label: "Hot", count: 8, pct: 17, color: "bg-red-400" },
                { label: "Warm", count: 14, pct: 30, color: "bg-orange-400" },
                { label: "Cold", count: 10, pct: 21, color: "bg-slate-400" },
                { label: "Qualified", count: 5, pct: 11, color: "bg-emerald-400" },
                { label: "Won", count: 3, pct: 6, color: "bg-green-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-400">{item.count} leads · {item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className={`h-2 rounded-full ${item.color} transition-all`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
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
                { label: "Leads researched", value: 23, icon: "🔍" },
                { label: "Leads scored", value: 19, icon: "⭐" },
                { label: "Draft replies created", value: 17, icon: "✍️" },
                { label: "Follow-ups scheduled", value: 12, icon: "📅" },
                { label: "Approvals processed", value: 31, icon: "✅" },
                { label: "Briefings prepared", value: 8, icon: "📋" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                  <span className="text-sm text-slate-300 flex items-center gap-2">
                    <span>{item.icon}</span> {item.label}
                  </span>
                  <span className="text-sm font-semibold text-blue-400">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly new leads */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-400" /> Weekly Lead Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {[4, 7, 5, 9, 6, 8, 6].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-violet-600 opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${(val / 9) * 100}%` }}
                  />
                  <span className="text-xs text-slate-500">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top sources */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="text-base">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { source: "Website Form", count: 18, pct: 78 },
                { source: "Referral", count: 3, pct: 13 },
                { source: "LinkedIn", count: 1, pct: 5 },
                { source: "Email", count: 1, pct: 4 },
              ].map((item) => (
                <div key={item.source} className="flex items-center gap-3">
                  <div className="w-28 text-sm text-slate-300 shrink-0">{item.source}</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${item.pct}%` }} />
                  </div>
                  <div className="text-xs text-slate-400 w-12 text-right">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
