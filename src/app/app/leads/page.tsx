import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { getScoreBandColor, getStatusColor, formatCurrency, formatRelativeTime } from "@/lib/utils"
import { LeadsToolbar } from "@/components/leads/leads-toolbar"
import { Users } from "lucide-react"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; sort?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
  })
  if (!membership) redirect("/app/onboarding")

  const companyId = membership.companyId

  const where: any = { companyId }
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: "insensitive" } },
      { companyName: { contains: searchParams.q, mode: "insensitive" } },
      { email: { contains: searchParams.q, mode: "insensitive" } },
    ]
  }
  if (searchParams.status) {
    where.status = searchParams.status
  }

  const sortMap: Record<string, any> = {
    score: { score: "desc" },
    value: { estimatedValue: "desc" },
    newest: { createdAt: "desc" },
  }
  const orderBy = sortMap[searchParams.sort ?? "newest"] ?? { createdAt: "desc" }

  const [leads, stats] = await Promise.all([
    prisma.lead.findMany({ where, orderBy, take: 100 }),
    prisma.lead.groupBy({
      by: ["scoreBand"],
      where: { companyId },
      _count: true,
    }),
  ])

  const totalCount = await prisma.lead.count({ where: { companyId } })
  const hotCount = stats.find(s => s.scoreBand === "HOT")?._count ?? 0
  const warmCount = stats.find(s => s.scoreBand === "WARM")?._count ?? 0
  const unscoredCount = await prisma.lead.count({ where: { companyId, scoreBand: null } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CRM Leads</h1>
          <p className="text-slate-400 mt-1">All leads captured and researched by your agent</p>
        </div>
      </div>

      <LeadsToolbar totalCount={totalCount} />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", count: totalCount, color: "text-blue-400" },
          { label: "Hot", count: hotCount, color: "text-red-400" },
          { label: "Warm", count: warmCount, color: "text-orange-400" },
          { label: "New (unscored)", count: unscoredCount, color: "text-slate-400" },
        ].map((s) => (
          <Card key={s.label} className="border-slate-800">
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {leads.length === 0 ? (
        <Card className="border-slate-800">
          <CardContent className="py-16 text-center">
            <Users className="h-10 w-10 text-slate-600 mx-auto mb-4" />
            <div className="text-lg font-medium text-slate-300 mb-1">No leads yet</div>
            <p className="text-sm text-slate-500 mb-4">Add your first lead manually or load demo leads to explore the CRM.</p>
          </CardContent>
        </Card>
      ) : (
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
                  {leads.map((lead) => (
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
                      <td className="px-5 py-3.5 text-sm text-slate-300">{lead.companyName ?? "—"}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{lead.source ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        {lead.scoreBand ? (
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getScoreBandColor(lead.scoreBand)}`}>
                            {lead.score ? `${lead.score} · ` : ""}{lead.scoreBand}
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
      )}
    </div>
  )
}
