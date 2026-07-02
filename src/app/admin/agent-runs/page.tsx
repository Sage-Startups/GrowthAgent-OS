import Link from "next/link"
import { prisma } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminAgentRunsPage() {
  const runs = await prisma.agentRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      agent: { select: { name: true, type: true, company: { select: { id: true, name: true } } } },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Runs</h1>
        <p className="text-slate-400 mt-1">Every piece of work the AI employees have done, across all customers</p>
      </div>

      {runs.length === 0 ? (
        <Card className="border-slate-800 border-dashed">
          <CardContent className="py-16 text-center">
            <Activity className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <div className="text-sm font-medium mb-1">No agent runs yet</div>
            <p className="text-xs text-slate-500">Runs appear here when customers&apos; AI employees start working.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Agent", "Customer", "Status", "Duration", "Credits", "When"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium">{run.agent.name}</div>
                        <div className="text-xs text-slate-500">{run.agent.type}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/customers/${run.agent.company.id}`} className="text-sm text-slate-300 hover:text-blue-400 transition-colors">
                          {run.agent.company.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${
                          run.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                          run.status === "failed" ? "bg-red-500/15 text-red-400" :
                          "bg-yellow-500/15 text-yellow-400"
                        }`}>
                          {run.status}
                        </span>
                        {run.error && <div className="text-xs text-red-400/80 mt-1 max-w-[240px] truncate">{run.error}</div>}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">
                        {run.durationMs != null ? `${(run.durationMs / 1000).toFixed(1)}s` : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">
                        {run.actualCreditCost ?? run.estimatedCreditCost ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{formatRelativeTime(run.createdAt)}</td>
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
