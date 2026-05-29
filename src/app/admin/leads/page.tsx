import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { getScoreBandColor, getStatusColor, formatCurrency, formatRelativeTime } from "@/lib/utils"

const mockAllLeads = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "Fintech Agency Ltd",
    customerCompany: "Fintech Agency Ltd",
    source: "Website form",
    status: "HOT",
    scoreBand: "HOT",
    estimatedValue: 12000,
    createdAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: "2",
    name: "Marcus Webb",
    company: "BuilderBrand Co",
    customerCompany: "BuilderBrand Co",
    source: "LinkedIn",
    status: "WARM",
    scoreBand: "WARM",
    estimatedValue: 6000,
    createdAt: new Date(Date.now() - 4 * 86400000),
  },
  {
    id: "3",
    name: "Priya Sharma",
    company: "SaaS Launch HQ",
    customerCompany: "SaaS Launch HQ",
    source: "Referral",
    status: "HOT",
    scoreBand: "HOT",
    estimatedValue: 18000,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "4",
    name: "Tom Rigby",
    company: "Agency X",
    customerCompany: "Agency X",
    source: "Website form",
    status: "FOLLOW_UP_DUE",
    scoreBand: "WARM",
    estimatedValue: 4500,
    createdAt: new Date(Date.now() - 7 * 86400000),
  },
  {
    id: "5",
    name: "Emma Foster",
    company: "GrowthCo",
    customerCompany: "GrowthCo",
    source: "Email",
    status: "QUALIFIED",
    scoreBand: "WARM",
    estimatedValue: 8000,
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: "6",
    name: "James Liu",
    company: "TechVentures",
    customerCompany: "Consulting DG",
    source: "Website form",
    status: "COLD",
    scoreBand: "COLD",
    estimatedValue: 2000,
    createdAt: new Date(Date.now() - 10 * 86400000),
  },
  {
    id: "7",
    name: "Natasha Brown",
    company: "RetailPlus",
    customerCompany: "SaaS Launch HQ",
    source: "Website form",
    status: "NEW",
    scoreBand: null,
    estimatedValue: null,
    createdAt: new Date(Date.now() - 43200000),
  },
  {
    id: "8",
    name: "David Kim",
    company: "Consulting DG",
    customerCompany: "Fintech Agency Ltd",
    source: "Referral",
    status: "CALL_BOOKED",
    scoreBand: "HOT",
    estimatedValue: 15000,
    createdAt: new Date(Date.now() - 5 * 86400000),
  },
]

export default function AdminLeadsPage() {
  const totalValue = mockAllLeads.reduce((a, l) => a + (l.estimatedValue ?? 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Leads</h1>
          <p className="text-slate-400 mt-1">Every lead across all customer accounts</p>
        </div>
        <div className="text-sm text-slate-400">
          Total pipeline:{" "}
          <span className="text-emerald-400 font-bold">{formatCurrency(totalValue)}</span>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Search leads..." className="pl-9" />
      </div>

      <Card className="border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Lead", "Customer Account", "Source", "Score", "Status", "Value", "Added"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockAllLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {lead.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{lead.name}</div>
                          <div className="text-xs text-slate-500">{lead.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{lead.customerCompany}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{lead.source}</td>
                    <td className="px-5 py-3.5">
                      {lead.scoreBand ? (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getScoreBandColor(
                            lead.scoreBand
                          )}`}
                        >
                          {lead.scoreBand}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {lead.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {lead.estimatedValue ? (
                        <span className="text-sm text-emerald-400 font-medium">
                          {formatCurrency(lead.estimatedValue)}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {formatRelativeTime(lead.createdAt)}
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
