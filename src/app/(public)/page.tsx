import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight, Bot, Brain, CheckCircle, ChevronRight, Clock,
  LayoutDashboard, Lock, Shield,
  Sparkles, TrendingUp, Zap, CreditCard, ClipboardList,
  Wrench, Rocket, Phone, FileText
} from "lucide-react"

const benefits = [
  { icon: Zap, title: "More capacity", desc: "Give repetitive work to your AI team and expand what your business can get done." },
  { icon: ClipboardList, title: "Consistent execution", desc: "Employees work to defined instructions and schedules — the same standard, every time." },
  { icon: Brain, title: "Built around your business", desc: "Every employee receives a customised Employee Brain: your services, customers, tone and rules." },
  { icon: Shield, title: "Human control", desc: "Employees research, prepare and draft — important actions remain yours to approve." },
  { icon: LayoutDashboard, title: "One workforce", desc: "Manage your specialised AI employees from one Staffgent environment." },
  { icon: TrendingUp, title: "Grow gradually", desc: "Start with one employee. Add others when the business is ready — not before." },
]

const workflow = [
  { step: "01", title: "Choose Your Employee", desc: "Select the role your business needs most — Sales, Marketing, Branding, Operations or Finance." },
  { step: "02", title: "Business Kickoff", desc: "A structured kickoff captures what you do, who you serve, your tone, rules and priorities." },
  { step: "03", title: "Employee Brain Built", desc: "Your employee doesn't start with a generic prompt — their Employee Brain is configured around the way your business actually works." },
  { step: "04", title: "They Start Working", desc: "Your employee begins completing their assigned and scheduled work." },
  { step: "05", title: "You Review & Approve", desc: "Important work comes back to you. Review, give feedback, approve — from anywhere." },
  { step: "06", title: "Grow Your Team", desc: "Start with one employee and add more roles as your business grows." },
]

const employees = [
  {
    name: "AI Sales Employee",
    outcome: "Find more of the right customers.",
    desc: "Researches potential customers, identifies relevant opportunities, finds decision-makers, evaluates buying signals, scores prospects and prepares personalised outreach for approval.",
    caps: ["Prospect research", "Lead qualification", "Opportunity scoring", "Personalised outreach", "Human approval"],
  },
  {
    name: "AI Marketing Employee",
    outcome: "Keep your business visible and your marketing moving.",
    desc: "Researches relevant topics, develops campaign ideas, creates content, prepares social posts and helps maintain a consistent marketing presence without the constant manual workload.",
    caps: ["Content planning", "Social content", "Campaign ideas", "Marketing copy", "Content calendars"],
  },
  {
    name: "AI Branding Employee",
    outcome: "Keep everything your business produces consistently on-brand.",
    desc: "Learns how your business should sound, look and position itself, then helps maintain consistency across messaging, campaigns, documents, sales material and customer-facing content.",
    caps: ["Brand voice", "Messaging consistency", "Copy review", "Tone checking", "Brand guidelines"],
  },
  {
    name: "AI Operations Employee",
    outcome: "Take repetitive admin off your team's plate.",
    desc: "Helps organise day-to-day work, summarise information, prepare responses, track outstanding actions, create reports and keep repetitive business administration moving.",
    caps: ["Task management", "Action tracking", "Reporting", "Meeting summaries", "CRM updates"],
  },
  {
    name: "AI Finance Assistant",
    outcome: "Stay on top of financial admin without adding more paperwork.",
    desc: "Supports repetitive financial administration such as overdue invoice monitoring, payment reminders, expense organisation and management summaries — while keeping important decisions under human control.",
    caps: ["Invoice monitoring", "Payment reminders", "Expense summaries", "Management summaries", "Account alerts"],
  },
]

const faqs = [
  {
    q: "What is a Staffgent AI Employee?",
    a: "A specialised AI employee configured around a specific area of your business, with business knowledge, working instructions and defined responsibilities."
  },
  {
    q: "Which employees can I hire?",
    a: "Sales, Marketing, Branding, Operations and Finance Assistant. Start with the role your business needs most and add more as you grow."
  },
  {
    q: "Can I start with one employee?",
    a: "Yes. Most businesses start with one employee and add more as they grow. Every plan can be upgraded at any time."
  },
  {
    q: "Is Staffgent fully autonomous?",
    a: "Employees complete substantial work independently — research, drafts, reports, organisation — but important actions remain subject to your review and approval."
  },
  {
    q: "How does Staffgent learn my business?",
    a: "Each employee is configured through onboarding and a structured kickoff that creates their Employee Brain: your services, customers, priorities, tone, rules and working preferences."
  },
  {
    q: "Is this just ChatGPT?",
    a: "No. Staffgent employees are configured around specific business responsibilities, company knowledge, rules, schedules and approval processes — and they carry their work through, rather than answering one prompt at a time."
  },
  {
    q: "How does the monthly work allowance function?",
    a: "Every plan includes a monthly allowance of work credits that covers everything your employees do — research, drafts, reports, follow-ups. We notify you at 80%, you can top up with +250 credits for $49, and we never auto-bill overages."
  },
  {
    q: "How quickly can I get started?",
    a: "Most businesses are live within 5–7 business days. The full journey is laid out step-by-step in the section above — your total time investment is about an hour, and we handle the rest."
  },
]

