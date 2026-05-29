import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { hasFeature } from "@/lib/plans"
import { UpgradeCard } from "@/components/plans/upgrade-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, Phone, MicOff, PhoneCall, Clock, FileText, Volume2, Settings2, Zap } from "lucide-react"

const voiceCommands = [
  "Summarise today's hot leads",
  "Tell me who needs a follow-up",
  "Prepare me for my next sales call",
  "Explain why this lead is scored cold",
  "Create a draft follow-up for approval",
  "What is my pipeline value this week?",
]

export default async function VoicePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const membership = await prisma.companyMember.findFirst({
    where: { userId: session.user.id },
    include: {
      company: {
        include: {
          subscriptions: { include: { plan: true }, take: 1, orderBy: { createdAt: "desc" } },
          voiceCalls: {
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
              id: true,
              direction: true,
              status: true,
              duration: true,
              phoneNumber: true,
              createdAt: true,
              transcript: true,
              summary: true,
              provider: true,
            },
          },
        },
      },
    },
  })
  if (!membership) redirect("/app/onboarding")

  const company = membership.company
  const voiceEnabled = hasFeature(company, "voice_agent")

  if (!voiceEnabled) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Voice Agent</h1>
          <p className="text-slate-400 mt-1">Talk to your AI sales operator with your voice</p>
        </div>
        <UpgradeCard
          feature="Voice Agent"
          description="Talk to your AI agent, qualify leads by phone, and process inbound calls — all on Growth Agent OS."
          requiredPlan="Growth OS"
        />
      </div>
    )
  }

  const calls = company.voiceCalls
  const configured = company.voiceEnabled && !!company.voiceProvider

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Voice Agent</h1>
          <p className="text-slate-400 mt-1">Talk to your AI sales operator — or process inbound lead calls</p>
        </div>
        <Badge className={configured ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-slate-700 text-slate-500"}>
          {configured ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 inline-block animate-pulse" />
              Voice Active
            </>
          ) : "Not Configured"}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Browser voice */}
        <div className="lg:col-span-2 space-y-4">
          <Card className={`border-slate-800 ${!configured ? "opacity-60" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Volume2 className="h-4 w-4 text-blue-400" /> Talk to Your Agent
              </CardTitle>
              <CardDescription>Ask questions about your pipeline using your voice</CardDescription>
            </CardHeader>
            <CardContent>
              {configured ? (
                <div className="text-center py-8">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600/30 to-violet-600/30 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:border-blue-400/60 transition-all">
                    <Mic className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-sm text-slate-400 mb-2">Click the microphone to start</p>
                  <p className="text-xs text-slate-600">Browser voice via {company.voiceProvider ?? "configured provider"}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MicOff className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-4">Voice not yet configured. Set up your provider below.</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#voice-settings">Configure Voice</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice commands */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-400" /> Voice Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2">
                {voiceCommands.map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-xs text-slate-300">
                    <Mic className="h-3 w-3 text-slate-500 shrink-0" />
                    &quot;{cmd}&quot;
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call history */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" /> Call History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calls.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No calls yet</div>
              ) : (
                <div className="space-y-2">
                  {calls.map((call) => (
                    <div key={call.id} className="flex items-start gap-3 rounded-lg border border-slate-800 p-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${call.direction === "INBOUND" ? "bg-emerald-500/10" : call.direction === "OUTBOUND" ? "bg-blue-500/10" : "bg-violet-500/10"}`}>
                        {call.direction === "BROWSER" ? (
                          <Volume2 className="h-3.5 w-3.5 text-violet-400" />
                        ) : (
                          <PhoneCall className={`h-3.5 w-3.5 ${call.direction === "INBOUND" ? "text-emerald-400" : "text-blue-400"}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-slate-300">{call.direction} · {call.provider}</span>
                          <span className="text-xs text-slate-600 ml-auto">{new Date(call.createdAt).toLocaleDateString()}</span>
                        </div>
                        {call.phoneNumber && <div className="text-xs text-slate-500">{call.phoneNumber}</div>}
                        {call.duration && <div className="text-xs text-slate-500">{Math.round(call.duration / 60)}m {call.duration % 60}s</div>}
                        {call.summary && <div className="text-xs text-slate-400 mt-1 truncate">{call.summary}</div>}
                      </div>
                      {call.transcript && (
                        <FileText className="h-3.5 w-3.5 text-slate-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Dedicated phone number */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" /> Dedicated Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              {company.twilioPhoneNumber ? (
                <div>
                  <div className="font-mono text-lg font-bold text-emerald-400">{company.twilioPhoneNumber}</div>
                  <div className="text-xs text-slate-400 mt-1">Inbound calls go to your Voice Agent</div>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No number configured.<br />Connect Twilio to get a dedicated number.</div>
              )}
            </CardContent>
          </Card>

          {/* Outbound calls note */}
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-amber-400 mb-2">Outbound Calling</div>
              <p className="text-xs text-slate-400 leading-relaxed">Outbound calls to leads require explicit approval in the approval queue. The agent can prepare call briefs but will not dial without your authorisation.</p>
            </CardContent>
          </Card>

          {/* Voice settings */}
          <Card className="border-slate-800" id="voice-settings">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings2 className="h-4 w-4" /> Voice Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              {[
                { label: "Provider", value: company.voiceProvider ?? "Not set" },
                { label: "Voice enabled", value: company.voiceEnabled ? "Yes" : "No" },
                { label: "Vapi assistant", value: company.vapiAssistantId ? "Configured" : "Not set" },
                { label: "Twilio number", value: company.twilioPhoneNumber ?? "Not set" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="text-slate-300 font-medium">{row.value}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7" asChild>
                <a href="/app/settings?tab=voice">Configure in Settings</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
