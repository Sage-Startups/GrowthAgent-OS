import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Globe, Mail, Phone, Building2, Clock, CheckCircle, FileText, Bot } from "lucide-react"
import { getScoreBandColor, getStatusColor, formatCurrency, formatDate } from "@/lib/utils"

const mockLeadsDb: Record<string, {
  id: string; name: string; email: string; phone: string; companyName: string;
  website: string; source: string; status: string; scoreBand: string | null;
  score: number | null; estimatedValue: number | null; painPoints: string;
  fitSummary: string; researchSummary: string; recommendedAction: string;
  draftReply: string; createdAt: Date;
}> = {
  "1": {
    id: "1", name: "Sarah Chen", email: "s.chen@fintechagency.com", phone: "+44 7700 900123",
    companyName: "Fintech Agency Ltd", website: "fintechagency.com", source: "Website form",
    status: "HOT", scoreBand: "HOT", score: 87, estimatedValue: 12000,
    painPoints: "Struggling to follow up with leads fast enough. Sales team is small (2 people) and can't keep up with enquiry volume. Currently losing hot leads to competitors because response time is too slow.",
    fitSummary: "Excellent ICP match. B2B digital agency with 20+ employees, clear budget signals, active buying intent, and pain points that align directly with what the Pipeline Agent solves.",
    researchSummary: "Fintech Agency Ltd is a UK-based financial marketing agency with approximately 25 staff. They serve fintech startups and scale-ups. Website traffic is growing (~12k/mo). They have been advertising for a 'growth ops' role — strong buying signal. LinkedIn shows active BD team. Domain registered 2019, strong online reputation.",
    recommendedAction: "Call within 24 hours. Reference their hiring for growth ops — perfect hook. Lead with speed-to-lead value prop and the approval queue feature.",
    draftReply: "Hi Sarah,\n\nThanks for your enquiry about GrowthAgent OS — great timing.\n\nI noticed you are scaling your BD operations at Fintech Agency, and from your website it looks like you are working with some fast-moving fintech clients. That means every lead counts and slow follow-up is costly.\n\nGrowthAgent OS is built for exactly this: we give your team a private AI operator that researches every new enquiry within minutes, scores the fit, and has a draft reply ready before you have even seen the lead.\n\nWould it be worth a 20-minute call this week to show you how it works? I can map it specifically to your current flow.\n\nBest,\n[Your name]",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  "2": {
    id: "2", name: "Marcus Webb", email: "marcus@builderbrand.co.uk", phone: "+44 7700 900456",
    companyName: "BuilderBrand Co", website: "builderbrand.co.uk", source: "LinkedIn",
    status: "WARM", scoreBand: "WARM", score: 64, estimatedValue: 6000,
    painPoints: "No structured CRM process. Leads fall through the cracks after initial contact. Using a spreadsheet to track prospects.",
    fitSummary: "Good ICP fit. Small agency with growth ambitions. Budget is tighter but pain points are clear. Worth nurturing.",
    researchSummary: "BuilderBrand Co is a UK branding and design agency focused on the construction and trades sector. ~10 employees. Active on LinkedIn. Recently launched a new website suggesting a rebrand/growth push.",
    recommendedAction: "Follow up with a case study relevant to their industry. No hard sell yet — build rapport first.",
    draftReply: "Hi Marcus,\n\nJust following up on my previous message. I wanted to share a quick example of how we helped a similar agency streamline their lead follow-up process.\n\nWould a 15-minute call this week work to explore if it could help your team too?\n\nBest,\n[Your name]",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  "3": {
    id: "3", name: "Priya Sharma", email: "priya@saaslaunch.io", phone: "+44 7700 900789",
    companyName: "SaaS Launch HQ", website: "saaslaunch.io", source: "Referral",
    status: "HOT", scoreBand: "HOT", score: 91, estimatedValue: 18000,
    painPoints: "Scaling sales team from 1 to 5 reps. Needs systems and automation to manage growing lead volume without hiring more SDRs.",
    fitSummary: "Top-tier ICP match. High-growth SaaS company with budget, clear buying intent, referred by an existing customer. Highest priority lead this week.",
    researchSummary: "SaaS Launch HQ is a UK-based SaaS go-to-market consultancy. ~15 employees. Raised a seed round 6 months ago. Their LinkedIn shows rapid headcount growth. Referred by an existing GrowthAgent customer — extremely warm.",
    recommendedAction: "Book a demo call immediately. Reference the referral upfront. Prepare a SaaS-specific case study and pricing proposal.",
    draftReply: "Hi Priya,\n\nGreat to connect — [referrer name] speaks very highly of you and your work at SaaS Launch HQ.\n\nFrom what they told me, you are at exactly the stage where GrowthAgent OS delivers the most value: scaling your sales motion without proportionally scaling headcount.\n\nI would love to show you a 20-minute demo tailored to your current setup. Are you free this week?\n\nBest,\n[Your name]",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  "4": {
    id: "4", name: "Tom Rigby", email: "t.rigby@agencyx.com", phone: "+44 7700 900321",
    companyName: "Agency X", website: "agencyx.com", source: "Website form",
    status: "FOLLOW_UP_DUE", scoreBand: "WARM", score: 58, estimatedValue: 4500,
    painPoints: "Wants to understand pricing before committing to a demo. Cost-conscious buyer.",
    fitSummary: "Moderate ICP fit. Smaller agency, more price-sensitive. Could be a good fit on the Starter plan.",
    researchSummary: "Agency X is a small full-service digital agency based in Manchester. 6-8 employees. Serves local SMEs. Website is relatively sparse — limited budget signals.",
    recommendedAction: "Send a personalised pricing overview with the Starter plan highlighted. Offer a 30-day trial to lower friction.",
    draftReply: "Hi Tom,\n\nThanks for reaching out — I know pricing is always the first question!\n\nI have put together a quick overview of our Starter plan which I think would be a great fit for Agency X at this stage. Would it be useful to jump on a 15-minute call so I can walk you through exactly what you would get?\n\nBest,\n[Your name]",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  "5": {
    id: "5", name: "Emma Foster", email: "emma@growthco.io", phone: "+44 7700 900654",
    companyName: "GrowthCo", website: "growthco.io", source: "Email",
    status: "QUALIFIED", scoreBand: "WARM", score: 72, estimatedValue: 8000,
    painPoints: "Current CRM (HubSpot) is underutilised. Team not logging activities consistently. Needs a simpler, AI-driven workflow.",
    fitSummary: "Good fit. Growth-stage agency with an existing CRM they are not using well. The HubSpot integration will be a key selling point when it launches.",
    researchSummary: "GrowthCo is a UK growth marketing agency with ~12 employees. Serves B2B SaaS clients. Active blog and LinkedIn presence. Using HubSpot but not fully adopted across the team.",
    recommendedAction: "Qualify on budget and timeline. Mention the upcoming HubSpot integration as a hook.",
    draftReply: "Hi Emma,\n\nReally good to speak last Tuesday — and glad you are thinking carefully about the decision.\n\nOne thing I should have mentioned: we are rolling out a HubSpot integration next quarter, which means your existing CRM data will sync automatically. That should make the transition much smoother for your team.\n\nHappy to send over a proposal this week if that helps move things forward?\n\nBest,\n[Your name]",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  "6": {
    id: "6", name: "James Liu", email: "james@techventures.com", phone: "+44 7700 900987",
    companyName: "TechVentures", website: "techventures.com", source: "Website form",
    status: "COLD", scoreBand: "COLD", score: 31, estimatedValue: 2000,
    painPoints: "Early stage startup. Very limited sales process. Not clear if they have budget.",
    fitSummary: "Poor ICP fit at this stage. Pre-revenue startup, no dedicated sales team. May revisit in 6-12 months when they have traction.",
    researchSummary: "TechVentures is a London-based early-stage startup in the B2B SaaS space. 3-4 employees. Website is a placeholder. No revenue signals identified. Likely exploring options without budget commitment.",
    recommendedAction: "Send a nurture email and add to a low-priority sequence. Revisit in Q4.",
    draftReply: "Hi James,\n\nThanks for getting in touch. It sounds like you are at an exciting early stage with TechVentures.\n\nGrowthAgent OS is typically most impactful once you have a regular flow of inbound leads to manage — so the timing may be slightly early for you right now.\n\nI will stay in touch and would love to reconnect when you are a bit further along. In the meantime, feel free to reach out with any questions.\n\nBest,\n[Your name]",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  "7": {
    id: "7", name: "Natasha Brown", email: "n.brown@retailplus.com", phone: "+44 7700 900111",
    companyName: "RetailPlus", website: "retailplus.com", source: "Website form",
    status: "NEW", scoreBand: null, score: null, estimatedValue: null,
    painPoints: "Research in progress...",
    fitSummary: "Research in progress...",
    researchSummary: "Research is currently being conducted by the agent. Check back shortly for a full company profile and fit analysis.",
    recommendedAction: "Wait for agent research to complete before taking action.",
    draftReply: "Draft will be prepared once research is complete.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  "8": {
    id: "8", name: "David Kim", email: "david@consultingdg.com", phone: "+44 7700 900222",
    companyName: "Consulting DG", website: "consultingdg.com", source: "Referral",
    status: "CALL_BOOKED", scoreBand: "HOT", score: 82, estimatedValue: 15000,
    painPoints: "Running a 3-person sales team and manually managing all lead follow-ups. Losing track of where each prospect is in the funnel.",
    fitSummary: "Strong ICP fit. Mid-size consulting firm with a defined sales team and active pipeline. Clear budget indicators from website and LinkedIn.",
    researchSummary: "Consulting DG is a business strategy consultancy based in Edinburgh. ~20 employees. Serves mid-market firms. Strong LinkedIn presence with regular thought leadership content. Referred by a satisfied customer — high trust starting point.",
    recommendedAction: "Call is already booked for tomorrow at 2pm. Prepare a tailored demo focused on the team workflow and approval queue features.",
    draftReply: "Hi David,\n\nLooking forward to our call tomorrow at 2pm.\n\nI have prepared a demo tailored specifically to Consulting DG's setup — I will show you how the agent handles your existing lead volume and how the team approval workflow would fit your current process.\n\nSee you tomorrow!\n\nBest,\n[Your name]",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = mockLeadsDb[params.id]
  if (!lead) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/leads"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Leads</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-xl font-bold text-white">
            {lead.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{lead.name}</h1>
              {lead.scoreBand && (
                <span className={`text-sm px-3 py-1 rounded-full font-semibold border ${getScoreBandColor(lead.scoreBand)}`}>
                  {lead.scoreBand}
                </span>
              )}
              <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${getStatusColor(lead.status)}`}>
                {lead.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-slate-400">{lead.companyName} · {lead.source}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Edit</Button>
          <Button variant="gradient" size="sm">
            <Bot className="h-4 w-4 mr-1.5" /> Ask Agent
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="space-y-4">
          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <a href={`mailto:${lead.email}`} className="text-blue-400 hover:underline">{lead.email}</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">{lead.companyName}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Globe className="h-4 w-4 text-slate-400" />
                <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{lead.website}</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400">Added {formatDate(lead.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Lead Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {lead.score ? (
                <>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{lead.score}<span className="text-xl text-slate-400">/100</span></div>
                  <div className="h-2 rounded-full bg-slate-800 mb-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${lead.score}%` }} />
                  </div>
                  {lead.estimatedValue && (
                    <p className="text-sm text-emerald-400 font-medium">Est. value: {formatCurrency(lead.estimatedValue)}</p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">Scoring in progress...</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main content tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="research">
            <TabsList>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="reply">Draft Reply</TabsTrigger>
              <TabsTrigger value="fit">Fit Analysis</TabsTrigger>
              <TabsTrigger value="action">Next Action</TabsTrigger>
            </TabsList>

            <TabsContent value="research" className="mt-4">
              <Card className="border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bot className="h-4 w-4 text-violet-400" /> Company Research
                    <Badge className="ml-auto text-xs border-violet-500/30 bg-violet-500/10 text-violet-400">AI Generated</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{lead.researchSummary}</p>
                  {lead.painPoints && lead.painPoints !== "Research in progress..." && (
                    <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <p className="text-xs font-semibold text-orange-400 mb-1">Pain Points Identified</p>
                      <p className="text-sm text-slate-300">{lead.painPoints}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reply" className="mt-4">
              <Card className="border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" /> Draft Reply
                    <Badge className="ml-auto text-xs border-yellow-500/30 bg-yellow-500/10 text-yellow-400">Awaiting Approval</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-slate-950/50 rounded-lg p-4 mb-4 font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-800">
                    {lead.draftReply}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="gradient" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                    </Button>
                    <Button variant="outline" size="sm">Edit Draft</Button>
                    <Button variant="ghost" size="sm">Reject</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fit" className="mt-4">
              <Card className="border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Fit Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-300 leading-relaxed">{lead.fitSummary}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="action" className="mt-4">
              <Card className="border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Recommended Action</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-300 leading-relaxed">{lead.recommendedAction}</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="gradient" size="sm">Book Call</Button>
                    <Button variant="outline" size="sm">Schedule Follow-Up</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
