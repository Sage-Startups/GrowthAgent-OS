import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, XCircle, Clock, Zap } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

const mockAgentRuns = [
  {
    id: "1",
    agentName: "Lead Research Agent",
    company: "Fintech Agency Ltd",
    status: "completed",
    lead: "Sarah Chen",
    durationMs: 4230,
    type: "LEAD_RESEARCH",
    createdAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "2",
    agentName: "Lead Scoring Engine",
    company: "Fintech Agency Ltd",
    status: "completed",
    lead: "Sarah Chen",
    durationMs: 890,
    type: "LEAD_SCORING",
    createdAt: new Date(Date.now() - 4 * 60000),
  },
  {
    id: "3",
    agentName: "Reply Drafter",
    company: "Fintech Agency Ltd",
    status: "completed",
    lead: "Sarah Chen",
    durationMs: 3100,
    type: "DRAFT_REPLY",
    createdAt: new Date(Date.now() - 3 * 60000),
  },
  {
    id: "4",
    agentName: "Lead Research Agent",
    company: "SaaS Launch HQ",
    status: "completed",
    lead: "Natasha Brown",
    durationMs: 5200,
    type: "LEAD_RESEARCH",
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "5",
    agentName: "Follow-Up Agent",
    company: "BuilderBrand Co",
    status: "failed",
    lead: "Marcus Webb",
    durationMs: 1200,
    type: "FOLLOW_UP",
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: "6",
    agentName: "Lead Scoring Engine",
    company: "Agency X",
    status: "running",
    lead: "Tom Rigby",
    durationMs: null as number | null,
    type: "LEAD_SCORING",
    createdAt: new Date(Date.now() - 60000),
  },
  {
    id: "7",
    agentName: "Call Prep Agent",
    company: "Consulting DG",
    status: "completed",
    lead: "David Kim",
    durationMs: 7800,
    type: "CALL_PREP",
    createdAt: new Date(Date.now() - 60 * 60000),
  },
]

const typeColors: Record<string, string> = {
  LEAD_RESEARCH: "text-blue-400 bg-blue-400/10",
  LEAD_SCORING: "text-violet-400 bg-violet-400/10",
  DRAFT_REPLY: "text-orange-400 bg-orange-400/10",
  FOLLOW_UP: "text-yellow-400 bg-yellow-400/10",
  CALL_PREP: "text-emerald-400 bg-emerald-400/10",
}

export default function AdminAgentRunsPage() {
  const completed = mockAgentRuns.filter((r) => r.status === "completed").length
  const failed = mockAgentRuns.filter((r) => r.status === "failed").length
  const running = mockAgentRuns.filter((r) => r.status === "running").length
  const runsWithDuration = mockAgentRuns.filter((r) => r.durationMs)
  const avgDuration = Math.round(
    runsWithDuration.reduce((a, r) => a + (r.durationMs ?? 0), 0) /
      runsWithDuration.length /
      1000
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Agent Runs</h1>
        <p className="text-slate-400 mt-1">All agent execution logs across the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Completed", value: completed, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Failed", value: failed, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
          { label: "Running", value: running, icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Avg Duration", value: `${avgDuration}s`, icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
        ].map((s) => (
          <Card key={s.label} className="border-slate-800">
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-800">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" /> Recent Agent Runs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Agent", "Type", "Company", "Lead", "Status", "Duration", "Time"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockAgentRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium">{run.agentName}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                          typeColors[run.type] ?? "text-slate-400 bg-slate-400/10"
                        }`}
                      >
                        {run.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{run.company}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-300">{run.lead}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          run.status === "completed"
                            ? "text-emerald-400"
                            : run.status === "failed"
                            ? "text-red-400"
                            : "text-blue-400"
                        }`}
                      >
                        {run.status === "completed" && <CheckCircle className="h-3.5 w-3.5" />}
                        {run.status === "failed" && <XCircle className="h-3.5 w-3.5" />}
                        {run.status === "running" && <Clock className="h-3.5 w-3.5 animate-spin" />}
                        {run.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {formatRelativeTime(run.createdAt)}
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
