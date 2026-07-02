import Link from "next/link"
import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { getScoreBandColor, getStatusColor, formatCurrency, formatRelativeTime } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { company: { select: { id: true, name: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Leads</h1>
        <p className="text-slate-400 mt-1">Latest leads across every customer workspace</p>
      </div>

      {leads.length === 0 ? (
        <Card className="border-slate-800 border-dashed">
          <CardContent className="py-16 text-center">
            <FileText className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <div className="text-sm font-medium mb-1">No leads yet</div>
            <p className="text-xs text-slate-500">Leads appear here as customers&apos; AI employees capture them.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Lead", "Customer", "Source", "Score", "Status", "Est. Value", "Created"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium">{lead.name}</div>
                        {lead.companyName && <div className="text-xs text-slate-500">{lead.companyName}</div>}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/customers/${lead.company.id}`} className="text-sm text-slate-300 hover:text-blue-400 transition-colors">
                          {lead.company.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{lead.source ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        {lead.scoreBand ? (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${getScoreBandColor(lead.scoreBand)}`}>
                            {lead.scoreBand}{lead.score != null ? ` · ${lead.score}` : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">Unscored</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-emerald-400">
                        {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{formatRelativeTime(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
