import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight, Bot, Brain, CheckCircle, ChevronRight, Clock, FileText,
  Globe, LayoutDashboard, Lock, MessageSquare, Phone, Search, Shield,
  Sparkles, Star, TrendingUp, Users, Zap, CreditCard, ClipboardList,
  Wrench, Rocket
} from "lucide-react"

const features = [
  { icon: Search, title: "Lead Research", desc: "Automatically research every new lead's company, website, and digital footprint within minutes of capture." },
  { icon: Star, title: "Lead Scoring", desc: "AI scores every lead as Hot, Warm, Cold, or Bad Fit based on your ideal customer profile." },
  { icon: MessageSquare, title: "Draft Replies", desc: "Personalised draft emails crafted in your tone of voice, ready for your one-click approval." },
  { icon: Phone, title: "Call Prep Briefs", desc: "Full sales-call briefs prepared before every discovery call — pain points, company context, talking points." },
  { icon: Clock, title: "Follow-Up Agent", desc: "Never miss a follow-up again. The agent tracks every lead and surfaces who needs attention today." },
  { icon: LayoutDashboard, title: "Your Review Hub (CRM)", desc: "Everything your AI employee prepares lands in your private CRM — check in anytime, approve from anywhere." },
]

const workflow = [
  { step: "01", title: "Lead Arrives", desc: "A new enquiry hits your form, email or integration source." },
  { step: "02", title: "Agent Researches", desc: "The AI researches their company, website, team size and signals." },
  { step: "03", title: "Lead Scored", desc: "Scored Hot, Warm, Cold or Bad Fit against your criteria." },
  { step: "04", title: "Draft Prepared", desc: "A personalised reply drafted in your brand voice, awaiting approval." },
  { step: "05", title: "You Approve", desc: "One click to approve, edit, or reject — you stay in control." },
  { step: "06", title: "Pipeline Updated", desc: "CRM updated, follow-up scheduled, briefing ready if you book a call." },
]

const agentModules = [
  { name: "Lead Research Agent", desc: "Deep-dives every new lead", badge: "All plans" },
  { name: "Lead Scoring Engine", desc: "Qualifies against your ICP", badge: "All plans" },
  { name: "Reply Drafter", desc: "Personalised outreach in your voice", badge: "All plans" },
  { name: "Follow-Up Agent", desc: "Tracks and reminds on every deal", badge: "Sales Team" },
  { name: "Call Prep Agent", desc: "Pre-call briefs in 60 seconds", badge: "Sales Team" },
  { name: "Proposal Agent", desc: "Draft proposals from call notes", badge: "Revenue OS" },
  { name: "Competitor Monitor", desc: "Tracks competitor signals per lead", badge: "Revenue OS" },
  { name: "Voice Agent", desc: "Inbound voice with AI qualification", badge: "Revenue OS" },
]

const faqs = [
  {
    q: "Is this an AI chatbot?",
    a: "No. Chatbots respond to prompts. GrowthAgent OS is an AI employee — it proactively works inside your revenue flow, researching leads, scoring them, and preparing actions, without you having to ask."
  },
  {
    q: "How do I approve what the AI does?",
    a: "Your AI employee sends everything it prepares — scored leads, draft replies, follow-ups — to your private CRM. You can review and approve right there, or confirm actions straight from your phone or email. Nothing goes out without your sign-off."
  },
  {
    q: "Do I have to set it up myself?",
    a: "No. We build and configure your AI employee for your specific business during onboarding — your ideal customer, your tone, your scoring rules — then monitor and fine-tune it every month."
  },
  {
    q: "Where do I see the AI's work?",
    a: "Everything lands in your private CRM — your single review hub. Every lead, score, draft, and follow-up the AI prepares is there for you to review anytime, from any device."
  },
  {
    q: "How quickly can I get started?",
    a: "Most clients are live within 5–7 business days. The full journey is laid out step-by-step in the section above — your total time investment is about an hour, and we handle the rest."
  },
]

