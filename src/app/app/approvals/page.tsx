"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Edit3, Clock, FileText, Mail, Phone, ArrowUpDown, CheckSquare } from "lucide-react"
import { getStatusColor } from "@/lib/utils"

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED"

type Approval = {
  id: string
  type: string
  title: string
  description: string
  proposedAction: string
  leadName: string
  companyName: string
  status: ApprovalStatus
  createdAt: Date
}

const initialApprovals: Approval[] = [
  {
    id: "1", type: "DRAFT_EMAIL", title: "Reply to Sarah Chen enquiry",
    description: "Personalised reply to a HOT lead from Fintech Agency Ltd.",
    proposedAction: "Send a personalised follow-up email to Sarah Chen referencing her company growth and proposing a 20-minute demo call.",
    leadName: "Sarah Chen", companyName: "Fintech Agency Ltd",
    status: "PENDING", createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "2", type: "CRM_STATUS_CHANGE", title: "Update Marcus Webb to FOLLOW_UP_DUE",
    description: "Marcus Webb has not replied in 4 days. Agent recommends status change.",
    proposedAction: "Change lead status from WARM to FOLLOW_UP_DUE and schedule a follow-up reminder for tomorrow at 9am.",
    leadName: "Marcus Webb", companyName: "BuilderBrand Co",
    status: "PENDING", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3", type: "DRAFT_EMAIL", title: "Follow-up for Tom Rigby",
    description: "Tom requested pricing info 7 days ago. Agent has drafted a follow-up.",
    proposedAction: "Send a follow-up email to Tom Rigby referencing his interest in pricing and offering a personalised breakdown call.",
    leadName: "Tom Rigby", companyName: "Agency X",
    status: "PENDING", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "4", type: "CALL_SCRIPT", title: "Call script for Priya Sharma",
    description: "Discovery call with Priya booked for tomorrow. Agent has prepared a call brief.",
    proposedAction: "Activate call script with pain-point framework for SaaS businesses, including competitive positioning against HubSpot.",
    leadName: "Priya Sharma", companyName: "SaaS Launch HQ",
    status: "APPROVED", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

const typeIcons: Record<string, React.ElementType> = {
  DRAFT_EMAIL: Mail, CRM_STATUS_CHANGE: ArrowUpDown, FOLLOW_UP: Clock,
  CALL_SCRIPT: Phone, PROPOSAL_OUTLINE: FileText,
}

const typeLabels: Record<string, string> = {
  DRAFT_EMAIL: "Draft Email", CRM_STATUS_CHANGE: "CRM Update",
  FOLLOW_UP: "Follow-Up", CALL_SCRIPT: "Call Script", PROPOSAL_OUTLINE: "Proposal",
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals)
  const [filter, setFilter] = useState<"ALL" | ApprovalStatus>("ALL")

  const act = (id: string, status: "APPROVED" | "REJECTED") => {
    setApprovals((prev) =>
      prev.map((a) => a.id === id ? { ...a, status } : a)
    )
  }

  const filtered = filter === "ALL" ? approvals : approvals.filter((a) => a.status === filter)
  const pending = approvals.filter((a) => a.status === "PENDING").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Approval Queue</h1>
          <p className="text-slate-400 mt-1">Review and approve agent-proposed actions before they execute</p>
        </div>
        {pending > 0 && (
          <Badge className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 px-3 py-1">
            <Clock className="h-3.5 w-3.5 mr-1.5" /> {pending} pending
          </Badge>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            {f === "PENDING" && pending > 0 && (
              <span className="ml-1.5 bg-yellow-400 text-slate-900 text-xs px-1.5 py-0.5 rounded-full font-bold">{pending}</span>
            )}
          </button>
        ))}
      </div>

      {/* Approval cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <CheckSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No {filter === "ALL" ? "" : filter.toLowerCase()} approvals</p>
          </div>
        )}
        {filtered.map((approval) => {
          const Icon = typeIcons[approval.type] ?? FileText
          return (
            <Card key={approval.id} className={`border-slate-800 transition-all ${approval.status === "PENDING" ? "border-yellow-500/20 bg-yellow-500/5" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm">{approval.title}</span>
                      <Badge variant="outline" className="text-xs">{typeLabels[approval.type]}</Badge>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ml-auto ${getStatusColor(approval.status)}`}>
                        {approval.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Lead: <span className="text-slate-300">{approval.leadName}</span> · {approval.companyName}
                    </p>
                    <p className="text-sm text-slate-300 mb-3">{approval.description}</p>
                    <div className="rounded-lg bg-slate-900/60 border border-slate-700/50 p-3 mb-4">
                      <p className="text-xs font-semibold text-slate-400 mb-1">Proposed action:</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{approval.proposedAction}</p>
                    </div>
                    {approval.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="gradient" onClick={() => act(approval.id, "APPROVED")}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Edit First
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => act(approval.id, "REJECTED")}>
                          <XCircle className="h-3.5 w-3.5 mr-1.5" /> Reject
                        </Button>
                      </div>
                    )}
                    {approval.status === "APPROVED" && (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                        <CheckCircle className="h-3.5 w-3.5" /> Approved
                      </div>
                    )}
                    {approval.status === "REJECTED" && (
                      <div className="flex items-center gap-1.5 text-red-400 text-xs">
                        <XCircle className="h-3.5 w-3.5" /> Rejected
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
