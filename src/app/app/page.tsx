import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users, TrendingUp, Flame, Thermometer, Clock, DollarSign,
  CheckSquare, Zap, Bot, ArrowRight, Star, Bell
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const mockStats = {
  totalLeads: 47,
  newThisWeek: 6,
  hotLeads: 8,
  warmLeads: 14,
  followUpsDue: 5,
  pipelineValue: 84500,
  agentTasksCompleted: 23,
  pendingApprovals: 3,
}

const mockBriefing = {
  bestLead: { name: "Sarah Chen", company: "Fintech Agency Ltd", score: "HOT", value: 12000 },
  followUps: ["Marcus Webb – Fintech Agency", "Tom Rigby – BuilderCo", "Priya Sharma – SaaS Startup"],
  draftsPending: ["Reply to Sarah Chen enquiry", "Follow-up for Marcus Webb"],
  suggestion: "You have 3 HOT leads with no follow-up scheduled. Book discovery calls this week to capitalise.",
}

const statCards = [
  { label: "Total Leads", value: mockStats.totalLeads, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "New This Week", value: mockStats.newThisWeek, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Hot Leads", value: mockStats.hotLeads, icon: Flame, color: "text-red-400", bg: "bg-red-400/10" },
  { label: "Warm Leads", value: mockStats.warmLeads, icon: Thermometer, color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Follow-Ups Due", value: mockStats.followUpsDue, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { label: "Pipeline Value", value: formatCurrency(mockStats.pipelineValue), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Agent Tasks Done", value: mockStats.agentTasksCompleted, icon: Zap, color: "text-violet-400", bg: "bg-violet-400/10" },
  { label: "Pending Approvals", value: mockStats.pendingApprovals, icon: CheckSquare, color: "text-yellow-400", bg: "bg-yellow-400/10" },
]

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Good morning, {session?.user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-slate-400 mt-1">Here is your sales pipeline overview for today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Agent Briefing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Today&apos;s Agent Briefing</h2>
            <Badge className="ml-auto text-xs border-blue-500/30 bg-blue-500/10 text-blue-400">AI Generated</Badge>
          </div>

          {/* Best lead */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {mockBriefing.bestLead.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{mockBriefing.bestLead.name}</span>
                    <Badge variant="hot" className="text-xs">HOT</Badge>
                    <Star className="h-3.5 w-3.5 text-yellow-400 ml-auto" />
                  </div>
                  <p className="text-xs text-slate-400">{mockBriefing.bestLead.company}</p>
                  <p className="text-xs text-emerald-400 font-medium mt-1">Est. value: {formatCurrency(mockBriefing.bestLead.value)}</p>
                  <p className="text-xs text-slate-300 mt-2">🎯 Best lead to chase today. High intent signals detected. Draft reply is ready for your approval.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-ups due */}
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-400" /> Follow-ups needed
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {mockBriefing.followUps.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Draft replies pending */}
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4 text-violet-400" /> Draft replies awaiting approval
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 mb-4">
                {mockBriefing.draftsPending.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" asChild>
                <Link href="/app/approvals">Review approvals <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
              </Button>
            </CardContent>
          </Card>

          {/* Agent suggestion */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-400 mb-1">Agent Insight</p>
                  <p className="text-sm text-slate-300">{mockBriefing.suggestion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: "/app/leads", label: "View all leads", icon: Users, color: "text-blue-400" },
              { href: "/app/approvals", label: "Review approvals", icon: CheckSquare, color: "text-yellow-400", badge: mockStats.pendingApprovals },
              { href: "/app/agent", label: "Chat with agent", icon: Bot, color: "text-violet-400" },
              { href: "/app/reports", label: "View reports", icon: TrendingUp, color: "text-emerald-400" },
              { href: "/app/settings", label: "Settings", icon: Zap, color: "text-slate-400" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm hover:border-slate-700 hover:bg-slate-800/60 transition-all group"
              >
                <action.icon className={`h-4 w-4 ${action.color}`} />
                <span className="flex-1">{action.label}</span>
                {action.badge ? (
                  <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">{action.badge}</span>
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                )}
              </Link>
            ))}
          </div>

          {/* Pipeline summary */}
          <Card className="border-slate-800 mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pipeline Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {[
                { label: "Hot", count: 8, color: "bg-red-400", pct: 17 },
                { label: "Warm", count: 14, color: "bg-orange-400", pct: 30 },
                { label: "Cold", count: 12, color: "bg-blue-400", pct: 26 },
                { label: "Qualified", count: 13, color: "bg-emerald-400", pct: 27 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-slate-300">{item.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800">
                    <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
