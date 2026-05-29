import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Globe, Mail, Phone, Building2, Clock, CheckCircle, FileText, Bot, Star } from "lucide-react"
import { getScoreBandColor, getStatusColor, formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils"
import { LeadActions } from "@/components/leads/lead-actions"

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
  })
  if (!membership) redirect("/app/onboarding")

  const lead = await prisma.lead.findFirst({
    where: { id: params.id, companyId: membership.companyId },
    include: {
      notes: { orderBy: { createdAt: "desc" }, take: 10 },
      scores: { orderBy: { createdAt: "desc" }, take: 1 },
      approvalRequests: { where: { status: "PENDING" }, orderBy: { createdAt: "desc" } },
      agentTasks: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  })

  if (!lead) notFound()

  const latestScore = lead.scores[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/app/leads"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
            {lead.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {lead.companyName && <span className="text-slate-400 text-sm">{lead.companyName}</span>}
              {lead.scoreBand && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getScoreBandColor(lead.scoreBand)}`}>
                  {lead.scoreBand}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${getStatusColor(lead.status)}`}>
                {lead.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
        <LeadActions leadId={lead.id} currentStatus={lead.status} scoreBand={lead.scoreBand} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="research">AI Research</TabsTrigger>
              <TabsTrigger value="reply">Draft Reply</TabsTrigger>
              <TabsTrigger value="notes">Notes {lead.notes.length > 0 && `(${lead.notes.length})`}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Contact info */}
              <Card className="border-slate-800">
                <CardHeader><CardTitle className="text-sm">Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {lead.email && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.website && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">{lead.website}</a>
                      </div>
                    )}
                    {lead.companyName && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{lead.companyName}</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <div className="text-xs text-slate-500">Source</div>
                      <div className="text-sm font-medium mt-0.5">{lead.source ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Est. Value</div>
                      <div className="text-sm font-medium mt-0.5 text-emerald-400">{lead.estimatedValue ? formatCurrency(lead.estimatedValue) : "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Added</div>
                      <div className="text-sm mt-0.5">{formatDate(lead.createdAt)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Original message */}
              {lead.message && (
                <Card className="border-slate-800">
                  <CardHeader><CardTitle className="text-sm">Original Enquiry</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{lead.message}</p>
                  </CardContent>
                </Card>
              )}

              {/* Recommended action */}
              {lead.recommendedAction && (
                <Card className="border-blue-500/20 bg-blue-500/5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-blue-400 mb-1">Recommended Action</div>
                        <p className="text-sm text-slate-200">{lead.recommendedAction}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Follow-up */}
              {lead.nextFollowUpAt && (
                <Card className={`border-slate-800 ${new Date(lead.nextFollowUpAt) < new Date() ? "border-orange-500/30 bg-orange-500/5" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className={`h-4 w-4 shrink-0 ${new Date(lead.nextFollowUpAt) < new Date() ? "text-orange-400" : "text-slate-400"}`} />
                      <div>
                        <div className="text-xs text-slate-500">Follow-up scheduled</div>
                        <div className={`text-sm font-medium ${new Date(lead.nextFollowUpAt) < new Date() ? "text-orange-400" : "text-slate-200"}`}>
                          {formatDate(lead.nextFollowUpAt)} ({formatRelativeTime(lead.nextFollowUpAt)})
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="research" className="space-y-4">
              {lead.fitSummary || lead.researchSummary || lead.painPoints ? (
                <>
                  {lead.fitSummary && (
                    <Card className="border-slate-800">
                      <CardHeader><CardTitle className="text-sm">Fit Summary</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-slate-300 leading-relaxed">{lead.fitSummary}</p></CardContent>
                    </Card>
                  )}
                  {lead.painPoints && (
                    <Card className="border-slate-800">
                      <CardHeader><CardTitle className="text-sm">Pain Points</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{lead.painPoints}</p></CardContent>
                    </Card>
                  )}
                  {lead.researchSummary && (
                    <Card className="border-slate-800">
                      <CardHeader><CardTitle className="text-sm">Company Research</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-slate-300 leading-relaxed">{lead.researchSummary}</p></CardContent>
                    </Card>
                  )}
                  {latestScore?.reasoning && (
                    <Card className="border-slate-800">
                      <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Star className="h-3.5 w-3.5 text-yellow-400" /> Score Reasoning</CardTitle></CardHeader>
                      <CardContent>
                        <div className="text-sm font-bold text-2xl mb-2">{lead.score ?? 0}<span className="text-slate-500 text-base">/100</span></div>
                        <pre className="text-xs text-slate-400 whitespace-pre-wrap font-sans leading-relaxed">{latestScore.reasoning}</pre>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="border-slate-800">
                  <CardContent className="py-12 text-center">
                    <Bot className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                    <div className="text-sm text-slate-400 mb-1">Research not yet completed</div>
                    <p className="text-xs text-slate-500">Click &quot;Run Qualification&quot; to have the agent research this lead.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reply">
              <Card className="border-slate-800">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" /> AI Draft Reply
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.draftReply ? (
                    <div className="rounded-lg bg-slate-900 border border-slate-700 p-4">
                      <pre className="text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">{lead.draftReply}</pre>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-slate-500">No draft reply yet. Run qualification or generate a reply.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              {lead.notes.length > 0 ? (
                lead.notes.map((note) => (
                  <Card key={note.id} className="border-slate-800">
                    <CardContent className="p-4">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{note.content}</pre>
                      <div className="text-xs text-slate-500 mt-2">{formatRelativeTime(note.createdAt)}</div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-slate-800">
                  <CardContent className="py-12 text-center">
                    <p className="text-sm text-slate-500">No notes yet. Add a note or run &quot;Prepare Sales Call&quot; to generate a call brief.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Score card */}
          <Card className="border-slate-800">
            <CardHeader><CardTitle className="text-sm">Lead Score</CardTitle></CardHeader>
            <CardContent>
              {lead.score != null ? (
                <div className="text-center py-2">
                  <div className="text-5xl font-bold mb-1">{lead.score}</div>
                  <div className="text-slate-500 text-sm">/100</div>
                  <div className="mt-3">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium border ${getScoreBandColor(lead.scoreBand ?? "COLD")}`}>
                      {lead.scoreBand ?? "UNSCORED"}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div
                      className={`h-2 rounded-full ${lead.scoreBand === "HOT" ? "bg-red-500" : lead.scoreBand === "WARM" ? "bg-orange-500" : "bg-slate-500"}`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-slate-500">Not scored yet</div>
              )}
            </CardContent>
          </Card>

          {/* Pending approvals */}
          {lead.approvalRequests.length > 0 && (
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader><CardTitle className="text-sm text-orange-400">Pending Approvals ({lead.approvalRequests.length})</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {lead.approvalRequests.map((req) => (
                  <div key={req.id} className="text-xs text-slate-300 p-2 rounded bg-slate-800/50">
                    <div className="font-medium">{req.title}</div>
                    <div className="text-slate-500 mt-0.5">{req.type.replace(/_/g, " ")}</div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-1" asChild>
                  <Link href="/app/approvals">Review Approvals</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Agent tasks */}
          {lead.agentTasks.length > 0 && (
            <Card className="border-slate-800">
              <CardHeader><CardTitle className="text-sm">Agent Activity</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {lead.agentTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-2">
                    <Bot className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="text-slate-300">{task.title}</div>
                      <div className={`mt-0.5 ${task.status === "COMPLETED" ? "text-emerald-400" : task.status === "FAILED" ? "text-red-400" : "text-slate-500"}`}>
                        {task.status}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
