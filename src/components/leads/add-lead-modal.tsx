"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addLead } from "@/app/actions/leads"
import { useRouter } from "next/navigation"

type Props = {
  open: boolean
  onClose: () => void
}

export function AddLeadModal({ open, onClose }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", email: "", phone: "", companyName: "",
    website: "", source: "", message: "", estimatedValue: "", notes: "",
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await addLead({
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      companyName: form.companyName || undefined,
      website: form.website || undefined,
      source: form.source || undefined,
      message: form.message || undefined,
      estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : undefined,
      notes: form.notes || undefined,
    })

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      onClose()
      setForm({ name: "", email: "", phone: "", companyName: "", website: "", source: "", message: "", estimatedValue: "", notes: "" })
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Sarah Chen" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="sarah@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+44 7700 900000" />
            </div>
            <div className="space-y-1.5">
              <Label>Company Name</Label>
              <Input value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="Acme Ltd" />
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input value={form.website} onChange={e => set("website", e.target.value)} placeholder="acme.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Input value={form.source} onChange={e => set("source", e.target.value)} placeholder="Website form, Referral..." />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Estimated Value (£)</Label>
              <Input type="number" value={form.estimatedValue} onChange={e => set("estimatedValue", e.target.value)} placeholder="5000" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Enquiry Message</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.message}
              onChange={e => set("message", e.target.value)}
              placeholder="What did they enquire about?"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Internal Notes</Label>
            <textarea
              className="flex min-h-[60px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Optional notes..."
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="gradient" disabled={loading}>
              {loading ? "Adding..." : "Add Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
