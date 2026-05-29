import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, Plus, Filter, Users } from "lucide-react"
import { getScoreBandColor, getStatusColor, formatCurrency, formatRelativeTime } from "@/lib/utils"

const mockLeads = [
  { id: "1", name: "Sarah Chen", email: "s.chen@fintechagency.com", companyName: "Fintech Agency Ltd", source: "Website form", status: "HOT", scoreBand: "HOT", estimatedValue: 12000, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "2", name: "Marcus Webb", email: "marcus@builderbrand.co.uk", companyName: "BuilderBrand Co", source: "LinkedIn", status: "WARM", scoreBand: "WARM", estimatedValue: 6000, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
  { id: "3", name: "Priya Sharma", email: "priya@saaslaunch.io", companyName: "SaaS Launch HQ", source: "Referral", status: "HOT", scoreBand: "HOT", estimatedValue: 18000, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: "4", name: "Tom Rigby", email: "t.rigby@agencyx.com", companyName: "Agency X", source: "Website form", status: "FOLLOW_UP_DUE", scoreBand: "WARM", estimatedValue: 4500, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { id: "5", name: "Emma Foster", email: "emma@growthco.io", companyName: "GrowthCo", source: "Email", status: "QUALIFIED", scoreBand: "WARM", estimatedValue: 8000, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: "6", name: "James Liu", email: "james@techventures.com", companyName: "TechVentures", source: "Website form", status: "COLD", scoreBand: "COLD", estimatedValue: 2000, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
  { id: "7", name: "Natasha Brown", email: "n.brown@retailplus.com", companyName: "RetailPlus", source: "Website form", status: "NEW", scoreBand: null, estimatedValue: null, createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
  { id: "8", name: "David Kim", email: "david@consultingdg.com", companyName: "Consulting DG", source: "Referral", status: "CALL_BOOKED", scoreBand: "HOT", estimatedValue: 15000, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
]

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CRM Leads</h1>
          <p className="text-slate-400 mt-1">All leads captured and researched by your agent</p>
        </div>
        <Button variant="gradient" size="sm">
          <Plus className="h-4 w-4 mr-1.5" /> Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search leads..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-1.5" /> Filter
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", count: mockLeads.length, color: "text-blue-400" },
          { label: "Hot", count: mockLeads.filter(l => l.scoreBand === "HOT").length, color: "text-red-400" },
          { label: "Warm", count: mockLeads.filter(l => l.scoreBand === "WARM").length, color: "text-orange-400" },
          { label: "New (unscored)", count: mockLeads.filter(l => !l.scoreBand).length, color: "text-blue-400" },
        ].map((s) => (
          <Card key={s.label} className="border-slate-800">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3">Lead</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3">Company</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3">Source</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3">Score</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3">Est. Value</th>
                  <th className="text-left text-xs font-semibold text-slate-400 px-5 py-3">Added</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {mockLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {lead.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{lead.name}</div>
                          <div className="text-xs text-slate-500">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-300">{lead.companyName}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{lead.source}</td>
                    <td className="px-5 py-3.5">
                      {lead.scoreBand ? (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getScoreBandColor(lead.scoreBand)}`}>
                          {lead.scoreBand}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      {lead.estimatedValue ? (
                        <span className="text-emerald-400 font-medium">{formatCurrency(lead.estimatedValue)}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{formatRelativeTime(lead.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/app/leads/${lead.id}`}>View</Link>
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