const onboardingSteps = [
  {
    icon: Sparkles,
    day: "Day 1",
    who: "You",
    time: "15 min",
    title: "Try the demo, then book a call",
    desc: "Click around the live demo to see what owning an AI employee feels like. Then book a walkthrough — we look at your lead flow together and recommend the right plan. No pressure, no jargon.",
  },
  {
    icon: CreditCard,
    day: "Day 1",
    who: "You",
    time: "5 min",
    title: "Hire your AI employee",
    desc: "Pick your plan and pay the one-time setup fee. You get instant access to your private workspace while we start the build.",
  },
  {
    icon: ClipboardList,
    day: "Day 1–2",
    who: "You",
    time: "10 min",
    title: "Tell us about your business",
    desc: "A guided setup wizard captures your ideal customer, your offer, your tone of voice and where your leads come from. That becomes your employee's job description.",
  },
  {
    icon: Phone,
    day: "Day 2–3",
    who: "Together",
    time: "30 min",
    title: "Kickoff call",
    desc: "We go deeper than any form can. You show us a few real past leads — one you won, one you lost, one that wasted your time — and replies you actually liked. That's how we calibrate scoring and voice.",
  },
  {
    icon: Wrench,
    day: "Day 3–6",
    who: "We handle it",
    time: null,
    title: "We build, train and test",
    desc: "We configure your agents, run your real past leads through them, and send you sample outputs — scores, draft replies, a call brief — for your sign-off before anything goes live.",
  },
  {
    icon: Rocket,
    day: "Day 5–7",
    who: "Together",
    time: "15 min",
    title: "Go live",
    desc: "We connect your lead sources and walk you through your workspace. From that moment your employee works every lead that arrives — and we keep monitoring and tuning it every month.",
  },
]