const onboardingSteps = [
  {
    icon: Sparkles,
    day: "Day 1",
    who: "You",
    time: "15 min",
    title: "Try the demo, then book a call",
    desc: "See a Staffgent workspace for yourself, then book a walkthrough — we talk through which employee role your business needs first. No pressure, no jargon.",
  },
  {
    icon: CreditCard,
    day: "Day 1",
    who: "You",
    time: "5 min",
    title: "Hire your first employee",
    desc: "Pick your plan and role, and pay the one-time setup fee. You get instant access to your workspace while we start the configuration.",
  },
  {
    icon: ClipboardList,
    day: "Day 1–2",
    who: "You",
    time: "10 min",
    title: "Tell us about your business",
    desc: "A guided setup captures what you do, who you serve, your tone and your rules — the start of your Employee Brain.",
  },
  {
    icon: Phone,
    day: "Day 2–3",
    who: "Together",
    time: "30 min",
    title: "Business kickoff call",
    desc: "We go deeper than any form can. Real examples from your business calibrate how your employee thinks, sounds and prioritises.",
  },
  {
    icon: Wrench,
    day: "Day 3–6",
    who: "We handle it",
    time: null,
    title: "We configure, train and test",
    desc: "Your employee's Brain is built and tested against real scenarios from your business. You sign off sample work before anything goes live.",
  },
  {
    icon: Rocket,
    day: "Day 5–7",
    who: "Together",
    time: "15 min",
    title: "Your employee starts work",
    desc: "A short handover of their workspace — then your employee begins their scheduled work, and we keep monitoring and tuning them every month.",
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
              The AI workforce platform for small and growing businesses
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Hire your{" "}
              <span className="gradient-text">AI workforce</span>.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
              Build a team of specialised AI employees that work across your business — finding
              opportunities, creating marketing, protecting your brand, handling repetitive operations
              and keeping financial admin organised.
            </p>
            <p className="text-base text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
              Each employee is configured around your business, works to defined instructions,
              and brings important decisions back to you for review.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gradient" size="lg" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                <Link href="/signup">
                  Build Your AI Team <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                <Link href="#employees">
                  Meet the Employees <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-400">
              {["Start with one employee", "You approve the decisions that matter", "Private to your business"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> {item}
                </span>
              ))}
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mt-16 max-w-5xl mx-auto">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              A look inside the Sales Employee workspace
            </p>
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-2xl shadow-blue-500/5 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <span className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-slate-500 mx-auto">Staffgent — Sales Employee workspace</span>
              </div>
              <div className="p-6 bg-[hsl(222_47%_7%)]">
                {/* Mock stats row */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Prospects researched", value: "47", color: "text-blue-400" },
                    { label: "Hot opportunities", value: "8", color: "text-red-400" },
                    { label: "Pipeline value", value: "$84k", color: "text-emerald-400" },
                    { label: "Awaiting your review", value: "3", color: "text-yellow-400" },
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
                    { name: "Sarah Chen", co: "Fintech Agency · outreach drafted", score: "HOT", value: "$12k" },
                    { name: "Marcus Webb", co: "E-commerce Brand · follow-up scheduled", score: "WARM", value: "$6k" },
                    { name: "Priya Sharma", co: "SaaS Startup · researched & scored", score: "HOT", value: "$18k" },
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

      {/* Capacity */}
      <section className="py-24">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge className="mb-6 border-blue-500/30 bg-blue-500/10 text-blue-400">Why Staffgent</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">More capacity. Same team.</h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Give the repetitive work to your AI employees, and give your people more time for the work
            that needs human judgement. Add specialist capacity without adding more repetitive work to
            your existing team.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
            {[
              { stat: "5 roles", label: "Sales · Marketing · Branding · Operations · Finance", accent: "text-slate-300" },
              { stat: "From $499/mo", label: "Start with one employee. Build your team as you grow", accent: "gradient-text" },
              { stat: "Always on", label: "Your AI team keeps work moving between the meetings", accent: "text-emerald-400" },
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Not a bundle of chatbots.</h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-10">
            Generic AI tools wait for prompts. <span className="text-white font-medium">Staffgent employees hold a role in your business.</span>{" "}
            They carry defined responsibilities, work to schedules, and bring important actions to you
            for approval.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span className="text-lg">❌</span> Generic AI tools
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Wait for someone to type a prompt</li>
                <li>• Know nothing about your business</li>
                <li>• One-off answers, no follow-through</li>
                <li>• No schedules or responsibilities</li>
                <li>• No review or approval workflow</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <span className="text-lg">✓</span> Staffgent employees
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Configured with an Employee Brain built around your business</li>
                <li>• Hold defined responsibilities and schedules</li>
                <li>• Complete real work: research, drafts, reports</li>
                <li>• Bring important actions to you for approval</li>
                <li>• Work alongside your existing team</li>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From hire to working employee</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The full journey, with you in control at every step.</p>
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

      {/* Benefits */}
      <section className="py-24 bg-slate-950/50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4">What You Get</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built to work like a team member</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Business outcomes, not another subscription to a pile of AI tools.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((f) => (
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

      {/* Built for small and growing businesses */}
      <section className="py-24 bg-slate-950/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Who it&apos;s for</Badge>
            <h2 className="text-3xl font-bold mb-4">Built for small and growing businesses</h2>
            <p className="text-slate-400 max-w-xl mx-auto">If repetitive work is eating your team&apos;s week, Staffgent was built for you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {["Digital agencies", "SaaS & software", "Consultants & coaches", "E-commerce brands", "Trades & local services", "Professional services"].map((aud) => (
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

      {/* The Employees */}
      <section id="employees" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 border-violet-500/30 bg-violet-500/10 text-violet-400">Meet the Employees</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Five specialists. One workforce.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Choose from specialised AI employee roles. Start with the one your business needs most.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 max-w-5xl mx-auto">
            {employees.map((m) => (
              <div key={m.name} className="glass-card rounded-xl p-6 hover:border-violet-500/30 transition-all w-full md:w-[320px] flex flex-col">
                <div className="h-9 w-9 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mb-4">
                  <Bot className="h-4 w-4 text-violet-400" />
                </div>
                <h3 className="text-base font-semibold mb-1">{m.name}</h3>
                <p className="text-sm font-medium text-blue-400 mb-2">{m.outcome}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{m.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.caps.map((c) => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-800/70 border border-slate-700/50 text-slate-400">{c}</span>
                  ))}
                </div>
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
            <Badge className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400">You Stay in Control</Badge>
            <h2 className="text-3xl font-bold mb-4">AI employees that work independently — with you in control of the decisions that matter.</h2>
            <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Your employees research, prepare, analyse, draft, organise and report. Important external
              actions come back to you for review before anything happens. Staffgent does the
              preparation; you make the decisions.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              {[
                { icon: FileText, title: "Review & Approval Queue", desc: "Important work waits for your sign-off before it goes anywhere." },
                { icon: Lock, title: "Defined Instructions", desc: "Every employee works to the rules, tone and boundaries you set." },
                { icon: CheckCircle, title: "Full Work Log", desc: "Every piece of work recorded, so you can always see what your team did." },
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hire employees, not software seats</h2>
          <p className="text-slate-400 mb-10">Start with the employee your business needs most, and build your team from there.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { name: "Solo", setup: "$997", monthly: "$499", allowance: "1 AI Employee · 500 work credits/mo", desc: "Start with the employee your business needs most.", highlight: false },
              { name: "Team", setup: "$1,997", monthly: "$1,199", allowance: "3 AI Employees · 1,500 work credits/mo", desc: "Build a connected AI team across the areas that matter most.", highlight: true },
              { name: "Workforce", setup: "$2,997", monthly: "$1,799", allowance: "All 5 AI Employees · 5,000 work credits/mo", desc: "Build a complete AI workforce around your business.", highlight: false },
            ].map((p) => (
              <div key={p.name} className={`rounded-xl p-6 border transition-all ${p.highlight ? "border-blue-500/50 bg-blue-600/10 glow-blue" : "border-slate-700/50 bg-slate-900/60"}`}>
                {p.highlight && <Badge className="mb-3 border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs">Most Popular</Badge>}
                <div className="text-sm font-semibold text-slate-400 mb-1">{p.name}</div>
                <div className="text-3xl font-bold mb-0.5">{p.monthly}<span className="text-lg text-slate-400">/mo</span></div>
                <div className="text-xs text-slate-500 mb-3">+ {p.setup} setup &amp; build</div>
                <div className={`text-xs font-medium rounded-md px-2.5 py-1.5 mb-3 inline-block ${p.highlight ? "bg-blue-600/15 text-blue-300 border border-blue-500/30" : "bg-slate-800/60 text-slate-300 border border-slate-700/50"}`}>
                  {p.allowance}
                </div>
                <p className="text-xs text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto mb-2">
            Work credits cover everything your employees do — research, drafts, reports, follow-ups.
            Need more? +250 credits for $49, prepaid, never auto-billed.
          </p>
          <p className="text-xs text-slate-500 mb-8">
            Month-to-month · Cancel anytime · Every employee starts with a structured business kickoff
          </p>
          <Button variant="gradient" asChild>
            <Link href="/pricing">View Full Pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Onboarding journey */}
      <section id="getting-started" className="py-24">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="mb-6 border-violet-500/30 bg-violet-500/10 text-violet-400">From hire to first day in 5–7 days</Badge>
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
            <p className="text-sm text-slate-500 mb-5">After day one: your employee works to schedule, and important actions wait in your review queue.</p>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Your next employee could be AI.</h2>
          <p className="text-lg text-slate-400 mb-8">
            Start with the role your business needs most and build your Staffgent workforce from there.
            You stay in control — your AI team does the repetitive work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="lg" asChild className="h-12 px-8">
              <Link href="/signup">Build Your AI Team <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
