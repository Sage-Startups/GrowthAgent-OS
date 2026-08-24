import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, ArrowRight, Zap, Gauge, ShieldCheck, BellRing, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Hire your AI workforce from $499/month + one-time setup. Choose from five specialised AI employees — Sales, Marketing, Branding, Operations and Finance — with a monthly work allowance included.",
}

const plans = [
  {
    name: "Solo",
    tagline: "Start with the employee your business needs most.",
    setup: "$997",
    monthly: "$499",
    allowance: "1 AI Employee · 500 work credits / month",
    highlight: false,
    features: [
      "Choose 1 Staffgent employee — any role",
      "Custom Employee Brain built around your business",
      "Structured business kickoff",
      "Employee workspace",
      "Scheduled work",
      "Direct employee interaction",
      "Review & approval workflow",
      "Performance reporting",
      "Standard support",
    ],
    notIncluded: [
      "Shared company knowledge",
      "Cross-employee visibility",
    ],
    cta: "Hire Your First Employee",
  },
  {
    name: "Team",
    tagline: "Build a connected AI team across the areas that matter most.",
    setup: "$1,997",
    monthly: "$1,199",
    allowance: "Any 3 AI Employees · 1,500 work credits / month",
    highlight: true,
    features: [
      "Everything in Solo, plus:",
      "Choose any 3 Staffgent employees",
      "Shared company knowledge",
      "Cross-employee visibility",
      "Priority onboarding",
      "Increased usage",
      "Enhanced reporting",
      "Priority support",
    ],
    notIncluded: [
      "Full five-role workforce",
    ],
    cta: "Build Your Team",
  },
  {
    name: "Workforce",
    tagline: "Build a complete AI workforce around your business.",
    setup: "$2,997",
    monthly: "$1,799",
    allowance: "All 5 AI Employees · 5,000 work credits / month",
    highlight: false,
    features: [
      "Everything in Team, plus:",
      "Sales, Marketing, Branding, Operations & Finance Assistant",
      "Shared business intelligence",
      "Higher usage allowances",
      "Advanced reporting",
      "Priority configuration",
      "Priority support",
      "Regular employee optimisation",
    ],
    notIncluded: [],
    cta: "Build Your Workforce",
  },
]

const allFeatures = [
  { name: "AI Employees included", starter: "1", pipeline: "Any 3", growth: "All 5" },
  { name: "Monthly work credits", starter: "500", pipeline: "1,500", growth: "5,000" },
  { name: "Custom Employee Brain per employee", starter: true, pipeline: true, growth: true },
  { name: "Structured business kickoff", starter: true, pipeline: true, growth: true },
  { name: "Review & approval workflow", starter: true, pipeline: true, growth: true },
  { name: "Scheduled work", starter: true, pipeline: true, growth: true },
  { name: "Direct employee interaction", starter: true, pipeline: true, growth: true },
  { name: "Performance reporting", starter: true, pipeline: true, growth: true },
  { name: "Month-to-month, cancel anytime", starter: true, pipeline: true, growth: true },
  { name: "Shared company knowledge", starter: false, pipeline: true, growth: true },
  { name: "Cross-employee visibility", starter: false, pipeline: true, growth: true },
  { name: "Priority onboarding", starter: false, pipeline: true, growth: true },
  { name: "Priority support", starter: false, pipeline: true, growth: true },
  { name: "Shared business intelligence", starter: false, pipeline: false, growth: true },
  { name: "Advanced reporting", starter: false, pipeline: false, growth: true },
  { name: "Regular employee optimisation", starter: false, pipeline: false, growth: true },
]

