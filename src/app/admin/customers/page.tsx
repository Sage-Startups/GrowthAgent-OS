import Link from "next/link"
import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Building2 } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
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

export default async function AdminCustomersPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      usage: true,
      _count: { select: { members: true, leads: true, approvalRequests: { where: { status: "PENDING" } } } },
    },
  })

  const mrr = companies
    .filter((c) => c.setupStatus === "LIVE")
    .reduce((sum, c) => sum + getPlanDisplay(c.usage?.planName ?? c.stripePlanName).monthlyPrice, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-slate-400 mt-1">Every business with an AI employee — click one to manage it</p>
        </div>
        <div className="text-sm text-slate-400">
          Live MRR:{" "}
          <span className="text-emerald-400 font-bold">{formatCurrency(mrr)}</span>
        </div>
      </div>

      {companies.length === 0 ? (
        <Card className="border-slate-800 border-dashed">
          <CardContent className="py-16 text-center">
            <Building2 className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <div className="text-sm font-medium mb-1">No customers yet</div>
            <p className="text-xs text-slate-500">Companies appear here as soon as they complete onboarding.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Company", "Plan", "Setup Status", "Users", "Leads", "Pending", "Credits", "MRR", "Since", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => {
                    const plan = getPlanDisplay(c.usage?.planName ?? c.stripePlanName)
                    const remaining = c.usage?.creditsRemaining ?? 0
                    const limit = c.usage?.monthlyCreditLimit ?? 0
                    const pct = limit > 0 ? Math.round((remaining / limit) * 100) : 0
                    return (
                      <tr
                        key={c.id}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3 group">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {c.name[0]}
                            </div>
                            <span className="text-sm font-medium group-hover:text-blue-400 transition-colors">{c.name}</span>
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-400">{plan.label}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusColors[c.setupStatus] ?? statusColors.NEW}`}>
                            {c.setupStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-300">{c._count.members}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-300">{c._count.leads}</td>
                        <td className="px-5 py-3.5">
                          {c._count.approvalRequests > 0 ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 font-medium">
                              {c._count.approvalRequests}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {limit > 0 ? (
                            <>
                              <div className="text-xs text-slate-300">{remaining.toLocaleString()} / {limit.toLocaleString()}</div>
                              <div className="h-1 rounded-full bg-slate-800 mt-1 w-20">
                                <div
                                  className={`h-1 rounded-full ${pct < 20 ? "bg-red-500" : "bg-blue-500"}`}
                                  style={{ width: `${Math.min(100, pct)}%` }}
                                />
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600">Not set</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-sm font-medium text-emerald-400">
                          {c.setupStatus === "LIVE" ? `$${plan.monthlyPrice.toLocaleString()}/mo` : <span className="text-slate-600 font-normal text-xs">Not live</span>}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(c.createdAt)}</td>
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/admin/customers/${c.id}`}
                            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                          >
                            Manage <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