const whoStyles: Record<string, string> = {
  "You": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Together": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "We handle it": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
}

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-sm px-4 py-1.5 border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Fully managed AI employees for digital businesses
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Hire an{" "}
              <span className="gradient-text">AI employee</span>
              <br />
              that closes your leads.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              For a fraction of the cost of a sales hire, your AI employee researches every new lead,
              scores the opportunity, drafts replies, preps your calls and follows up — then sends it all
              to your private CRM. You approve the work from your phone or email. Nothing happens without your say-so.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gradient" size="lg" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                <Link href="/signup">
                  Hire Your AI Employee <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                <Link href="/demo">
                  Try the Live Demo <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-400">
              {["Setup in 5 days", "Approval-first AI", "Private to your business"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> {item}
                </span>
              ))}
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-2xl shadow-blue-500/5 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <span className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-slate-500 mx-auto">GrowthAgent OS — Dashboard</span>
              </div>
              <div className="p-6 bg-[hsl(222_47%_7%)]">
                {/* Mock stats row */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Total Leads", value: "47", color: "text-blue-400" },
                    { label: "Hot Leads", value: "8", color: "text-red-400" },
                    { label: "Pipeline Value", value: "$84k", color: "text-emerald-400" },
                    { label: "Approvals Due", value: "3", color: "text-yellow-400" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-slate-800/60 border border-slate-700/50 p-3">
                      <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Mock lead rows */}
                <div className="space-y-2">
                  {[
                    { name: "Sarah Chen", co: "Fintech Agency", score: "HOT", value: "$12k" },
                    { name: "Marcus Webb", co: "E-commerce Brand", score: "WARM", value: "$6k" },
                    { name: "Priya Sharma", co: "SaaS Startup", score: "HOT", value: "$18k" },
                  ].map((l) => (
                    <div key={l.name} className="flex items-center justify-between rounded-lg bg-slate-800/40 border border-slate-700/30 px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white">{l.name[0]}</div>
                        <div>
                          <div className="text-sm font-medium">{l.name}</div>
                          <div className="text-xs text-slate-500">{l.co}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.score === "HOT" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>{l.score}</span>
                        <span className="text-sm font-semibold text-emerald-400">{l.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The maths */}
      <section className="py-24">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge className="mb-6 border-blue-500/30 bg-blue-500/10 text-blue-400">Do the Maths</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">An employee&apos;s output. A subscription&apos;s price.</h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10">
            A junior sales hire costs $3,000–$5,000 a month, needs training, takes holidays and still lets leads slip.
            Your AI employee does the qualifying, drafting and follow-up work around the clock — and we build,
            monitor and fine-tune it for you every month.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
            {[
              { stat: "$3k–$5k/mo", label: "Typical junior sales hire", accent: "text-slate-500" },
              { stat: "From $497/mo", label: "Your AI employee, fully managed", accent: "gradient-text" },
              { stat: "24/7", label: "Works every lead the minute it arrives", accent: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-6 text-center">
                <div className={`text-2xl font-bold mb-1 ${s.accent}`}>{s.stat}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not another chatbot */}
      <section className="py-24 border-y border-slate-800 bg-slate-950/50">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge className="mb-6 border-violet-500/30 bg-violet-500/10 text-violet-400">
            The Difference
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Not another AI chatbot.</h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-10">
            Chatbots wait for prompts. <span className="text-white font-medium">GrowthAgent OS works inside your revenue flow.</span>{" "}
            It captures leads, researches companies, scores fit, drafts next steps and asks for approval
            before anything sensitive happens.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span className="text-lg">❌</span> Generic AI chatbots
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Wait for someone to type a question</li>
                <li>• No memory of your business context</li>
                <li>• Can&apos;t research leads or update CRM</li>
                <li>• No approval workflow</li>
                <li>• Generic responses, wrong tone</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <span className="text-lg">✓</span> GrowthAgent OS
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Works proactively on every new lead</li>
                <li>• Trained on your ICP and business context</li>
                <li>• Researches, scores, drafts and updates CRM</li>
                <li>• Nothing sensitive without your approval</li>
                <li>• Personalised to your brand voice</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="features" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From enquiry to opportunity in minutes</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The full lead-to-sale workflow, handled by your AI employee — with you in control at every step.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {workflow.map((step) => (
              <div key={step.step} className="glass-card rounded-xl p-6 group hover:border-blue-500/30 transition-all">
                <div className="text-3xl font-bold gradient-text mb-3">{step.step}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-950/50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4">Agent Capabilities</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything your sales flow needs</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Built around the real work of qualifying and converting digital business enquiries.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="glass-card rounded-xl p-6 hover:border-blue-500/30 transition-all group">
                <div className="h-10 w-10 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <f.icon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for digital businesses */}
      <section className="py-24 bg-slate-950/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold mb-4">Built for digital service businesses</h2>
            <p className="text-slate-400 max-w-xl mx-auto">If you sell a service and receive enquiries, GrowthAgent OS was built for you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {["Digital agencies", "SaaS founders", "Consultants", "Coaches & trainers", "Freelancers", "B2B service businesses"].map((aud) => (
              <div key={aud} className="glass-card rounded-xl p-5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium">{aud}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Modules */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4">Agent Suite</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your full AI operations team</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Each agent is purpose-built for a specific step in your revenue process.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {agentModules.map((m) => (
              <div key={m.name} className="glass-card rounded-xl p-4 hover:border-violet-500/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-8 w-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    m.badge === "All plans" ? "bg-emerald-500/20 text-emerald-400" :
                    m.badge === "Sales Team" ? "bg-blue-500/20 text-blue-400" :
                    "bg-violet-500/20 text-violet-400"
                  }`}>{m.badge}</span>
                </div>
                <h3 className="text-sm font-semibold mb-1">{m.name}</h3>
                <p className="text-xs text-slate-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approval / Security */}
      <section className="py-24 bg-slate-950/50">
        <div className="container max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-10 text-center border-slate-700/50">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-7 w-7 text-emerald-400" />
            </div>
            <Badge className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">Approval-First AI</Badge>
            <h2 className="text-3xl font-bold mb-4">You stay in control. Always.</h2>
            <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Every sensitive action goes through your approval queue before anything happens. Draft emails,
              CRM updates, follow-up sequences, proposal outlines — all reviewed by you. GrowthAgent OS
              does the preparation; you make the decisions.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              {[
                { icon: FileText, title: "Draft Email Approval", desc: "Review and approve every draft before it can be sent." },
                { icon: Lock, title: "CRM Update Control", desc: "Approve or reject CRM status changes and data updates." },
                { icon: CheckCircle, title: "Full Audit Trail", desc: "Every agent action logged for complete transparency." },
              ].map((item) => (
                <div key={item.title} className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-4">
                  <item.icon className="h-5 w-5 text-emerald-400 mb-2" />
                  <div className="text-sm font-semibold mb-1">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-24">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge className="mb-6">Simple Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hire your first AI employee</h2>
          <p className="text-slate-400 mb-10">A fraction of the cost of a sales hire. We build it, you approve the work.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { name: "AI Sales Assistant", setup: "$500", monthly: "$497", desc: "1 AI agent + private CRM review hub", highlight: false },
              { name: "AI Sales Team", setup: "$1,000", monthly: "$997", desc: "3 AI agents working your pipeline", highlight: true },
              { name: "Full AI Revenue OS", setup: "$1,500", monthly: "$1,997", desc: "A complete AI sales department", highlight: false },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl p-6 border transition-all ${p.highlight ? "border-blue-500/50 bg-blue-600/10 glow-blue" : "border-slate-700/50 bg-slate-900/60"}`}>
                {p.highlight && <Badge className="mb-3 border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs">Most Popular</Badge>}
                <div className="text-sm font-semibold text-slate-400 mb-1">{p.name}</div>
                <div className="text-3xl font-bold mb-0.5">{p.monthly}<span className="text-lg text-slate-400">/mo</span></div>
                <div className="text-xs text-slate-500 mb-3">+ {p.setup} setup &amp; build</div>
                <p className="text-xs text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
          <Button variant="gradient" asChild>
            <Link href="/pricing">View Full Pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Onboarding journey */}
      <section id="getting-started" className="py-24">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-6 border-violet-500/30 bg-violet-500/10 text-violet-400">From signup to live in 5–7 days</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Exactly what happens when you sign up</h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              No prompts to write, no software to learn. Your total time investment is about an hour —
              we do the rest. Here&apos;s the whole journey, step by step.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/40 to-emerald-500/50 hidden sm:block" />
            <div className="space-y-5">
              {onboardingSteps.map((step, i) => (
                <div key={step.title} className="relative flex gap-5">
                  <div className="relative z-10 h-10 w-10 rounded-full bg-slate-900 border border-slate-700 items-center justify-center shrink-0 hidden sm:flex">
                    <step.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="glass-card rounded-xl p-5 flex-1 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-xs font-bold gradient-text">Step {i + 1}</span>
                      <span className="text-xs text-slate-500">· {step.day}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${whoStyles[step.who]}`}>
                        {step.who}
                      </span>
                      {step.time && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {step.time} of your time
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold mb-1.5">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-slate-500 mb-5">After go-live: we monitor your employee, tune it monthly, and you approve its work from your phone, email or CRM.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gradient" size="lg" asChild className="h-12 px-8">
                <Link href="/demo">Start Step 1 — Try the Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-12 px-8">
                <Link href="/book-demo">Book a Walkthrough</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-950/50">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="glass-card rounded-xl p-5">
                <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/8 rounded-full blur-3xl" />
          </div>
          <Badge className="mb-6 border-blue-500/30 bg-blue-500/10 text-blue-400">
            <Zap className="h-3.5 w-3.5 mr-1.5" /> Get started today
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to hire your first AI employee?</h2>
          <p className="text-lg text-slate-400 mb-8">
            We build it around your business, monitor it every month, and send all its work to your private CRM for approval. You stay in control — it does the graft.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="lg" asChild className="h-12 px-8">
              <Link href="/signup">Hire Your AI Employee <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 px-8">
              <Link href="/demo">Try the Live Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
