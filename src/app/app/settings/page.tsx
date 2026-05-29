"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Zap, Bot, CreditCard, Globe, Mail, FileText, Link2, Slack, Copy, RefreshCw, Eye, EyeOff, Key, CheckCircle, XCircle, Loader2, Cpu, Mic, Shield, Clock } from "lucide-react"
import { saveCompanySettings } from "@/app/actions/settings"
import { regenerateApiKey, getOrCreateApiKey } from "@/app/actions/settings"
import { saveOpenClawConfig, testOpenClawConnection, getOpenClawConfig } from "@/app/actions/agent-config"
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

type AuditLogEntry = {
  id: string
  action: string
  entityType: string | null
  entityId: string | null
  createdAt: string
  metadata: Record<string, unknown> | null
}

type OpenClawData = {
  openclawEnabled: boolean
  openclawGatewayUrl: string
  openclawAgentId: string
  openclawWorkspaceId: string
  openclawApiKey: string
  openclawChannel: string
  openclawSetupStatus: string | null
  openclawLastTestedAt: Date | null
  hasApiKey: boolean
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
  const [oc, setOc] = useState<OpenClawData>({
    openclawEnabled: false, openclawGatewayUrl: "", openclawAgentId: "",
    openclawWorkspaceId: "", openclawApiKey: "", openclawChannel: "",
    openclawSetupStatus: null, openclawLastTestedAt: null, hasApiKey: false,
  })
  const [ocSaving, setOcSaving] = useState(false)
  const [ocTesting, setOcTesting] = useState(false)
  const [ocTestResult, setOcTestResult] = useState<{ status: string; message: string } | null>(null)
  const [voiceConfig, setVoiceConfig] = useState({
    voiceEnabled: false,
    voiceProvider: "",
    vapiAssistantId: "",
    twilioPhoneNumber: "",
  })
  const [voiceSaving, setVoiceSaving] = useState(false)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [auditLoading, setAuditLoading] = useState(false)

  useEffect(() => {
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
          setVoiceConfig({
            voiceEnabled: c.voiceEnabled ?? false,
            voiceProvider: c.voiceProvider ?? "",
            vapiAssistantId: c.vapiAssistantId ?? "",
            twilioPhoneNumber: c.twilioPhoneNumber ?? "",
          })
        }
      })
      .catch(() => {})

    getOpenClawConfig().then(res => {
      if (res && "config" in res && res.config) {
        const cfg = res.config
        setOc({
          openclawEnabled: cfg.openclawEnabled ?? false,
          openclawGatewayUrl: cfg.openclawGatewayUrl ?? "",
          openclawAgentId: cfg.openclawAgentId ?? "",
          openclawWorkspaceId: cfg.openclawWorkspaceId ?? "",
          openclawApiKey: "",
          openclawChannel: cfg.openclawChannel ?? "",
          openclawSetupStatus: cfg.openclawSetupStatus ?? null,
          openclawLastTestedAt: cfg.openclawLastTestedAt ? new Date(cfg.openclawLastTestedAt as unknown as string) : null,
          hasApiKey: cfg.hasApiKey ?? false,
        })
      }
    }).catch(() => {})
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

  const handleSaveOpenClaw = async () => {
    setOcSaving(true)
    const result = await saveOpenClawConfig({
      openclawEnabled: oc.openclawEnabled,
      openclawGatewayUrl: oc.openclawGatewayUrl || undefined,
      openclawAgentId: oc.openclawAgentId || undefined,
      openclawWorkspaceId: oc.openclawWorkspaceId || undefined,
      openclawApiKey: oc.openclawApiKey || undefined,
      openclawChannel: oc.openclawChannel || undefined,
    })
    setOcSaving(false)
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
    } else {
      setOc(prev => ({ ...prev, openclawApiKey: "", hasApiKey: prev.hasApiKey || !!prev.openclawApiKey }))
      toast({ title: "Saved", description: "Agent engine configuration updated." })
    }
  }

  const handleTestOpenClaw = async () => {
    setOcTesting(true)
    setOcTestResult(null)
    const result = await testOpenClawConnection()
    setOcTesting(false)
    if (result.error) {
      setOcTestResult({ status: "failed", message: result.error })
      toast({ title: "Connection failed", description: result.error, variant: "destructive" })
    } else if ("status" in result) {
      setOcTestResult({ status: result.status ?? "failed", message: result.message ?? "" })
      if (result.success) {
        toast({ title: "Connected", description: "OpenClaw gateway is reachable." })
        setOc(prev => ({ ...prev, openclawSetupStatus: "connected", openclawLastTestedAt: new Date() }))
      } else {
        toast({ title: "Connection failed", description: result.message ?? "Could not reach gateway.", variant: "destructive" })
      }
    }
  }

  const handleSaveVoice = async () => {
    setVoiceSaving(true)
    const result = await saveCompanySettings({
      name: company.name,
    })
    // Save voice config via a direct patch
    try {
      const res = await fetch("/api/company/voice-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voiceConfig),
      })
      if (!res.ok) throw new Error("Failed to save voice config")
      toast({ title: "Saved", description: "Voice configuration updated." })
    } catch {
      // Fallback: use saveCompanySettings as best effort
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      } else {
        toast({ title: "Saved", description: "Voice configuration updated." })
      }
    }
    setVoiceSaving(false)
  }

  const loadAuditLogs = async () => {
    setAuditLoading(true)
    try {
      const res = await fetch("/api/company/audit-logs")
      if (res.ok) {
        const data = await res.json()
        setAuditLogs(data.logs ?? [])
      }
    } catch {
      // ignore
    }
    setAuditLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your GrowthAgent OS configuration</p>
      </div>

      <Tabs defaultValue="company">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="scoring">Lead Scoring</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security" onClick={loadAuditLogs}>Security</TabsTrigger>
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

        <TabsContent value="agent" className="space-y-6">
          {/* Current engine status */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cpu className="h-4 w-4" /> Agent Engine</CardTitle>
              <CardDescription>The engine powering your AI agents. Local mode uses the built-in deterministic engine. OpenClaw enables advanced LLM-powered analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 bg-slate-900/50">
                <div className={`h-2.5 w-2.5 rounded-full ${oc.openclawEnabled ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{oc.openclawEnabled ? "OpenClaw Gateway" : "Local Deterministic Engine"}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {oc.openclawEnabled
                      ? oc.openclawSetupStatus === "connected" ? "Connected and ready" : "Configured — run a test to verify"
                      : "Built-in engine active — no external API required"
                    }
                  </div>
                </div>
                <Badge className={oc.openclawEnabled ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs" : "border-slate-700 text-slate-400 text-xs"}>
                  {oc.openclawEnabled ? "OpenClaw" : "Local"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* OpenClaw config */}
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4" /> OpenClaw Integration</CardTitle>
              <CardDescription>Connect an OpenClaw gateway for LLM-powered lead analysis and multi-agent workflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Enable toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50">
                <div>
                  <div className="text-sm font-medium">Enable OpenClaw</div>
                  <div className="text-xs text-slate-400 mt-0.5">Route agent tasks through your OpenClaw gateway</div>
                </div>
                <button
                  onClick={() => setOc(prev => ({ ...prev, openclawEnabled: !prev.openclawEnabled }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${oc.openclawEnabled ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${oc.openclawEnabled ? "translate-x-4" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Gateway URL</Label>
                  <Input
                    value={oc.openclawGatewayUrl}
                    onChange={e => setOc(prev => ({ ...prev, openclawGatewayUrl: e.target.value }))}
                    placeholder="https://your-gateway.openclaw.ai"
                    disabled={!oc.openclawEnabled}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Agent ID</Label>
                  <Input
                    value={oc.openclawAgentId}
                    onChange={e => setOc(prev => ({ ...prev, openclawAgentId: e.target.value }))}
                    placeholder="agent_..."
                    disabled={!oc.openclawEnabled}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Workspace ID</Label>
                  <Input
                    value={oc.openclawWorkspaceId}
                    onChange={e => setOc(prev => ({ ...prev, openclawWorkspaceId: e.target.value }))}
                    placeholder="ws_..."
                    disabled={!oc.openclawEnabled}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Channel</Label>
                  <Input
                    value={oc.openclawChannel}
                    onChange={e => setOc(prev => ({ ...prev, openclawChannel: e.target.value }))}
                    placeholder="default"
                    disabled={!oc.openclawEnabled}
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>
                    API Key / Token
                    {oc.hasApiKey && <span className="ml-2 text-xs text-emerald-400">Key saved — enter a new one to replace it</span>}
                  </Label>
                  <Input
                    type="password"
                    value={oc.openclawApiKey}
                    onChange={e => setOc(prev => ({ ...prev, openclawApiKey: e.target.value }))}
                    placeholder={oc.hasApiKey ? "••••••••••••••••" : "Bearer token or API key"}
                    disabled={!oc.openclawEnabled}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Test result */}
              {ocTestResult && (
                <div className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                  ocTestResult.status === "connected"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {ocTestResult.status === "connected"
                    ? <CheckCircle className="h-4 w-4 shrink-0" />
                    : <XCircle className="h-4 w-4 shrink-0" />
                  }
                  <span>{ocTestResult.message}</span>
                </div>
              )}

              {oc.openclawLastTestedAt && !ocTestResult && (
                <div className="text-xs text-slate-500">
                  Last tested: {new Date(oc.openclawLastTestedAt).toLocaleString()}
                  {oc.openclawSetupStatus === "connected" && <span className="ml-2 text-emerald-400">Connected</span>}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button variant="gradient" onClick={handleSaveOpenClaw} disabled={ocSaving}>
                  {ocSaving ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...</> : "Save Configuration"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTestOpenClaw}
                  disabled={ocTesting || !oc.openclawGatewayUrl}
                >
                  {ocTesting ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Testing...</> : "Test Connection"}
                </Button>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed">
                If OpenClaw is unavailable or credentials are missing, all agent tasks automatically fall back to the local engine.
                Your leads continue to be scored and processed without interruption.
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

        <TabsContent value="voice" className="space-y-6">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mic className="h-4 w-4" /> Voice Agent Configuration</CardTitle>
              <CardDescription>Configure your voice provider for inbound and browser-based calls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Enable toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50">
                <div>
                  <div className="text-sm font-medium">Enable Voice Agent</div>
                  <div className="text-xs text-slate-400 mt-0.5">Allow voice calls via your configured provider</div>
                </div>
                <button
                  onClick={() => setVoiceConfig(v => ({ ...v, voiceEnabled: !v.voiceEnabled }))}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${voiceConfig.voiceEnabled ? "bg-blue-600" : "bg-slate-700"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${voiceConfig.voiceEnabled ? "translate-x-4" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Voice Provider</Label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={voiceConfig.voiceProvider}
                    onChange={e => setVoiceConfig(v => ({ ...v, voiceProvider: e.target.value }))}
                  >
                    <option value="">Not configured</option>
                    <option value="local">Local (demo only)</option>
                    <option value="vapi">Vapi</option>
                    <option value="twilio">Twilio</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Twilio Phone Number</Label>
                  <Input
                    value={voiceConfig.twilioPhoneNumber}
                    onChange={e => setVoiceConfig(v => ({ ...v, twilioPhoneNumber: e.target.value }))}
                    placeholder="+44 7700 900000"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Vapi Assistant ID</Label>
                  <Input
                    value={voiceConfig.vapiAssistantId}
                    onChange={e => setVoiceConfig(v => ({ ...v, vapiAssistantId: e.target.value }))}
                    placeholder="asst_..."
                  />
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300 leading-relaxed">
                Voice Agent is available on the Growth Agent OS plan. Configure your Vapi or Twilio credentials in your environment variables before enabling.
              </div>

              <Button variant="gradient" onClick={handleSaveVoice} disabled={voiceSaving}>
                {voiceSaving ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...</> : "Save Voice Config"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Security Overview</CardTitle>
              <CardDescription>Approval-first settings and security status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Approval-first mode", value: "Enabled", note: "All sensitive agent actions require manual approval", ok: true },
                { label: "Outbound emails", value: "Approval required", note: "Draft replies go to your approval queue", ok: true },
                { label: "CRM updates", value: "Approval required", note: "Status changes are gated by approval", ok: true },
                { label: "Voice outbound calls", value: "Approval required", note: "No outbound calls without explicit approval", ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-slate-800">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.note}</div>
                  </div>
                  <span className="text-xs text-emerald-400 font-medium shrink-0">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Recent Audit Log
              </CardTitle>
              <CardDescription>Last 10 agent and account actions</CardDescription>
            </CardHeader>
            <CardContent>
              {auditLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading audit log...
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="text-sm text-slate-500 py-4 text-center">
                  No audit events yet. Click the Security tab to refresh.
                </div>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 rounded-lg border border-slate-800 p-3">
                      <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                        <Shield className="h-3 w-3 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-300">{log.action}</div>
                        {log.entityType && <div className="text-xs text-slate-600">{log.entityType} · {log.entityId}</div>}
                      </div>
                      <span className="text-xs text-slate-600 shrink-0">{new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" size="sm" className="mt-4 text-xs" onClick={loadAuditLogs} disabled={auditLoading}>
                {auditLoading ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> Loading...</> : "Refresh"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
