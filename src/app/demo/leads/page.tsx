"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { demoLeads, demoCompany, type DemoLead } from "@/lib/demo-data"
import { formatCurrency, cn } from "@/lib/utils"
import { Bot, Search, FileText, Target, MessageSquare, ArrowRight, Sparkles } from "lucide-react"

const bandStyles: Record<DemoLead["band"], string> = {
  HOT: "bg-red-500/15 text-red-400 border-red-500/30",
  WARM: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  COLD: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  BAD_FIT: "bg-slate-500/15 text-slate-400 border-slate-500/30",
}

export default function DemoLeadsPage() {
  const [selectedId, setSelectedId] = useState(demoLeads[0].id)
  const lead = demoLeads.find((l) => l.id === selectedId)!

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leads (CRM)</h1>
        <p className="text-slate-400 mt-1">
          Every lead {demoCompany.employeeName} has captured, researched and scored. Click one to see her work.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Lead list */}
        <div className="lg:col-span-2 space-y-2">
          {demoLeads.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedId(l.id)}
              className={cn(
                "w-full text-left rounded-xl border p-4 transition-all",
                selectedId === l.id
                  ? "border-blue-500/50 bg-blue-600/10"
                  : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {l.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{l.name}</div>
                  <div className="text-xs text-slate-400 truncate">{l.company}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${bandStyles[l.band]}`}>
                    {l.band === "BAD_FIT" ? "BAD FIT" : l.band} {l.score}
                  </span>
                  {l.value && <div className="text-xs text-emerald-400 font-semibold mt-1">{formatCurrency(l.value)}</div>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lead detail */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-slate-800">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold">{lead.name}</h2>
                  <p className="text-sm text-slate-400">{lead.role} · {lead.company}</p>
                  <p className="text-xs text-slate-500 mt-1">Source: {lead.source} · Last activity {lead.lastActivity}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${bandStyles[lead.band]}`}>
                    {lead.band === "BAD_FIT" ? "BAD FIT" : lead.band} · Score {lead.score}
                  </span>
                  {lead.value && <div className="text-sm text-emerald-400 font-bold mt-1.5">{formatCurrency(lead.value)} est.</div>}
                </div>
              </div>
              <Badge variant="outline" className="mt-3 text-xs text-slate-300">{lead.status}</Badge>
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-400" /> {demoCompany.employeeName}&apos;s research
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300 leading-relaxed">{lead.research}</CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-400" /> Pain points
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 leading-relaxed">{lead.painPoints}</CardContent>
            </Card>
            <Card className="border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-violet-400" /> Why this score
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 leading-relaxed">{lead.scoringReason}</CardContent>
            </Card>
          </div>

          {lead.draftReply && (
            <Card className="border-violet-500/20 bg-violet-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-violet-400" /> Draft reply — awaiting your approval
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed mb-4">{lead.draftReply}</pre>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/demo/approvals">Review in approvals <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-slate-800">
            <CardContent className="p-4 flex items-start gap-3">
              <Bot className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-blue-400 mb-0.5">Next action</div>
                <p className="text-sm text-slate-300">{lead.nextAction}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            In your workspace, {demoCompany.employeeName} builds this profile for every lead automatically — usually within minutes of the enquiry arriving.
          </div>
        </div>
      </div>
    </div>
  )
}
