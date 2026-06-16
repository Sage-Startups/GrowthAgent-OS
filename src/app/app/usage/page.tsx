import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gauge, Info } from "lucide-react"
import { getCompanyUsage } from "@/lib/usage-service"
import { getPlanLimits } from "@/lib/plans"

export default async function UsagePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
  })
  if (!membership) redirect("/app/onboarding")

  const companyId = membership.companyId
  const usage = await getCompanyUsage(companyId)
  const limits = getPlanLimits(usage.planName)

  const recentActivity = await prisma.creditLedger.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  const creditPct = limits.monthlyCreditLimit > 0
    ? Math.min(100, Math.round((usage.creditsUsedThisCycle / limits.monthlyCreditLimit) * 100))
    : 0

  const resetDate = usage.billingCycleEnd.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const featureRows = [
    {
      label: "Leads sourced",
      used: usage.leadsSourcedThisCycle,
      limit: limits.maxLeadsPerMonth,
    },
    {
      label: "Reply drafts",
      used: usage.repliesDraftedThisCycle,
      limit: limits.maxRepliesPerMonth,
    },
    {
      label: "Call briefs",
      used: usage.callBriefsThisCycle,
      limit: limits.maxCallBriefsPerMonth,
    },
    {
      label: "Voice minutes",
      used: usage.voiceMinutesThisCycle,
      limit: limits.maxVoiceMinutesPerMonth,
    },
  ]

  function actionLabel(actionType: string): string {
    const labels: Record<string, string> = {
      lead_scored: "Lead qualified",
      personalised_reply_draft: "Reply drafted",
      follow_up_draft: "Follow-up drafted",
      call_brief: "Call brief generated",
      proposal_draft: "Proposal drafted",
      competitor_check: "Competitor check",
      weekly_report: "Weekly report",
      manual_agent_instruction: "Agent instruction",
      basic_lead_found: "Lead found",
      deep_lead_research: "Deep research",
      contact_enrichment: "Contact enriched",
      voice_minute: "Voice call",
      refund: "Credits refunded",
      admin_add: "Credits added",
      admin_remove: "Credits removed",
      cycle_reset: "Monthly reset",
    }
    return labels[actionType] ?? actionType
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gauge className="h-6 w-6 text-blue-400" />
          Monthly Work Allowance
        </h1>
        <p className="text-slate-400 mt-1">Track how your AI employee is spending its work capacity this cycle.</p>
      </div>

      {/* Credits card */}
      <Card className="border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">AI Work Credits</CardTitle>
            <Badge variant="outline" className="capitalize text-slate-300">{usage.planName}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-slate-800/50 p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{usage.creditsRemaining.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Remaining</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4 text-center">
              <div className="text-3xl font-bold">{usage.creditsUsedThisCycle.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Used this cycle</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4 text-center">
              <div className="text-3xl font-bold text-slate-300">{limits.monthlyCreditLimit.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Monthly total</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>{creditPct}% used</span>
              <span>Resets {resetDate}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800">
              <div
                className={`h-3 rounded-full transition-all ${creditPct >= 90 ? "bg-red-500" : creditPct >= 70 ? "bg-yellow-500" : "bg-blue-500"}`}
                style={{ width: `${creditPct}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature limits table */}
      <Card className="border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Feature Limits</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {["Feature", "Used this cycle", "Monthly limit", "Remaining", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureRows.map((row) => {
                const pct = row.limit > 0 ? Math.min(100, Math.round((row.used / row.limit) * 100)) : 0
                const remaining = Math.max(0, row.limit - row.used)
                return (
                  <tr key={row.label} className="border-b border-slate-800/50">
                    <td className="px-5 py-3 text-sm font-medium">{row.label}</td>
                    <td className="px-5 py-3 text-sm text-slate-300">{row.used.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{row.limit.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm text-slate-300">{remaining.toLocaleString()}</td>
                    <td className="px-5 py-3 w-32">
                      <div className="h-1.5 rounded-full bg-slate-800">
                        <div
                          className={`h-1.5 rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-blue-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card className="border-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentActivity.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">
              No credit activity yet. Activity will appear here once your AI employee starts working.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Action", "Credits", "Balance after", "Date"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-800/50">
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium">{actionLabel(entry.actionType)}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">{entry.description}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-medium ${entry.creditsChanged > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {entry.creditsChanged > 0 ? "+" : ""}{entry.creditsChanged}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-300">{entry.balanceAfter.toLocaleString()}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {entry.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Info box */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300">
          Your AI employee uses <strong className="text-white">AI Work Credits</strong> when completing tasks such as qualifying leads,
          drafting replies, preparing call briefs, and generating reports. Viewing saved results does not use credits.
          Credits reset each billing cycle. Larger or more complex tasks use more credits. Upgrade your plan to increase
          your monthly allowance.
        </p>
      </div>
    </div>
  )
}
