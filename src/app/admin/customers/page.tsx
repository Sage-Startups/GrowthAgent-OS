import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"

const mockCustomers = [
  { id: "1", name: "Fintech Agency Ltd", plan: "Pipeline Agent", status: "LIVE", users: 3, leads: 47, setupStatus: "LIVE", mrr: 249, createdAt: new Date("2026-01-15") },
  { id: "2", name: "BuilderBrand Co", plan: "Lead Agent Starter", status: "LIVE", users: 1, leads: 23, setupStatus: "LIVE", mrr: 99, createdAt: new Date("2026-02-01") },
  { id: "3", name: "SaaS Launch HQ", plan: "Growth Agent OS", status: "LIVE", users: 5, leads: 134, setupStatus: "LIVE", mrr: 599, createdAt: new Date("2025-11-20") },
  { id: "4", name: "Agency X", plan: "Pipeline Agent", status: "TESTING", users: 2, leads: 8, setupStatus: "TESTING", mrr: 249, createdAt: new Date("2026-05-01") },
  { id: "5", name: "GrowthCo", plan: "Lead Agent Starter", status: "ONBOARDING", users: 1, leads: 0, setupStatus: "ONBOARDING", mrr: 99, createdAt: new Date("2026-05-20") },
  { id: "6", name: "Consulting DG", plan: "Pipeline Agent", status: "CONFIGURING", users: 2, leads: 3, setupStatus: "CONFIGURING", mrr: 249, createdAt: new Date("2026-05-10") },
]

const statusColors: Record<string, string> = {
  LIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  TESTING: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  ONBOARDING: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  CONFIGURING: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  NEW: "border-slate-500/30 bg-slate-500/10 text-slate-400",
  PAUSED: "border-red-500/30 bg-red-500/10 text-red-400",
}

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-slate-400 mt-1">All companies using GrowthAgent OS</p>
        </div>
        <div className="text-sm text-slate-400">
          Total MRR:{" "}
          <span className="text-emerald-400 font-bold">
            £{mockCustomers.reduce((a, c) => a + c.mrr, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Search customers..." className="pl-9" />
      </div>

      <Card className="border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Company", "Plan", "Setup Status", "Users", "Leads", "MRR", "Since", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockCustomers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                          {c.name[0]}
                        </div>
                        <span className="text-sm font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{c.plan}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                          statusColors[c.setupStatus] ?? statusColors.NEW
                        }`}
                      >
                        {c.setupStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-300">{c.users}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-300">{c.leads}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-emerald-400">£{c.mrr}/mo</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
