"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { qualifyLead, regenerateReply, createFollowUp, prepareSalesCall, updateLeadStatus } from "@/app/actions/leads"
import { Zap, MessageSquare, Calendar, Phone, ChevronDown, CheckCircle, XCircle } from "lucide-react"

type Props = {
  leadId: string
  currentStatus: string
  scoreBand: string | null
}

export function LeadActions({ leadId, currentStatus, scoreBand }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [followUpDays, setFollowUpDays] = useState("3")
  const [customDate, setCustomDate] = useState("")

  const run = async (action: string, fn: () => Promise<any>) => {
    setLoading(action)
    await fn()
    setLoading(null)
    router.refresh()
  }

  const handleFollowUp = async () => {
    setLoading("followup")
    const days = customDate ? 0 : Number(followUpDays)
    await createFollowUp(leadId, days, customDate || undefined)
    setLoading(null)
    setShowFollowUp(false)
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="gradient"
          size="sm"
          onClick={() => run("qualify", () => qualifyLead(leadId))}
          disabled={loading === "qualify"}
        >
          <Zap className="h-3.5 w-3.5 mr-1.5" />
          {loading === "qualify" ? "Running..." : "Run Qualification"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => run("reply", () => regenerateReply(leadId))}
          disabled={loading === "reply"}
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
          {loading === "reply" ? "Generating..." : "Generate Reply"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFollowUp(true)}
        >
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          Follow-Up
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => run("call", () => prepareSalesCall(leadId))}
          disabled={loading === "call"}
        >
          <Phone className="h-3.5 w-3.5 mr-1.5" />
          {loading === "call" ? "Preparing..." : "Call Brief"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Status <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => run("status", () => updateLeadStatus(leadId, "QUALIFIED"))}>
              <CheckCircle className="h-3.5 w-3.5 mr-2 text-emerald-400" /> Mark Qualified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => run("status", () => updateLeadStatus(leadId, "CALL_BOOKED"))}>
              <Phone className="h-3.5 w-3.5 mr-2 text-blue-400" /> Call Booked
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => run("status", () => updateLeadStatus(leadId, "WON"))} className="text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5 mr-2" /> Mark Won
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => run("status", () => updateLeadStatus(leadId, "LOST"))} className="text-red-400">
              <XCircle className="h-3.5 w-3.5 mr-2" /> Mark Lost
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showFollowUp} onOpenChange={setShowFollowUp}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Schedule Follow-Up</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Follow up in</Label>
              <div className="flex gap-2 flex-wrap">
                {[["1", "Tomorrow"], ["2", "2 days"], ["3", "3 days"], ["7", "1 week"]].map(([days, label]) => (
                  <button
                    key={days}
                    onClick={() => { setFollowUpDays(days); setCustomDate("") }}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${followUpDays === days && !customDate ? "border-blue-500 bg-blue-500/20 text-blue-400" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Or pick a date</Label>
              <Input type="date" value={customDate} onChange={e => { setCustomDate(e.target.value); setFollowUpDays("") }} className="text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFollowUp(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleFollowUp} disabled={loading === "followup" || (!followUpDays && !customDate)}>
              {loading === "followup" ? "Scheduling..." : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
