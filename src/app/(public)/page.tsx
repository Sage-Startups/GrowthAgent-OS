import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight, Bot, Brain, CheckCircle, ChevronRight, Clock, FileText,
  Globe, LayoutDashboard, Lock, MessageSquare, Phone, Search, Shield,
  Sparkles, Star, TrendingUp, Users, Zap
} from "lucide-react"

const features = [
  { icon: Search, title: "Lead Research", desc: "Automatically research every new lead's company, website, and digital footprint within minutes of capture." },
  { icon: Star, title: "Lead Scoring", desc: "AI scores every lead as Hot, Warm, Cold, or Bad Fit based on your ideal customer profile." },
  { icon: MessageSquare, title: "Draft Replies", desc: "Personalised draft emails crafted in your tone of voice, ready for your one-click approval." },
  { icon: Phone, title: "Call Prep Briefs", desc: "Full sales-call briefs prepared before every discovery call — pain points, company context, talking points." },
  { icon: Clock, title: "Follow-Up Agent", desc: "Never miss a follow-up again. The agent tracks every lead and surfaces who needs attention today." },
  { icon: LayoutDashboard, title: "Private CRM", desc: "All lead intelligence lives in a private CRM built around your sales flow, not a generic database." },
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
  { name: "Lead Research Agent", desc: "Deep-dives every new lead", badge: "Active" },
  { name: "Lead Scoring Engine", desc: "Qualifies against your ICP", badge: "Active" },
  { name: "Reply Drafter", desc: "Personalised outreach in your voice", badge: "Active" },
  { name: "Follow-Up Agent", desc: "Tracks and reminds on every deal", badge: "Pipeline+" },
  { name: "Call Prep Agent", desc: "Pre-call briefs in 60 seconds", badge: "Pipeline+" },
  { name: "Proposal Agent", desc: "Draft proposals from call notes", badge: "Growth OS" },
  { name: "Competitor Monitor", desc: "Tracks competitor signals per lead", badge: "Growth OS" },
  { name: "Voice Agent", desc: "Inbound voice with AI qualification", badge: "Growth OS" },
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
    a: "Most clients are live within 5–7 business days of setup. Book a demo and we will walk you through the onboarding timeline."
  },
]

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
              AI operations for digital businesses
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
                  Get Your Lead Agent <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto h-12 px-8 text-base">
                <Link href="/demo">
                  See How It Works <ChevronRight className="ml-1 h-4 w-4" />
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

      {/* The Shift */}
      <section className="py-24">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge className="mb-6 border-blue-500/30 bg-blue-500/10 text-blue-400">The Shift</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">The future of digital business operations</h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Basic AI tools wait for prompts. <span className="text-white font-medium">GrowthAgent OS works inside your revenue flow.</span> It turns enquiries into structured opportunities, keeps your CRM alive, prepares your next move and lets you approve anything before it goes out.
          </p>
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
            <p className="text-slate-400 max-w-2xl mx-auto">The full lead-to-sale workflow, handled by your AI operator — with you in control at every step.</p>
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
                    m.badge === "Active" ? "bg-emerald-500/20 text-emerald-400" :
                    m.badge === "Pipeline+" ? "bg-blue-500/20 text-blue-400" :
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

      {/* Managed installation */}
      <section className="py-24">
        <div className="container max-w-3xl mx-auto text-center">
          <Badge className="mb-6 border-violet-500/30 bg-violet-500/10 text-violet-400">Managed Setup</Badge>
          <h2 className="text-3xl font-bold mb-4">We install and configure it for you</h2>
          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            You do not need to understand prompts, agents or infrastructure. We configure your private GrowthAgent OS workspace, connect your lead sources, train the agent on your business, and test it before going live. You just start approving actions.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { step: "01", title: "Discovery Call", desc: "30 minutes to understand your business and lead flow." },
              { step: "02", title: "Configuration", desc: "We set up your agents, scoring rules, and integrations." },
              { step: "03", title: "Go Live", desc: "You approve actions and watch your pipeline fill." },
            ].map((s) => (
              <div key={s.step} className="glass-card rounded-xl p-5">
                <div className="text-2xl font-bold gradient-text mb-2">{s.step}</div>
                <div className="text-sm font-semibold mb-1">{s.title}</div>
                <div className="text-xs text-slate-400">{s.desc}</div>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to turn enquiries into opportunities?</h2>
          <p className="text-lg text-slate-400 mb-8">
            Join digital businesses using GrowthAgent OS to qualify leads, draft replies and keep their pipeline moving — without adding headcount.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="lg" asChild className="h-12 px-8">
              <Link href="/signup">Get Your Lead Agent <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 px-8">
              <Link href="/demo">Book a Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
