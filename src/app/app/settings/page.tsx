"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Zap, Bot, CreditCard, Shield, Globe, Mail, FileText, Link2, Slack, Copy, RefreshCw, Eye, EyeOff, Key } from "lucide-react"
import { saveCompanySettings } from "@/app/actions/settings"
import { regenerateApiKey, getOrCreateApiKey } from "@/app/actions/settings"
import { useToast } from "@/components/ui/use-toast"

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

type CompanyData = {
  name: string
  website: string
  businessType: string
  mainOffer: string
  averageDealValue: string
  idealCustomerProfile: string
  badFitTraits: string
  toneOfVoice: string
  approvalPreference: string
  leadScoringPriorities: string
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [company, setCompany] = useState<CompanyData>({
    name: "", website: "", businessType: "", mainOffer: "",
    averageDealValue: "", idealCustomerProfile: "", badFitTraits: "",
    toneOfVoice: "", approvalPreference: "", leadScoringPriorities: "",
  })

  useEffect(() => {
    // Load company data via server action (we call getOrCreateApiKey which returns company data)
    // For now, load the settings from a fetch to the current session
    fetch("/api/company/settings")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.company) {
          const c = data.company
          setCompany({
            name: c.name ?? "",
            website: c.website ?? "",
            businessType: c.businessType ?? "",
            mainOffer: c.mainOffer ?? "",
            averageDealValue: c.averageDealValue ? String(c.averageDealValue) : "",
            idealCustomerProfile: c.idealCustomerProfile ?? "",
            badFitTraits: c.badFitTraits ?? "",
            toneOfVoice: c.toneOfVoice ?? "",
            approvalPreference: c.approvalPreference ?? "",
            leadScoringPriorities: c.leadScoringPriorities ?? "",
          })
          if (c.apiKey) setApiKey(c.apiKey)
        }
      })
      .catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const result = await saveCompanySettings({
      name: company.name,
      website: company.website || undefined,
      businessType: company.businessType || undefined,
      mainOffer: company.mainOffer || undefined,
      averageDealValue: company.averageDealValue ? Number(company.averageDealValue) : undefined,
      idealCustomerProfile: company.idealCustomerProfile || undefined,
      badFitTraits: company.badFitTraits || undefined,
      toneOfVoice: company.toneOfVoice || undefined,
      approvalPreference: company.approvalPreference || undefined,
      leadScoringPriorities: company.leadScoringPriorities || undefined,
    })
    setSaving(false)
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Saved", description: "Settings updated successfully." })
    }
  }

  const handleRegenerateKey = async () => {
    setRegenerating(true)
    const result = await regenerateApiKey()
    setRegenerating(false)
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else if ("apiKey" in result && result.apiKey) {
      setApiKey(result.apiKey)
      toast({ title: "New key generated", description: "Your previous key is now invalid." })
    }
  }

  const handleGetApiKey = async () => {
    const result = await getOrCreateApiKey()
    if ("apiKey" in result && result.apiKey) {
      setApiKey(result.apiKey)
    }
  }

  const copyKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      toast({ title: "Copied", description: "API key copied to clipboard." })
    }
  }

  const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${"•".repeat(24)}${apiKey.slice(-4)}` : null

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
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Company Profile</CardTitle>
              <CardDescription>Your business information used to personalise agent responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label>Business Name</Label>
                  <Input value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input value={company.website} onChange={e => setCompany(c => ({ ...c, website: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Business Type</Label>
                  <Input value={company.businessType} onChange={e => setCompany(c => ({ ...c, businessType: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Average Deal Value (£)</Label>
                  <Input type="number" value={company.averageDealValue} onChange={e => setCompany(c => ({ ...c, averageDealValue: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Main Offer</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={company.mainOffer} onChange={e => setCompany(c => ({ ...c, mainOffer: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Ideal Customer Profile</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={company.idealCustomerProfile} onChange={e => setCompany(c => ({ ...c, idealCustomerProfile: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Bad-Fit Traits</Label>
                <textarea className="flex min-h-[80px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={company.badFitTraits} onChange={e => setCompany(c => ({ ...c, badFitTraits: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tone of Voice</Label>
                <Input value={company.toneOfVoice} onChange={e => setCompany(c => ({ ...c, toneOfVoice: e.target.value }))} placeholder="e.g. Professional and confident" />
              </div>
              <Button variant="gradient" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="h-4 w-4" /> Lead Scoring Rules</CardTitle>
              <CardDescription>Configure how the agent scores incoming leads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label>Scoring Priorities</Label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={company.leadScoringPriorities}
                  onChange={e => setCompany(c => ({ ...c, leadScoringPriorities: e.target.value }))}
                  placeholder="Describe what matters most when scoring leads..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Approval Preference</Label>
                <Input value={company.approvalPreference} onChange={e => setCompany(c => ({ ...c, approvalPreference: e.target.value }))} placeholder="e.g. Approve everything manually" />
              </div>
              <Button variant="gradient" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agent">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4" /> Agent Configuration</CardTitle>
              <CardDescription>How your AI agent behaves and communicates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-slate-700/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Lead Research Agent</div>
                    <div className="text-xs text-slate-400">Researches and scores incoming leads</div>
                  </div>
                  <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">Active</Badge>
                </div>
              </div>
              <div className="rounded-lg border border-slate-700/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Follow-Up Agent</div>
                    <div className="text-xs text-slate-400">Tracks and surfaces overdue follow-ups</div>
                  </div>
                  <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid md:grid-cols-2 gap-4">
            {integrations.map((int) => (
              <Card key={int.name} className="border-slate-800">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <int.icon className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium truncate">{int.name}</div>
                      {int.status === "connected" ? (
                        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">Connected</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-slate-500">Coming soon</Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{int.desc}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Key className="h-4 w-4" /> API Access</CardTitle>
              <CardDescription>Use your API key to send leads via the webhook endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Your API Key</Label>
                {apiKey ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={apiKeyVisible ? apiKey : (maskedKey ?? "")}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" size="icon" onClick={() => setApiKeyVisible(!apiKeyVisible)}>
                      {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={copyKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleGetApiKey}>Generate API Key</Button>
                )}
                <Button variant="outline" size="sm" onClick={handleRegenerateKey} disabled={regenerating} className="flex items-center gap-1.5">
                  <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
                  Regenerate Key
                </Button>
              </div>

              <Separator className="border-slate-800" />

              <div className="space-y-3">
                <Label>Webhook Endpoint</Label>
                <div className="rounded-lg bg-slate-900 border border-slate-700 p-3 font-mono text-xs text-slate-300">
                  POST /api/leads/webhook
                </div>
                <div className="text-xs text-slate-400">Send leads from your website or any external source using this endpoint with your API key.</div>
                <div className="rounded-lg bg-slate-900 border border-slate-700 p-3">
                  <pre className="text-xs text-slate-300 overflow-auto">{`{
  "companyApiKey": "gao_...",
  "name": "John Smith",
  "email": "john@company.com",
  "phone": "+44 7700 900000",
  "companyName": "Acme Ltd",
  "website": "acme.com",
  "source": "Website form",
  "message": "Enquiry text here"
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Billing</CardTitle>
              <CardDescription>Manage your subscription and payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-700/50 p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Pipeline Agent</div>
                  <div className="text-xs text-slate-400">£249/month · Active</div>
                </div>
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">Active</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-4">Stripe billing integration coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
