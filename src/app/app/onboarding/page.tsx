"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { onboardingSchema, type OnboardingInput } from "@/lib/validations"
import { saveOnboarding } from "@/app/actions/auth"
import { Bot, ArrowRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Your Business" },
  { id: 2, title: "Your Customers" },
  { id: 3, title: "Your Setup" },
  { id: 4, title: "Tone & Preferences" },
]

const toneOptions = [
  { value: "Professional and confident", label: "Professional", desc: "Formal, authoritative, trust-building" },
  { value: "Warm and conversational", label: "Friendly", desc: "Approachable, casual, human" },
  { value: "Direct and concise", label: "Direct", desc: "No fluff, efficient, to the point" },
  { value: "Consultative and expert", label: "Premium Consultative", desc: "Thoughtful, advisory, high-touch" },
]

const leadSourceOptions = [
  "Website contact form", "Email enquiries", "LinkedIn",
  "Referrals", "Google Ads", "Cold outreach", "Social media", "Events/conferences",
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedTone, setSelectedTone] = useState("Professional and confident")
  const [agentPrefs, setAgentPrefs] = useState({
    autoDraftReplies: true,
    autoApprovalsForHot: false,
    autoFollowUpSuggestions: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { currentLeadSources: [], averageDealValue: 0 },
  })

  const toggleSource = (s: string) => {
    setSelectedSources((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  const onSubmit = async (data: OnboardingInput) => {
    if (!session?.user?.id) return
    setIsSubmitting(true)
    const approvalNote = agentPrefs.autoApprovalsForHot
      ? "Auto-approve HOT lead actions"
      : "Approve everything manually"
    await saveOnboarding(session.user.id, {
      ...data,
      currentLeadSources: selectedSources,
      toneOfVoice: selectedTone,
      approvalPreference: approvalNote,
    })
    setDone(true)
    setTimeout(() => router.push("/app"), 1500)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Setup complete!</h2>
          <p className="text-slate-400">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[hsl(222_47%_5%)]">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 mx-auto mb-4">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Set up your GrowthAgent</h1>
          <p className="text-slate-400 text-sm">This takes 3 minutes and unlocks your personalised AI operator</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                step > s.id ? "bg-emerald-500 text-white" :
                step === s.id ? "bg-blue-600 text-white" :
                "bg-slate-800 text-slate-500"
              )}>
                {step > s.id ? "✓" : s.id}
              </div>
              <span className={cn("text-xs ml-1.5 hidden sm:block", step === s.id ? "text-white" : "text-slate-500")}>{s.title}</span>
              {i < steps.length - 1 && <div className={cn("flex-1 h-px mx-2", step > s.id ? "bg-emerald-500" : "bg-slate-800")} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur p-6 space-y-5">
            {step === 1 && (
              <>
                <h2 className="text-lg font-semibold">Tell us about your business</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label>Business Name *</Label>
                    <Input placeholder="Your company name" {...register("businessName")} />
                    {errors.businessName && <p className="text-xs text-red-400">{errors.businessName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Website</Label>
                    <Input placeholder="https://yoursite.com" {...register("website")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Business Type *</Label>
                    <select className="flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" {...register("businessType")}>
                      <option value="">Select type</option>
                      <option>Agency</option>
                      <option>SaaS / Software</option>
                      <option>Consulting / Coaching</option>
                      <option>E-commerce</option>
                      <option>Other</option>
                    </select>
                    {errors.businessType && <p className="text-xs text-red-400">{errors.businessType.message}</p>}
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label>Main Offer *</Label>
                    <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="What do you sell? Be specific." {...register("mainOffer")} />
                    {errors.mainOffer && <p className="text-xs text-red-400">{errors.mainOffer.message}</p>}
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label>Average Deal Value ($)</Label>
                    <Input type="number" placeholder="5000" {...register("averageDealValue", { valueAsNumber: true })} />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-semibold">Who are your best customers?</h2>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Ideal Customer Profile *</Label>
                    <textarea className="flex min-h-[90px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Describe your best-fit customer: industry, size, revenue, goals..." {...register("idealCustomerProfile")} />
                    {errors.idealCustomerProfile && <p className="text-xs text-red-400">{errors.idealCustomerProfile.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bad-Fit Traits</Label>
                    <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Who should the agent flag as a bad fit? e.g. no budget, wrong industry..." {...register("badFitTraits")} />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-semibold">Your current setup</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current lead sources (select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {leadSourceOptions.map((source) => (
                        <button
                          key={source}
                          type="button"
                          onClick={() => toggleSource(source)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-xs text-left transition-all",
                            selectedSources.includes(source)
                              ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                              : "border-slate-700/50 bg-slate-800/40 text-slate-400 hover:border-slate-600"
                          )}
                        >
                          {source}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Current CRM (if any)</Label>
                    <Input placeholder="HubSpot, Pipedrive, Spreadsheet, None..." {...register("currentCRM")} />
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="text-lg font-semibold">Tone &amp; Agent Preferences</h2>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>Tone of Voice</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {toneOptions.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setSelectedTone(t.value)}
                          className={cn(
                            "rounded-lg border px-3 py-3 text-left transition-all",
                            selectedTone === t.value
                              ? "border-blue-500/50 bg-blue-500/10"
                              : "border-slate-700/50 bg-slate-800/40 hover:border-slate-600"
                          )}
                        >
                          <div className={cn("text-xs font-semibold", selectedTone === t.value ? "text-blue-300" : "text-slate-300")}>{t.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Agent Behaviour</Label>
                    {[
                      { key: "autoDraftReplies" as const, label: "Auto-draft replies for new leads", desc: "Agent creates draft emails ready for approval" },
                      { key: "autoApprovalsForHot" as const, label: "Auto-create approvals for HOT leads", desc: "Immediately queue approval actions for your top leads" },
                      { key: "autoFollowUpSuggestions" as const, label: "Auto-suggest follow-ups", desc: "Agent surfaces follow-up reminders on overdue leads" },
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50">
                        <div>
                          <div className="text-sm font-medium">{pref.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{pref.desc}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAgentPrefs(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${agentPrefs[pref.key] ? "bg-blue-600" : "bg-slate-700"}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${agentPrefs[pref.key] ? "translate-x-4" : "translate-x-1"}`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Lead Scoring Priorities (optional)</Label>
                    <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Any specific factors the agent should weight heavily when scoring leads?" {...register("leadScoringPriorities")} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 1}>
              Back
            </Button>
            {step < 4 ? (
              <Button type="button" variant="gradient" onClick={() => setStep((s) => s + 1)}>
                Continue <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" variant="gradient" disabled={isSubmitting}>
                {isSubmitting ? "Setting up..." : "Launch My Agent"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
