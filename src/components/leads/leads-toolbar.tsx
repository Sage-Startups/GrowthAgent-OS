"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Sparkles } from "lucide-react"
import { AddLeadModal } from "./add-lead-modal"
import { loadDemoLeads } from "@/app/actions/leads"

export function LeadsToolbar({ totalCount }: { totalCount: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [, startTransition] = useTransition()

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleLoadDemo = async () => {
    setLoadingDemo(true)
    await loadDemoLeads()
    setLoadingDemo(false)
    startTransition(() => router.refresh())
  }

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search leads..."
            className="pl-9"
            defaultValue={searchParams.get("q") ?? ""}
            onChange={e => updateParam("q", e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-ring"
          value={searchParams.get("status") ?? ""}
          onChange={e => updateParam("status", e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="HOT">Hot</option>
          <option value="WARM">Warm</option>
          <option value="COLD">Cold</option>
          <option value="BAD_FIT">Bad Fit</option>
          <option value="FOLLOW_UP_DUE">Follow-up Due</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="CALL_BOOKED">Call Booked</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </select>
        <select
          className="rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-ring"
          value={searchParams.get("sort") ?? "newest"}
          onChange={e => updateParam("sort", e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="score">Highest score</option>
          <option value="value">Highest value</option>
        </select>
        <div className="ml-auto flex gap-2">
          {totalCount === 0 && (
            <Button variant="outline" size="sm" onClick={handleLoadDemo} disabled={loadingDemo}>
              <Sparkles className="h-4 w-4 mr-1.5" />
              {loadingDemo ? "Loading..." : "Load Demo Leads"}
            </Button>
          )}
          <Button variant="gradient" size="sm" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Lead
          </Button>
        </div>
      </div>
      <AddLeadModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