const pricingFaqs = [
  {
    q: "What does the monthly work allowance cover?",
    a: "Every plan includes a monthly allowance of work credits that covers everything your employees do — research, scoring, drafts, follow-ups, reports and summaries. Different tasks use different amounts of credits, and your dashboard always shows where you stand.",
  },
  {
    q: "What happens when I use my monthly allowance?",
    a: "We notify you when you reach 80% of your allowance. If you reach 100%, your employees pause new work (existing conversations continue) until you add a prepaid top-up — +250 work credits for $49, one tap from your dashboard — or your allowance resets. We never auto-bill overages.",
  },
  {
    q: "Do unused credits roll over?",
    a: "No — your allowance resets at the start of each billing cycle. Pick the tier that matches your workload; if you're regularly topping up, upgrading a tier usually works out better value.",
  },
  {
    q: "Can I change plans or swap employees?",
    a: "Plans are month-to-month: upgrade, downgrade or cancel anytime, effective from your next billing cycle. On Solo and Team you choose which roles to hire, and you can change your selection when your needs change.",
  },
  {
    q: "What does the setup & build fee cover?",
    a: "The one-time fee covers the hands-on work of standing up each employee: your business kickoff, building the Employee Brain, configuring rules and schedules, testing against real scenarios from your business, and your go-live handover.",
  },
]

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hire employees, not software seats</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Start with the employee your business needs most, and build your AI workforce from there.
            Every plan includes configuration, a structured business kickoff, and a monthly work
            allowance — with important actions always yours to approve.
          </p>
        </div>

        {/* Work allowance explainer */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="glass-card rounded-2xl p-6 border-blue-500/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Gauge className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold mb-1">How the monthly work allowance works</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every plan includes a monthly allowance of work credits that covers everything your
                  employees do — research, drafts, reports, follow-ups. One allowance across your whole
                  team, no hidden meters.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Zap, text: "Need more? +250 work credits — $49, prepaid, one tap from your dashboard" },
                { icon: BellRing, text: "We notify you at 80% — and never auto-bill overages" },
                { icon: RefreshCw, text: "Allowance resets monthly — unused credits don't roll over" },
              ].map((item) => (
                <div key={item.text} className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-3 flex items-start gap-2.5">
                  <item.icon className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl border p-8 flex flex-col transition-all ${plan.highlight ? "border-blue-500/50 bg-blue-600/5 glow-blue relative" : "border-slate-700/50 bg-slate-900/60"}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="border-blue-500/50 bg-blue-600 text-white px-4 shadow-lg shadow-blue-500/30">Most Popular</Badge>
                </div>
              )}
              <div className="mb-5">
                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="text-sm text-slate-400">{plan.tagline}</p>
              </div>
              <div className="mb-4">
                <div className="text-4xl font-bold mb-1">
                  {plan.monthly}<span className="text-xl text-slate-400">/mo</span>
                </div>
                <div className="text-sm text-slate-500">+ {plan.setup} one-time setup &amp; build fee</div>
              </div>
              <div className={`rounded-lg px-3 py-2 mb-6 text-sm font-medium flex items-center gap-2 ${plan.highlight ? "bg-blue-600/15 text-blue-300 border border-blue-500/30" : "bg-slate-800/60 text-slate-300 border border-slate-700/50"}`}>
                <Gauge className="h-4 w-4 shrink-0" />
                {plan.allowance}
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
                  {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee + billing terms */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="glass-card rounded-2xl p-6 border-emerald-500/20 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold mb-1">30-Day Setup Guarantee</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                If your first employee isn&apos;t configured, tested and producing reviewable work within
                30 days, we refund your setup fee.
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            All plans month-to-month · Cancel anytime · Pay annually, get 2 months free
          </p>
        </div>

        {/* Feature comparison table */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Full plan comparison</h2>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-4 bg-slate-900 border-b border-slate-800">
                  <div className="p-4 text-sm font-semibold text-slate-400">Feature</div>
                  <div className="p-4 text-sm font-semibold text-center">Solo</div>
                  <div className="p-4 text-sm font-semibold text-center text-blue-400">Team</div>
                  <div className="p-4 text-sm font-semibold text-center">Workforce</div>
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
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Allowance &amp; billing questions</h2>
          <div className="space-y-4">
            {pricingFaqs.map((faq) => (
              <div key={faq.q} className="glass-card rounded-xl p-5">
                <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-6">Not sure which employee to hire first? Book a 20-minute consultation — or try the live demo first.</p>
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
