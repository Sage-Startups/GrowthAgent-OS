import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users, TrendingUp, Flame, Thermometer, Clock, DollarSign,
  CheckSquare, Zap, Bot, ArrowRight, Star, Bell, Gauge, ShieldCheck, Sparkles,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { demoStats, demoCredits, demoLeads, demoActivity, demoApprovals, demoCompany } from "@/lib/demo-data"

export default function DemoOverviewPage() {
  const hotLeads = demoLeads.filter((l) => l.band === "HOT").slice(0, 3)
  const creditPct = Math.round((demoCredits.used / demoCredits.limit) * 100)

  const statCards = [
    { label: "Total Leads", value: demoStats.totalLeads, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "New This Week", value: demoStats.newThisWeek, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Hot Leads", value: demoStats.hotLeads, icon: Flame, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Warm Leads", value: demoStats.warmLeads, icon: Thermometer, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Follow-Ups Due", value: demoStats.followUpsDue, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Pipeline Value", value: formatCurrency(demoStats.pipelineValue), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Tasks Completed", value: demoStats.tasksCompleted, icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Awaiting Your Approval", value: demoStats.pendingApprovals, icon: CheckSquare, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Maya 👋</h1>
          <p className="text-slate-400 mt-1">Here&apos;s what {demoCompany.employeeName} has been working on for you.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-slate-400">Team plan</Badge>
          <Badge className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs">
            <Bell className="h-3 w-3 mr-1" /> 3 approvals
          </Badge>
        </div>
      </div>

      {/* AI Employee status */}
      <Card className="border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/40">
        <CardContent className="p-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold">{demoCompany.employeeName} — AI Sales Employee</span>
                <Badge variant="outline" className="text-xs text-slate-300">On the job</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Working your pipeline right now — researching Vault Insurance Group, 2 replies drafted overnight.
              </p>
            </div>
            <div className="flex items-center gap-5 text-center shrink-0">
              <div>
                <div className="text-lg font-bold">3</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Active agents</div>
              </div>
              <div>
                <div className="text-lg font-bold">{demoStats.tasksCompleted}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Tasks done</div>
              </div>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 shrink-0 border-l border-slate-800 pl-5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Monitored &amp; tuned monthly by our team
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Prepared for your review</h2>
            <Badge className="ml-auto text-xs border-blue-500/30 bg-blue-500/10 text-blue-400">Live</Badge>
          </div>

          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-5">
              <div className="text-xs font-semibold text-red-400 mb-3 flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" /> Top Opportunities
              </div>
              <div className="space-y-3">
                {hotLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white shrink-0">{lead.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.company} · {lead.status}</div>
                    </div>
                    {lead.value && <div className="text-xs font-semibold text-emerald-400 shrink-0">{formatCurrency(lead.value)}</div>}
                    <Button variant="ghost" size="sm" className="text-xs h-6 px-2 shrink-0" asChild>
                      <Link href="/demo/leads">View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Awaiting approvals preview */}
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4 text-violet-400" /> Work awaiting your approval
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 mb-4">
                {demoApprovals.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                    {a.title}
                  </li>
                ))}
              </ul>
              <Button variant="gradient" size="sm" asChild>
                <Link href="/demo/approvals">Try approving them <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
              </Button>
            </CardContent>
          </Card>

          {/* Activity feed */}
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" /> What {demoCompany.employeeName} did while you were away
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-0">
                {demoActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-800/50 last:border-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span className="text-sm text-slate-300 flex-1">{item.text}</span>
                    <span className="text-xs text-slate-600 shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Credits card */}
          <Card className="border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-400" /> AI Work Credits
                <Badge variant="outline" className="ml-auto text-xs text-slate-400">{demoCredits.plan}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{demoCredits.remaining.toLocaleString()} remaining</span>
                  <span className="text-slate-500">{demoCredits.limit.toLocaleString()} total</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${creditPct}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-1">Resets {demoCredits.resets}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-slate-800/50 px-2 py-1.5">
                  <div className="text-xs font-semibold">{demoCredits.leadsSourced}</div>
                  <div className="text-xs text-slate-500">Leads</div>
                </div>
                <div className="rounded-md bg-slate-800/50 px-2 py-1.5">
                  <div className="text-xs font-semibold">{demoCredits.repliesDrafted}</div>
                  <div className="text-xs text-slate-500">Replies</div>
                </div>
                <div className="rounded-md bg-slate-800/50 px-2 py-1.5">
                  <div className="text-xs font-semibold">{demoCredits.callBriefs}</div>
                  <div className="text-xs text-slate-500">Briefs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <h2 className="text-sm font-semibold text-slate-400 px-1">Try it yourself</h2>
          <div className="space-y-2">
            {[
              { href: "/demo/approvals", label: "Approve Ava's work", icon: CheckSquare, color: "text-yellow-400", badge: 3 },
              { href: "/demo/leads", label: "Browse the CRM", icon: Users, color: "text-blue-400" },
              { href: "/demo/chat", label: "Chat with Ava", icon: Bot, color: "text-violet-400" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm hover:border-slate-700 hover:bg-slate-800/60 transition-all group"
              >
                <action.icon className={`h-4 w-4 ${action.color}`} />
                <span className="flex-1">{action.label}</span>
                {"badge" in action && action.badge ? (
                  <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">{action.badge}</span>
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                )}
              </Link>
            ))}
          </div>

          {/* Hire CTA */}
          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-950/60 to-violet-950/40">
            <CardContent className="p-5 text-center">
              <Sparkles className="h-5 w-5 text-blue-400 mx-auto mb-2" />
              <div className="text-sm font-semibold mb-1">This could be your business</div>
              <p className="text-xs text-slate-400 mb-4">
                We build your own {demoCompany.employeeName} around your leads, your tone, and your ideal customer — live in 5–7 days.
              </p>
              <Button variant="gradient" size="sm" className="w-full" asChild>
                <Link href="/signup">Build Your AI Team <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
