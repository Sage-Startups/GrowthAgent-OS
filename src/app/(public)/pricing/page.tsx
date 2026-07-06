import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, ArrowRight, Zap, Gauge, ShieldCheck, BellRing, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Hire an AI employee from $497/month. Every plan includes a monthly lead allowance — researched, scored, replied and followed up. Month-to-month, 30-day setup guarantee.",
}

const plans = [
  {
    name: "AI Sales Assistant",
    tagline: "Your first AI employee",
    setup: "$997",
    monthly: "$497",
    allowance: "200 leads included / month",
    highlight: false,
    features: [
      "1 AI employee: lead research, ICP scoring (1–100), reply drafting",
      "Approval queue dashboard — nothing sends without your sign-off",
      "Email + web form lead capture",
      "Monthly tune-up: scoring accuracy review + prompt updates",
      "Email support",
    ],
    notIncluded: [
      "Follow-up sequencing",
      "Call-prep briefs",
      "Proposal drafting & competitor monitoring",
    ],
  },
  {
    name: "AI Sales Team",
    tagline: "Three AI employees working your pipeline",
    setup: "$1,997",
    monthly: "$997",
    allowance: "500 leads included / month",
    highlight: true,
    features: [
      "Everything in Assistant, plus:",
      "3 AI employees — adds follow-up sequencing and call-prep briefs",
      "Priority support (same business day)",
      "Monthly performance report",
      "Custom voice calibration refreshes",
    ],
    notIncluded: [
      "Proposal drafting",
      "Competitor monitoring",
    ],
  },
  {
    name: "Full AI Revenue OS",
    tagline: "A complete AI sales department",
    setup: "$2,997",
    monthly: "$1,997",
    allowance: "1,500 leads included / month",
    highlight: false,
    features: [
      "Everything in Team, plus:",
      "Full agent suite — adds proposal drafting and competitor monitoring",
      "Quarterly strategy call",
      "Dedicated Slack/WhatsApp support channel",
    ],
    notIncluded: [],
  },
]

const allFeatures = [
  { name: "Monthly lead allowance", starter: "200", pipeline: "500", growth: "1,500" },
  { name: "AI employees", starter: "1", pipeline: "3", growth: "Full suite" },
  { name: "Lead research & ICP scoring (1–100)", starter: true, pipeline: true, growth: true },
  { name: "Reply drafting in your voice", starter: true, pipeline: true, growth: true },
  { name: "Approval queue — nothing sends without sign-off", starter: true, pipeline: true, growth: true },
  { name: "Email + web form lead capture", starter: true, pipeline: true, growth: true },
  { name: "Monthly tune-up (scoring + prompts)", starter: true, pipeline: true, growth: true },
  { name: "Month-to-month, cancel anytime", starter: true, pipeline: true, growth: true },
  { name: "Follow-up sequencing", starter: false, pipeline: true, growth: true },
  { name: "Call-prep briefs", starter: false, pipeline: true, growth: true },
  { name: "Priority support (same business day)", starter: false, pipeline: true, growth: true },
  { name: "Monthly performance report", starter: false, pipeline: true, growth: true },
  { name: "Custom voice calibration refreshes", starter: false, pipeline: true, growth: true },
  { name: "Proposal drafting", starter: false, pipeline: false, growth: true },
  { name: "Competitor monitoring", starter: false, pipeline: false, growth: true },
  { name: "Quarterly strategy call", starter: false, pipeline: false, growth: true },
  { name: "Dedicated Slack/WhatsApp support channel", starter: false, pipeline: false, growth: true },
]

const pricingFaqs = [
  {
    q: "What counts as a lead?",
    a: "One lead is one complete cycle of work: your AI employee researches the lead, scores it against your ideal customer profile, and drafts every reply and follow-up for it. There's no per-message or per-task metering — one lead, one number, no hidden meters.",
  },
  {
    q: "What happens when I hit my monthly allowance?",
    a: "We notify you when you reach 80% of your allowance. If you hit 100%, your AI employee pauses work on new leads (existing conversations continue) until you add a prepaid top-up — +100 leads for $49, one tap from your dashboard — or your allowance resets. We never auto-bill overages.",
  },
  {
    q: "Do unused leads roll over?",
    a: "No — your allowance resets at the start of each billing cycle. Pick the tier that matches your typical monthly volume; if you're regularly topping up, upgrading a tier usually works out cheaper.",
  },
  {
    q: "Can I change tiers or cancel anytime?",
    a: "Yes. Every plan is month-to-month. Upgrade or downgrade anytime and it applies from your next billing cycle; cancel anytime with no exit fees. Prefer annual? Pay annually and get 2 months free.",
  },
]

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="text-center mb-12">
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hire an AI employee, not another tool</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A sales hire runs $4,000–$6,000 a month — plus three months of onboarding and all the employment
            risk. Your full AI revenue team tops out at $1,997/month, is live in about a week, and you can
            cancel anytime.
          </p>
        </div>

        {/* Lead allowance explainer */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="glass-card rounded-2xl p-6 border-blue-500/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Gauge className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold mb-1">How the lead allowance works</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every plan includes a monthly lead allowance. One lead means we research it, score it, and
                  draft every reply and follow-up — one number, no hidden meters.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Zap, text: "Need more? +100 leads — $49, prepaid, one tap from your dashboard" },
                { icon: BellRing, text: "We notify you at 80% — and never auto-bill overages" },
                { icon: RefreshCw, text: "Allowance resets monthly — unused leads don't roll over" },
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
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
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
                If your AI employee hasn&apos;t researched, scored, and drafted a reply for every lead in your
                pipeline within 30 days, we refund your setup fee.
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            All plans month-to-month · Cancel anytime · Pay annually, get 2 months free
          </p>
        </div>

        {/* Feature comparison table */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Full feature comparison</h2>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
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
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Lead allowance &amp; billing questions</h2>
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
