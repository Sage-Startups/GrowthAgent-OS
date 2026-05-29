import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, ArrowRight, Zap } from "lucide-react"

export const metadata: Metadata = { title: "Pricing" }

const plans = [
  {
    name: "Lead Agent Starter",
    tagline: "Your first AI sales operator",
    setup: "$499",
    monthly: "$99",
    highlight: false,
    features: [
      "Private dashboard",
      "Mini lead CRM",
      "1 lead source connected",
      "AI lead research",
      "Lead scoring (HOT/WARM/COLD)",
      "Draft reply generation",
      "Approval queue",
      "Agent chat",
      "Weekly lead report",
    ],
    notIncluded: [
      "Follow-up agent",
      "Sales-call prep agent",
      "Custom scoring rules",
      "Proposal agent",
    ],
  },
  {
    name: "Pipeline Agent",
    tagline: "Full pipeline automation",
    setup: "$1,500",
    monthly: "$249",
    highlight: true,
    features: [
      "Everything in Starter",
      "Up to 3 lead sources",
      "Follow-up agent",
      "Sales-call prep agent",
      "Custom scoring rules",
      "CRM status updates",
      "Pipeline report",
      "Monthly optimisation call",
      "Priority support",
    ],
    notIncluded: [
      "Proposal prep agent",
      "Competitor monitoring",
      "Voice agent",
      "Custom integrations",
    ],
  },
  {
    name: "Growth Agent OS",
    tagline: "Complete AI revenue operation",
    setup: "from $3,000",
    monthly: "from $599",
    highlight: false,
    features: [
      "Everything in Pipeline",
      "Full agent suite",
      "Proposal prep agent",
      "Competitor monitoring agent",
      "Client onboarding agent",
      "Voice agent readiness",
      "Custom integrations",
      "Done-for-you workflows",
      "Dedicated account manager",
    ],
    notIncluded: [],
  },
]

const allFeatures = [
  { name: "Private dashboard", starter: true, pipeline: true, growth: true },
  { name: "Lead CRM", starter: true, pipeline: true, growth: true },
  { name: "AI lead research", starter: true, pipeline: true, growth: true },
  { name: "Lead scoring", starter: true, pipeline: true, growth: true },
  { name: "Draft reply generation", starter: true, pipeline: true, growth: true },
  { name: "Approval queue", starter: true, pipeline: true, growth: true },
  { name: "Agent chat", starter: true, pipeline: true, growth: true },
  { name: "Lead sources", starter: "1", pipeline: "3", growth: "Unlimited" },
  { name: "Follow-up agent", starter: false, pipeline: true, growth: true },
  { name: "Sales-call prep agent", starter: false, pipeline: true, growth: true },
  { name: "Custom scoring rules", starter: false, pipeline: true, growth: true },
  { name: "Monthly optimisation call", starter: false, pipeline: true, growth: true },
  { name: "Proposal prep agent", starter: false, pipeline: false, growth: true },
  { name: "Competitor monitoring", starter: false, pipeline: false, growth: true },
  { name: "Voice agent readiness", starter: false, pipeline: false, growth: true },
  { name: "Custom integrations", starter: false, pipeline: false, growth: true },
  { name: "Done-for-you workflows", starter: false, pipeline: false, growth: true },
]

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Each plan includes a one-time setup fee covering configuration, testing, and integration — then a fixed monthly retainer.
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
                <div className="text-sm text-slate-500">+ {plan.setup} one-time setup fee</div>
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
                <Link href="/demo">
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
              <div className="p-4 text-sm font-semibold text-center">Starter</div>
              <div className="p-4 text-sm font-semibold text-center text-blue-400">Pipeline</div>
              <div className="p-4 text-sm font-semibold text-center">Growth OS</div>
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
          <p className="text-slate-400 mb-6">Not sure which plan is right for you? Book a 20-minute consultation.</p>
          <Button variant="gradient" size="lg" asChild>
            <Link href="/demo">
              <Zap className="mr-2 h-4 w-4" /> Book a Free Demo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
