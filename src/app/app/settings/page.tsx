"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Zap, Bot, CreditCard, Shield, Globe, Mail, FileText, Link2, Slack } from "lucide-react"

const integrations = [
  { name: "Website Form", icon: Globe, desc: "Capture leads from your website contact form", status: "connected" },
  { name: "Gmail", icon: Mail, desc: "Connect Gmail to capture email enquiries", status: "coming_soon" },
  { name: "Google Sheets", icon: FileText, desc: "Sync leads to/from Google Sheets", status: "coming_soon" },
  { name: "HubSpot", icon: Link2, desc: "Two-way CRM sync with HubSpot", status: "coming_soon" },
  { name: "Pipedrive", icon: Link2, desc: "Two-way CRM sync with Pipedrive", status: "coming_soon" },
  { name: "Slack", icon: Slack, desc: "Get agent notifications in Slack", status: "coming_soon" },
  { name: "OpenClaw", icon: Bot, desc: "Advanced agent orchestration engine", status: "coming_soon" },
  { name: "Vapi / Twilio Voice", icon: Zap, desc: "Inbound voice agent for lead qualification", status: "coming_soon" },
]

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your GrowthAgent OS configuration</p>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="mb-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="scoring">Lead Scoring</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Company Profile</CardTitle>
              <CardDescription>Your business information used to personalise agent responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5"><Label>Business Name</Label><Input defaultValue="My Digital Agency" /></div>
                <div className="space-y-1.5"><Label>Website</Label><Input defaultValue="https://myagency.com" /></div>
                <div className="space-y-1.5"><Label>Business Type</Label><Input defaultValue="Digital Agency" /></div>
                <div className="space-y-1.5"><Label>Average Deal Value</Label><Input defaultValue="£5,000" /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Main Offer</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" defaultValue="We help e-commerce brands grow their revenue through performance marketing and conversion optimisation." />
              </div>
              <div className="space-y-1.5">
                <Label>Ideal Customer Profile</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" defaultValue="E-commerce brands with £1M+ annual revenue, B2C, UK/EU based, looking to scale paid acquisition." />
              </div>
              <div className="space-y-1.5">
                <Label>Bad-Fit Traits</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" defaultValue="Startups with no revenue, looking for cheap/fast work, no budget for testing." />
              </div>
              <Button variant="gradient" onClick={save}>{saved ? "Saved ✓" : "Save Changes"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="h-4 w-4" /> Lead Scoring Rules</CardTitle>
              <CardDescription>Configure how the agent scores incoming leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { label: "Company size signals", desc: "Weight company team size in scoring", value: 8 },
                  { label: "Website quality", desc: "Assess prospect website signals", value: 6 },
                  { label: "Budget indicators", desc: "Look for budget/spend signals", value: 9 },
                  { label: "Urgency signals", desc: "Identify urgency and buying timeline", value: 7 },
                  { label: "ICP match", desc: "Match against your ideal customer profile", value: 10 },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center justify-between py-3 border-b border-slate-800/50">
                    <div>
                      <div className="text-sm font-medium">{rule.label}</div>
                      <div className="text-xs text-slate-400">{rule.desc}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-slate-800">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${rule.value * 10}%` }} />
                      </div>
                      <span className="text-sm font-medium w-6 text-right text-slate-300">{rule.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="gradient" onClick={save}>{saved ? "Saved ✓" : "Save Scoring Rules"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4" /> Agent Behaviour</CardTitle>
              <CardDescription>Control how your AI agent operates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label>Tone of Voice</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Professional and confident</option>
                  <option>Warm and conversational</option>
                  <option>Direct and concise</option>
                  <option>Consultative and expert</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Approval Preference</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Approve everything manually</option>
                  <option>Auto-approve CRM updates, manual for emails</option>
                  <option>Auto-approve all non-external actions</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Lead Scoring Priorities</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" defaultValue="Prioritise budget signals and company growth indicators. Penalise solo freelancers and sub-5 employee companies." />
              </div>
              <Button variant="gradient" onClick={save}>{saved ? "Saved ✓" : "Save Agent Settings"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.name} className="border-slate-800">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <integration.icon className="h-4 w-4 text-slate-300" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{integration.name}</div>
                      </div>
                    </div>
                    <Badge className={
                      integration.status === "connected"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs"
                        : "border-slate-600/30 bg-slate-600/10 text-slate-400 text-xs"
                    }>
                      {integration.status === "connected" ? "Connected" : "Coming Soon"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{integration.desc}</p>
                  <Button variant="outline" size="sm" className="w-full" disabled={integration.status === "coming_soon"}>
                    {integration.status === "connected" ? "Configure" : "Connect during setup"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Billing &amp; Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="text-sm font-semibold text-blue-400 mb-1">Pipeline Agent</div>
                <div className="text-2xl font-bold">£249<span className="text-base text-slate-400">/month</span></div>
                <div className="text-xs text-slate-400 mt-1">Next billing date: 29 June 2026</div>
              </div>
              <Separator />
              <div className="text-sm text-slate-400 rounded-lg border border-slate-700/50 p-4">
                Stripe checkout is configured during your setup session. To update your billing details or upgrade your plan, contact your account manager.
              </div>
              <Button variant="outline">Manage Billing</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-1.5"><Label>New Password</Label><Input type="password" placeholder="Min. 8 characters" /></div>
              <div className="space-y-1.5"><Label>Confirm New Password</Label><Input type="password" placeholder="Min. 8 characters" /></div>
              <Button variant="gradient" onClick={save}>{saved ? "Saved ✓" : "Update Password"}</Button>
              <Separator />
              <div>
                <div className="text-sm font-semibold mb-2">Active Sessions</div>
                <div className="rounded-lg border border-slate-800 p-3 text-sm text-slate-400">
                  Current session — Chrome, London, UK · <span className="text-emerald-400">Active now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
