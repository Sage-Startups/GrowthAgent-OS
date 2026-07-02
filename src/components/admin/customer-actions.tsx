"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  adjustCompanyCredits,
  setCompanySetupStatus,
  setEmployeePaused,
  setCompanyPlan,
  addCustomerNote,
} from "@/app/actions/admin"
import { Pause, Play, Coins, StickyNote } from "lucide-react"

const SETUP_STATUSES = ["NEW", "ONBOARDING", "CONFIGURING", "TESTING", "LIVE", "PAUSED"]
const PLAN_OPTIONS = ["AI Sales Assistant", "AI Sales Team", "Full AI Revenue OS"]

type ActionResult = { success?: boolean; error?: string } | undefined

export function CustomerActions({
  companyId,
  currentStatus,
  currentPlan,
  employeePaused,
}: {
  companyId: string
  currentStatus: string
  currentPlan: string
  employeePaused: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; msg: string } | null>(null)
  const [creditAmount, setCreditAmount] = useState("")
  const [creditReason, setCreditReason] = useState("")
  const [note, setNote] = useState("")

  const run = (fn: () => Promise<ActionResult>, okMsg: string) => {
    setFeedback(null)
    startTransition(async () => {
      try {
        const result = await fn()
        if (result?.error) setFeedback({ type: "err", msg: result.error })
        else setFeedback({ type: "ok", msg: okMsg })
      } catch {
        setFeedback({ type: "err", msg: "Something went wrong" })
      }
    })
  }

  return (
    <div className="space-y-5">
      {feedback && (
        <div
          className={`rounded-lg border p-3 text-sm text-center ${
            feedback.type === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Pause / resume employee */}
      <div className="flex items-center justify-between rounded-lg border border-slate-700/50 p-4">
        <div>
          <div className="text-sm font-medium">AI Employee</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {employeePaused ? "Paused — no agent work will run" : "Working — agents active on this account"}
          </div>
        </div>
        <Button
          variant={employeePaused ? "gradient" : "outline"}
          size="sm"
          disabled={isPending}
          onClick={() =>
            run(
              () => setEmployeePaused(companyId, !employeePaused),
              employeePaused ? "AI employee resumed" : "AI employee paused"
            )
          }
        >
          {employeePaused ? (
            <><Play className="h-3.5 w-3.5 mr-1.5" /> Resume</>
          ) : (
            <><Pause className="h-3.5 w-3.5 mr-1.5" /> Pause</>
          )}
        </Button>
      </div>

      {/* Setup status */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Setup status</Label>
        <select
          className="flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          defaultValue={currentStatus}
          disabled={isPending}
          onChange={(e) => run(() => setCompanySetupStatus(companyId, e.target.value), `Status set to ${e.target.value}`)}
        >
          {SETUP_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Plan */}
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-400">Plan</Label>
        <select
          className="flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          defaultValue={PLAN_OPTIONS.includes(currentPlan) ? currentPlan : PLAN_OPTIONS[0]}
          disabled={isPending}
          onChange={(e) => run(() => setCompanyPlan(companyId, e.target.value), `Plan changed to ${e.target.value}`)}
        >
          {PLAN_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500">Changing the plan re-applies its credit and agent limits.</p>
      </div>

      {/* Credit adjustment */}
      <div className="space-y-2 rounded-lg border border-slate-700/50 p-4">
        <div className="text-sm font-medium flex items-center gap-2">
          <Coins className="h-4 w-4 text-yellow-400" /> Adjust AI Work Credits
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="e.g. 500 or -100"
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
          />
          <Input
            placeholder="Reason (required)"
            value={creditReason}
            onChange={(e) => setCreditReason(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={isPending || !creditAmount || !creditReason.trim()}
          onClick={() =>
            run(async () => {
              const result = await adjustCompanyCredits(companyId, Number(creditAmount), creditReason)
              if (result?.success) {
                setCreditAmount("")
                setCreditReason("")
              }
              return result
            }, "Credits adjusted")
          }
        >
          Apply adjustment
        </Button>
      </div>

      {/* Internal note */}
      <div className="space-y-2 rounded-lg border border-slate-700/50 p-4">
        <div className="text-sm font-medium flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-violet-400" /> Internal note
        </div>
        <textarea
          className="flex min-h-[70px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Only visible to admins — e.g. tuning changes, client conversations..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={isPending || !note.trim()}
          onClick={() =>
            run(async () => {
              const result = await addCustomerNote(companyId, note)
              if (result?.success) setNote("")
              return result
            }, "Note saved")
          }
        >
          Save note
        </Button>
      </div>
    </div>
  )
}
