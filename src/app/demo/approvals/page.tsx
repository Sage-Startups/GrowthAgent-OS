"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { demoApprovals, demoCompany } from "@/lib/demo-data"
import {
  CheckSquare, CheckCircle, XCircle, ChevronDown, ChevronUp,
  ArrowRight, Sparkles, Bot,
} from "lucide-react"

type Decision = "approved" | "rejected"

export default function DemoApprovalsPage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({})
  const [expanded, setExpanded] = useState<string | null>(demoApprovals[0].id)

  const remaining = demoApprovals.filter((a) => !decisions[a.id]).length
  const allDone = remaining === 0

  const decide = (id: string, decision: Decision) => {
    setDecisions((prev) => ({ ...prev, [id]: decision }))
    const next = demoApprovals.find((a) => a.id !== id && !decisions[a.id] && !(a.id === id))
    setExpanded(next?.id ?? null)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2.5">
          Approve Work
          {remaining > 0 && (
            <Badge className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs">{remaining} pending</Badge>
          )}
        </h1>
        <p className="text-slate-400 mt-1">
          Everything {demoCompany.employeeName} prepares waits here for your sign-off. Nothing is sent without you. Go ahead — approve something.
        </p>
      </div>

      {allDone && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-1">Inbox zero. That took about 60 seconds.</h2>
            <p className="text-sm text-slate-400 mb-4 max-w-md mx-auto">
              That&apos;s the whole job of owning an AI employee: {demoCompany.employeeName} does the research, scoring,
              drafting and follow-up — you review and approve, from anywhere.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="gradient" asChild>
                <Link href="/signup">Build Your AI Team <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/demo/chat">Chat with {demoCompany.employeeName} <Bot className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {demoApprovals.map((approval) => {
          const decision = decisions[approval.id]
          const isOpen = expanded === approval.id
          return (
            <Card
              key={approval.id}
              className={
                decision === "approved" ? "border-emerald-500/30 bg-emerald-500/5" :
                decision === "rejected" ? "border-red-500/30 bg-red-500/5 opacity-70" :
                "border-slate-800"
              }
            >
              <CardContent className="p-5">
                <button
                  className="flex items-start justify-between w-full text-left gap-3"
                  onClick={() => setExpanded(isOpen ? null : approval.id)}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      decision === "approved" ? "bg-emerald-500/15" :
                      decision === "rejected" ? "bg-red-500/15" :
                      "bg-violet-500/15"
                    }`}>
                      {decision === "approved" ? <CheckCircle className="h-4 w-4 text-emerald-400" /> :
                       decision === "rejected" ? <XCircle className="h-4 w-4 text-red-400" /> :
                       <CheckSquare className="h-4 w-4 text-violet-400" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{approval.title}</span>
                        <Badge variant="outline" className="text-xs text-slate-400">{approval.type}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{approval.summary}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{approval.lead}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500 shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 mt-1" />}
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-lg border border-slate-700/50 bg-slate-950/60 p-4">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{approval.content}</pre>
                    </div>

                    {decision ? (
                      <div className={`rounded-lg border p-3 text-sm ${
                        decision === "approved"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-red-500/30 bg-red-500/10 text-red-300"
                      }`}>
                        {decision === "approved"
                          ? <>✓ Approved. {approval.whatHappensNext}</>
                          : <>✕ Rejected. {demoCompany.employeeName} will redraft it with your feedback and resubmit for approval.</>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button variant="gradient" size="sm" onClick={() => decide(approval.id, "approved")}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => decide(approval.id, "rejected")}>
                          <XCircle className="h-3.5 w-3.5 mr-1.5" /> Reject
                        </Button>
                        <span className="text-xs text-slate-500 ml-2 hidden sm:block">
                          In the live product you can also approve by email or from your phone.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!allDone && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          This is sample data — approving here doesn&apos;t send anything. It just shows you the workflow.
        </div>
      )}
    </div>
  )
}
