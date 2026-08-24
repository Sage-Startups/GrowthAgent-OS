"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { demoRequestSchema, type DemoRequestInput } from "@/lib/validations"
import { CheckCircle, Calendar, Sparkles, ArrowRight } from "lucide-react"

export default function BookDemoPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DemoRequestInput>({
    resolver: zodResolver(demoRequestSchema),
  })

  const onSubmit = async (data: DemoRequestInput) => {
    await new Promise((r) => setTimeout(r, 800))
    console.log("Demo request:", data)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="py-24 min-h-[70vh] flex items-center">
        <div className="container max-w-lg mx-auto text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Request received!</h1>
          <p className="text-slate-400 mb-8">
            Thanks for your interest in Staffgent. We will review your information and reach out within 1 business day to schedule your personalised walkthrough.
          </p>
          <Button variant="outline" asChild>
            <Link href="/demo">Explore the live demo while you wait <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-24">
      <div className="container max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-400">
            <Calendar className="h-3.5 w-3.5 mr-1.5" /> Book a Walkthrough
          </Badge>
          <h1 className="text-4xl font-bold mb-3">Meet your AI employees before you hire them</h1>
          <p className="text-slate-400">
            Tell us about your business and we will show you which Staffgent employee role would take
            the most repetitive work off your team&apos;s plate.
          </p>
          <p className="text-sm text-slate-500 mt-3">
            Prefer to look around first?{" "}
            <Link href="/demo" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Try the live demo workspace
            </Link>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Your name *</Label>
                <Input id="name" placeholder="Alex Johnson" {...register("name")} />
                {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Work email *</Label>
                <Input id="email" type="email" placeholder="alex@company.com" {...register("email")} />
                {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" placeholder="Your company name" {...register("company")} />
                {errors.company && <p className="text-xs text-red-400">{errors.company.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://yoursite.com" {...register("website")} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="leadVolume">Monthly lead volume *</Label>
                <select id="leadVolume" {...register("leadVolume")} className="flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select range</option>
                  <option value="1-10">1–10 leads/month</option>
                  <option value="10-50">10–50 leads/month</option>
                  <option value="50-200">50–200 leads/month</option>
                  <option value="200+">200+ leads/month</option>
                </select>
                {errors.leadVolume && <p className="text-xs text-red-400">{errors.leadVolume.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessType">Business type *</Label>
                <select id="businessType" {...register("businessType")} className="flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select type</option>
                  <option value="agency">Agency</option>
                  <option value="saas">SaaS / Software</option>
                  <option value="consulting">Consulting / Coaching</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="other">Other</option>
                </select>
                {errors.businessType && <p className="text-xs text-red-400">{errors.businessType.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currentCRM">Current CRM (if any)</Label>
              <Input id="currentCRM" placeholder="HubSpot, Pipedrive, Spreadsheet, None..." {...register("currentCRM")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="painPoint">What is your biggest challenge with leads right now? *</Label>
              <textarea
                id="painPoint"
                {...register("painPoint")}
                className="flex min-h-[100px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                placeholder="e.g. Leads go cold before we follow up, we don't know which leads are worth pursuing..."
              />
              {errors.painPoint && <p className="text-xs text-red-400">{errors.painPoint.message}</p>}
            </div>
            <Button type="submit" variant="gradient" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Request My Walkthrough"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
