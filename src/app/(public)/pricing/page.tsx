import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, ArrowRight, Zap } from "lucide-react"

export const metadata: Metadata = { title: "Pricing" }

const plans = [
  {
    name: "AI Sales Assistant",
    tagline: "Your first AI employee",
    setup: "$500",
    monthly: "$497",
    highlight: false,
    features: [
      "1 dedicated AI agent",
      "Reviews & scores every lead (HOT/WARM/COLD)",
      "Researches each prospect",
      "Drafts replies in your tone",
      "Sends follow-up reminders",
      "Private CRM — your review hub",
      "Approve actions by phone or email",
      "We build & configure your agent",
      "Ongoing monitoring & tuning",
    ],
    notIncluded: [
      "Sales-call prep agent",
      "Proposal prep agent",
      "Voice agent",
    ],
  },
  {
    name: "AI Sales Team",
    tagline: "Three AI employees working your pipeline",
    setup: "$1,000",
    monthly: "$997",
    highlight: true,
    features: [
      "Everything in Assistant",
      "3 dedicated AI agents",
      "Follow-up agent",
      "Sales-call prep agent",
      "Custom scoring rules for your business",
      "CRM auto-updates from every agent",
      "Weekly check-in & optimisation",
      "Priority support",
    ],
    notIncluded: [
      "Proposal prep agent",
      "Voice agent",
    ],
  },
  {
    name: "Full AI Revenue OS",
    tagline: "A complete AI sales department",
    setup: "$1,500",
    monthly: "$1,997",
    highlight: false,
    features: [
      "Everything in Sales Team",
      "Full agent suite",
      "Proposal prep agent",
      "Competitor monitoring agent",
      "Client onboarding agent",
      "Voice agent (AI calls)",
      "Monthly performance report",
      "Custom integrations",
      "Dedicated account manager",
    ],
    notIncluded: [],
  },
]

const allFeatures = [
  { name: "Dedicated AI agents", starter: "1", pipeline: "3", growth: "Full suite" },
  { name: "Private CRM review hub", starter: true, pipeline: true, growth: true },
  { name: "Lead research & scoring", starter: true, pipeline: true, growth: true },
  { name: "Draft reply generation", starter: true, pipeline: true, growth: true },
  { name: "Approve by phone or email", starter: true, pipeline: true, growth: true },
  { name: "Follow-up agent", starter: true, pipeline: true, growth: true },
  { name: "We build & configure for you", starter: true, pipeline: true, growth: true },
  { name: "Ongoing monitoring & tuning", starter: true, pipeline: true, growth: true },
  { name: "Sales-call prep agent", starter: false, pipeline: true, growth: true },
  { name: "Custom scoring rules", starter: false, pipeline: true, growth: true },
  { name: "Weekly check-in", starter: false, pipeline: true, growth: true },
  { name: "Proposal prep agent", starter: false, pipeline: false, growth: true },
  { name: "Competitor monitoring", starter: false, pipeline: false, growth: true },
  { name: "Voice agent (AI calls)", starter: false, pipeline: false, growth: true },
  { name: "Custom integrations", starter: false, pipeline: false, growth: true },
  { name: "Dedicated account manager", starter: false, pipeline: false, growth: true },
]

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hire an AI employee, not another tool</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A junior sales hire costs $3,000–$5,000/month. Your AI employee does the same work — qualifying leads,
            drafting replies, prepping calls, following up — for a fraction of the price. We build it, configure it
            for your business, and monitor it every month. You just approve the work.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border p-8 flex flex-col transition-all ${plan.highlight ? "border-blue-500/50 bg-blue-600/5 glow-blue relative" : "border-slate-700/50 bg-slate-900/60"}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="border-blue-500/50 bg-blue-600 text-white px-4 shadow-lg shadow-blue-500/30">Most Popular</Badge>
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="text-sm text-slate-400">{plan.tagline}</p>
              </div>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-1">
                  {plan.monthly}<span className="text-xl text-slate-400">/mo</span>
                </div>
                <div className="text-sm text-slate-500">+ {plan.setup} one-time setup & build fee</div>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <X className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
                    <span className="text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight ? "gradient" : "outline"} asChild className="w-full">
                <Link href="/book-demo">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Full feature comparison</h2>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="grid grid-cols-4 bg-slate-900 border-b border-slate-800">
              <div className="p-4 text-sm font-semibold text-slate-400">Feature</div>
              <div className="p-4 text-sm font-semibold text-center">Assistant</div>
              <div className="p-4 text-sm font-semibold text-center text-blue-400">Sales Team</div>
              <div className="p-4 text-sm font-semibold text-center">Revenue OS</div>
            </div>
            {allFeatures.map((f, i) => (
              <div key={f.name} className={`grid grid-cols-4 border-b border-slate-800/50 ${i % 2 === 0 ? "bg-slate-900/30" : "bg-slate-950/30"}`}>
                <div className="p-3.5 text-sm text-slate-300">{f.name}</div>
                {[f.starter, f.pipeline, f.growth].map((val, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-center">
                    {typeof val === "boolean" ? (
                      val ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-slate-700" />
                    ) : (
                      <span className="text-sm text-slate-300">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-6">Not sure which AI employee is right for you? Book a 20-minute consultation — or try the live demo first.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/book-demo">
                <Zap className="mr-2 h-4 w-4" /> Book a Free Walkthrough
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">Try the Live Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
