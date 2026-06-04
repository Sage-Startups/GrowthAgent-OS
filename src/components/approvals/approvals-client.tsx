"use client"

import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Edit3, Clock, FileText, Mail, Phone, ArrowUpDown, CheckSquare, Zap, BookOpen, Users, Download, Globe } from "lucide-react"
import { getStatusColor, formatRelativeTime } from "@/lib/utils"
import { approveRequest, rejectRequest } from "@/app/actions/approvals"
import { useToast } from "@/components/ui/use-toast"

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED"

type Approval = {
  id: string
  type: string
  title: string
  description: string | null
  proposedAction: string
  leadName: string | null
  leadCompanyName: string | null
  leadId: string | null
  status: ApprovalStatus
  createdAt: Date
}

const typeIcons: Record<string, React.ElementType> = {
  DRAFT_EMAIL: Mail,
  CRM_STATUS_CHANGE: ArrowUpDown,
  FOLLOW_UP: Clock,
  CALL_SCRIPT: Phone,
  PROPOSAL_OUTLINE: FileText,
  SEND_EMAIL: Mail,
  BOOK_CALL: Phone,
  SEND_PROPOSAL: FileText,
  DELETE_LEAD: XCircle,
  EXPORT_DATA: Download,
  COMPETITOR_RESEARCH: Globe,
  CLIENT_ONBOARDING: Users,
}

const typeLabels: Record<string, string> = {
  DRAFT_EMAIL: "Draft Email",
  CRM_STATUS_CHANGE: "CRM Update",
  FOLLOW_UP: "Follow-Up",
  CALL_SCRIPT: "Call Script",
  PROPOSAL_OUTLINE: "Proposal",
  SEND_EMAIL: "Send Email",
  BOOK_CALL: "Book Call",
  SEND_PROPOSAL: "Send Proposal",
  DELETE_LEAD: "Delete Lead",
  EXPORT_DATA: "Export Data",
  COMPETITOR_RESEARCH: "Competitor Research",
  CLIENT_ONBOARDING: "Client Onboarding",
}

export function ApprovalsClient({ initialApprovals }: { initialApprovals: Approval[] }) {
  const { toast } = useToast()
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals)
  const [filter, setFilter] = useState<"ALL" | ApprovalStatus>("ALL")
  const [pending, startTransition] = useTransition()
  const [actingId, setActingId] = useState<string | null>(null)

  const act = (id: string, action: "APPROVED" | "REJECTED") => {
    setActingId(id)
    startTransition(async () => {
      const result = action === "APPROVED" ? await approveRequest(id) : await rejectRequest(id)
      setActingId(null)
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      } else {
        setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: action } : a))
        toast({ title: action === "APPROVED" ? "Approved" : "Rejected", description: `Action ${action.toLowerCase()} successfully.` })
      }
    })
  }

  const filtered = filter === "ALL" ? approvals : approvals.filter((a) => a.status === filter)
  const pendingCount = approvals.filter((a) => a.status === "PENDING").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Approval Queue</h1>
          <p className="text-slate-400 mt-1">Review and approve agent-proposed actions before they execute</p>
        </div>
        {pendingCount > 0 && (
          <Badge className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 px-3 py-1">
            <Clock className="h-3.5 w-3.5 mr-1.5" /> {pendingCount} pending
          </Badge>
        )}
      </div>

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
            {f === "PENDING" && pendingCount > 0 && (
              <span className="ml-1.5 bg-yellow-400 text-slate-900 text-xs px-1.5 py-0.5 rounded-full font-bold">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <CheckSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No {filter === "ALL" ? "" : filter.toLowerCase()} approvals</p>
          </div>
        )}
        {filtered.map((approval) => {
          const Icon = typeIcons[approval.type] ?? FileText
          const isActing = actingId === approval.id && pending
          return (
            <Card
              key={approval.id}
              className={`border-slate-800 transition-all ${approval.status === "PENDING" ? "border-yellow-500/20 bg-yellow-500/5" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm">{approval.title}</span>
                      <Badge variant="outline" className="text-xs">{typeLabels[approval.type] ?? approval.type}</Badge>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ml-auto ${getStatusColor(approval.status)}`}>
                        {approval.status}
                      </span>
                    </div>
                    {(approval.leadName || approval.leadCompanyName) && (
                      <p className="text-xs text-slate-400 mb-2">
                        Lead: <span className="text-slate-300">{approval.leadName ?? "—"}</span>
                        {approval.leadCompanyName && ` · ${approval.leadCompanyName}`}
                      </p>
                    )}
                    {approval.description && (
                      <p className="text-sm text-slate-300 mb-3">{approval.description}</p>
                    )}
                    <div className="rounded-lg bg-slate-900/60 border border-slate-700/50 p-3 mb-3">
                      <p className="text-xs font-semibold text-slate-400 mb-1">Proposed action:</p>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{approval.proposedAction}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">{formatRelativeTime(approval.createdAt)}</span>
                      {approval.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="gradient"
                            onClick={() => act(approval.id, "APPROVED")}
                            disabled={isActing}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                            {isActing ? "Saving..." : "Approve"}
                          </Button>
                          <Button size="sm" variant="outline" disabled={isActing}>
                            <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Edit First
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={() => act(approval.id, "REJECTED")}
                            disabled={isActing}
                          >
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
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
